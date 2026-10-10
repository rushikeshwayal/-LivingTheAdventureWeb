import hashlib
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database.database import get_db
from admin.service.service import get_current_admin
from upload.model import MediaAsset
from upload.s3 import client, bucket, public_url, read_url

router = APIRouter(tags=["Media Library"])
ALLOWED_FOLDERS = {"cover", "poster", "gallery_image", "promo_video", "hero", "document"}
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "video/mp4": ".mp4", "video/webm": ".webm", "application/pdf": ".pdf"}
MAX_BYTES = 100 * 1024 * 1024

def serialize(asset):
    return {"id": asset.id, "name": asset.name, "tags": asset.tags.split(",") if asset.tags else [], "folder": asset.folder, "content_type": asset.content_type, "size_bytes": asset.size_bytes, "filename": asset.s3_key, "url": public_url(asset.s3_key), "preview_url": read_url(asset.s3_key)}

@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...), folder: str = Form(...), name: str = Form(""), tags: str = Form(""), admin_id: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(400, "Invalid folder")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, "Unsupported media type")
    if folder == "promo_video" and not file.content_type.startswith("video/"):
        raise HTTPException(400, "Expected video")
    if folder == "document" and file.content_type != "application/pdf":
        raise HTTPException(400, "Expected PDF")
    title = (name or Path(file.filename or "").stem).strip()
    if not title or len(title) > 255:
        raise HTTPException(400, "Invalid media name")
    tag_list = [t.strip().lower() for t in tags.split(",") if t.strip()]
    if len(tag_list) > 20 or any(len(t) > 40 for t in tag_list):
        raise HTTPException(400, "Invalid tags")
    data = await file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File exceeds 100 MB")
    digest = hashlib.sha256(data).hexdigest()
    existing = db.query(MediaAsset).filter_by(sha256=digest).first()
    if existing:
        return {"success": True, "reused": True, **serialize(existing)}
    key = f"{folder}/{uuid.uuid4().hex}{ALLOWED_TYPES[file.content_type]}"
    try:
        client().put_object(Bucket=bucket(), Key=key, Body=data, ContentType=file.content_type)
    except Exception as exc:
        raise HTTPException(502, "S3 upload failed") from exc
    asset = MediaAsset(name=title, tags=",".join(tag_list), folder=folder, content_type=file.content_type, sha256=digest, s3_key=key, size_bytes=len(data))
    try:
        db.add(asset)
        db.commit()
        db.refresh(asset)
    except Exception:
        db.rollback()
        client().delete_object(Bucket=bucket(), Key=key)
        existing = db.query(MediaAsset).filter_by(sha256=digest).first()
        if existing:
            return {"success": True, "reused": True, **serialize(existing)}
        raise HTTPException(500, "Failed to save media metadata")
    return {"success": True, "reused": False, **serialize(asset)}

@router.get("/storage/search")
def search_files(folder: str = Query(None), q: str = Query("", max_length=100), limit: int = Query(30, ge=1, le=100), offset: int = Query(0, ge=0), admin_id: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    if folder and folder not in ALLOWED_FOLDERS:
        raise HTTPException(400, "Invalid folder")
    query = db.query(MediaAsset)
    if folder:
        query = query.filter_by(folder=folder)
    if q.strip():
        pattern = f"%{q.strip()}%"
        query = query.filter(or_(MediaAsset.name.ilike(pattern), MediaAsset.tags.ilike(pattern)))
    total = query.count()
    results = query.order_by(MediaAsset.created_at.desc()).offset(offset).limit(limit).all()
    return {"success": True, "folder": folder, "count": total, "results": [serialize(a) for a in results]}
