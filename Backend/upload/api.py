import hashlib
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from admin.service.service import get_current_admin
from upload.model import MediaAsset
from upload.s3 import client, bucket, public_url, read_url

router = APIRouter(tags=["Media Upload"])
ALLOWED_FOLDERS = {"cover", "poster", "gallery_image", "promo_video", "hero", "document"}
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "video/mp4": ".mp4", "video/webm": ".webm", "application/pdf": ".pdf"}
MAX_BYTES = 100 * 1024 * 1024

def serialize(asset):
    return {"id": asset.id, "name": asset.name, "tags": asset.tags.split(",") if asset.tags else [], "folder": asset.folder, "content_type": asset.content_type, "size_bytes": asset.size_bytes, "filename": asset.s3_key, "url": public_url(asset.s3_key), "preview_url": read_url(asset.s3_key)}

@router.post("/upload/presign")
def create_upload_url(folder: str = Form(...), name: str = Form(...), content_type: str = Form(...), size_bytes: int = Form(...), tags: str = Form(""), admin_id: str = Depends(get_current_admin)):
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(400, "Invalid media category")
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(415, "Unsupported media type")
    if size_bytes < 1 or size_bytes > MAX_BYTES:
        raise HTTPException(413, "Files must be smaller than 100 MB")
    if folder == "promo_video" and not content_type.startswith("video/"):
        raise HTTPException(400, "Choose an MP4 or WebM video")
    if folder == "document" and content_type != "application/pdf":
        raise HTTPException(400, "Documents must be PDF files")
    title = (name or "").strip()
    if not title or len(title) > 255:
        raise HTTPException(400, "Media name is required (max 255 characters)")
    tag_list = [tag.strip().lower() for tag in tags.split(",") if tag.strip()]
    if len(tag_list) > 20 or any(len(tag) > 40 for tag in tag_list):
        raise HTTPException(400, "Invalid tags")
    key = f"{folder}/{uuid.uuid4().hex}{ALLOWED_TYPES[content_type]}"
    try:
        signed = client().generate_presigned_url("put_object", Params={"Bucket": bucket(), "Key": key, "ContentType": content_type}, ExpiresIn=900)
    except Exception as exc:
        raise HTTPException(502, "Could not prepare S3 upload. Check AWS configuration.") from exc
    return {"success": True, "upload_url": signed, "key": key, "name": title, "tags": ",".join(tag_list), "folder": folder, "content_type": content_type, "size_bytes": size_bytes}

@router.post("/upload/register")
def register_upload(key: str = Form(...), name: str = Form(...), tags: str = Form(""), folder: str = Form(...), content_type: str = Form(...), size_bytes: int = Form(...), admin_id: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    if folder not in ALLOWED_FOLDERS or not key.startswith(folder + "/") or "/" in key[len(folder)+1:]:
        raise HTTPException(400, "Invalid upload key")
    if content_type not in ALLOWED_TYPES or size_bytes < 1 or size_bytes > MAX_BYTES:
        raise HTTPException(400, "Invalid media metadata")
    try:
        head = client().head_object(Bucket=bucket(), Key=key)
    except Exception as exc:
        raise HTTPException(400, "S3 object was not found; upload may have failed") from exc
    actual_size = int(head.get("ContentLength", 0))
    if actual_size != size_bytes or head.get("ContentType") != content_type:
        client().delete_object(Bucket=bucket(), Key=key)
        raise HTTPException(400, "Uploaded file details did not match")
    try:
        response = client().get_object(Bucket=bucket(), Key=key, Range="bytes=0-1048575")
        digest = hashlib.sha256(response["Body"].read()).hexdigest()
    except Exception:
        digest = hashlib.sha256(f"{key}:{actual_size}".encode()).hexdigest()
    existing = db.query(MediaAsset).filter_by(sha256=digest).first()
    if existing:
        client().delete_object(Bucket=bucket(), Key=key)
        return {"success": True, "reused": True, **serialize(existing)}
    asset = MediaAsset(name=name.strip(), tags=",".join(t.strip().lower() for t in tags.split(",") if t.strip()), folder=folder, content_type=content_type, sha256=digest, s3_key=key, size_bytes=actual_size)
    try:
        db.add(asset)
        db.commit()
        db.refresh(asset)
    except Exception as exc:
        db.rollback()
        client().delete_object(Bucket=bucket(), Key=key)
        raise HTTPException(500, "Could not save media metadata") from exc
    return {"success": True, "reused": False, **serialize(asset)}

# Compatibility endpoint for small files and existing integrations. Large videos should use presign/register.
@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...), folder: str = Form(...), name: str = Form(""), tags: str = Form(""), admin_id: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    if folder not in ALLOWED_FOLDERS or file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported media category or file type")
    data = await file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File exceeds 100 MB; use the direct S3 upload flow")
    title = (name or Path(file.filename or "").stem).strip()
    digest = hashlib.sha256(data).hexdigest()
    existing = db.query(MediaAsset).filter_by(sha256=digest).first()
    if existing:
        return {"success": True, "reused": True, **serialize(existing)}
    key = f"{folder}/{uuid.uuid4().hex}{ALLOWED_TYPES[file.content_type]}"
    try:
        client().put_object(Bucket=bucket(), Key=key, Body=data, ContentType=file.content_type)
        asset = MediaAsset(name=title, tags=",".join(t.strip().lower() for t in tags.split(",") if t.strip()), folder=folder, content_type=file.content_type, sha256=digest, s3_key=key, size_bytes=len(data))
        db.add(asset)
        db.commit()
        db.refresh(asset)
    except Exception as exc:
        db.rollback()
        try: client().delete_object(Bucket=bucket(), Key=key)
        except Exception: pass
        raise HTTPException(502, "Upload or media metadata save failed") from exc
    return {"success": True, "reused": False, **serialize(asset)}
