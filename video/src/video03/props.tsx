import React from "react";
import { random } from "remotion";
import { FONT, WHITE } from "../lib/ui";
import { INK, MID } from "../video02/props";

export { INK, MID };

/** Seeded scatter of bullet holes on the wings and body (never on the engines). */
export const HOLES = Array.from({ length: 46 }, (_, i) => {
  const r = random(`hole${i}`);
  if (i < 30) {
    // wings: between engines and tips, both sides
    const side = i % 2 === 0 ? -1 : 1;
    const xs = [70 + r * 50, 200 + r * 40, 330 + r * 90];
    const x = side * xs[i % 3];
    const y = -10 + random(`hy${i}`) * 50;
    return { x, y };
  }
  // fuselage + tail
  return { x: -18 + random(`hx${i}`) * 36, y: -160 + random(`hy${i}`) * 420 };
});

export const ENGINES = [-300, -150, 150, 300];

/** Top-down bomber (the famous survivorship diagram). (x, y) = centre, nose up. */
export const PlaneTop: React.FC<{
  x: number;
  y: number;
  s?: number;
  holes?: number; // how many holes are visible
  armorWings?: number; // 0..1 armor plates on wings/body
  armorEngines?: number; // 0..1 armor on engines
  ghost?: number; // 0..1 dashed outline only
  opacity?: number;
}> = ({ x, y, s = 1, holes = 0, armorWings = 0, armorEngines = 0, ghost = 0, opacity = 1 }) => {
  const stroke = WHITE;
  const fill = ghost > 0.5 ? "none" : INK;
  const dash = ghost > 0.5 ? "14 12" : undefined;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`} opacity={opacity}>
      <g stroke={stroke} strokeWidth={5} strokeLinejoin="round" fill={fill} strokeDasharray={dash}>
        {/* wings */}
        <path d="M-470 10 L-40 -40 L40 -40 L470 10 L470 40 L40 30 L-40 30 L-470 40 Z" />
        {/* tailplane */}
        <path d="M-150 270 L-20 245 L20 245 L150 270 L150 292 L20 285 L-20 285 L-150 292 Z" />
        {/* fuselage */}
        <path d="M0 -330 C34 -330 40 -280 40 -200 L32 300 C30 330 -30 330 -32 300 L-40 -200 C-40 -280 -34 -330 0 -330 Z" />
        {/* engines */}
        {ENGINES.map((ex) => (
          <path key={ex} d={`M${ex - 18} -84 Q${ex} -104 ${ex + 18} -84 L${ex + 18} 10 L${ex - 18} 10 Z`} />
        ))}
      </g>
      {ghost <= 0.5 ? (
        <g>
          {/* cockpit line */}
          <path d="M-22 -270 Q0 -290 22 -270" stroke={MID} strokeWidth={3} fill="none" />
          {/* armor plates */}
          {armorWings > 0 ? (
            <g opacity={armorWings} fill="rgba(255,255,255,0.22)" stroke={WHITE} strokeWidth={3}>
              <rect x={-440} y={-14} width={230} height={46} rx={6} />
              <rect x={210} y={-14} width={230} height={46} rx={6} />
              <rect x={-30} y={-180} width={60} height={380} rx={8} />
            </g>
          ) : null}
          {armorEngines > 0 ? (
            <g opacity={armorEngines} fill={WHITE} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))" }}>
              {ENGINES.map((ex) => (
                <path key={ex} d={`M${ex - 22} -88 Q${ex} -110 ${ex + 22} -88 L${ex + 22} 14 L${ex - 22} 14 Z`} />
              ))}
            </g>
          ) : null}
          {HOLES.slice(0, Math.floor(holes)).map((h, i) => (
            <g key={i}>
              <circle cx={h.x} cy={h.y} r={9} fill={WHITE} />
              <circle cx={h.x} cy={h.y} r={4} fill={INK} />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Side-view propeller bomber. (x, y) = centre. */
export const PlaneSide: React.FC<{ x: number; y: number; s?: number; t?: number; holes?: boolean; dir?: 1 | -1; opacity?: number; smoke?: boolean }> = ({
  x,
  y,
  s = 1,
  t = 0,
  holes,
  dir = 1,
  opacity = 1,
  smoke,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${dir * s}, ${s})`} opacity={opacity}>
    {smoke
      ? [0, 1, 2, 3].map((k) => {
          const ph = (t * 1.5 + k * 0.25) % 1;
          return <circle key={k} cx={-40 - ph * 160} cy={-10 - ph * 30} r={10 + ph * 22} fill="rgba(255,255,255,0.18)" opacity={1 - ph} />;
        })
      : null}
    <g stroke={WHITE} strokeWidth={4} strokeLinejoin="round" fill={INK}>
      <path d="M-170 -10 Q-170 -30 -140 -32 L130 -26 Q175 -22 180 0 Q175 18 130 20 L-140 20 Q-170 18 -170 -10 Z" />
      <path d="M-150 -30 L-178 -92 L-140 -92 L-110 -30 Z" />
      <path d="M-30 4 L60 4 L30 40 L-50 40 Z" />
      <path d="M100 -26 Q120 -46 150 -24" fill="none" />
    </g>
    {/* propeller blur */}
    <ellipse cx={186} cy={0} rx={6} ry={28 + Math.sin(t * 40) * 4} fill="rgba(255,255,255,0.5)" />
    {holes ? (
      <g fill={WHITE}>
        {[-120, -80, -30, 20, 70, 110, -60, 40].map((hx, i) => (
          <circle key={i} cx={hx} cy={i % 2 ? -12 : 6} r={5} />
        ))}
      </g>
    ) : null}
  </g>
);

