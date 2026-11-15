#!/usr/bin/env bash
# Analyse a REFERENCE video's editing style (read-only).
# Usage: scripts/workflow/analyze-reference.sh public/videos/reference-video/<file>
# Writes to out/analysis/reference_<name>/ :
#   probe.txt       format, size, fps, duration
#   cuts.txt        scene-cut times (transition rhythm)
#   contact.png     1 frame per second (layout, typography, framing, graphics)
#   captions.png    lower and middle bands over time (caption style/position)
#   audio.txt       loudness, pauses, music presence (stereo side level)
set -euo pipefail
IN="$1"; NAME=$(basename "${IN%.*}"); OUT="out/analysis/reference_${NAME}"
mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels -of compact "$IN" > "$OUT/probe.txt"
ffmpeg -v error -i "$IN" -vf "select='gt(scene,0.25)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$OUT/cuts.txt" || true
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN"); N=$(python3 -c "print(min(60,max(1,int(float('$D')))))")
ffmpeg -v error -y -i "$IN" -vf "fps=1,scale=180:-2,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=10x$(( (N+9)/10 ))" -frames:v 1 "$OUT/contact.png"
ffmpeg -v error -y -i "$IN" -vf "fps=1,crop=iw:ih*0.45:0:ih*0.45,scale=200:-2,tile=10x$(( (N+9)/10 ))" -frames:v 1 "$OUT/captions.png"
{
  echo "== loudness"; ffmpeg -i "$IN" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|LRA:|Peak:)"
  echo "== pauses (>0.3 s, -35 dB)"; ffmpeg -i "$IN" -af "silencedetect=noise=-35dB:d=0.3" -f null - 2>&1 | grep -o "silence_\(start\|end\): [0-9.]*" | paste - - || true
  echo "== music/stereo check (side vs mid; music usually raises side level)"
  ffmpeg -i "$IN" -af "pan=mono|c0=0.5*c0-0.5*c1,volumedetect" -f null - 2>&1 | grep mean_volume | sed 's/^/side /'
  ffmpeg -i "$IN" -af "pan=mono|c0=0.5*c0+0.5*c1,volumedetect" -f null - 2>&1 | grep mean_volume | sed 's/^/mid  /'
} > "$OUT/audio.txt"
echo "Reference analysis written to $OUT (cuts: $(wc -l < "$OUT/cuts.txt"))"
