import React from "react";
import { FONT, WHITE } from "../lib/ui";

/**
 * Pictogram person with moving limbs. (x, y) = point between the feet.
 * `phase` drives the stride (radians); `stride` 0 = standing.
 */
export const Walker: React.FC<{
  x: number;
  y: number;
  phase?: number;
  stride?: number;
  scale?: number;
  color?: string;
  lean?: number;
  flip?: boolean;
}> = ({ x, y, phase = 0, stride = 1, scale = 1, color = WHITE, lean = 0, flip }) => {
  const a = Math.sin(phase) * 32 * stride;
  const bob = Math.abs(Math.cos(phase)) * 4 * stride;
  const leg = (ang: number) => {
    const r = (ang * Math.PI) / 180;
    const kx = Math.sin(r) * 22;
    const ky = Math.cos(r) * 22;
    const knee = ang > 0 ? -ang * 0.5 : ang * 0.15;
    const r2 = ((ang + knee) * Math.PI) / 180;
    return `M0 -44 l${kx} ${ky} l${Math.sin(r2) * 22} ${Math.cos(r2) * 22}`;
  };
  const arm = (ang: number) => {
    const r = (ang * Math.PI) / 180;
    return `M0 -84 l${Math.sin(r) * 20} ${Math.cos(r) * 20} l${Math.sin(r + 0.5) * 18} ${Math.cos(r + 0.5) * 18}`;
  };
  return (
    <g transform={`translate(${x}, ${y - bob}) scale(${flip ? -scale : scale}, ${scale}) rotate(${lean})`}>
      <g stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={leg(-a)} opacity={0.75} />
        <path d={arm(a * 1.1)} opacity={0.75} />
        <path d="M0 -84 V-46" strokeWidth={22} />
        <path d={leg(a)} />
        <path d={arm(-a * 1.1)} />
      </g>
      <circle cx={0} cy={-108} r={13} fill={color} />
    </g>
  );
};

/** Simple standing pictogram (filled), (x, y) = feet. */
export const Pict: React.FC<{ x: number; y: number; s?: number; color?: string; opacity?: number }> = ({
  x,
  y,
  s = 1,
  color = WHITE,
  opacity = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${s})`} opacity={opacity}>
    <circle cx={0} cy={-62} r={11} fill={color} />
    <path d="M-17 0 V-30 a17 17 0 0 1 34 0 V0 Z" fill={color} />
  </g>
);

export const Coin: React.FC<{ x: number; y: number; r?: number; rot?: number; squash?: number }> = ({ x, y, r = 20, rot = 0, squash = 1 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${squash}, 1)`}>
    <circle r={r} fill={WHITE} />
    <circle r={r * 0.72} fill="none" stroke="#000" strokeWidth={r * 0.07} opacity={0.5} />
    <text y={r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 0.95} fill="#000">
      $
    </text>
  </g>
);

export const CloudPath = "M-60 20 a30 30 0 0 1 8 -58 a40 40 0 0 1 72 -10 a32 32 0 0 1 44 34 a26 26 0 0 1 -6 34 Z";

export const Snowflake: React.FC<{ x: number; y: number; r?: number; rot?: number; opacity?: number }> = ({ x, y, r = 22, rot = 0, opacity = 1 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`} stroke={WHITE} strokeWidth={2.6} strokeLinecap="round" opacity={opacity}>
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d={`M0 ${-r} V${r}`} />
        <path d={`M0 ${-r * 0.6} l${r * 0.25} ${-r * 0.25} M0 ${-r * 0.6} l${-r * 0.25} ${-r * 0.25}`} />
        <path d={`M0 ${r * 0.6} l${r * 0.25} ${r * 0.25} M0 ${r * 0.6} l${-r * 0.25} ${r * 0.25}`} />
      </g>
    ))}
  </g>
);

export const Moth: React.FC<{ x: number; y: number; flap: number; s?: number }> = ({ x, y, flap, s = 1 }) => {
  const w = 0.35 + 0.65 * Math.abs(Math.sin(flap));
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`} stroke={WHITE} strokeWidth={2.4} fill="none" strokeLinejoin="round">
      <g transform={`scale(${w}, 1)`}>
        <path d="M0 -4 C-18 -30 -46 -26 -40 -6 C-36 6 -16 6 0 0 Z" />
        <path d="M0 2 C-14 14 -30 22 -26 8" />
        <path d="M0 -4 C18 -30 46 -26 40 -6 C36 6 16 6 0 0 Z" />
        <path d="M0 2 C14 14 30 22 26 8" />
      </g>
      <path d="M0 -12 V12" strokeWidth={4} />
      <path d="M0 -12 l-6 -10 M0 -12 l6 -10" />
    </g>
  );
};

/** Check badge (circle + tick). */
export const CheckBadge: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => (
  <g transform={`translate(${x}, ${y})`} stroke={WHITE} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle r={r} />
    <path d={`M${-r * 0.42} 0 L${-r * 0.1} ${r * 0.32} L${r * 0.45} ${-r * 0.32}`} />
  </g>
);
