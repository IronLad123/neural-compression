from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import shutil
import os
import uuid
from datetime import datetime
from backend.image_engine import compress_image
from backend.metrics import psnr, ssim

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RESULTS_DIR = os.path.join(ROOT, "results_api")
os.makedirs(RESULTS_DIR, exist_ok=True)

# in-memory storage
RESULTS = {}


def _public_record(uid, record):
    original_available = record.get("original_available")
    if original_available is None:
        try:
            original_path = record.get("files", {}).get("original")
            original_available = bool(original_path and os.path.exists(original_path))
        except Exception:
            original_available = False
    return {
        "id": uid,
        "filename": record.get("filename"),
        "original_size": record.get("original_size"),
        "compressed_size": record.get("compressed_size"),
        "ratio": record.get("ratio"),
        "level": record.get("level"),
        "created_at": record.get("created_at"),
        "width": record.get("width"),
        "height": record.get("height"),
        "bpp": record.get("bpp"),
        "psnr": record.get("psnr"),
        "ssim": record.get("ssim"),
        "original_available": original_available,
    }


@app.post("/compress")
async def compress_endpoint(
    file: UploadFile = File(...),
    level: int = Form(...)
):
    if level < 2 or level > 256:
        raise HTTPException(status_code=400, detail="level must be between 2 and 256")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="file must be an image")

    uid = str(uuid.uuid4())
    work_dir = os.path.join(RESULTS_DIR, uid)
    os.makedirs(work_dir, exist_ok=True)

    upload_path = os.path.join(work_dir, "original.png")

    # save uploaded image
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # validate image
    try:
        with Image.open(upload_path) as img:
            img.verify()
    except Exception:
        shutil.rmtree(work_dir, ignore_errors=True)
        raise HTTPException(status_code=400, detail="invalid image file")

    # run compression
    result = compress_image(upload_path, level, work_dir)

    original_size = os.path.getsize(upload_path)
    compressed_size = result["compressed_size"]

    width = result["width"]
    height = result["height"]
    pixels = width * height if width and height else 0
    bpp = round((compressed_size * 8) / pixels, 4) if pixels else 0

    psnr_val = psnr(upload_path, result["output_image"])
    ssim_val = ssim(upload_path, result["output_image"])

    record = {
        "files": {
            "original": upload_path,
            "image": result["output_image"],
            "latents": result["latent_path"],
            "scales": result["scales_path"],
            "shape": result["shape_path"],
        },
        "work_dir": work_dir,
        "filename": file.filename,
        "original_size": original_size,
        "compressed_size": compressed_size,
        "ratio": round(original_size / compressed_size, 3) if compressed_size else 0,
        "level": level,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "width": width,
        "height": height,
        "bpp": bpp,
        "psnr": round(psnr_val, 4) if psnr_val is not None else None,
        "ssim": round(ssim_val, 4) if ssim_val is not None else None,
        "original_available": True,
    }

    RESULTS[uid] = record

    return JSONResponse({
        "id": uid,
        **_public_record(uid, record)
    })


@app.get("/history")
def history():
    items = [_public_record(uid, record) for uid, record in RESULTS.items()]
    items.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    return items


@app.get("/result/{id}")
def get_result(id: str):
    if id not in RESULTS:
        return {"error": "not found"}
    path = RESULTS[id]["files"]["image"]
    return FileResponse(path, media_type="image/png", filename=f"reconstructed_{id}.png")


@app.get("/artifact/{id}/{kind}")
def get_artifact(id: str, kind: str):
    if id not in RESULTS:
        return {"error": "not found"}

    files = RESULTS[id]["files"]
    if kind not in files or kind == "image":
        return {"error": "invalid artifact"}

    path = files[kind]
    if kind == "original":
        return FileResponse(path, media_type="image/png", filename=os.path.basename(path))
    return FileResponse(path, media_type="application/octet-stream", filename=os.path.basename(path))


@app.delete("/result/{id}")
def delete_result(id: str):
    if id in RESULTS:
        try:
            shutil.rmtree(RESULTS[id]["work_dir"], ignore_errors=True)
        except Exception:
            pass
        del RESULTS[id]
        return {"status": "deleted"}
    return {"status": "not found"}
