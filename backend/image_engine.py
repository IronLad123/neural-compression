import os
from backend.compress import run_compress
from backend.decompress import run_decompress


def compress_image(path, level, work_dir):
    result = run_compress(path, level, work_dir)
    output_image = run_decompress(
        result["latent_path"],
        result["scales_path"],
        result["shape_path"],
        level,
        os.path.join(work_dir, "decompressed.png"),
    )

    return {
        "output_image": output_image,
        "compressed_size": result["compressed_size"],
        "work_dir": work_dir,
        "latent_path": result["latent_path"],
        "scales_path": result["scales_path"],
        "shape_path": result["shape_path"],
        "width": result["width"],
        "height": result["height"],
    }
