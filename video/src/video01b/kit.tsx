import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { prog } from "../lib/anim";
import { FONT, WHITE } from "../lib/ui";

export const GREY_LINE = "#8f8f8f";
export const T_TRANS = 0.34; // seconds of a camera transition between shots

export const whipEase = Easing.bezier(0.7, 0, 0.2, 1);
export const fastOut = Easing.bezier(0.16, 1, 0.3, 1);

export const glow = (k = 1) =>
  `drop-shadow(0 0 ${4 * k}px rgba(255,255,255,${0.7 * Math.min(1, k)})) drop-shadow(0 0 ${16 * k}px rgba(255,255,255,${0.28 * Math.min(1, k)}))`;

/** Piecewise camera: keyframes of focus point + zoom, eased between. */
export type CamKey = { t: number; x: number; y: number; z: number; ease?: (n: number) => number };
export const camPath = (keys: CamKey[]) => (t: number) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const e = (b.ease ?? whipEase)((t - a.t) / (b.t - a.t));
      return { t, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, z: a.z * Math.pow(b.z / a.z, e) };
    }
  }
  return keys[keys.length - 1];
};

type Dir = "L" | "R" | "U" | "D" | "zoom" | "none";

const transOffset = (dir: Dir, p: number, entering: boolean) => {
  // p: 0→1 progress of the transition. World moves in `dir`.
  const k = entering ? 1 - p : -p;
  switch (dir) {
    case "L":
      return { x: 1920 * k, y: 0, s: 1, o: 1 };
    case "R":
      return { x: -1920 * k, y: 0, s: 1, o: 1 };
    case "U":
      return { x: 0, y: 1080 * k, s: 1, o: 1 };
    case "D":
      return { x: 0, y: -1080 * k, s: 1, o: 1 };
    case "zoom":
      return entering
        ? { x: 0, y: 0, s: 0.3 + 0.7 * p, o: Math.min(1, p * 2.2) }
        : { x: 0, y: 0, s: 1 + 5 * p * p, o: 1 - Math.max(0, (p - 0.45) / 0.55) };
    default:
      return { x: 0, y: 0, s: 1, o: entering ? p : 1 - p };
  }
};

/**
 * One shot of the continuous camera. Visible from `from` to `to + T_TRANS`;
 * enters with `inDir` during [from, from+T] and leaves with `outDir` during
 * [to, to+T], so neighbouring shots move together like one camera move.
 * Fast moves get a directional motion blur.
 */
