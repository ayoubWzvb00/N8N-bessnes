import React from "react";
import { FONT, WHITE } from "../lib/ui";
import { GREY_LINE } from "./kit";

// Escalator geometry shared by the hook and the ending (world coordinates).
export const ESC = { bx: 470, by: 880, tx: 1450, ty: 260 };
const DX = ESC.tx - ESC.bx;
const DY = ESC.ty - ESC.by;
export const ESC_LEN = Math.hypot(DX, DY);
export const U = { x: DX / ESC_LEN, y: DY / ESC_LEN };
const NDOWN = { x: -U.y, y: U.x }; // perpendicular, pointing down-right
export const ESC_ANGLE = (Math.atan2(DY, DX) * 180) / Math.PI;
const STEP = 46;

export const onLine = (d: number, off = 0) => ({
  x: ESC.bx + U.x * d + NDOWN.x * off,
  y: ESC.by + U.y * d + NDOWN.y * off,
});

/** `travel` = how far the steps have moved down (px). */
export const Escalator: React.FC<{ travel: number }> = ({ travel }) => {
  const phase = ((travel % STEP) + STEP) % STEP;
  let steps = "";
  for (let d = STEP - phase - STEP; d < ESC_LEN; d += STEP) {
    const a = Math.max(0, d);
    const b = Math.min(ESC_LEN, d + STEP);
    if (b <= a) continue;
    const p = onLine(a);
    const tread = (b - a) * U.x;
    const riser = (b - a) * U.y;
    steps += `M${p.x} ${p.y} h${tread} v${riser} `;
  }
  const rail = (off: number) => {
    const a = onLine(0, off);
    const b = onLine(ESC_LEN, off);
    return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  };
  const b0 = onLine(0, 70);
  const b1 = onLine(ESC_LEN, 70);
  const h0 = onLine(-30, -120);
  const h1 = onLine(ESC_LEN + 30, -120);
  const g0 = onLine(0, -95);
  const g1 = onLine(ESC_LEN, -95);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* glass balustrade */}
      <path
        d={`M${g0.x} ${g0.y} L${g1.x} ${g1.y} L${ESC.tx} ${ESC.ty} L${ESC.bx} ${ESC.by} Z`}
        fill="rgba(255,255,255,0.035)"
        stroke="none"
      />
      {/* truss underneath */}
      <path d={`${rail(70)} M${ESC.bx} ${ESC.by} L${b0.x} ${b0.y} M${ESC.tx} ${ESC.ty} L${b1.x} ${b1.y}`} stroke={GREY_LINE} strokeWidth={2.5} />
      {/* handrail with rounded ends */}
      <path
        d={`M${ESC.bx - 40} ${ESC.by - 4} Q${h0.x - 10} ${h0.y + 60} ${h0.x} ${h0.y} L${h1.x} ${h1.y} Q${h1.x + 40} ${h1.y + 4} ${ESC.tx + 40} ${ESC.ty - 4}`}
        stroke={WHITE}
        strokeWidth={5}
      />
      {/* steps */}
      <path d={steps} stroke={WHITE} strokeWidth={3} />
      {/* landings */}
      <path d={`M${ESC.bx - 360} ${ESC.by} H${ESC.bx} M${ESC.tx} ${ESC.ty} H${ESC.tx + 360}`} stroke={WHITE} strokeWidth={3} />
    </g>
  );
};

export const Sign: React.FC<{ x: number; y: number; text: string; lit: number }> = ({ x, y, text, lit }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M0 0 V110" stroke={GREY_LINE} strokeWidth={3} />
    <rect
      x={-110}
      y={-60}
      width={220}
      height={76}
      rx={14}
      fill={`rgba(255,255,255,${0.04 + lit * 0.92})`}
      stroke={WHITE}
      strokeWidth={3}
      style={{ filter: lit > 0.05 ? `drop-shadow(0 0 ${lit * 26}px rgba(255,255,255,${lit * 0.8}))` : undefined }}
    />
    <text
      x={0}
      y={-10}
      textAnchor="middle"
      fontFamily={FONT}
      fontWeight={600}
      fontSize={34}
      letterSpacing="0.22em"
      fill={lit > 0.5 ? "#000" : WHITE}
    >
      {text}
    </text>
  </g>
);

/** Integrate f over [0, t] with 1/60 s steps. */
export const integrate = (t: number, f: (x: number) => number, from = 0) => {
  let s = 0;
  for (let x = from; x < t; x += 1 / 60) s += f(x) / 60;
  return s;
};
