import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Current time in seconds. */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0→1 progress of an animation that starts at `start` and lasts `dur` seconds. */
export const prog = (t: number, start: number, dur = 0.45, easing = easeOut) =>
  interpolate(t, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Linear mapping with clamping. */
export const lerp = (t: number, range: [number, number], out: [number, number], easing = easeInOut) =>
  interpolate(t, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** The house entrance: fade + blur→sharp + scale 0.9→1. */
export const enterStyle = (t: number, at: number, dur = 0.45, fromScale = 0.9) => {
  const p = prog(t, at, dur);
  return {
    opacity: p,
    blur: (1 - p) * 12,
    scale: fromScale + (1 - fromScale) * p,
    p,
  };
};

export const fmtMoney = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
