"""Sound-effect cue list for video 01 (times in seconds, matching Video01.tsx)."""
import json, random, sys

random.seed(3)
cues = []
add = lambda t, kind, gain: cues.append({"t": round(t, 3), "type": kind, "gain": gain})

# hook: coins landing, the jar cracking, "BROKE"
for _ in range(16):
    add(random.uniform(0.05, 1.45), "clink", -34)
for _ in range(7):
    add(random.uniform(1.5, 2.6), "clink", -36)
add(1.45, "crack", -22)
add(2.95, "pop", -27)

# scene changes
for t in [3.85, 8.25, 12.75, 15.55, 18.55, 23.35, 28.25, 31.5, 40.35, 45.75, 49.4, 52.8, 58.15, 63.05, 66.35, 70.65, 74.15]:
    add(t - 0.12, "whoosh", -29)

# pills / key words
for t in [4.0, 13.0, 15.95, 16.6, 17.65, 20.3, 27.45, 30.7, 33.6, 42.05, 50.6, 54.7, 66.7, 71.3, 71.6, 72.6, 76.1]:
    add(t, "pop", -28)
# icons and cards
for t in [9.45, 10.05, 11.15, 35.1, 36.4, 38.0, 25.3, 61.4] + [49.6 + i * 0.27 for i in range(6)]:
    add(t, "tick", -30)
# counters rolling
for i in range(6):
    add(26.85 + i * 0.09, "tick", -33)
    add(40.6 + i * 0.14, "tick", -33)
# checks
for i in range(6):
    add(51.2 + i * 0.07, "tick", -33)
add(63.95, "pop", -28)
# glows
for t in [14.5, 22.75, 43.6, 75.6]:
    add(t, "shimmer", -31)
# strike-through on DECISION
add(48.6, "swipe", -29)
# final: coins staying in the jar
for _ in range(20):
    add(random.uniform(74.4, 77.2), "clink", -34)

for c in cues:
    c["gain"] += 4  # overall SFX level, still well under the voice
json.dump(sorted(cues, key=lambda c: c["t"]), open(sys.argv[1], "w"), indent=1)
print(len(cues), "cues")
