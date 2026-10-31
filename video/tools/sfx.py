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


def click():
    # lock / latch click: short bright transient + tiny resonance
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    burst = rng.standard_normal(n) * env(n, 0.0003, 0.004)
    ring = np.sin(2 * np.pi * 3100 * t) * env(n, 0.0005, 0.012) * 0.5
    return norm(burst + ring)


def creak():
    # door swing: low wobbling tone with breathy noise
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 180 + 90 * np.sin(2 * np.pi * 3 * t) + 120 * t
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t))
    air = lowpass(rng.standard_normal(n), 900) * 0.4
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return norm((tone * 0.7 + air) * shape)


def kaching():
    # register bell: two bright partials + drawer clunk
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    bell = sum(np.sin(2 * np.pi * f * t) * w for f, w in [(2093, 1), (2637, 0.7), (4186, 0.35)]) * env(n, 0.002, 0.25)
    clunk = lowpass(rng.standard_normal(n), 600) * env(n, 0.001, 0.03)
    return norm(bell + clunk * 0.8)


def printer():
    # receipt printer: fast ticks over a soft buzz
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    buzz = np.sign(np.sin(2 * np.pi * 120 * t)) * 0.15 * lowpass(np.ones(n), 400)
    ticks = np.zeros(n)
    for k in range(0, n, int(SR / 38)):
        m = min(n - k, int(0.004 * SR))
        ticks[k : k + m] += rng.standard_normal(m) * np.linspace(1, 0, m)
    shape = np.minimum(1, np.minimum(t / 0.03, (0.9 - t) / 0.08))
    return norm((buzz + ticks * 0.6) * np.clip(shape, 0, 1))


def snap():
    # mousetrap snap: hard click + wooden thump
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    hit = rng.standard_normal(n) * env(n, 0.0002, 0.006)
    thump = np.sin(2 * np.pi * (140 * np.exp(-t * 20) + 70) * t) * env(n, 0.001, 0.06)
    return norm(hit * 0.9 + thump)


def beep():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return norm(np.sin(2 * np.pi * 1760 * t) * np.minimum(1, np.minimum(t / 0.005, (0.12 - t) / 0.02)))


def air():
    # rushing air during the jump
    n = int(0.7 * SR)
    x = lowpass(rng.standard_normal(n), 1400)
    t = np.linspace(0, 1, n)
    return norm(x * np.sin(np.pi * t) ** 2)


def thud():
    # landing on the ground: low body hit
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (110 * np.exp(-t * 14) + 45) * t) * env(n, 0.001, 0.07)
    grit = lowpass(rng.standard_normal(n), 700) * env(n, 0.001, 0.03)
    return norm(body + grit * 0.6)


def applause():
    # crowd clapping that is cut off abruptly (no tail) for the reveal
    n = int(1.65 * SR)
    out = np.zeros(n)
    for _ in range(420):
        i = int(rng.uniform(0, n - 0.03 * SR))
        m = int(0.012 * SR)
        clap = lowpass(rng.standard_normal(m), rng.uniform(1500, 3500)) * np.linspace(1, 0, m) ** 2
        out[i : i + m] += clap * rng.uniform(0.3, 1)
    swell = np.minimum(1, np.arange(n) / (0.25 * SR))
    return norm(out * swell)


def wind():
    # hollow canyon wind
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    x = lowpass(rng.standard_normal(n), 380)
    gust = 0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t)
    shape = np.minimum(1, np.minimum(t / 0.4, (2.2 - t) / 0.8))
    return norm(x * gust * np.clip(shape, 0, 1))


def boom():
    # low dramatic tone for the reveal
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) * w for f, w in [(55, 1), (82.4, 0.5), (110, 0.25)])
    return norm(x * env(n, 0.02, 0.5))


def gunshot():
    # distant, muffled shot
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    crack_ = lowpass(rng.standard_normal(n), 1100) * env(n, 0.0005, 0.03)
    body = np.sin(2 * np.pi * (80 * np.exp(-t * 10) + 40) * t) * env(n, 0.002, 0.09)
    return norm(crack_ * 0.8 + body)


def engine():
    # distant propeller drone
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    f = 62 + 4 * np.sin(2 * np.pi * 0.3 * t)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    x = lowpass(saw, 500) * (0.75 + 0.25 * np.sin(2 * np.pi * 18 * t))
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.2
    return norm(x * shape)


def clank():
    # heavy metal plate
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) * w for f, w in [(310, 1), (523, 0.7), (871, 0.5), (1290, 0.3)])
    hit = lowpass(rng.standard_normal(n), 2000) * env(n, 0.0005, 0.01)
    return norm(x * env(n, 0.001, 0.12) + hit)


GEN = {"air": air, "thud": thud, "applause": applause, "wind": wind, "boom": boom, "gunshot": gunshot,
       "engine": engine, "clank": clank,
       "click": click, "creak": creak, "kaching": kaching, "printer": printer, "snap": snap, "beep": beep,
       "whoosh": whoosh, "tick": tick, "pop": pop, "clink": clink, "shimmer": shimmer, "crack": crack, "swipe": swipe}


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
        if kind in ("clink", "tick", "gunshot") or kind not in cache:
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
