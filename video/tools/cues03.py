"""Sound-effect cue list for video 03 (canyon hook, WWII planes, modern feed)."""
import json, random, sys

random.seed(13)
cues = []
add = lambda t, kind, gain: cues.append({"t": round(t, 3), "type": kind, "gain": gain})

# camera moves between shots
for t in [4.32, 9.16, 16.94, 21.3, 24.08, 27.38, 31.8, 50.34, 51.53, 56.19, 59.14, 62.9, 66.97]:
    add(t - 0.1, "whoosh", -27)
for t in [13.2, 18.2, 22.6, 30.9, 43.8]:
    add(t - 0.05, "whoosh", -29)

# 1 hook: the jump, the landing, the applause cut dead by the dive, then the canyon
add(0.0, "air", -24)
add(0.55, "thud", -19)
add(0.62, "applause", -25)  # 1.65 s long: stops abruptly at ~2.27
add(2.22, "whoosh", -21)
add(2.4, "wind", -29)
add(3.08, "boom", -21)
add(1.2, "pop", -26)

# 2 airfield
add(4.35, "engine", -29)
add(6.2, "engine", -31)
add(4.5, "pop", -27)

# 3-5 bullet holes (distant, muffled), the plan, armor
k = 9.4
while k < 12.6:
    add(k, "gunshot", -31 - random.random() * 3)
    k += random.uniform(0.16, 0.34)
add(13.3, "pop", -25)
for i in range(3):
    add(15.1 + i * 0.12, "clank", -25 - i)
add(15.2, "pop", -27)

# 6 Wald, 7 survived
add(17.9, "pop", -25)
add(23.4, "pop", -25)

# 8 missing: a stricken engine drifting away
add(25.3, "engine", -30)
add(26.1, "shimmer", -31)
add(25.5, "pop", -27)

# 9-10 armor moves to the engines
add(28.1, "swipe", -26)
add(30.25, "clank", -22)
add(30.4, "shimmer", -28)

# 11-15 phone feed
add(31.9, "shimmer", -30)
add(32.3, "pop", -28)
for t in [35.3, 37.9, 40.0, 41.95]:
    add(t, "tick", -27)
    add(t + 0.02, "swipe", -30)
for i in range(6):
    add(40.4 + i * 0.2, "clink", -31)
for i in range(6):
    add(42.2 + i * 0.2, "tick", -33)

# 16 thousands + interviewer footsteps
add(45.4, "pop", -26)
k = 48.6
while k < 50.0:
    add(k, "tick", -34)
    k += 0.26

# 17 spotlight
add(50.45, "thud", -24)
add(50.5, "pop", -25)

# 18 sign flip, 19 mentor, 20 flashlight + canyon
add(54.2, "swipe", -26)
add(54.3, "pop", -26)
add(57.6, "swipe", -28)
add(58.3, "pop", -27)
add(60.9, "click", -24)
add(61.2, "whoosh", -24)
add(61.4, "wind", -31)
add(61.7, "pop", -26)

# 21 the plane that came back, 22 the ghosts
add(62.95, "engine", -30)
add(65.6, "pop", -27)
add(67.6, "shimmer", -29)
add(68.2, "shimmer", -30)

json.dump(sorted(cues, key=lambda c: c["t"]), open(sys.argv[1], "w"), indent=1)
print(len(cues), "cues")
