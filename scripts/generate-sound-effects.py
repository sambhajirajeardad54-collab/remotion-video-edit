#!/usr/bin/env python3
"""
Original sound effects for Remotion Video Edit.

Every effect is *designed and synthesized from scratch* in this script from
sine waves and random noise. No samples, recordings or third-party sound
libraries are used, so the effects carry no third-party copyright.

Effects (written to the output folder as WAV):
  whoosh.wav       1.0 s  airy band-passed noise sweep, panned left -> right
  impact-soft.wav  1.6 s  soft low cinematic hit (pitch-dropping thump + tail)
  tick.wav         0.25 s gentle "pop" for infographic elements
  swipe.wav        0.4 s  short airy swipe for lines drawing in
  riser.wav        1.0 s  rising cinematic swell that leads into a hit

Usage:
  python3 scripts/generate-sound-effects.py <output-folder>
  (then convert each WAV to MP3 with ffmpeg; see public/audio/README.md)

Requires: numpy. Output is deterministic (fixed random seed).
"""

import os
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(20261115)


def secs(n: float) -> int:
    return int(n * SR)


def fft_filter(x: np.ndarray, gain_fn) -> np.ndarray:
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec * gain_fn(freqs), len(x))


def lowpass(x, fc):
    return fft_filter(x, lambda f: 1 / (1 + (f / fc) ** 4))


def highpass(x, fc):
    return fft_filter(x, lambda f: 1 / (1 + (fc / np.maximum(f, 1e-6)) ** 4))


def sweep_bandpass(noise: np.ndarray, centre_hz: np.ndarray, q: float = 1.4) -> np.ndarray:
    """Band-pass noise whose centre frequency follows centre_hz (overlap-add STFT)."""
    win = 1024
    hop = win // 4
    window = np.hanning(win)
    out = np.zeros(len(noise) + win)
    norm = np.zeros(len(noise) + win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    for start in range(0, len(noise), hop):
        chunk = noise[start:start + win]
        if len(chunk) < win:
            chunk = np.pad(chunk, (0, win - len(chunk)))
        fc = centre_hz[min(start + win // 2, len(centre_hz) - 1)]
        bw = fc / q
        mask = np.exp(-0.5 * ((freqs - fc) / (bw / 2)) ** 2)
        y = np.fft.irfft(np.fft.rfft(chunk * window) * mask, win) * window
        out[start:start + win] += y
        norm[start:start + win] += window ** 2
    return (out / np.maximum(norm, 1e-6))[: len(noise)]


def reverb(x: np.ndarray, seconds: float, seed: int, wet: float) -> np.ndarray:
    r = np.random.default_rng(seed)
    n_ir = secs(seconds)
    ir = r.standard_normal(n_ir) * np.exp(-np.arange(n_ir) / SR / (seconds / 6.9))
    ir = lowpass(ir, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n_ir)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - wet) * x + wet * y


def fade_edges(x: np.ndarray, fade_in: float = 0.004, fade_out: float = 0.03) -> np.ndarray:
    x = x.copy()
    a, b = secs(fade_in), secs(fade_out)
    x[:a] *= np.linspace(0, 1, a)
    x[-b:] *= np.linspace(1, 0, b)
    return x


def to_stereo(mono: np.ndarray, pan: np.ndarray | float = 0.0) -> np.ndarray:
    pan = np.broadcast_to(pan, mono.shape)
    left = mono * np.cos((pan + 1) * np.pi / 4)
    right = mono * np.sin((pan + 1) * np.pi / 4)
    return np.stack([left, right], axis=1) * np.sqrt(2)


def normalise(stereo: np.ndarray, peak_db: float = -3.0) -> np.ndarray:
    return stereo / np.max(np.abs(stereo)) * 10 ** (peak_db / 20)


def whoosh() -> np.ndarray:
    n = secs(1.0)
    tt = np.arange(n) / SR
    peak = 0.45
    # Bell-shaped loudness peaking at 0.45 s; centre frequency rises then falls.
    env = np.exp(-0.5 * ((tt - peak) / 0.16) ** 2)
    centre = 350 + 2200 * np.exp(-0.5 * ((tt - peak) / 0.2) ** 2)
    body = sweep_bandpass(rng.standard_normal(n), centre, q=1.2) * env
    air = sweep_bandpass(rng.standard_normal(n), centre * 2.2, q=2.0) * env * 0.35
    mono = reverb(body + air, 0.8, 1, 0.2)
    pan = np.clip((tt - peak) / 0.35, -1, 1) * 0.7  # moves left -> right
    return normalise(to_stereo(fade_edges(mono), pan))


def impact_soft() -> np.ndarray:
    n = secs(1.6)
    tt = np.arange(n) / SR
    # Pitch-dropping sub thump (90 -> 42 Hz), soft attack, ~0.35 s decay.
    freq = 42 + 48 * np.exp(-tt / 0.08)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    thump = np.sin(phase) * np.exp(-tt / 0.35) * (1 - np.exp(-tt / 0.006))
    # Muffled noise "body" for texture.
    body = lowpass(rng.standard_normal(n), 400) * np.exp(-tt / 0.12) * 0.5
    mono = reverb(thump + body, 1.4, 2, 0.3)
    return normalise(to_stereo(fade_edges(highpass(mono, 30), fade_out=0.2)))


def tick() -> np.ndarray:
    n = secs(0.25)
    tt = np.arange(n) / SR
    freq = 900 + 500 * np.exp(-tt / 0.01)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    pop = (np.sin(phase) + 0.25 * np.sin(2 * phase)) * np.exp(-tt / 0.035)
    click = highpass(rng.standard_normal(n), 3000) * np.exp(-tt / 0.004) * 0.15
    mono = reverb(pop + click, 0.4, 3, 0.15)
    return normalise(to_stereo(fade_edges(mono, fade_in=0.002, fade_out=0.05)))


def swipe() -> np.ndarray:
    n = secs(0.4)
    tt = np.arange(n) / SR
    env = np.sin(np.pi * np.clip(tt / 0.4, 0, 1)) ** 2
    centre = 2500 + 4000 * tt / 0.4
    mono = sweep_bandpass(rng.standard_normal(n), centre, q=1.5) * env
    pan = np.linspace(-0.5, 0.5, n)
    return normalise(to_stereo(fade_edges(mono), pan))


def riser() -> np.ndarray:
    n = secs(1.0)
    tt = np.arange(n) / SR
    env = (tt / 1.0) ** 2.2
    centre = 200 + 2800 * (tt / 1.0) ** 1.8
    noise = sweep_bandpass(rng.standard_normal(n), centre, q=1.6)
    # Tonal layer: a rising fifth for a cinematic "swell" feel.
    freq = 110 * 2 ** (7 / 12 * tt / 1.0)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    tone = (np.sin(phase) + 0.5 * np.sin(1.5 * phase)) * 0.25
    mono = reverb((noise + tone) * env, 1.2, 4, 0.35)
    return normalise(to_stereo(fade_edges(mono, fade_out=0.04)))


EFFECTS = {
    "whoosh": whoosh,
    "impact-soft": impact_soft,
    "tick": tick,
    "swipe": swipe,
    "riser": riser,
}

out_dir = sys.argv[1] if len(sys.argv) > 1 else "."
os.makedirs(out_dir, exist_ok=True)
for name, make in EFFECTS.items():
    data = make()
    path = os.path.join(out_dir, f"{name}.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype("<i2").tobytes())
    print(f"Wrote {path} ({len(data) / SR:.2f} s)")
