#!/usr/bin/env bash
# Background removal for a raw recording -> transparent WebM (CPU, MODNet).
# Usage: scripts/workflow/make-cutout.sh public/videos/raw-video/<file> public/videos/cutouts/<name>.cutout.webm
# Needs: pip install onnxruntime opencv-python-headless numpy, and the model:
#   curl -L -o scripts/remove-background/modnet.onnx https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx
set -euo pipefail
IN="$1"; OUTF="$2"
case "$IN" in *reference-video*) echo "Refusing: reference videos are never used as footage." >&2; exit 1;; esac
[ -e "$OUTF" ] && { echo "Refusing to overwrite $OUTF" >&2; exit 1; }
mkdir -p "$(dirname "$OUTF")"
python3 scripts/remove-background/matte_video.py "$IN" "$OUTF"
echo "Cutout written to $OUTF. Check it for burned-in graphics (see mask-burned-in-poster.sh)."
