"""Synthesise soft sound effects and mix them under the voiceover.

usage: python3 tools/sfx.py <voice.wav> <cues.json> <out.wav>

cues.json: [{"t": 1.47, "type": "crack", "gain": -24}, ...]
gain is the effect's peak level in dBFS (the voice peaks around -1.5 dBFS).
"""
import json
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def env(n, attack, release):
    a = int(attack * SR)
    e = np.ones(n)
    if a:
        e[:a] = np.linspace(0, 1, a)
    e *= np.exp(-np.arange(n) / (release * SR))
    return e


def lowpass(x, cutoff):
    # one-pole low-pass, run twice for a gentler slope
    k = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for i, v in enumerate(x):
            acc = (1 - k) * v + k * acc
            y[i] = acc
        x = y
    return x


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def whoosh(dur=0.55):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    # band sweep: low-pass whose cutoff rises then falls
    out = np.zeros(n)
    hop = 512
    for s in range(0, n, hop):
        seg = noise[s : s + hop]
        c = 300 + 2200 * np.sin(np.pi * t[s]) ** 2
        out[s : s + hop] = lowpass(seg, c)
    shape = np.sin(np.pi * t) ** 2
    return norm(out * shape)


def tick():
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 2400 * t) * env(n, 0.001, 0.008)
    return norm(x)


def pop():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 900 * np.exp(-t * 18) + 380
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.03)
    return norm(x)


def clink():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    base = rng.uniform(2600, 3400)
    x = sum(np.sin(2 * np.pi * base * r * t) * w for r, w in [(1, 1), (1.52, 0.6), (2.31, 0.35)])
    return norm(x * env(n, 0.0005, 0.025))


def shimmer(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) * w for f, w in [(1046.5, 1), (1568, 0.7), (2093, 0.45), (2637, 0.3)])
    trem = 0.85 + 0.15 * np.sin(2 * np.pi * 7 * t)
    return norm(x * trem * env(n, 0.05, 0.35))


def crack():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = lowpass(rng.standard_normal(n), 1800) * env(n, 0.001, 0.05)
    thump = np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 45) * t) * env(n, 0.002, 0.12)
    return norm(noise * 0.8 + thump)


def swipe():
    n = int(0.3 * SR)
    noise = lowpass(rng.standard_normal(n), 2500)
    t = np.linspace(0, 1, n)
    return norm(noise * np.sin(np.pi * t) ** 3)


GEN = {"whoosh": whoosh, "tick": tick, "pop": pop, "clink": clink, "shimmer": shimmer, "crack": crack, "swipe": swipe}


def read_wav(p):
    with wave.open(p) as w:
        assert w.getframerate() == SR and w.getsampwidth() == 2
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        return data.reshape(-1, w.getnchannels()).mean(axis=1)


def main():
    voice_p, cues_p, out_p = sys.argv[1:4]
    voice = read_wav(voice_p)
    cues = json.load(open(cues_p))
    total = max(len(voice), int((max(c["t"] for c in cues) + 2) * SR))
    mix = np.zeros(total)
    mix[: len(voice)] += voice
    cache = {}
    for c in cues:
        kind = c["type"]
        if kind in ("clink", "tick") or kind not in cache:
            cache[kind] = GEN[kind]()
        s = cache[kind] * 10 ** (c["gain"] / 20)
        i = int(c["t"] * SR)
        mix[i : i + len(s)] += s[: total - i]
    peak = np.max(np.abs(mix))
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (mix * 32767).astype(np.int16)
    with wave.open(out_p, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {out_p}: {total / SR:.2f}s, {len(cues)} cues, peak {peak:.2f}")


if __name__ == "__main__":
    main()
