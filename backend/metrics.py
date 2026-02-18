import numpy as np
from PIL import Image

try:
    from skimage.metrics import structural_similarity as _ssim
except Exception:
    _ssim = None


def _load_rgb(path):
    return np.array(Image.open(path).convert("RGB"), dtype=np.float32)


def psnr(img1_path, img2_path):
    img1 = _load_rgb(img1_path)
    img2 = _load_rgb(img2_path)

    mse = np.mean((img1 - img2) ** 2)
    if mse == 0:
        return 100.0

    return float(20 * np.log10(255.0 / np.sqrt(mse)))


def ssim(img1_path, img2_path):
    if _ssim is None:
        return None

    img1 = _load_rgb(img1_path)
    img2 = _load_rgb(img2_path)

    return float(
        _ssim(img1, img2, channel_axis=2, data_range=255)
    )
