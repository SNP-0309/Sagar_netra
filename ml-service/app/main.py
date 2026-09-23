"""HTTP entrypoint for the SagarNetra local analysis service."""

from __future__ import annotations

import io
import os
import time
import uuid
from typing import Any

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from PIL import Image, ImageFile

from .detector import baseline_detect

ImageFile.LOAD_TRUNCATED_IMAGES = False
Image.MAX_IMAGE_PIXELS = 30_000_000

MAX_UPLOAD_BYTES = 200 * 1024 * 1024
SUPPORTED_TYPES = {"image/png", "image/jpeg", "image/tiff"}

app = FastAPI(title="SagarNetra Baseline Analysis Service", version="0.1.0")


def verify_api_key(authorization: str | None) -> None:
    expected = os.getenv("ML_API_KEY", "").strip()
    if expected and authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="Invalid analysis service credentials.")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sagarnetra-baseline"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    verify_api_key(authorization)

    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=415, detail="Upload a PNG, JPEG, or TIFF raster image.")

    started = time.perf_counter()
    raw = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 200 MB size limit.")

    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except Exception as error:
        raise HTTPException(status_code=400, detail="The uploaded file is not a readable raster image.") from error

    detections = baseline_detect(image)
    elapsed = round((time.perf_counter() - started) * 1000)

    return {
        "survey_id": f"SN-{uuid.uuid4().hex[:10].upper()}",
        "status": "complete",
        "model": "baseline-local-contrast-v0",
        "detections": detections,
        "processing_time_ms": elapsed,
        "coverage_km": None,
        "swath_width_m": None,
        "image_width": image.width,
        "image_height": image.height,
        "notice": "Baseline candidates require human review; no trained debris classifier is connected yet.",
    }
