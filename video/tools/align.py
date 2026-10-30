"""Estimate word timings for a voiceover: text chunks are pinned to the
speech segments found with ffmpeg silencedetect, and words inside a chunk
are spread proportionally to their length."""
import json, re, sys

# (chunk text, start, end) — speech segments between detected pauses
CHUNKS = [
    ("The more you earn,", 0.09, 1.02),
    ("the easier it becomes to stay broke.", 1.47, 3.29),
    ("Most people believe their money problems will disappear once they start making more.", 4.00, 7.86),
    ("So they chase a raise, a better job, or a bigger income.", 8.43, 12.11),
    ("But here's what most people don't understand.", 13.16, 15.16),
    ("Your income was never what made you wealthy.", 15.78, 18.16),
    ("What makes you wealthy", 18.81, 19.80),
    ("is the gap between what you earn", 19.99, 21.67),
    ("and what you spend.", 21.88, 22.81),
    ("Imagine someone who goes from making $4,000 a month", 23.57, 26.53),
    ("to $8,000.", 26.91, 27.87),
    ("At first, it feels like they're finally getting ahead.", 28.45, 31.06),
    ("But slowly,", 31.70, 32.45),
    ("their life starts to upgrade.", 32.69, 34.08),
    ("A nicer apartment.", 34.65, 35.84),
    ("A newer car.", 35.98, 36.78),
    ("More expensive habits", 37.27, 38.52),
    ("that quietly become normal.", 38.65, 39.89),
    ("Years later,", 40.64, 41.34),
    ("they're earning twice as much,", 41.48, 42.85),
    ("but still have nothing left at the end of the month.", 43.04, 45.30),
    ("And the interesting part", 46.00, 46.90),
    ("is that it rarely feels like a decision.", 47.08, 49.02),
    ("Every upgrade seems small and reasonable on its own.", 49.63, 52.46),
    ("But together,", 52.98, 53.64),
    ("they turn every raise into a bigger lifestyle", 53.88, 56.48),
    ("instead of more freedom.", 56.61, 57.74),
    ("This is why so many people with high salaries still live paycheck to paycheck.", 58.44, 62.66),
    ("Of course, there's nothing wrong with enjoying the money you make.", 63.31, 65.99),
    ("The problem starts when your expenses grow", 66.58, 68.73),
    ("every time your income does.", 68.87, 70.34),
    ("Because becoming wealthy isn't about", 70.88, 72.00),
    ("how much money comes in.", 72.14, 73.84),
    ("It's about how much of it stays with you.", 74.39, 76.40),
]

def weight(w):
    w = re.sub(r"[^\w$]", "", w)
    if w.startswith("$"):  # "$4,000" is spoken as "four thousand dollars"
        return 14
    return max(len(w), 2) + 2

out = []
for text, s, e in CHUNKS:
    words = text.split()
    ws = [weight(w) for w in words]
    total, t = sum(ws), s
    for w, k in zip(words, ws):
        d = (e - s) * k / total
        out.append({"w": w, "s": round(t, 2), "e": round(t + d, 2)})
        t += d
json.dump(out, open(sys.argv[1], "w"), indent=0)
for o in out:
    print(f'{o["s"]:6.2f} {o["w"]}')
