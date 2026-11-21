#!/usr/bin/env bash
# MPSC history video only: the source has a thumbnail poster burned into its
# first 3 s (frames 0-92, from y = 1170 down), which the matting treats as
# foreground. This makes that area transparent in the cutout.
# Usage: scripts/remove-background/mask-burned-in-poster.sh <in.webm> <out.webm>
set -euo pipefail
ffmpeg -v error -y -c:v libvpx-vp9 -i "$1" \
  -vf "format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(N,93)*gte(Y,1170),0,alpha(X,Y))'" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 5M -deadline realtime -cpu-used 8 \
  -row-mt 1 -auto-alt-ref 0 "$2"
