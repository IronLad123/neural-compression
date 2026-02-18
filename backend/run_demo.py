import os
from PIL import Image
from backend.image_engine import compress_image
from backend.psnr import psnr

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SAMPLE = os.path.join(ROOT, "sample.png")

level = int(input("Enter quality level (2/4/8/16/32): "))

work_dir = os.path.join(ROOT, "results_demo")
result = compress_image(SAMPLE, level, work_dir)

# PSNR
score = psnr(SAMPLE, result["output_image"])
print("PSNR:", score)

# Size comparison (neural vs jpeg)
orig = os.path.getsize(SAMPLE)
neural = result["compressed_size"]

jpeg_path = os.path.join(work_dir, "jpeg_q75.jpg")
img = Image.open(SAMPLE)
img.save(jpeg_path, "JPEG", quality=75)

jpeg = os.path.getsize(jpeg_path)

print("\n--- Size Comparison ---")
print(f"Original: {orig/1024:.2f} KB")
print(f"Neural : {neural/1024:.2f} KB")
print(f"JPEG   : {jpeg/1024:.2f} KB")

print("\n--- Compression Ratio ---")
print(f"Neural ratio: {orig/neural:.3f}")
print(f"JPEG ratio  : {orig/jpeg:.3f}")
