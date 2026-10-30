"""Sound-effect cue list for video 01b (times in seconds, matching src/video01b)."""
import json, random, sys

random.seed(5)
cues = []
add = lambda t, kind, gain: cues.append({"t": round(t, 3), "type": kind, "gain": gain})

# camera moves between shots + big in-shot camera moves
for t in [3.52, 7.63, 11.27, 13.62, 16.08, 20.41, 24.78, 27.7, 35.66, 40.55, 43.8, 51.7, 56.07, 58.95, 62.98, 66.15]:
    add(t - 0.1, "whoosh", -25)
for t in [0.55, 2.72, 30.6, 37.95, 46.85, 67.75]:
    add(t - 0.05, "whoosh", -28)

# hook
add(2.8, "pop", -24)
add(2.85, "shimmer", -28)
# pops for tags, cards and reveals
for t in [7.05, 18.35, 21.9, 23.62, 23.95, 26.95, 30.95, 32.25, 33.7, 33.95, 35.15, 39.05, 53.5, 56.8, 57.6, 59.2, 60.85, 62.1, 63.55, 63.95, 65.0]:
    add(t, "pop", -25)
# small ticks
for t in [8.35, 9.3, 10.42, 29.8, 41.85, 42.1, 42.32, 67.4] + [35.8 + i * 0.14 for i in range(5)] + [45.3 + i * 0.06 for i in range(7)]:
    add(t, "tick", -27)
for k in range(4):
    add(52.0 + k * 1.15, "tick", -26)
# swipes and impacts
for t in [17.75, 38.2, 43.2, 65.45]:
    add(t, "swipe", -26)
add(14.6, "crack", -21)
add(51.0, "crack", -24)
# glows
for t in [12.6, 38.75, 67.9]:
    add(t, "shimmer", -28)
# coins
for i in range(3):
    add(48.45 + i * 0.12 + 0.45, "clink", -29)
for _ in range(14):
    add(random.uniform(63.1, 66.0), "clink", -31)
for _ in range(10):
    add(random.uniform(66.2, 67.4), "clink", -30)

json.dump(sorted(cues, key=lambda c: c["t"]), open(sys.argv[1], "w"), indent=1)
print(len(cues), "cues")
