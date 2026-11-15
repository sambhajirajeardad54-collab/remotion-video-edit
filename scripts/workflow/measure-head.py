#!/usr/bin/env python3
"""Measure where the presenter's head is, from the background-removed cutout.

Usage: python3 scripts/workflow/measure-head.py public/videos/cutouts/<name>.cutout.webm [skip_start-skip_end ...]
  e.g. ... 12.4-15.8   (skip seconds where the presenter is not on screen)

Prints headX / headY (0-1, for the project config) and the hair-top / chin
range, so the circular frame can centre the head without cropping it.
"""
import subprocess, sys
import numpy as np

src = sys.argv[1]
skips = [tuple(map(float, s.split("-"))) for s in sys.argv[2:]]
w, h, d = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height:format=duration", "-of", "csv=p=0", src],
                         capture_output=True, text=True).stdout.replace("\n", ",").strip(",").split(",")[:3]
W, H, D = int(w), int(h), float(d)
res = []
for t in np.arange(0.25, D - 0.25, 0.5):
    if any(a <= t <= b for a, b in skips):
        continue
    raw = subprocess.run(["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-ss", f"{t:.2f}", "-i", src,
                          "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "-"], capture_output=True).stdout
    if len(raw) < W * H * 4:
        continue
    a = np.frombuffer(raw, np.uint8).reshape(H, W, 4)[..., 3] > 128
    width = a.sum(1)
    rows = np.flatnonzero(width > 20)
    if not rows.size:
        continue
    top = rows[0]
    lo, hi = top + int(0.18 * H), min(H, top + int(0.42 * H))
    neck = lo + int(np.argmin(width[lo:hi]))
    mid = a[top + (neck - top) // 3: top + 2 * (neck - top) // 3]
    cols = np.flatnonzero(mid.any(0))
    res.append((top, neck, (cols[0] + cols[-1]) / 2))
r = np.array(res)
top, neck, cx = np.median(r[:, 0]), np.median(r[:, 1]), np.median(r[:, 2])
chin = neck - 0.04 * H
print(f"samples: {len(r)}  source {W}x{H}")
print(f"hair top y: {r[:,0].min():.0f}-{r[:,0].max():.0f} (median {top:.0f}), chin ≈ {chin:.0f}, face centre x {cx:.0f}")
print(f"headX: {cx / W:.4f}   headY: {((top + chin) / 2) / H:.4f}")
print(f"suggested circle scale for a 420 px circle: {0.6 * 420 / (chin - top):.2f}")
