"""Export the registered album layers for the Wayspace arrival. Requires Pillow."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "_source/design/wayspace-animated-artwork-pieces"
OUTPUT = ROOT / "assets/img/arrival"
# Images are cached as immutable. Bump this before changing published exports.
VERSION = "v1"
LAYERS = {
    "BACKGROUND": "sky",
    "RIVER&TREES": "river",
    "TREES": "trees",
    "JACK": "jack",
    "BRIDGE": "bridge",
    "FLOWER": "flower",
    "SPIRAL": "spiral",
    "WAYSPACE": "wordmark",
    "SWIMMERS": "swimmers",
    "ALL-BUTTERFLIES": "butterflies",
}

OUTPUT.mkdir(parents=True, exist_ok=True)
for original, name in LAYERS.items():
    with Image.open(SOURCE / f"{original}.png") as source:
        # Keep the full registered canvas and its alpha. Never trim a layer.
        image = source.resize((1200, 1200), Image.Resampling.LANCZOS)
        image.info.clear()
        destination = OUTPUT / f"{name}-{VERSION}.webp"
        if name == "sky":
            image.convert("RGB").save(destination, "WEBP", quality=85, method=6)
        else:
            image.save(destination, "WEBP", lossless=True, method=6)
        print(f"{destination.relative_to(ROOT)}: {destination.stat().st_size:,} bytes")
