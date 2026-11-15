# Usage: python3 scripts/remove-background/matte_video.py <source.mp4> <output.webm>
# Writes a transparent VP9 WebM (same size, frame rate and timing as the source).
# Requires: pip install onnxruntime opencv-python-headless numpy ; ffmpeg.
import sys, os, subprocess, time, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mattelib import matte
SRC, OUT = sys.argv[1], sys.argv[2]
# Source size and frame rate, read from the file itself.
_probe = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height,r_frame_rate","-of","csv=p=0",SRC],capture_output=True,text=True).stdout.strip().split(",")
W, H = int(_probe[0]), int(_probe[1])
FPS = _probe[2] if len(_probe) > 2 else "30"
dec = subprocess.Popen(["ffmpeg","-v","error","-i",SRC,"-f","rawvideo","-pix_fmt","rgb24","-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgba","-s",f"{W}x{H}","-r",FPS,"-i","-",
    "-c:v","libvpx-vp9","-pix_fmt","yuva420p","-b:v","5M","-deadline","realtime","-cpu-used","8","-row-mt","1","-auto-alt-ref","0",OUT], stdin=subprocess.PIPE)
n=0; t0=time.time()
while True:
    buf = dec.stdout.read(W*H*3)
    if len(buf) < W*H*3: break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    a = (matte(rgb)*255).astype(np.uint8)
    enc.stdin.write(np.dstack([rgb, a]).tobytes()); n += 1
    if n % 150 == 0: print(f"{n} frames, {time.time()-t0:.0f}s", flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print(f"done: {n} frames in {time.time()-t0:.0f}s", flush=True)
