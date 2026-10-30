"""Word timings for voice-01b: chunks are pinned to speech segments found on
the raw ElevenLabs file, then moved onto the edited (pauses shortened) file."""
import json, re, sys

CHUNKS = [
    ("The more you earn,", 0.08, 1.07),
    ("the easier it becomes to stay broke.", 1.49, 3.41),
    ("Most people believe their money problems will disappear once they start making more.", 3.92, 7.80),
    ("So they chase a raise, a better job,", 8.19, 10.52),
    ("or a bigger income.", 10.63, 11.62),
    ("But here's what most people don't understand.", 12.17, 14.29),
    ("Your income was never what made you wealthy.", 14.74, 16.99),
    ("What makes you wealthy is the gap between what you earn and what you spend.", 17.44, 21.56),
    ("Imagine someone who goes from making $4,000 a month", 22.11, 24.97),
    ("to $8,000.", 25.11, 26.27),
    ("At first,", 26.70, 27.25),
    ("it feels like they're finally getting ahead.", 27.35, 29.21),
    ("But slowly,", 29.79, 30.51),
    ("their life starts to upgrade.", 30.62, 32.09),
    ("A nicer apartment.", 32.53, 33.65),
    ("A newer car.", 33.82, 34.63),
    ("More expensive habits", 35.04, 36.22),
    ("that quietly become normal.", 36.34, 37.58),
    ("Years later,", 38.13, 38.82),
    ("they're earning twice as much,", 38.96, 40.32),
    ("but still have nothing left at the end of the month.", 40.45, 42.79),
    ("And the interesting part", 43.31, 44.26),
    ("is that it rarely feels like a decision.", 44.37, 46.33),
    ("Every upgrade seems small and reasonable on its own.", 46.91, 49.54),
    ("But together,", 50.01, 50.64),
    ("they turn every raise into a bigger lifestyle", 50.95, 53.54),
    ("instead of more freedom.", 53.69, 54.84),
    ("This is why so many people with high salaries still live paycheck to paycheck.", 55.37, 59.52),
    ("Of course, there's nothing wrong with enjoying the money you make.", 60.03, 62.69),
    ("The problem starts when your expenses grow", 63.14, 65.27),
    ("every time your income does.", 65.40, 66.97),
    ("Because becoming wealthy isn't about", 67.38, 68.47),
    ("how much money comes in.", 68.60, 70.32),
    ("It's about how much of it stays with you.", 70.78, 72.65),
]
cuts = json.load(open("tools/voice-01b-cuts.json"))["cuts"]

def remap(t):
    return t - sum(b - a for a, b in cuts if b <= t)

def weight(w):
    w = re.sub(r"[^\w$]", "", w)
    return 14 if w.startswith("$") else max(len(w), 2) + 2

out = []
for text, s, e in CHUNKS:
    s, e = remap(s), remap(e)
    words = text.split()
    ws = [weight(w) for w in words]
    t = s
    for w, k in zip(words, ws):
        d = (e - s) * k / sum(ws)
        out.append({"w": w, "s": round(t, 2), "e": round(t + d, 2)})
        t += d
json.dump(out, open("src/video01b/words.json", "w"))
for o in out:
    print(f'{o["s"]:.2f} {o["w"]}', end=" | ")
