import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from model.autoencoder import Autoencoder
from backend.huffman import encode_bytes, delta_encode


def run_compress(image_path, level, out_dir):
    device = "cuda" if torch.cuda.is_available() else "cpu"

    model = Autoencoder().to(device)
    model.load_state_dict(torch.load("model.pth", map_location=device))
    model.eval()

    PATCH = 128

    transform = transforms.Compose([
        transforms.ToTensor()
    ])

    img = Image.open(image_path).convert("RGB")
    w, h = img.size

    latents = []
    scales = []

    for y in range(0, h, PATCH):
        for x in range(0, w, PATCH):
            patch = img.crop((x, y, x + PATCH, y + PATCH))
            patch = patch.resize((PATCH, PATCH))

            x_tensor = transform(patch).unsqueeze(0).to(device)

            with torch.no_grad():
                latent = model.encoder(x_tensor)

            latent = latent.squeeze().cpu().numpy()

            # quantize using provided level
            mn, mx = latent.min(), latent.max()
            latent_q = ((latent - mn) / (mx - mn + 1e-9) * (level - 1)).astype(np.uint8)

            latents.append(latent_q)
            scales.append((mn, mx))

    latents = np.array(latents, dtype=np.uint8)
    scales = np.array(scales, dtype=np.float32)

    os.makedirs(out_dir, exist_ok=True)

    latent_bytes = delta_encode(latents.tobytes())
    latent_path = os.path.join(out_dir, "latents.huff")
    encode_bytes(latent_bytes, latent_path)

    scales_path = os.path.join(out_dir, "scales.bin")
    shape_path = os.path.join(out_dir, "shape.bin")

    scales.tofile(scales_path)
    np.array([w, h], dtype=np.int32).tofile(shape_path)

    compressed_size = (
        os.path.getsize(latent_path) +
        os.path.getsize(scales_path) +
        os.path.getsize(shape_path)
    )

    return {
        "latent_path": latent_path,
        "scales_path": scales_path,
        "shape_path": shape_path,
        "compressed_size": compressed_size,
        "width": w,
        "height": h,
    }
