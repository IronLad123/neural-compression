import os
from PIL import Image

orig = os.path.getsize("sample.png")
neural = os.path.getsize("latents.huff") + os.path.getsize("scales.bin") + os.path.getsize("shape.bin")

# save jpeg version
img = Image.open("sample.png")
img.save("jpeg_q75.jpg", "JPEG", quality=75)

jpeg = os.path.getsize("jpeg_q75.jpg")

print("\n--- Size Comparison ---")
print(f"Original: {orig/1024:.2f} KB")
print(f"Neural : {neural/1024:.2f} KB")
print(f"JPEG   : {jpeg/1024:.2f} KB")

print("\n--- Compression Ratio ---")
print(f"Neural ratio: {orig/neural:.3f}")
print(f"JPEG ratio  : {orig/jpeg:.3f}")
