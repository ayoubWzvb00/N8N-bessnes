import React from "react";
import { fmtMoney, lerp, prog, useTime } from "./anim";
import { FONT, GLOW, GREY, Label, WHITE } from "./ui";

/** Vertical bar growing from a baseline, with a label under and a value above. */
export const Bar: React.FC<{
  x: number;
  base: number;
  width?: number;
  height: number;
  label: string;
  value?: number;
  filled?: boolean;
  dim?: boolean;
}> = ({ x, base, width = 120, height, label, value, filled = true, dim }) => {
  const h = Math.max(0, height);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - width / 2,
          top: base - h,
          width,
          height: h,
          borderRadius: 10,
          border: `3px solid ${WHITE}`,
          background: filled ? (dim ? "rgba(255,255,255,0.35)" : WHITE) : "transparent",
          boxShadow: filled && !dim ? "0 0 26px rgba(255,255,255,0.35)" : "0 0 10px rgba(255,255,255,0.2)",
          opacity: h > 2 ? 1 : 0,
        }}
      />
      {value !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: base - h - 52,
            transform: "translateX(-50%)",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 34,
            color: WHITE,
            fontVariantNumeric: "tabular-nums",
            filter: GLOW,
            opacity: h > 2 ? 1 : 0,
          }}
        >
          {fmtMoney(value)}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: x, top: base + 22, transform: "translateX(-50%)" }}>
        <Label size={20}>{label}</Label>
      </div>
    </>
  );
};

/** A path that draws itself between `at` and `at + dur`. */
export const DrawPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}> = ({ d, at, dur = 0.8, width = 3, dashed, opacity = 1 }) => {
  const t = useTime();
  const p = prog(t, at, dur);
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={WHITE}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={dashed ? undefined : 1}
      strokeDashoffset={dashed ? undefined : 1 - p}
      opacity={opacity * (dashed ? p : 1)}
      style={dashed ? { strokeDasharray: "0.012 0.012" } : undefined}
    />
  );
};

/** Animated money counter. */
export const MoneyCounter: React.FC<{
  from: number;
  to: number;
  start: number;
  end: number;
  size?: number;
}> = ({ from, to, start, end, size = 96 }) => {
  const t = useTime();
  const v = lerp(t, [start, end], [from, to]);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: WHITE,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {fmtMoney(v)}
    </div>
  );
};

/** Card with a caps title and boxed digits (flip-counter look). */
export const DigitCard: React.FC<{ title: string; value: number; size?: number }> = ({ title, value, size = 84 }) => {
  const s = fmtMoney(value);
  return (
    <div
      style={{
        border: `3px solid ${WHITE}`,
        borderRadius: 18,
        padding: "22px 26px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 0 30px rgba(255,255,255,0.18)",
      }}
    >
      <Label size={18}>{title}</Label>
      <div style={{ display: "flex", gap: 10 }}>
        {s.split("").map((ch, i) =>
          ch === "," ? (
            <div key={i} style={{ fontFamily: FONT, fontSize: size, fontWeight: 600, color: WHITE, alignSelf: "flex-end" }}>
              ,
            </div>
          ) : (
            <div
              key={i}
              style={{
                width: size * 0.72,
                height: size * 1.12,
                border: `2.5px solid ${WHITE}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontSize: size,
                fontWeight: 600,
                color: WHITE,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {ch}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/** Balance scale. `tilt` in degrees (positive = left side down). */
export const Scale: React.FC<{
  x: number;
  y: number;
  tilt: number;
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel: string;
  rightLabel: string;
}> = ({ x, y, tilt, left, right, leftLabel, rightLabel }) => {
  const arm = 300;
  const rad = (tilt * Math.PI) / 180;
  const lx = x - arm * Math.cos(rad);
  const ly = y + arm * Math.sin(rad);
  const rx = x + arm * Math.cos(rad);
  const ry = y - arm * Math.sin(rad);
  const pan = (px: number, py: number, content: React.ReactNode, label: string) => (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
        <g stroke={WHITE} strokeWidth={3} fill="none" strokeLinecap="round" style={{ filter: GLOW }}>
          <path d={`M${px} ${py} L${px - 85} ${py + 150} M${px} ${py} L${px + 85} ${py + 150}`} />
          <path d={`M${px - 105} ${py + 150} Q${px} ${py + 215} ${px + 105} ${py + 150} Z`} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: px, top: py + 112, transform: "translate(-50%, -100%)" }}>{content}</div>
      <div style={{ position: "absolute", left: px, top: py + 222, transform: "translateX(-50%)" }}>
        <Label size={20}>{label}</Label>
      </div>
    </>
  );
  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
        <g stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" style={{ filter: GLOW }}>
          <path d={`M${x} ${y} V${y + 380} M${x - 90} ${y + 380} H${x + 90}`} />
          <path d={`M${lx} ${ly} L${rx} ${ry}`} />
          <circle cx={x} cy={y} r={8} fill={WHITE} />
        </g>
      </svg>
      {pan(lx, ly, left, leftLabel)}
      {pan(rx, ry, right, rightLabel)}
    </>
  );
};

/** Speech/thought bubble outline with content. */
export const Bubble: React.FC<{ size?: number; children?: React.ReactNode; dashed?: boolean }> = ({
  size = 56,
  children,
  dashed = true,
}) => (
  <div style={{ position: "relative", width: size, height: size * 0.8 }}>
    <svg width={size} height={size * 0.8} viewBox="0 0 70 56" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path
        d="M14 2 H56 a12 12 0 0 1 12 12 V30 a12 12 0 0 1 -12 12 H30 L18 54 L20 42 H14 a12 12 0 0 1 -12 -12 V14 a12 12 0 0 1 12 -12 Z"
        fill="none"
        stroke={GREY}
        strokeWidth={2.4}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size * 0.6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size * 0.34,
        color: WHITE,
      }}
    >
      {children}
    </div>
  </div>
);
