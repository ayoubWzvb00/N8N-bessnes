import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime } from "../lib/anim";
import { FONT } from "../lib/ui";
import { Face, Human, Pose, POSES } from "./Human";

const CELLS: { label: string; pose: Pose; face: Face; who: "lock" | "cust"; sweat?: number; hold?: "coin" | "key" }[] = [
  { label: "Locksmith · ready", pose: POSES.carry, face: "neutral", who: "lock" },
  { label: "Apprentice · struggling", pose: POSES.workKneel, face: "strain", who: "lock", sweat: 1 },
  { label: "Apprentice · exhausted", pose: POSES.wipeBrow, face: "strain", who: "lock", sweat: 1 },
  { label: "Expert · done in seconds", pose: POSES.workStand, face: "smug", who: "lock", hold: "key" },
  { label: "Customer · happy, tipping", pose: POSES.give, face: "happy", who: "cust", hold: "coin" },
  { label: "Customer · annoyed", pose: POSES.armsCrossed, face: "angry", who: "cust" },
  { label: "Customer · complaining", pose: POSES.complain, face: "angry", who: "cust" },
  { label: "Customer · surprised", pose: POSES.shrug, face: "surprised", who: "cust" },
];

export const CharacterSheet: React.FC = () => {
  const t = useTime();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {CELLS.map((c, i) => {
          const x = 240 + (i % 4) * 480;
          const y = i < 4 ? 440 : 960;
          return (
            <g key={i}>
              <line x1={x - 170} x2={x + 170} y1={y} y2={y} stroke="#555" strokeWidth={2} />
              <Human
                x={x}
                y={y}
                pose={c.pose}
                face={c.face}
                scale={1.45}
                cap={c.who === "lock"}
                bag={c.who === "lock" && i === 0}
                hair={c.who === "cust"}
                sweat={c.sweat}
                hold={c.hold}
                t={t}
                dir={c.who === "cust" ? -1 : 1}
              />
              <text x={x} y={y + 44} textAnchor="middle" fontFamily={FONT} fontSize={20} letterSpacing="0.16em" fill="#bdbdbd">
                {c.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
