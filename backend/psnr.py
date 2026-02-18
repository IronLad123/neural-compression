import numpy as np
from PIL import Image


def psnr(img1_path, img2_path):
    img1 = np.array(Image.open(img1_path).convert("RGB"), dtype=np.float32)
    img2 = np.array(Image.open(img2_path).convert("RGB"), dtype=np.float32)

    mse = np.mean((img1 - img2) ** 2)
    if mse == 0:
        return 100

    return 20 * np.log10(255.0 / np.sqrt(mse))


if __name__ == "__main__":
    print("PSNR:", psnr("sample.png", "decompressed.png"))
