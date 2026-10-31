"""Word timings for voice-03 (edited file): chunks pinned to speech segments
between the pauses detected on public/voice-03.wav; words spread by length."""
import json, re

CHUNKS = [
    ("The advice of successful people", 0.12, 1.85),
    ("might be the worst advice you can follow.", 2.30, 4.21),
    ("During World War Two,", 4.43, 5.60),
    ("the US military studied the planes that came back from battle.", 5.88, 9.03),
    ("They were covered in bullet holes,", 9.29, 10.94),
    ("mostly on the wings and the body.", 11.20, 12.80),
    ("So the plan seemed simple.", 13.04, 14.51),
    ("Add more armor where the planes were getting hit.", 14.74, 16.81),
    ("But a mathematician named Abraham Wald", 17.07, 18.28),
    ("noticed something nobody else did.", 18.36, 21.17),
    ("They were only looking at the planes that survived.", 21.42, 23.95),
    ("The planes that got hit in the engines", 24.20, 25.86),
    ("never came back at all.", 26.04, 27.27),
    ("So the armor didn't belong where the holes were.", 27.49, 29.79),
    ("It belonged where they weren't.", 30.04, 31.69),
    ("And this is exactly how most people learn about money.", 31.92, 35.07),
    ("Every day, you hear from the people who made it.", 35.32, 37.68),
    ("The founder who dropped out of college.", 37.94, 39.77),
    ("The investor who went all in.", 40.02, 41.74),
    ("The creator who quit their job.", 41.98, 43.65),
    ("But you never hear from the thousands who did the exact same thing and failed,", 43.89, 47.54),
    ("because nobody interviews them.", 48.67, 50.22),
    ("That's the trap.", 50.46, 51.40),
    ("When you only study the winners,", 51.66, 53.20),
    ("risky decisions start to look like smart ones.", 53.49, 56.06),
    ("Of course,", 56.32, 56.84),
    ("successful people can still teach you a lot.", 56.96, 59.01),
    ("Just don't copy what they did without asking who else tried it.", 59.27, 62.77),
    ("Because the most important lessons aren't always on the planes that came back.", 63.03, 66.85),
    ("Sometimes,", 67.09, 67.72),
    ("they're in the ones that didn't.", 68.05, 69.29),
]

def weight(w):
    w = re.sub(r"[^\w$]", "", w)
    return max(len(w), 2) + 2

out = []
for text, s, e in CHUNKS:
    words = text.split()
    ws = [weight(w) for w in words]
    t = s
    for w, k in zip(words, ws):
        d = (e - s) * k / sum(ws)
        out.append({"w": w, "s": round(t, 2), "e": round(t + d, 2)})
        t += d
json.dump(out, open("src/video03/words.json", "w"))
print(" | ".join(f'{o["s"]:.2f} {o["w"]}' for o in out))
