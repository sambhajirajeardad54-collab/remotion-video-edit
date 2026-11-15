#!/usr/bin/env python3
"""Transcribe YOUR Marathi voice with word timestamps (Whisper large-v3).

Usage: python3 scripts/workflow/transcribe.py out/analysis/raw_<name>/voice16k.wav out/analysis/raw_<name>/transcript.json

How it works (the method used for the MPSC video):
  - splits the audio at natural pauses (no cuts inside words),
  - transcribes each phrase separately (avoids Whisper skipping or looping),
  - no prompt (prompts made Whisper copy the prompt instead of listening).
The result is a MACHINE transcript: always have Sam confirm unclear words
before they go into captions. Never invent dialogue.

Needs: pip install faster-whisper numpy, network access to huggingface.co
and its download host (us.aws.cdn.hf.co); set HF_HUB_DISABLE_XET=1.
"""
import json, subprocess, sys, wave
import numpy as np
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
if "reference-video" in src:
    sys.exit("Refusing: reference videos are never transcribed as the voiceover.")
SR = 16000
wf = wave.open(src)
audio = np.frombuffer(wf.readframes(wf.getnframes()), dtype="<i2").astype(np.float32) / 32768
dur = len(audio) / SR

# Cut points in the middle of pauses longer than 0.3 s.
log = subprocess.run(["ffmpeg", "-i", src, "-af", "silencedetect=noise=-35dB:d=0.3", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(l.split("silence_start: ")[1]) for l in log.splitlines() if "silence_start" in l]
ends = [float(l.split("silence_end: ")[1].split()[0]) for l in log.splitlines() if "silence_end" in l]
cuts = [0.0] + [(s + e) / 2 for s, e in zip(starts, ends) if 0 < s and e < dur] + [dur]

model = WhisperModel("large-v3", device="cpu", compute_type="int8")
chunks = []
for a, b in zip(cuts[:-1], cuts[1:]):
    if b - a < 0.3:
        continue
    segs, _ = model.transcribe(audio[int(a * SR):int(b * SR)], language="mr", beam_size=5,
                               word_timestamps=True, condition_on_previous_text=False,
                               temperature=[0, 0.2, 0.4], no_repeat_ngram_size=3)
    segs = list(segs)
    words = [{"w": w.word.strip(), "s": round(a + w.start, 2), "e": round(a + w.end, 2),
              "p": round(w.probability, 2)} for s in segs for w in (s.words or [])]
    text = " ".join(s.text.strip() for s in segs)
    chunks.append({"start": round(a, 2), "end": round(b, 2), "text": text, "words": words})
    low = [w["w"] for w in words if w["p"] < 0.6]
    print(f"[{a:6.2f}-{b:6.2f}] {text}" + (f"   (unclear: {' '.join(low)})" if low else ""), flush=True)
json.dump(chunks, open(out, "w"), ensure_ascii=False, indent=1)
print(f"Transcript written to {out}")