export const Trophy: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${s})`} stroke={WHITE} strokeWidth={5} strokeLinejoin="round">
    <path d="M-40 -140 H40 V-100 Q40 -60 0 -55 Q-40 -60 -40 -100 Z" fill={WHITE} />
    <path d="M-40 -125 Q-70 -125 -62 -98 Q-56 -82 -36 -80 M40 -125 Q70 -125 62 -98 Q56 -82 36 -80" fill="none" />
    <path d="M0 -55 V-24 M-30 -24 H30 V0 H-30 Z" fill={INK} />
  </g>
);

export const SpeechBubble: React.FC<{ x: number; y: number; text: string; size?: number; o?: number }> = ({ x, y, text, size = 44, o = 1 }) => {
  const w = text.length * size * 0.62 + size * 1.4;
  const h = size * 2;
  return (
    <g opacity={o} transform={`translate(${x}, ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={WHITE} />
      <path d={`M${-w * 0.18} ${h / 2 - 4} L${-w * 0.3} ${h / 2 + 30} L${-w * 0.05} ${h / 2 - 4} Z`} fill={WHITE} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={INK}>
        {text}
      </text>
    </g>
  );
};

/** Social post card frame with a header and a caption. */
export const Post: React.FC<{ x: number; y: number; w?: number; h?: number; caption: string; grey?: boolean; children?: React.ReactNode }> = ({
  x,
  y,
  w = 420,
  h = 520,
  caption,
  grey,
  children,
}) => (
  <g transform={`translate(${x}, ${y})`} opacity={grey ? 0.4 : 1}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={INK} stroke={grey ? MID : WHITE} strokeWidth={4} />
    <circle cx={-w / 2 + 40} cy={-h / 2 + 40} r={18} fill={grey ? MID : WHITE} />
    <rect x={-w / 2 + 70} y={-h / 2 + 30} width={120} height={10} rx={5} fill={MID} />
    <rect x={-w / 2 + 70} y={-h / 2 + 46} width={70} height={8} rx={4} fill="#444" />
    <g transform={`translate(0, ${-20})`}>{children}</g>
    <text y={h / 2 - 36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={grey ? MID : WHITE}>
      {caption}
    </text>
  </g>
);
