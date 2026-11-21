# Presenter background removal with MODNet (Apache-2.0, ONNX from
# https://huggingface.co/Xenova/modnet). Runs on CPU via onnxruntime.
# Download once:  curl -L -o scripts/remove-background/modnet.onnx \
#   https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx
import os, numpy as np, cv2, onnxruntime as ort
_s=ort.InferenceSession(os.path.join(os.path.dirname(os.path.abspath(__file__)),'modnet.onnx'),providers=['CPUExecutionProvider'])
TORSO_Y=0.67  # below this fraction of the height, fill the body solid (shoulders meet the frame edges at ~0.66 in this shot)
def raw_matte(rgb):
    h,w=rgb.shape[:2]; sc=512/min(h,w); nh=int(round(h*sc/32))*32; nw=int(round(w*sc/32))*32
    x=cv2.resize(rgb,(nw,nh),interpolation=cv2.INTER_AREA).astype(np.float32)/255.0
    x=((x-0.5)/0.5).transpose(2,0,1)[None]
    m=_s.run(None,{'input':x})[0][0,0]
    return cv2.resize(m,(w,h),interpolation=cv2.INTER_LINEAR)
FULL_WIDTH_Y=0.72  # below this the shot is shirt from edge to edge
def fix_torso(a):
    h,w=a.shape; y0=int(h*TORSO_Y); y1=int(h*FULL_WIDTH_Y)
    fg=a>0.5
    out=a.copy()
    # 1. Columns: below the top edge of the person, the body is solid.
    has=fg.any(axis=0)
    first=np.where(has, fg.argmax(axis=0), h)
    start=np.maximum(first, y0)
    rows=np.arange(h)[:,None]
    out=np.maximum(out, ((rows>=start[None,:]) & has[None,:]).astype(np.float32))
    # 2. Rows: fill holes between the leftmost and rightmost body pixel,
    #    never beyond the person's own outline.
    for y in range(y0, h):
        xs=np.flatnonzero(out[y]>0.5)
        if xs.size: out[y, xs[0]:xs[-1]+1]=1.0
    # 3. Lowest part of the frame is shirt from edge to edge.
    out[y1:,:]=1.0
    # Smooth the edge slightly (keeps hair detail above the torso).
    out=cv2.morphologyEx(out,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    return cv2.GaussianBlur(out,(5,5),0)
def matte(rgb): return np.clip(fix_torso(raw_matte(rgb)),0,1)
