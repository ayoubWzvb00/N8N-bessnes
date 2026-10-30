import React from "react";
import { FONT, WHITE } from "./ui";

type IconProps = { size?: number; stroke?: number; color?: string };

const Svg: React.FC<IconProps & { children: React.ReactNode; vb?: string }> = ({
  size = 96,
  stroke = 2.4,
  color = WHITE,
  vb = "0 0 64 64",
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={vb}
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ overflow: "visible", display: "block" }}
  >
    {children}
  </svg>
);

/** Filled pictogram person (head + rounded body). */
export const Person: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = WHITE }) => (
  <svg width={size * (40 / 56)} height={size} viewBox="0 0 40 56" style={{ display: "block" }}>
    <circle cx="20" cy="11" r="10" fill={color} />
    <path d="M3 56 V40 a17 17 0 0 1 34 0 V56 Z" fill={color} />
  </svg>
);

/** Front-facing coin with a $ sign. */
export const Coin: React.FC<{ size?: number; filled?: boolean }> = ({ size = 44, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{ display: "block", overflow: "visible" }}>
    <circle cx="22" cy="22" r="20" fill={filled ? WHITE : "none"} stroke={WHITE} strokeWidth="2.5" />
    <circle cx="22" cy="22" r="14.5" fill="none" stroke={filled ? "#000" : WHITE} strokeWidth="1.4" opacity={0.6} />
    <text
      x="22"
      y="29"
      textAnchor="middle"
      fontFamily={FONT}
      fontWeight={700}
      fontSize="19"
      fill={filled ? "#000" : WHITE}
    >
      $
    </text>
  </svg>
);

export const TrendUp: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M8 46 L24 30 L34 38 L54 18" />
    <path d="M42 18 H54 V30" />
  </Svg>
);

export const Briefcase: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="8" y="20" width="48" height="32" rx="5" />
    <path d="M24 20 V14 a3 3 0 0 1 3 -3 h10 a3 3 0 0 1 3 3 V20" />
    <path d="M8 33 H56" />
    <path d="M29 33 v4 h6 v-4" />
  </Svg>
);

export const Bills: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="6" y="22" width="44" height="26" rx="3" />
    <path d="M12 16 H54 a2 2 0 0 1 2 2 V40" />
    <circle cx="28" cy="35" r="6" />
    <path d="M12 28 v0 M44 42 v0" strokeWidth={4} />
  </Svg>
);

export const Apartment: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 58 V12 H50 V58" />
    <path d="M6 58 H58" />
    {[20, 30, 40].map((y) =>
      [22, 32, 42].map((x) => <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" />),
    )}
    <path d="M28 58 V50 H36 V58" />
  </Svg>
);

export const Car: React.FC<IconProps> = (p) => (
  <Svg {...p} vb="0 0 80 64">
    <path d="M6 42 V34 l8 -3 l10 -11 h26 l12 11 l10 3 v8 H6 Z" />
    <path d="M27 23 l-6 8 h20 V23 Z M45 23 v8 h14 l-8 -8 Z" />
    <circle cx="20" cy="43" r="6" fill="#000" />
    <circle cx="60" cy="43" r="6" fill="#000" />
  </Svg>
);

export const Bag: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 22 H52 L48 56 H16 Z" />
    <path d="M24 26 V18 a8 8 0 0 1 16 0 V26" />
  </Svg>
);

export const Cup: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 26 H46 V40 a12 12 0 0 1 -12 12 H24 a12 12 0 0 1 -12 -12 Z" />
    <path d="M46 30 h4 a6 6 0 0 1 0 12 h-5" />
    <path d="M22 18 c0 -4 4 -4 4 -8 M32 18 c0 -4 4 -4 4 -8" />
    <path d="M10 58 H48" />
  </Svg>
);

export const Phone: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="18" y="6" width="28" height="52" rx="5" />
    <path d="M28 50 H36" />
  </Svg>
);

export const Plane: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 36 L58 20 L50 28 L30 34 L22 50 L18 50 L22 35 L12 38 L8 44 L5 44 Z" />
  </Svg>
);

export const Calendar: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="8" y="12" width="48" height="44" rx="5" />
    <path d="M8 24 H56 M20 6 V16 M44 6 V16" />
  </Svg>
);

export const Check: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 34 L26 46 L50 20" />
  </Svg>
);

export const Lock: React.FC<IconProps & { open?: boolean }> = ({ open, ...p }) => (
  <Svg {...p}>
    <rect x="14" y="28" width="36" height="28" rx="4" />
    <path d={open ? "M22 28 V18 a10 10 0 0 1 19.5 -3" : "M22 28 V18 a10 10 0 0 1 20 0 V28"} />
    <path d="M32 38 V46" />
  </Svg>
);

export const Gift: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="10" y="26" width="44" height="30" rx="2" />
    <rect x="6" y="18" width="52" height="10" rx="2" />
    <path d="M32 18 V56" />
    <path d="M32 18 c-4 -10 -16 -10 -14 -2 c1 3 8 2 14 2 c6 0 13 1 14 -2 c2 -8 -10 -8 -14 2" />
  </Svg>
);
