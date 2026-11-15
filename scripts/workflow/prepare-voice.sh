#!/usr/bin/env bash
# Make a level-corrected copy of YOUR voice from a raw recording
# (-16 LUFS, two-pass loudnorm). The raw file is never modified.
# Usage: scripts/workflow/prepare-voice.sh public/videos/raw-video/<file> public/audio/<project>/voice.mp3
set -euo pipefail
IN="$1"; OUTF="$2"
case "$IN" in *reference-video*) echo "Refusing: reference videos are never used as voiceover." >&2; exit 1;; esac
[ -e "$OUTF" ] && { echo "Refusing to overwrite $OUTF" >&2; exit 1; }
mkdir -p "$(dirname "$OUTF")"
M=$(ffmpeg -i "$IN" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
read -r i tp lra th off <<< "$(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -v error -i "$IN" -vn -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$i:measured_TP=$tp:measured_LRA=$lra:measured_thresh=$th:offset=$off:linear=true" -ar 48000 -ac 2 -c:a libmp3lame -b:a 192k "$OUTF"
ffmpeg -i "$OUTF" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:"
echo "Voice written to $OUTF"
