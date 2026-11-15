#!/usr/bin/env bash
# Analyse YOUR raw recording (read-only; the file is never modified).
# Usage: scripts/workflow/analyze-raw.sh public/videos/raw-video/<file>
# Writes to out/analysis/raw_<name>/ : probe.txt, cuts.txt (burned-in
# graphics / cutaways show up as cuts), contact.png, audio.txt (loudness,
# pauses for caption/graphic timing), voice16k.wav (for transcription).
set -euo pipefail
IN="$1"; NAME=$(basename "${IN%.*}"); OUT="out/analysis/raw_${NAME}"
case "$IN" in *reference-video*) echo "This is a reference video. Use analyze-reference.sh." >&2; exit 1;; esac
mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels -of compact "$IN" > "$OUT/probe.txt"
ffmpeg -v error -i "$IN" -vf "select='gt(scene,0.25)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$OUT/cuts.txt" || true
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN"); N=$(python3 -c "print(min(60,max(1,int(float('$D')/2))))")
ffmpeg -v error -y -i "$IN" -vf "fps=1/2,scale=180:-2,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=10x$(( (N+9)/10 ))" -frames:v 1 "$OUT/contact.png"
{
  echo "== loudness"; ffmpeg -i "$IN" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|LRA:|Peak:)"
  echo "== pauses (>0.3 s, -35 dB): use these to split captions"; ffmpeg -i "$IN" -af "silencedetect=noise=-35dB:d=0.3" -f null - 2>&1 | grep -o "silence_\(start\|end\): [0-9.]*" | paste - - || true
} > "$OUT/audio.txt"
ffmpeg -v error -y -i "$IN" -vn -ac 1 -ar 16000 "$OUT/voice16k.wav"
echo "Raw analysis written to $OUT"
echo "Next: python3 scripts/workflow/transcribe.py $OUT/voice16k.wav $OUT/transcript.json"
