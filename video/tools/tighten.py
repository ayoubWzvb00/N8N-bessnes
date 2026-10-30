"""Shorten long pauses in a voiceover without touching the speech.

usage: python3 tools/tighten.py in.mp3 out.wav map.json [max_pause=0.3] [keep=0.22]

Pauses longer than max_pause become `keep` seconds (half kept on each side,
joined with a 10 ms crossfade). map.json lists the cuts so timestamps taken on
the original file can be moved onto the edited one.
"""
import json, re, subprocess, sys
import numpy as np

src, dst, map_p = sys.argv[1:4]
max_pause = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
keep = float(sys.argv[5]) if len(sys.argv) > 5 else 0.22
SR = 48000

log = subprocess.run(
    ["ffmpeg", "-hide_banner", "-nostats", "-i", src, "-af", "silencedetect=noise=-40dB:d=0.1", "-f", "null", "-"],
    capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True).stdout
audio = np.frombuffer(raw, np.float32)

cuts = []  # (cut_start, cut_end) in original seconds
for s, e in zip(starts, ends):
    if e - s > max_pause and e < len(audio) / SR - 0.05:
        cuts.append((s + keep / 2, e - keep / 2))

fade = int(0.01 * SR)
out, pos = [], 0
for a, b in cuts:
    ia, ib = int(a * SR), int(b * SR)
    seg = audio[pos:ia].copy()
    if out:
        seg[:fade] *= np.linspace(0, 1, fade)
    seg[-fade:] *= np.linspace(1, 0, fade)
    out.append(seg)
    pos = ib
tail = audio[pos:].copy()
tail[:fade] *= np.linspace(0, 1, fade)
out.append(tail)
res = np.concatenate(out)

subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                "-c:a", "pcm_s16le", dst], input=res.tobytes(), check=True)
json.dump({"cuts": cuts}, open(map_p, "w"), indent=1)
print(f"{len(cuts)} pauses shortened: {len(audio)/SR:.2f}s -> {len(res)/SR:.2f}s")
