#!/usr/bin/env python3
"""Remove the flat white background from trustchain-logo.png and write an
anti-aliased, halo-free transparent PNG.

The source logo is an orange circle (with a black compass/star icon and black
"TRUSTCHAIN" text) centered on a solid flat-white square. We:

  1. Derive a per-pixel alpha from "whiteness" (distance from pure white) so the
     white field becomes fully transparent while the orange/black artwork stays
     opaque, with a soft ramp across edge pixels for anti-aliasing.
  2. Colour-decontaminate the partially-transparent edge pixels by
     un-premultiplying against white, i.e. recover the true foreground colour
     from the observed (foreground-over-white) blend. This is what removes the
     bright white halo/fringe that a naive threshold leaves behind.

Outputs are written next to each source as `transparent-logo.png` (the source
files are left untouched).
"""

from pathlib import Path
import sys

import numpy as np
from PIL import Image

# White-removal ramp, in terms of "whiteness" w = min(R,G,B) (0..255).
# Pixels whiter than WHITE_HI collapse to fully transparent; pixels below
# WHITE_LO stay fully opaque; in between we ramp for anti-aliased edges.
WHITE_HI = 250.0   # >= this min-channel value -> treat as background (alpha 0)
WHITE_LO = 230.0   # <= this min-channel value -> treat as artwork   (alpha 255)


def make_transparent(src_path: Path, dst_path: Path) -> None:
    img = Image.open(src_path).convert("RGB")
    arr = np.asarray(img).astype(np.float32)  # (H, W, 3)

    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # Whiteness proxy: the *min* channel. White (255,255,255) -> 255.
    # Orange has a low blue channel; black has low everything -> both far from
    # white, so both end up opaque. This cleanly separates fg from white bg.
    whiteness = np.minimum(np.minimum(r, g), b)

    # Map whiteness -> alpha with a linear ramp between LO and HI for smooth,
    # anti-aliased edges (no hard 1-px stair-step).
    alpha = (WHITE_HI - whiteness) / (WHITE_HI - WHITE_LO)
    alpha = np.clip(alpha, 0.0, 1.0)

    # Colour decontamination: edge pixels are (fg over white) blends:
    #     observed = a * fg + (1 - a) * 255
    # Recover the true foreground colour so the leftover white does not show as
    # a halo once composited onto the dark theme:
    #     fg = (observed - (1 - a) * 255) / a
    a3 = alpha[..., None]
    safe_a = np.where(a3 > 0.0039, a3, 1.0)  # avoid /0 where fully transparent
    fg = (arr - (1.0 - a3) * 255.0) / safe_a
    fg = np.clip(fg, 0.0, 255.0)

    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = fg.astype(np.uint8)
    out[..., 3] = (alpha * 255.0).round().astype(np.uint8)

    Image.fromarray(out, mode="RGBA").save(dst_path)

    opaque = int((out[..., 3] == 255).sum())
    clear = int((out[..., 3] == 0).sum())
    edge = out[..., 3].size - opaque - clear
    print(
        f"{src_path} -> {dst_path}  "
        f"({img.width}x{img.height}, opaque={opaque}, transparent={clear}, edge={edge})"
    )


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    targets = [
        root / "public" / "trustchain-logo.png",
        root / "src" / "assets" / "trustchain-logo.png",
    ]

    missing = [t for t in targets if not t.exists()]
    if missing:
        print("ERROR: source logo(s) not found:", *missing, sep="\n  ")
        return 1

    for src in targets:
        dst = src.with_name("transparent-logo.png")
        make_transparent(src, dst)

    return 0


if __name__ == "__main__":
    sys.exit(main())
