"""Word timings for voice-02 (edited file): chunks pinned to speech segments
between the pauses detected on public/voice-02.wav; words spread by length."""
import json, re

CHUNKS = [
    ("People will pay you less for being good at your job.", 0.05, 2.85),
    ("A locksmith once explained this to a famous economist.", 3.08, 5.87),
    ("When he was just starting out,", 6.11, 7.34),
    ("opening a lock took him almost an hour.", 7.60, 9.93),
    ("He struggled,", 10.18, 11.00),
    ("he sweated,", 11.12, 11.85),
    ("and sometimes he even broke the lock.", 12.18, 14.22),
    ("And his customers were happy to pay,", 14.47, 16.26),
    ("and they often gave him a tip.", 16.54, 17.92),
    ("But years later,", 18.16, 19.10),
    ("he could open the same door in a few seconds.", 19.33, 21.93),
    ("Same result,", 22.18, 22.93),
    ("better service.", 23.17, 23.92),
    ("And suddenly,", 24.17, 24.86),
    ("people started complaining about the price.", 25.14, 27.18),
    ("Some refused to tip at all.", 27.44, 29.00),
    ("Here's what most people don't understand.", 29.25, 31.19),
    ("Customers rarely pay for the result itself.", 31.44, 33.98),
    ("They pay for the effort they can see.", 34.21, 36.16),
    ("And the better you get, the less effort they see.", 36.39, 38.83),
    ("That's the trap of being good at something.", 39.08, 41.16),
    ("Your skill starts to look easy,", 41.40, 43.08),
    ("and your speed starts to look like overcharging.", 43.39, 45.92),
    ("This is why so many experts feel underpaid,", 46.17, 48.64),
    ("even when they're the best at what they do.", 48.94, 50.85),
    ("Of course,", 51.06, 51.50),
    ("getting faster isn't the problem.", 51.69, 53.25),
    ("The problem is selling your time instead of what it gives people.", 53.50, 56.99),
    ("Because the door was never worth an hour of struggle.", 57.21, 59.93),
    ("It was worth getting back inside your home.", 60.16, 62.14),
    ("And once you understand that,", 62.39, 63.61),
    ("you stop charging for your effort,", 63.87, 65.51),
    ("and start charging for the difference you make.", 65.78, 67.95),
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
json.dump(out, open("src/video02/words.json", "w"))
print(len(out), "words")
