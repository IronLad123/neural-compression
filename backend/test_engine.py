import os
from backend.image_engine import compress_image

root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
result = compress_image(os.path.join(root, "upload.png"), 8, os.path.join(root, "results_demo"))
print(result)
