"""Sound-effect cue list for video 02 (story vibe: locks, keys, doors, coins, register)."""
import json, random, sys

random.seed(9)
cues = []
add = lambda t, kind, gain: cues.append({"t": round(t, 3), "type": kind, "gain": gain})

# camera moves between shots + bigger in-shot moves
for t in [2.95, 6.0, 10.05, 14.35, 18.05, 22.05, 24.05, 27.32, 29.12, 31.32, 36.28, 38.95, 41.28, 46.05, 50.95, 53.38, 57.1, 62.27]:
    add(t - 0.1, "whoosh", -26)
for t in [0.45, 7.5, 11.0, 12.2, 19.15, 43.1, 55.6, 60.3, 30.9]:
    add(t, "whoosh", -29)

# 1 hook
add(0.04, "click", -20)
add(0.08, "creak", -26)
add(0.62, "pop", -24)
add(1.12, "swipe", -24)
add(1.15, "beep", -32)
add(1.92, "pop", -24)
# 2 economist
for t in [3.95, 4.3, 4.65]:
    add(t, "tick", -27)
# 3 year one: the clock racing
k = 7.6
while k < 9.7:
    add(k, "tick", -32)
    k += 0.14
add(9.6, "pop", -25)
# 4 struggle
for i in range(5):
    add(10.4 + i * 0.11, "click", -29)
add(13.35, "crack", -20)
add(13.42, "pop", -26)
# 5 happy + tip
add(15.5, "pop", -25)
add(16.05, "swipe", -28)
add(17.88, "clink", -24)
add(17.75, "pop", -26)
# 6 years later: keys piling up, door in two seconds
for i in range(9):
    add(18.4 + i * 0.1, "clink", -31)
add(18.7, "pop", -26)
add(21.2, "click", -21)
add(21.24, "creak", -27)
add(21.35, "pop", -26)
# 7 same result
add(22.45, "pop", -25)
add(23.1, "shimmer", -29)
# 8 complaint
add(24.2, "printer", -27)
add(25.95, "pop", -24)
add(26.8, "swipe", -28)
# 9 no tip
add(28.1, "swipe", -27)
add(28.5, "pop", -26)
# 10 keyhole
add(29.6, "pop", -26)
add(30.2, "shimmer", -29)
# 11-12 register
add(32.6, "beep", -27)
add(33.2, "tick", -27)
add(34.8, "beep", -27)
add(35.6, "kaching", -23)
add(35.7, "pop", -27)
# 13 blur
add(36.8, "pop", -26)
add(37.75, "pop", -25)
# 14 trap
add(39.85, "snap", -19)
add(39.95, "pop", -25)
# 15 looks easy
add(41.6, "swipe", -26)
add(43.7, "tick", -27)
add(44.9, "pop", -24)
# 16 podium
add(48.05, "pop", -26)
add(48.55, "clink", -27)
add(49.8, "shimmer", -29)
# 17 fast is good
add(51.2, "click", -22)
add(51.24, "creak", -28)
add(51.75, "pop", -26)
add(52.35, "pop", -24)
# 18 tag swap
add(53.7, "pop", -26)
add(55.25, "swipe", -26)
add(55.75, "whoosh", -29)
add(56.4, "pop", -25)
# 19-20 home
add(57.6, "pop", -26)
add(58.25, "swipe", -27)
add(60.42, "click", -22)
add(60.46, "creak", -25)
add(60.6, "shimmer", -27)
# 21 the difference + tip
add(62.5, "pop", -27)
add(64.3, "swipe", -26)
add(65.8, "pop", -26)
add(66.95, "shimmer", -27)
add(67.38, "clink", -23)
add(67.35, "pop", -26)

json.dump(sorted(cues, key=lambda c: c["t"]), open(sys.argv[1], "w"), indent=1)
print(len(cues), "cues")
