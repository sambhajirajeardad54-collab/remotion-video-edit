#!/usr/bin/env python3
"""
Original background music for Remotion Video Edit.

This script *composes and synthesizes* the track from scratch: every sound is
generated here from sine waves and noise. No samples, loops, recordings or
third-party music are used, so the result carries no third-party copyright.

Style: subtle, slow, minor-key documentary/cinematic underscore.
  - Chords:  Dm -> Bb -> F -> C  (5.5 s each), soft string-like pads
  - Sub bass on each chord root
  - Sparse piano-like notes on chord tones
  - Soft filtered-noise swells into each chord change
  - Synthetic hall reverb

Usage:
  python3 scripts/generate-background-music.py out.wav
  ffmpeg -i out.wav -c:a libmp3lame -b:a 192k public/audio/music/background-music.mp3

Requires: numpy. Output is deterministic (fixed random seed).
"""

import sys
import wave

import numpy as np

SR = 44100
DURATION = 24.0  # seconds (the video is 21.8 s)
CHORD_LEN = 5.5
rng = np.random.default_rng(20261114)

N = int(SR * DURATION)
t = np.arange(N) / SR


def midi_hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def envelope(start: float, length: float, attack: float, release: float) -> np.ndarray:
    """Smooth (raised-cosine) attack / sustain / release envelope."""
    env = np.zeros(N)
    a0, a1 = start, start + attack
    r0, r1 = start + length, start + length + release
    i = lambda x: int(np.clip(x * SR, 0, N))
    seg = np.arange(i(a0), i(a1))
    env[seg] = 0.5 - 0.5 * np.cos(np.pi * (seg / SR - a0) / attack)
    env[i(a1):i(r0)] = 1.0
    seg = np.arange(i(r0), i(r1))
    env[seg] = 0.5 + 0.5 * np.cos(np.pi * (seg / SR - r0) / release)
    return env


def pad_voice(freq: float, detune_cents: float) -> np.ndarray:
    """Warm string-like tone: additive saw with strongly damped upper harmonics."""
    f = freq * 2 ** (detune_cents / 1200)
    phase = rng.uniform(0, 2 * np.pi)
    vib = 0.0015 * np.sin(2 * np.pi * 4.8 * t + phase)  # gentle vibrato
    out = np.zeros(N)
    for n in range(1, 13):
        out += (1 / n) * np.exp(-n / 4.5) * np.sin(2 * np.pi * f * n * t * (1 + vib) + phase * n)
    return out


# Chord progression (MIDI notes). Voicings kept in a low-mid register.
CHORDS = [
    ("Dm", 38, [50, 53, 57, 62]),  # D2 root | D3 F3 A3 D4
    ("Bb", 34, [50, 53, 58, 62]),  # Bb1     | D3 F3 Bb3 D4
    ("F", 41, [48, 53, 57, 60]),   # F2      | C3 F3 A3 C4
    ("C", 36, [48, 52, 55, 60]),   # C2      | C3 E3 G3 C4
    ("Dm", 38, [50, 53, 57, 62]),  # resolve
]

left = np.zeros(N)
right = np.zeros(N)

for idx, (_name, root, notes) in enumerate(CHORDS):
    start = idx * CHORD_LEN
    if start >= DURATION:
        break
    env = envelope(start, CHORD_LEN - 0.6, attack=1.6, release=2.2)

    # Pads: two detuned voices per note, spread left/right.
    for k, m in enumerate(notes):
        hz = midi_hz(m)
        amp = 0.11 * (1.0 if k < 3 else 0.7)
        left += amp * env * pad_voice(hz, -6 + k)
        right += amp * env * pad_voice(hz, 6 - k)

    # Sub bass: pure sine on the chord root.
    sub = 0.12 * env * np.sin(2 * np.pi * midi_hz(root) * t)
    left += sub
    right += sub

    # Airy shimmer: chord tones two octaves up, slowly breathing in level,
    # so the music stays present on small phone speakers.
    for k, m in enumerate(notes[1:3]):
        hz = midi_hz(m + 24)
        breathe = 0.5 + 0.5 * np.sin(2 * np.pi * 0.18 * t + k * 1.7)
        tone = np.sin(2 * np.pi * hz * t) + 0.3 * np.sin(2 * np.pi * 2 * hz * t)
        shimmer = 0.018 * env * breathe * tone
        left += shimmer if k == 0 else 0.4 * shimmer
        right += shimmer if k == 1 else 0.4 * shimmer

