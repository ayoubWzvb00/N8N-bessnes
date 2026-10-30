import React from "react";
import { random } from "remotion";
import { prog, useTime } from "../lib/anim";
import { FONT, GLOW, WHITE } from "../lib/ui";

// Jar geometry (1920×1080 space).
export const JAR = { cx: 960, left: 790, right: 1130, top: 300, bottom: 820 };
const COIN = 40;
const COLS = 7;
const SLOT_X0 = 838;
const SLOT_DX = 41;
const G = 2600;

const JAR_BODY =
  "M852 326 C852 362 790 362 790 412 L790 780 Q790 820 830 820 " +
  "M1090 820 Q1130 820 1130 780 L1130 412 C1130 362 1068 362 1068 326";
const BOTTOM_LEFT = "M830 820 L905 820";
const BOTTOM_MID = "M905 820 L1015 820";
const BOTTOM_RIGHT = "M1015 820 L1090 820";
const CRACKS = [
  "M905 820 L918 792 L906 770 L924 742 L914 718",
  "M1015 820 L1004 796 L1020 774 L1006 748",
  "M790 700 L808 712 L800 730",
];

/** Spawn times for a stream of coins whose rate grows over time. */
export const spawnTimes = (start: number, end: number, rate0: number, accel: number) => {
  const out: number[] = [];
  let s = start;
  while (s < end) {
    out.push(s);
    s += 1 / (rate0 + accel * Math.max(0, s - start));
  }
  return out;
};

type CoinState = { x: number; y: number; vy: number; rot: number; inJar: boolean; visible: boolean };

/**
 * Coins fall into the jar and stack. If `crackAt` is set, the bottom breaks at
 * that moment: the pile drains out and later coins fall straight through.
 */
export const simulate = (t: number, spawns: number[], crackAt: number | null, seed: string): CoinState[] => {
  const landed: { at: number; slot: number }[] = [];
  let slot = 0;
  return spawns.map((s, i) => {
    const x = JAR.cx + (random(`${seed}x${i}`) - 0.5) * 150;
    const v0 = 250 + random(`${seed}v${i}`) * 200;
    const y0 = -60;
    const spin = (random(`${seed}r${i}`) - 0.5) * 500;
    const fallY = (dt: number) => y0 + v0 * dt + 0.5 * G * dt * dt;
    const fallV = (dt: number) => v0 + G * dt;
    const timeTo = (y: number) => (-v0 + Math.sqrt(v0 * v0 + 2 * G * (y - y0))) / G;

    const k = slot;
    const col = k % COLS;
    const row = Math.floor(k / COLS);
    const sx = SLOT_X0 + col * SLOT_DX + (row % 2) * 12;
    const sy = JAR.bottom - COIN / 2 - 4 - row * 33;
    const landAt = s + timeTo(sy);
    const willLand = crackAt === null || landAt < crackAt;
    if (willLand) {
      slot++;
      landed.push({ at: landAt, slot: k });
    }
    if (t < s) return { x, y: y0, vy: 0, rot: 0, inJar: false, visible: false };

    if (!willLand) {
      const dt = t - s;
      const y = fallY(dt);
      return { x, y, vy: fallV(dt), rot: spin * dt, inJar: y > JAR.top && y < JAR.bottom, visible: y < 1200 };
    }
    // Falling from the top, sliding toward its slot as it drops.
    if (t < landAt) {
      const dt = t - s;
      const y = fallY(dt);
      const f = Math.min(1, Math.max(0, (y - JAR.top) / (sy - JAR.top)));
      return { x: x + (sx - x) * f, y, vy: fallV(dt), rot: spin * dt, inJar: y > JAR.top, visible: true };
    }
    const restRot = spin * (landAt - s);
    if (crackAt === null || t < crackAt) {
      return { x: sx, y: sy, vy: 0, rot: restRot, inJar: true, visible: true };
    }
    // Pile drains: coins nearest the hole go first.
    const release = crackAt + 0.05 + row * 0.07 + Math.abs(sx - JAR.cx) / 900 + random(`${seed}d${i}`) * 0.08;
    if (t < release) return { x: sx, y: sy, vy: 0, rot: restRot, inJar: true, visible: true };
    const dt = t - release;
    const nx = sx + (JAR.cx - sx) * Math.min(1, dt * 3.5);
    const y = sy + 0.5 * G * dt * dt;
    return { x: nx, y, vy: G * dt, rot: restRot + spin * dt, inJar: y < JAR.bottom, visible: y < 1200 };
  });
};

export const Jar: React.FC<{
  spawns: number[];
  crackAt?: number | null;
  seed: string;
  /** brightness of the jar outline glow pulse */
  glowAt?: number;
}> = ({ spawns, crackAt = null, seed, glowAt }) => {
  const t = useTime();
  const coins = simulate(t, spawns, crackAt, seed);
  const crackP = crackAt === null ? 0 : prog(t, crackAt, 0.25);
  const shardDt = crackAt === null ? 0 : Math.max(0, t - crackAt);
  const pulse = glowAt === undefined ? 0 : prog(t, glowAt, 0.5);

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={`jarlight-${seed}`} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.1 + 0.08 * pulse} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={960} cy={600} rx={260} ry={300} fill={`url(#jarlight-${seed})`} />
      {/* coins */}
      {coins.map((c, i) =>
        c.visible ? (
          <g key={i} transform={`translate(${c.x - COIN / 2}, ${c.y - COIN / 2})`}>
            {c.vy > 900 ? (
              <line
                x1={COIN / 2}
                y1={COIN / 2 - Math.min(110, c.vy / 22)}
                x2={COIN / 2}
                y2={COIN / 2 - 14}
                stroke={WHITE}
                strokeOpacity={0.35}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ) : null}
            <g transform={`rotate(${c.rot}, ${COIN / 2}, ${COIN / 2})`} style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.6))" }}>
              <circle cx={20} cy={20} r={19} fill={WHITE} />
              <circle cx={20} cy={20} r={13.5} fill="none" stroke="#000" strokeWidth={1.4} opacity={0.55} />
              <text x={20} y={27} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={18} fill="#000">
                $
              </text>
            </g>
          </g>
        ) : null,
      )}
      {/* jar */}
      <g
        fill="none"
        stroke={WHITE}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: GLOW }}
      >
        <rect x={842} y={292} width={236} height={34} rx={8} />
        <path d={JAR_BODY} />
        <path d={BOTTOM_LEFT} />
        <path d={BOTTOM_RIGHT} />
        {crackAt === null || crackP === 0 ? <path d={BOTTOM_MID} /> : null}
        {crackP > 0
          ? CRACKS.map((d) => <path key={d} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crackP} strokeWidth={3} />)
          : null}
        {/* falling shards of the broken bottom */}
        {crackP > 0 && shardDt < 1.2
          ? [
              { x: 905, w: 55, r: 40 },
              { x: 960, w: 55, r: -55 },
            ].map((s, i) => {
              const y = 820 + 0.5 * G * 0.5 * shardDt * shardDt;
              return (
                <line
                  key={i}
                  x1={s.x}
                  y1={y}
                  x2={s.x + s.w}
                  y2={y}
                  opacity={1 - shardDt / 1.2}
                  transform={`rotate(${s.r * shardDt * 2}, ${s.x + s.w / 2}, ${y})`}
                />
              );
            })
          : null}
      </g>
    </svg>
  );
};

/** Number of coins resting inside the jar at time t. */
export const coinsInJar = (t: number, spawns: number[], crackAt: number | null, seed: string) =>
  simulate(t, spawns, crackAt, seed).filter((c) => c.visible && c.inJar && c.vy === 0).length;
