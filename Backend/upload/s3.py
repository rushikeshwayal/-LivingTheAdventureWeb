"""Server-side helpers for S3 uploads and reads."""

import os
from urllib.parse import quote

import boto3
from botocore.config import Config


def _region() -> str:
    return os.environ["AWS_REGION"]


def _bucket_name() -> str:
    return os.environ["AWS_S3_BUCKET_NAME"]


def client():
    """Create an S3 client pinned to the bucket's regional endpoint.

    Using the regional endpoint avoids S3's 307 redirect from the global
    bucket hostname, which can break browser uploads using presigned URLs.
    """
    region = _region()
    return boto3.client(
        "s3",
        region_name=region,
        endpoint_url=f"https://s3.{region}.amazonaws.com",
        config=Config(
            signature_version="s3v4",
            s3={"addressing_style": "virtual"},
        ),
    )


def bucket() -> str:
    return _bucket_name()


def public_url(key: str) -> str:
    """Return a stable public/CDN URL for an asset."""
    base_url = os.getenv("AWS_S3_PUBLIC_BASE_URL")
    if base_url:
        return f"{base_url.rstrip('/')}/{quote(key, safe='/')}"

    return (
        f"https://{_bucket_name()}.s3.{_region()}.amazonaws.com/"
        f"{quote(key, safe='/')}"
    )


def read_url(key: str, expires_in: int = 3600) -> str:
    """Generate a temporary signed URL for reading a private object."""
    return client().generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket(), "Key": key},
        ExpiresIn=expires_in,
    )