# Sparse piano-like notes: soft attack, exponential decay, a few partials.
MOTIF = [  # (time s, MIDI note, velocity, pan -1..1)
    (1.5, 69, 0.8, -0.3), (3.2, 74, 0.6, 0.3),
    (7.0, 70, 0.8, -0.3), (8.7, 74, 0.6, 0.3),
    (12.5, 72, 0.8, -0.3), (14.2, 77, 0.55, 0.3),
    (18.0, 67, 0.75, -0.3), (19.7, 72, 0.55, 0.3),
    (22.0, 69, 0.6, 0.0),
]
for start, m, vel, pan in MOTIF:
    hz = midi_hz(m)
    i0 = int(start * SR)
    tt = t[i0:] - start
    note = (
        np.sin(2 * np.pi * hz * tt) * np.exp(-tt / 2.6)
        + 0.35 * np.sin(2 * np.pi * 2 * hz * tt) * np.exp(-tt / 1.2)
        + 0.12 * np.sin(2 * np.pi * 3 * hz * tt) * np.exp(-tt / 0.6)
    )
    note *= 1 - np.exp(-tt / 0.008)  # remove click
    note *= 0.12 * vel
    left[i0:] += note * (1 - pan) / 2 * 1.4
    right[i0:] += note * (1 + pan) / 2 * 1.4


def lowpass_fft(x: np.ndarray, cutoff_hz: float) -> np.ndarray:
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (freqs / cutoff_hz) ** 4)
    return np.fft.irfft(spec, len(x))


# Soft noise swells rising into each chord change.
for change in [CHORD_LEN * k for k in range(1, 5)]:
    i0, i1 = int((change - 2.2) * SR), int((change + 0.4) * SR)
    seg_len = i1 - i0
    swell = lowpass_fft(rng.standard_normal(seg_len), 900)
    shape = np.linspace(0, 1, seg_len) ** 2.5
    shape[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))
    swell *= shape * 0.05
    left[i0:i1] += swell
    right[i0:i1] += np.roll(swell, 300)


# Synthetic hall reverb: decaying, low-passed noise impulse response.
def reverb(x: np.ndarray, seed: int, seconds: float = 3.0) -> np.ndarray:
    r = np.random.default_rng(seed)
    n_ir = int(seconds * SR)
    ir = r.standard_normal(n_ir) * np.exp(-np.arange(n_ir) / SR / (seconds / 6.9) * 1.0)
    ir = lowpass_fft(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n_ir)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y


wet = 0.35
left_out = (1 - wet) * left + wet * reverb(left, 1)
right_out = (1 - wet) * right + wet * reverb(right, 2)

# Remove sub-audible rumble below ~40 Hz.
def highpass_fft(x: np.ndarray, cutoff_hz: float) -> np.ndarray:
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (cutoff_hz / np.maximum(freqs, 1e-6)) ** 4)
    return np.fft.irfft(spec, len(x))


left_out = highpass_fft(left_out, 40)
right_out = highpass_fft(right_out, 40)

# Overall fade in / out and normalisation to -1 dBFS peak.
master = envelope(0, DURATION - 3.0, attack=2.0, release=3.0)
stereo = np.stack([left_out, right_out], axis=1) * master[:, None]
stereo /= np.max(np.abs(stereo)) / 10 ** (-1 / 20)

out_path = sys.argv[1] if len(sys.argv) > 1 else "background-music.wav"
pcm = (stereo * 32767).astype("<i2")
with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"Wrote {out_path} ({DURATION:.1f} s, {SR} Hz stereo)")
