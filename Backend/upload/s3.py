"""S3 access is server-side only. Configure AWS credentials in backend environment."""
import os
from urllib.parse import quote
import boto3
from botocore.config import Config

def client():
    return boto3.client("s3", region_name=os.environ["AWS_REGION"], config=Config(signature_version="s3v4"))

def bucket():
    return os.environ["AWS_S3_BUCKET_NAME"]

def public_url(key):
    # Use this only if objects are intentionally public, or a CDN is configured.
    base = os.getenv("AWS_S3_PUBLIC_BASE_URL")
    if base:
        return base.rstrip("/") + "/" + quote(key, safe="/")
    return f"https://{bucket()}.s3.{os.environ['AWS_REGION']}.amazonaws.com/{quote(key, safe='/')}"

def read_url(key):
    return client().generate_presigned_url("get_object", Params={"Bucket": bucket(), "Key": key}, ExpiresIn=3600)
