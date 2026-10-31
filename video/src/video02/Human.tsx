import React from "react";
import { useTime } from "../lib/anim";
import { WHITE } from "../lib/ui";

/**
 * Clear, readable character: solid white silhouette with jointed limbs, a
 * simple face and optional props. (x, y) = point between the feet.
 * Limb angles are degrees from straight down; positive swings toward the
 * direction the character faces.
 */
export type Pose = {
  lean?: number; // torso tilt, + = forward
  head?: number; // head tilt
  armF?: [number, number]; // near arm: upper, lower (relative to upper)
  armB?: [number, number]; // far arm
  legF?: [number, number]; // near leg: thigh, shin (relative to thigh)
  legB?: [number, number];
  crouch?: number; // 0..1 lowers the hips (kneeling/squatting)
};

export type Face = "neutral" | "happy" | "angry" | "strain" | "surprised" | "smug";

export const POSES: Record<string, Pose> = {
  stand: { armF: [6, 6], armB: [-6, 6], legF: [3, 0], legB: [-3, 0] },
  armsCrossed: { lean: -4, head: -6, armF: [25, 115], armB: [20, 120], legF: [4, 0], legB: [-6, 0] },
  complain: { lean: 6, head: 4, armF: [125, -35], armB: [-25, 60], legF: [10, 0], legB: [-8, 0] },
  give: { lean: 4, armF: [70, 15], armB: [-8, 8], legF: [10, 0], legB: [-6, 0] },
  point: { armF: [95, 0], armB: [-6, 6], legF: [6, 0], legB: [-4, 0] },
  workKneel: { lean: 18, head: 6, armF: [70, 25], armB: [55, 40], legF: [80, -95], legB: [-10, -95], crouch: 1 },
  workStand: { lean: 10, head: 6, armF: [75, 10], armB: [60, 25], legF: [4, 0], legB: [-6, 0] },
  shrug: { armF: [-30, 120], armB: [30, -120], legF: [3, 0], legB: [-3, 0] },
  wipeBrow: { lean: -6, head: -8, armF: [120, 94], armB: [-10, 10], legF: [6, 0], legB: [-6, 0] },
  carry: { armF: [8, 4], armB: [-10, 20], legF: [3, 0], legB: [-3, 0] },
  sit: { lean: 2, armF: [55, 45], armB: [45, 50], legF: [90, -90], legB: [86, -88], crouch: 1 },
  sitWrite: { lean: 12, head: 10, armF: [70, 30], armB: [60, 45], legF: [90, -90], legB: [86, -88], crouch: 1 },
  proud: { lean: -5, head: -6, armF: [-34, 92], armB: [34, -92], legF: [10, 0], legB: [-10, 0] },
  sad: { lean: 10, head: 18, armF: [4, 4], armB: [-4, 6], legF: [2, 0], legB: [-2, 0] },
  reach: { lean: 14, armF: [105, -20], armB: [-10, 10], legF: [14, 0], legB: [-12, 0] },
  surprised: { lean: -8, head: -10, armF: [40, 112], armB: [-12, 14], legF: [6, 0], legB: [-6, 0] },
  thumbsUp: { lean: -2, armF: [55, 85], armB: [-6, 8], legF: [6, 0], legB: [-6, 0] },
};

const L = { torso: 66, neck: 30, upperArm: 44, foreArm: 40, thigh: 50, shin: 48 };

const rot = (a: number) => (a * Math.PI) / 180;
const step = (x: number, y: number, ang: number, len: number) => ({ x: x + Math.sin(rot(ang)) * len, y: y + Math.cos(rot(ang)) * len });

export const mixPose = (a: Pose, b: Pose, k: number): Pose => {
  const n = (u = 0, v = 0) => u + (v - u) * k;
  const pr = (u: [number, number] = [0, 0], v: [number, number] = [0, 0]): [number, number] => [n(u[0], v[0]), n(u[1], v[1])];
  return {
    lean: n(a.lean, b.lean),
    head: n(a.head, b.head),
    armF: pr(a.armF, b.armF),
    armB: pr(a.armB, b.armB),
    legF: pr(a.legF, b.legF),
    legB: pr(a.legB, b.legB),
    crouch: n(a.crouch, b.crouch),
  };
};

