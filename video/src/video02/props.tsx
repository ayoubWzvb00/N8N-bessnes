import React from "react";
import { FONT, WHITE } from "../lib/ui";

export const INK = "#0a0a0a";
export const MID = "#8f8f8f";

/** Door seen from the front. (x, floor) = bottom centre. open: 0 closed → 1 swung open (hinge on the left). */
export const Door: React.FC<{ x: number; floor: number; open?: number; w?: number; h?: number; warm?: number; keyhole?: boolean }> = ({
  x,
  floor,
  open = 0,
  w = 150,
  h = 320,
  warm = 0,
  keyhole = true,
}) => {
  const left = x - w / 2;
  const top = floor - h;
  const pw = w * (1 - 0.82 * open);
  return (
    <g>
      {/* inside light */}
      <rect x={left} y={top} width={w} height={h} fill={`rgba(255,255,255,${0.04 + warm * 0.55})`} />
      {warm > 0 ? (
        <path d={`M${left} ${floor} L${left - 120 * warm} ${floor + 70 * warm} L${left + w + 120 * warm} ${floor + 70 * warm} L${left + w} ${floor} Z`} fill={`rgba(255,255,255,${0.12 * warm})`} />
      ) : null}
      {/* frame */}
      <path d={`M${left - 12} ${floor} V${top - 12} H${left + w + 12} V${floor}`} fill="none" stroke={WHITE} strokeWidth={5} strokeLinejoin="round" />
      {/* panel */}
      <g>
        <path
          d={`M${left} ${top} L${left + pw} ${top + 12 * open} L${left + pw} ${floor - 12 * open} L${left} ${floor} Z`}
          fill={INK}
          stroke={WHITE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect x={left + pw * 0.14} y={top + 26} width={pw * 0.72} height={h * 0.34} rx={6} fill="none" stroke={MID} strokeWidth={2.5} />
        <rect x={left + pw * 0.14} y={top + h * 0.5} width={pw * 0.72} height={h * 0.4} rx={6} fill="none" stroke={MID} strokeWidth={2.5} />
        {open < 0.6 ? (
          <g>
            <circle cx={left + pw - 22 * (1 - open)} cy={floor - h * 0.47} r={9} fill={WHITE} />
            {keyhole ? <path d={`M${left + pw - 22 * (1 - open)} ${floor - h * 0.47 + 18} v10`} stroke={WHITE} strokeWidth={4} strokeLinecap="round" /> : null}
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const Floor: React.FC<{ y: number; x1?: number; x2?: number }> = ({ y, x1 = 80, x2 = 1840 }) => (
  <line x1={x1} x2={x2} y1={y} y2={y} stroke={WHITE} strokeWidth={3} strokeLinecap="round" />
);

export const CoinG: React.FC<{ x: number; y: number; r?: number; squash?: number; rot?: number }> = ({ x, y, r = 16, squash = 1, rot = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${Math.max(0.08, squash)}, 1)`}>
    <circle r={r} fill={WHITE} stroke={INK} strokeWidth={2.5} />
    <text y={r * 0.38} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 1.05} fill={INK}>
      $
    </text>
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w?: number; h?: number; tail?: "left" | "right"; children?: React.ReactNode }> = ({
  x,
  y,
  w = 220,
  h = 120,
  tail = "left",
  children,
}) => {
  const tx = tail === "left" ? x - w * 0.25 : x + w * 0.25;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.32} fill={INK} stroke={WHITE} strokeWidth={3.5} />
      <path d={`M${tx - 14} ${y + h / 2 - 2} L${tx + (tail === "left" ? -26 : 26)} ${y + h / 2 + 34} L${tx + 14} ${y + h / 2 - 2}`} fill={INK} stroke={WHITE} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={tx - 16} y={y + h / 2 - 6} width={32} height={8} fill={INK} />
      {children}
    </g>
  );
};

export const PriceTag: React.FC<{ x: number; y: number; text: string; rot?: number; size?: number; strike?: number }> = ({ x, y, text, rot = 0, size = 40, strike = 0 }) => {
  const w = text.length * size * 0.62 + size * 1.6;
  const h = size * 1.7;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <path
        d={`M${-w / 2} ${-h / 2} H${w / 2 - h * 0.35} L${w / 2} 0 L${w / 2 - h * 0.35} ${h / 2} H${-w / 2} Z`}
        fill={WHITE}
        stroke={WHITE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <circle cx={w / 2 - h * 0.42} cy={0} r={size * 0.14} fill={INK} />
      <text x={-size * 0.3} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={INK}>
        {text}
      </text>
      {strike > 0 ? <line x1={-w / 2 - 6} x2={-w / 2 - 6 + (w + 12) * strike} y1={0} y2={0} stroke={INK} strokeWidth={size * 0.12} strokeLinecap="round" /> : null}
    </g>
  );
};

export const WallClock: React.FC<{ x: number; y: number; r?: number; minute: number; hour: number }> = ({ x, y, r = 80, minute, hour }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle r={r} fill={INK} stroke={WHITE} strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={0} y1={-r + 10} x2={0} y2={-r + (i % 3 === 0 ? 26 : 18)} stroke={WHITE} strokeWidth={i % 3 === 0 ? 5 : 3} transform={`rotate(${i * 30})`} strokeLinecap="round" />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={WHITE} strokeWidth={7} strokeLinecap="round" transform={`rotate(${hour})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={WHITE} strokeWidth={4} strokeLinecap="round" transform={`rotate(${minute})`} />
    <circle r={7} fill={WHITE} />
  </g>
);

/** Ring of keys; n keys hang around the lower half. */
export const KeyRing: React.FC<{ x: number; y: number; n: number; r?: number; swing?: number }> = ({ x, y, n, r = 80, swing = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${swing})`}>
    <circle r={r} fill="none" stroke={WHITE} strokeWidth={Math.max(3, r * 0.07)} />
    {Array.from({ length: n }, (_, i) => {
      const a = -75 + (150 * i) / 12; // fan across the bottom
      const k = r / 80;
      return (
        <g key={i} transform={`rotate(${a}) translate(0, ${r})`}>
          <g stroke={i % 2 === 0 ? WHITE : "#cfcfcf"} strokeWidth={4 * k} fill={INK} strokeLinecap="round">
            <circle cx={0} cy={16 * k} r={12 * k} />
            <path d={`M0 ${28 * k} V${92 * k} M0 ${74 * k} h${12 * k} M0 ${86 * k} h${9 * k}`} fill="none" />
          </g>
        </g>
      );
    })}
  </g>
);

/** Lock cylinder plate (close-up). */
export const LockPlate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${s})`}>
    <rect x={-80} y={-170} width={160} height={340} rx={30} fill={INK} stroke={WHITE} strokeWidth={5} />
    <circle cx={0} cy={-60} r={52} fill={INK} stroke={WHITE} strokeWidth={5} />
    <circle cx={0} cy={-60} r={36} fill="none" stroke={MID} strokeWidth={3} />
    <path d="M0 -84 v34 M-6 -50 h12" stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={80} r={30} fill={INK} stroke={WHITE} strokeWidth={5} />
  </g>
);

export const Receipt: React.FC<{ x: number; y: number; len: number; total?: string; circle?: number }> = ({ x, y, len, total = "$100.00", circle = 0 }) => {
  const rows = Math.max(0, Math.floor((len - 120) / 34));
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={`M-160 0 H160 V${len} ${Array.from({ length: 16 }, (_, i) => `L${160 - (i + 0.5) * 20} ${len + (i % 2 ? 0 : 12)}`).join(" ")} L-160 ${len} Z`}
        fill={INK}
        stroke={WHITE}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={24} letterSpacing="0.3em" fill={WHITE}>
        INVOICE
      </text>
      {Array.from({ length: Math.min(rows, 4) }, (_, i) => (
        <g key={i}>
          <rect x={-100} y={78 + i * 34} width={110 - (i % 2) * 30} height={8} rx={4} fill={MID} />
          <rect x={60} y={78 + i * 34} width={40} height={8} rx={4} fill={MID} />
        </g>
      ))}
      {len > 300 ? (
        <g>
          <line x1={-100} x2={100} y1={len - 74} y2={len - 74} stroke={MID} strokeWidth={2} strokeDasharray="6 6" />
          <text x={-130} y={len - 34} fontFamily={FONT} fontWeight={600} fontSize={20} letterSpacing="0.2em" fill={WHITE}>
            TOTAL
          </text>
          <text x={130} y={len - 30} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill={WHITE}>
            {total}
          </text>
          {circle > 0 ? (
            <ellipse cx={68} cy={len - 42} rx={84} ry={34} fill="none" stroke={WHITE} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle} transform={`rotate(-6, 68, ${len - 42})`} />
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

export const Jar: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M-70 -200 h140 M-62 -200 v16 q-18 10 -18 40 V-14 q0 14 14 14 H66 q14 0 14 -14 V-144 q0 -30 -18 -40 v-16" fill="rgba(255,255,255,0.04)" stroke={WHITE} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={-56} y={-120} width={112} height={50} rx={8} fill={WHITE} />
    <text y={-85} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} letterSpacing="0.2em" fill={INK}>
      {label}
    </text>
  </g>
);

export const Hourglass: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const p = (t * 0.25) % 1;
  return (
    <g transform={`translate(${x}, ${y})`} stroke={WHITE} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-90 -150 H90 M-90 150 H90" strokeWidth={8} />
      <path d="M-70 -150 Q-70 -40 -10 0 Q-70 40 -70 150 M70 -150 Q70 -40 10 0 Q70 40 70 150" fill="none" />
      <path d={`M${-50 + 40 * p} ${-130 + 110 * p} H${50 - 40 * p} L8 -6 H-8 Z`} fill={WHITE} stroke="none" opacity={0.85} />
      <line x1={0} y1={0} x2={0} y2={130} strokeWidth={3} strokeDasharray="4 8" strokeDashoffset={-t * 60} />
      <path d={`M-60 140 Q0 ${140 - 70 * (0.3 + 0.7 * p)} 60 140 Z`} fill={WHITE} stroke="none" opacity={0.85} />
    </g>
  );
};
