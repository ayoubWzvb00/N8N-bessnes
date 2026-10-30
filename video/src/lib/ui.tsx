import React from "react";
import { AbsoluteFill } from "remotion";
import { enterStyle, prog, useTime } from "./anim";

export const WHITE = "#ffffff";
export const GREY = "#c4c4c4";
export const DIM = "#6e6e6e";
export const FONT = "Inter, sans-serif";
export const GLOW = "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 0 18px rgba(255,255,255,0.18))";
export const SOFT_GLOW = "drop-shadow(0 0 4px rgba(255,255,255,0.35))";

/** Element positioned by its centre in 1920×1080 space, with the house entrance. */
export const Appear: React.FC<{
  at: number;
  x: number;
  y: number;
  dur?: number;
  out?: number;
  glow?: boolean;
  fromScale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, x, y, dur = 0.45, out, glow = true, fromScale = 0.9, style, children }) => {
  const t = useTime();
  const e = enterStyle(t, at, dur, fromScale);
  const o = out === undefined ? 1 : 1 - prog(t, out, 0.35);
  if (e.opacity <= 0 || o <= 0) return null;
  const filters = [e.blur + (1 - o) * 10 > 0.05 ? `blur(${e.blur + (1 - o) * 10}px)` : "", glow ? GLOW : ""];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${e.scale})`,
        opacity: e.opacity * o,
        filter: filters.join(" ").trim() || undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small ALL CAPS label with wide tracking. */
export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({
  children,
  size = 24,
  color = GREY,
  weight = 500,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
      paddingLeft: "0.26em",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Hero word / number. */
export const Big: React.FC<{ children: React.ReactNode; size?: number; tracking?: string; style?: React.CSSProperties }> = ({
  children,
  size = 104,
  tracking = "0.02em",
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 600,
      color: WHITE,
      letterSpacing: tracking,
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

/** White pill tag with black caps text. */
export const Pill: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 20 }) => (
  <div
    style={{
      background: WHITE,
      color: "#000",
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      padding: `${size * 0.42}px ${size * 1.05}px ${size * 0.42}px ${size * 1.25}px`,
      borderRadius: 999,
      whiteSpace: "nowrap",
      boxShadow: "0 0 24px rgba(255,255,255,0.45)",
    }}
  >
    {children}
  </div>
);

/** Black background with a soft radial light spot. */
export const Backdrop: React.FC<{ x?: number; y?: number; r?: number; strength?: number }> = ({
  x = 960,
  y = 540,
  r = 620,
  strength = 0.09,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,255,255,${strength}) 0%, rgba(255,255,255,${strength * 0.35}) 45%, rgba(0,0,0,0) 100%), #000`,
    }}
  />
);

/**
 * A scene: visible between `from` and `to` (seconds), with a dip-to-black
 * entrance/exit and a slow virtual-camera push. `cam` can override pan/zoom.
 */
export const Scene: React.FC<{
  from: number;
  to: number;
  push?: number;
  cam?: (t: number) => { x?: number; y?: number; zoom?: number };
  light?: { x?: number; y?: number; r?: number; strength?: number };
  /** false = already on screen at `from` (used for the hook at frame 0) */
  enter?: boolean;
  children: React.ReactNode;
}> = ({ from, to, push = 0.04, cam, light, enter = true, children }) => {
  const t = useTime();
  if (t < from || t > to) return null;
  const pin = enter ? prog(t, from, 0.35) : 1;
  const pout = 1 - prog(t, to - 0.3, 0.3);
  const a = Math.min(pin, pout);
  const c = cam ? cam(t) : {};
  const zoom = (1 + push * ((t - from) / (to - from))) * (c.zoom ?? 1);
  const blur = (1 - a) * 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: a }}>
        <Backdrop {...light} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: a,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
          transform: `translate(${c.x ?? 0}px, ${c.y ?? 0}px) scale(${zoom})`,
          transformOrigin: "960px 540px",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Corner brackets frame (the "lens"). */
export const Brackets: React.FC<{ w: number; h: number; len?: number; label?: string }> = ({ w, h, len = 36, label }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {[
        `M0 ${len} V0 H${len}`,
        `M${w - len} 0 H${w} V${len}`,
        `M${w} ${h - len} V${h} H${w - len}`,
        `M${len} ${h} H0 V${h - len}`,
      ].map((d) => (
        <path key={d} d={d} stroke={WHITE} strokeWidth={3} fill="none" strokeLinecap="round" />
      ))}
    </svg>
    {label ? (
      <div style={{ position: "absolute", left: 18, top: 16 }}>
        <Label size={18}>{label}</Label>
      </div>
    ) : null}
  </div>
);
