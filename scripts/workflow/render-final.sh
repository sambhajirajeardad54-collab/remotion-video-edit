#!/usr/bin/env bash
# Render a composition as the final MP4 into out/final-video/ and verify it.
# Usage: scripts/workflow/render-final.sh <CompositionId> <project-name>
# Output: out/final-video/YYYY-MM-DD_<project-name>_1080x1920.mp4 (never overwrites)
set -euo pipefail
ID="$1"; NAME="$2"; OUTF="out/final-video/$(date +%F)_${NAME}_1080x1920.mp4"
[ -e "$OUTF" ] && { echo "Refusing to overwrite $OUTF (rename or delete it first)" >&2; exit 1; }
mkdir -p out/final-video
BROWSER=""; [ -x /opt/pw-browsers/chromium ] && BROWSER="--browser-executable=/opt/pw-browsers/chromium"
npx remotion render "$ID" "$OUTF" --codec=h264 --crf=16 --x264-preset=slow \
  --pixel-format=yuv420p --image-format=jpeg --jpeg-quality=95 \
  --audio-codec=aac --audio-bitrate=320k $BROWSER
echo "== verify"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of compact "$OUTF"
ffmpeg -v error -i "$OUTF" -f null - && echo "full decode: OK"
ffmpeg -i "$OUTF" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
ffmpeg -i "$OUTF" -vf "blackdetect=d=0.1:pix_th=0.05" -an -f null - 2>&1 | grep -q black_start && echo "WARNING: black frames found" || echo "no black frames"
echo "Final video: $OUTF"