const FaceMarks: React.FC<{ face: Face; cx: number; cy: number; blink?: boolean }> = ({ face, cx, cy, blink }) => {
  const ink = "#0a0a0a";
  const eyeY = cy - 2;
  const ex1 = cx + 4;
  const ex2 = cx + 15;
  // brows as [eye1 outer y, eye1 inner y, eye2 inner y, eye2 outer y] offsets from eye level
  const b = {
    neutral: [-8, -8, -8, -8],
    happy: [-9, -10, -10, -9],
    smug: [-8, -8, -9, -12],
    angry: [-11, -5, -5, -11],
    strain: [-6, -10, -10, -6],
    surprised: [-12, -12, -12, -12],
  }[face];
  const mouth = {
    neutral: `M${cx + 4} ${cy + 11} h12`,
    happy: `M${cx + 2} ${cy + 9} q8 9 16 0`,
    smug: `M${cx + 3} ${cy + 11} q8 3 14 -4`,
    angry: `M${cx + 3} ${cy + 14} q8 -7 15 0`,
    strain: `M${cx + 3} ${cy + 12} l4 -2 l4 2 l4 -2 l4 2`,
    surprised: "",
  }[face];
  return (
    <g stroke={ink} strokeLinecap="round" fill="none">
      {blink ? (
        <path d={`M${ex1 - 3} ${eyeY} h6 M${ex2 - 3} ${eyeY} h6`} strokeWidth={2.4} />
      ) : (
        <>
          <circle cx={ex1} cy={eyeY} r={2.6} fill={ink} stroke="none" />
          <circle cx={ex2} cy={eyeY} r={2.6} fill={ink} stroke="none" />
        </>
      )}
      <path d={`M${ex1 - 4} ${eyeY + b[0]} L${ex1 + 3} ${eyeY + b[1]}`} strokeWidth={2.4} />
      <path d={`M${ex2 - 3} ${eyeY + b[2]} L${ex2 + 4} ${eyeY + b[3]}`} strokeWidth={2.4} />
      {face === "surprised" ? <circle cx={cx + 10} cy={cy + 12} r={4} strokeWidth={2.4} /> : <path d={mouth} strokeWidth={2.6} />}
    </g>
  );
};

