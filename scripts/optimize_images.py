"""Optimize oversized image assets for faster load.

- hero-workers.png (1024x1024, ~1.1MB) -> WebP at 800px (kept eager/LCP).
- transparent-logo: rendered at most ~420px (hero watermark) / 200px
  (BrandWatermark) / 180px (apple-touch) yet shipped at 1024px. Resize to
  512px. WebP for the bundled component import; a small PNG for the favicon
  and apple-touch-icon (broad compatibility).

Originals are left in place except where a resized PNG intentionally
replaces an oversized one that is only ever displayed small.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
public = root / "public"
assets = root / "src" / "assets"


def resize(img: Image.Image, target: int) -> Image.Image:
    if max(img.size) <= target:
        return img.copy()
    ratio = target / max(img.size)
    new = (round(img.width * ratio), round(img.height * ratio))
    return img.resize(new, Image.LANCZOS)


def report(path: Path):
    print(f"  {path.relative_to(root)}  {path.stat().st_size // 1024} KB")


# 1. Hero illustration -> WebP @ 800px (RGBA preserved)
hero = Image.open(public / "hero-workers.png").convert("RGBA")
hero_out = resize(hero, 800)
hero_out.save(public / "hero-workers.webp", "WEBP", quality=82, method=6)
print("hero-workers.webp:")
report(public / "hero-workers.webp")

# 2. Component logo -> WebP @ 512px (RGBA)
logo = Image.open(assets / "transparent-logo.png").convert("RGBA")
logo512 = resize(logo, 512)
logo512.save(assets / "transparent-logo.webp", "WEBP", quality=90, method=6, lossless=False)
print("src/assets/transparent-logo.webp:")
report(assets / "transparent-logo.webp")

# 3. Public logo (favicon + hero watermark) -> resized PNG @ 512px, overwrite
plogo = Image.open(public / "transparent-logo.png").convert("RGBA")
plogo512 = resize(plogo, 512)
plogo512.save(public / "transparent-logo.png", "PNG", optimize=True)
print("public/transparent-logo.png (resized 512):")
report(public / "transparent-logo.png")

# 4. Small favicon PNG @ 128px for crisp tab icon
plogo.resize((128, 128), Image.LANCZOS).save(public / "favicon-128.png", "PNG", optimize=True)
print("public/favicon-128.png:")
report(public / "favicon-128.png")