export const Shot: React.FC<{
  id: string;
  from: number;
  to: number;
  inDir?: Dir;
  outDir?: Dir;
  cam?: (t: number) => { x: number; y: number; z: number };
  light?: { x: number; y: number; r?: number; a?: number };
  grid?: boolean;
  last?: boolean;
  children: React.ReactNode;
}> = ({ id, from, to, inDir = "none", outDir = "none", cam, light, grid = true, last, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const end = last ? to : to + T_TRANS;
  if (t < from || t > end) return null;

  const state = (tt: number) => {
    const c = cam ? cam(tt) : { x: 960, y: 540, z: 1 };
    let ox = 0;
    let oy = 0;
    let s = 1;
    let o = 1;
    if (inDir !== "none" || from > 0) {
      const p = interpolate(tt, [from, from + T_TRANS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: whipEase });
      if (p < 1) {
        const r = transOffset(inDir, p, true);
        ox += r.x;
        oy += r.y;
        s *= r.s;
        o *= r.o;
      }
    }
    if (!last) {
      const p = interpolate(tt, [to, to + T_TRANS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: whipEase });
      if (p > 0) {
        const r = transOffset(outDir, p, false);
        ox += r.x;
        oy += r.y;
        s *= r.s;
        o *= r.o;
      }
    } else {
      o *= 1 - prog(tt, to - 0.45, 0.45);
    }
    const z = c.z * s;
    return { tx: -z * (c.x - 960) + ox, ty: -z * (c.y - 540) + oy, z, o };
  };

  const now = state(t);
  const prev = state(t - 1 / fps);
  const bx = Math.min(60, Math.abs(now.tx - prev.tx) * 0.45);
  const by = Math.min(60, Math.abs(now.ty - prev.ty) * 0.45);
  const bz = Math.min(18, Math.abs(Math.log(now.z / prev.z)) * 260);
  const blurX = bx + bz;
  const blurY = by + bz;
  const fid = `mb-${id}`;
  const lx = light?.x ?? 960;
  const ly = light?.y ?? 540;

  return (
    <AbsoluteFill style={{ opacity: now.o }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`} />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          transform: `translate(${now.tx}px, ${now.ty}px) scale(${now.z})`,
          transformOrigin: "960px 540px",
          filter: blurX + blurY > 0.6 ? `url(#${fid})` : undefined,
        }}
      >
        {grid ? (
          <div
            style={{
              position: "absolute",
              left: -1920,
              top: -1080,
              width: 1920 * 3,
              height: 1080 * 3,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.075) 1.3px, transparent 1.8px)",
              backgroundSize: "34px 34px",
            }}
          />
        ) : null}
        {light ? (
          <div
            style={{
              position: "absolute",
              left: lx - (light.r ?? 520),
              top: ly - (light.r ?? 520),
              width: (light.r ?? 520) * 2,
              height: (light.r ?? 520) * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,${light.a ?? 0.07}) 0%, rgba(255,255,255,0) 70%)`,
            }}
          />
        ) : null}
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Absolutely positioned (centre) box with the standard pop-in. */
export const At: React.FC<{
  t: number;
  at?: number;
  x: number;
  y: number;
  dur?: number;
  g?: number;
  rot?: number;
  scale?: number;
  opacity?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ t, at = -99, x, y, dur = 0.32, g = 0, rot = 0, scale = 1, opacity = 1, children, style }) => {
  const p = prog(t, at, dur, fastOut);
  if (p <= 0 || opacity <= 0) return null;
  const blur = (1 - p) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${(0.7 + 0.3 * p) * scale})`,
        opacity: p * opacity,
        filter: [blur > 0.1 ? `blur(${blur}px)` : "", g > 0 ? glow(g) : ""].join(" ").trim() || undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Caps: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; track?: number }> = ({
  children,
  size = 22,
  color = "#cfcfcf",
  weight = 500,
  track = 0.26,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: `${track}em`,
      paddingLeft: `${track}em`,
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Num: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  children,
  size = 64,
  color = WHITE,
  weight = 600,
}) => (
  <div style={{ fontFamily: FONT, fontSize: size, fontWeight: weight, color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
    {children}
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; size?: number; solid?: boolean }> = ({ children, size = 20, solid = true }) => (
  <div
    style={{
      background: solid ? WHITE : "transparent",
      border: solid ? undefined : `2px solid ${WHITE}`,
      color: solid ? "#000" : WHITE,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      padding: `${size * 0.4}px ${size * 0.95}px ${size * 0.4}px ${size * 1.13}px`,
      borderRadius: 999,
      whiteSpace: "nowrap",
      boxShadow: solid ? "0 0 22px rgba(255,255,255,0.45)" : undefined,
    }}
  >
    {children}
  </div>
);

/** Full-frame SVG layer in world coordinates. */
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

/** A stroke that draws itself. */
export const Stroke: React.FC<{
  d: string;
  t: number;
  at: number;
  dur?: number;
  w?: number;
  color?: string;
  dash?: string;
  opacity?: number;
  fill?: string;
}> = ({ d, t, at, dur = 0.5, w = 3, color = WHITE, dash, opacity = 1, fill = "none" }) => {
  const p = prog(t, at, dur, fastOut);
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity * (dash ? p : 1)}
      {...(dash ? { strokeDasharray: dash } : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p })}
    />
  );
};

export const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