export const Human: React.FC<{
  x: number;
  y: number;
  pose?: Pose;
  face?: Face;
  scale?: number;
  dir?: 1 | -1;
  cap?: boolean;
  tie?: boolean;
  hair?: boolean;
  bag?: boolean;
  sweat?: number; // 0..1 animates sweat drops
  t?: number;
  dim?: number; // 0 = white, 1 = grey
  glowK?: number;
  hold?: "coin" | "key";
  idle?: boolean;
}> = ({ x, y, pose: basePose = POSES.stand, face = "neutral", scale = 1, dir = 1, cap, tie, hair, bag, sweat = 0, t: tProp, dim = 0, glowK = 0.35, hold, idle = true }) => {
  const now = useTime();
  const t = tProp ?? now;
  // idle life: breathing, small head movement, blinking (desynced per character)
  const seed = (x * 0.013) % 6.28;
  const breath = idle ? Math.sin(t * 2.1 + seed) : 0;
  const pose: Pose = idle
    ? {
        ...basePose,
        lean: (basePose.lean ?? 0) + breath * 1.3,
        head: (basePose.head ?? 0) + Math.sin(t * 1.3 + seed * 2) * 2.5,
        armF: basePose.armF ? [basePose.armF[0] + breath * 2, basePose.armF[1]] : basePose.armF,
        armB: basePose.armB ? [basePose.armB[0] - breath * 2, basePose.armB[1]] : basePose.armB,
      }
    : basePose;
  const blink = idle && (t * 0.31 + seed * 0.17) % 1 < 0.04;
  const body = dim > 0 ? `rgb(${255 - dim * 120},${255 - dim * 120},${255 - dim * 120})` : WHITE;
  const far = `rgb(${190 - dim * 80},${190 - dim * 80},${190 - dim * 80})`;
  const crouch = pose.crouch ?? 0;
  const hip = { x: 0, y: -100 + crouch * 42 };
  const lean = pose.lean ?? 0;
  const sh = step(hip.x, hip.y, 180 - lean, L.torso); // shoulders (going up)
  const neckTop = step(sh.x, sh.y, 180 - lean - (pose.head ?? 0) * 0.5, 8);
  const head = step(neckTop.x, neckTop.y, 180 - lean - (pose.head ?? 0), 22);

  const limb = (o: { x: number; y: number }, a: [number, number] | undefined, l1: number, l2: number) => {
    const [u, v] = a ?? [0, 0];
    const k = step(o.x, o.y, u, l1);
    const e = step(k.x, k.y, u + v, l2);
    return { k, e, d: `M${o.x} ${o.y} L${k.x} ${k.y} L${e.x} ${e.y}` };
  };
  const armB = limb(sh, pose.armB, L.upperArm, L.foreArm);
  const armF = limb(sh, pose.armF, L.upperArm, L.foreArm);
  const legB = limb(hip, pose.legB, L.thigh, L.shin);
  const legF = limb(hip, pose.legF, L.thigh, L.shin);

  const torso = (() => {
    const a = rot(lean);
    const px = Math.cos(a);
    const py = Math.sin(a);
    const ux = Math.sin(a); // torso axis (towards the shoulders is -u)
    const uy = -Math.cos(a);
    const w1 = 24; // shoulder half-width
    const w2 = 18; // waist half-width
    const P = (o: { x: number; y: number }, w: number, along = 0) => `${o.x + px * w + ux * along} ${o.y + py * w + uy * along}`;
    return `M${P(sh, -w1, -4)} Q${P(sh, 0, 8)} ${P(sh, w1, -4)} L${P(hip, w2, 4)} Q${P(hip, 0, -6)} ${P(hip, -w2, 4)} Z`;
  })();

  const drops = sweat > 0
    ? [0, 1].map((i) => {
        const ph = (t * 1.6 + i * 0.5) % 1;
        return (
          <path
            key={i}
            d={`M0 -7 Q5 1 0 4 Q-5 1 0 -7 Z`}
            fill={WHITE}
            opacity={sweat * (1 - ph)}
            transform={`translate(${head.x - 26 - i * 8 - ph * 14}, ${head.y - 20 + ph * 30})`}
          />
        );
      })
    : null;

  return (
    <g transform={`translate(${x}, ${y}) scale(${dir * scale}, ${scale})`} style={{ filter: glowK > 0 ? `drop-shadow(0 0 ${3 * glowK}px rgba(255,255,255,${0.5 * glowK}))` : undefined }}>
      {/* far limbs */}
      <path d={legB.d} stroke={far} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${legB.e.x - 2} ${legB.e.y} h16`} stroke={far} strokeWidth={12} strokeLinecap="round" />
      <path d={armB.d} stroke={far} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* body */}
      <path d={torso} fill={body} stroke={body} strokeWidth={10} strokeLinejoin="round" />
      {tie ? <path d={`M${sh.x + 2} ${sh.y + 6} l-5 10 l5 30 l5 -30 Z`} fill="#0a0a0a" /> : null}
      <path d={legF.d} stroke="#0a0a0a" strokeWidth={23} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={legF.d} stroke={body} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${legF.e.x - 2} ${legF.e.y} h18`} stroke={body} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${sh.x} ${sh.y} L${neckTop.x} ${neckTop.y}`} stroke={body} strokeWidth={14} strokeLinecap="round" />
      {hair ? <path d={`M${head.x - 22} ${head.y + 4} q-6 -30 22 -30 q26 0 22 22 q-4 -10 -20 -12 q-14 0 -24 20 Z`} fill={body} /> : null}
      <circle cx={head.x} cy={head.y} r={22} fill={body} />
      {hair ? <path d={`M${head.x - 18} ${head.y - 14} q-30 6 -26 46 q8 -6 12 -2 q-4 -28 18 -34`} fill={body} stroke="#0a0a0a" strokeWidth={2} /> : null}
      {cap ? (
        <g>
          <path d={`M${head.x - 24} ${head.y - 13} a24 22 0 0 1 48 0 Z`} fill={body} />
          <path d={`M${head.x - 22} ${head.y - 13} h44`} stroke="#0a0a0a" strokeWidth={2.6} />
          <path d={`M${head.x + 10} ${head.y - 14} h30`} stroke={body} strokeWidth={7} strokeLinecap="round" />
        </g>
      ) : null}
      <FaceMarks face={face} cx={head.x} cy={head.y + 2} blink={blink} />
      <path d={armF.d} stroke="#0a0a0a" strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={armF.d} stroke={body} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={armF.e.x} cy={armF.e.y} r={8.5} fill={body} />
      {hold === "coin" ? (
        <g transform={`translate(${armF.e.x + 6}, ${armF.e.y - 14})`}>
          <circle r={14} fill={WHITE} stroke="#0a0a0a" strokeWidth={3} />
          <text y={6} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={16} fill="#0a0a0a">$</text>
        </g>
      ) : null}
      {hold === "key" ? (
        <g transform={`translate(${armF.e.x + 4}, ${armF.e.y})`} stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round">
          <circle cx={0} cy={0} r={7} />
          <path d="M7 0 H34 M26 0 v7 M32 0 v6" />
        </g>
      ) : null}
      {bag ? (
        <g transform={`translate(${armB.e.x}, ${armB.e.y})`}>
          <path d="M-12 0 a12 10 0 0 1 24 0" stroke={far} strokeWidth={3.5} fill="none" />
          <rect x={-30} y={0} width={60} height={40} rx={7} fill="#0a0a0a" stroke={far} strokeWidth={3.5} />
          <path d="M-30 14 H30" stroke={far} strokeWidth={2.5} />
        </g>
      ) : null}
      {drops}
    </g>
  );
};

/** Hand-held key at the near hand (helper to place props). */
export const handPos = (x: number, y: number, pose: Pose, scale = 1, dir: 1 | -1 = 1) => {
  const crouch = pose.crouch ?? 0;
  const hip = { x: 0, y: -100 + crouch * 42 };
  const sh = step(hip.x, hip.y, 180 - (pose.lean ?? 0), L.torso);
  const [u, v] = pose.armF ?? [0, 0];
  const k = step(sh.x, sh.y, u, L.upperArm);
  const e = step(k.x, k.y, u + v, L.foreArm);
  return { x: x + e.x * scale * dir, y: y + e.y * scale };
};

/** Pose from a timeline of keyframes, blending over `blend` seconds at each change. */
export const poseAt = (t: number, keys: [number, Pose][], blend = 0.3): Pose => {
  let cur = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [at, p] = keys[i];
    if (t < at) break;
    const k = Math.min(1, (t - at) / blend);
    const e = k * k * (3 - 2 * k);
    cur = mixPose(cur, p, e);
  }
  return cur;
};
