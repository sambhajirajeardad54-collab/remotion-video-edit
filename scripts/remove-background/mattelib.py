# Presenter background removal with MODNet (Apache-2.0, ONNX from
# https://huggingface.co/Xenova/modnet). Runs on CPU via onnxruntime.
# Download once:  curl -L -o scripts/remove-background/modnet.onnx \
#   https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx
import os, numpy as np, cv2, onnxruntime as ort
_s=ort.InferenceSession(os.path.join(os.path.dirname(os.path.abspath(__file__)),'modnet.onnx'),providers=['CPUExecutionProvider'])
TORSO_Y=0.62  # below this fraction of the height, fill the body solid
def raw_matte(rgb):
    h,w=rgb.shape[:2]; sc=512/min(h,w); nh=int(round(h*sc/32))*32; nw=int(round(w*sc/32))*32
    x=cv2.resize(rgb,(nw,nh),interpolation=cv2.INTER_AREA).astype(np.float32)/255.0
    x=((x-0.5)/0.5).transpose(2,0,1)[None]
    m=_s.run(None,{'input':x})[0][0,0]
    return cv2.resize(m,(w,h),interpolation=cv2.INTER_LINEAR)
def fix_torso(a):
    h,w=a.shape; y0=int(h*TORSO_Y)
    fg=a>0.5
    has=fg.any(axis=0)
    first=np.where(has, fg.argmax(axis=0), h)       # top edge of the person per column
    start=np.maximum(first, y0)
    rows=np.arange(h)[:,None]
    fill=(rows>=start[None,:]) & has[None,:]
    out=np.maximum(a, fill.astype(np.float32))
    # close small gaps and soften the edge a little
    out=cv2.morphologyEx(out,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    return cv2.GaussianBlur(out,(5,5),0)
def matte(rgb): return np.clip(fix_torso(raw_matte(rgb)),0,1)
