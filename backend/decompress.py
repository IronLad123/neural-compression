import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from model.autoencoder import Autoencoder
from backend.huffman import decode_bytes, delta_decode


def run_decompress(latent_file, scales_path, shape_path, level, output_path):
    device = "cuda" if torch.cuda.is_available() else "cpu"

    model = Autoencoder().to(device)
    model.load_state_dict(torch.load("model.pth", map_location=device))
    model.eval()

    PATCH = 128

    # load compressed data
    latent_bytes = delta_decode(decode_bytes(latent_file))
    latents = np.frombuffer(latent_bytes, dtype=np.uint8)

    scales = np.fromfile(scales_path, dtype=np.float32).reshape(-1, 2)
    w, h = np.fromfile(shape_path, dtype=np.int32)

    # determine latent shape automatically
    latent_size = 64 * 16 * 16
    num_patches = len(latents) // latent_size
    latents = latents.reshape(num_patches, 64, 16, 16)

    transform = transforms.ToPILImage()
    canvas = Image.new("RGB", (w, h))

    idx = 0
    for y in range(0, h, PATCH):
        for x in range(0, w, PATCH):
            latent_q = latents[idx]
            mn, mx = scales[idx]

            # dequantize using provided level
            latent = latent_q.astype(np.float32) / (level - 1) * (mx - mn) + mn
            latent = torch.tensor(latent).unsqueeze(0).to(device)

            with torch.no_grad():
                recon = model.decoder(latent)

            patch = transform(recon.squeeze().cpu())
            canvas.paste(patch, (x, y))
            idx += 1

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path)

    return output_path
