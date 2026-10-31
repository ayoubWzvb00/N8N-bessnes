import React from "react";
import { random } from "remotion";
import { lerp, prog, useTime } from "../lib/anim";
import { FONT, WHITE } from "../lib/ui";
import { At, camPath, Caps, fastOut, Layer, Num, Shot, Tag } from "../video01b/kit";
import { Human, poseAt, POSES } from "../video02/Human";
import { Floor } from "../video02/props";
import { INK, MID, PlaneSide, PlaneTop, Post, SpeechBubble, Trophy } from "./props";

const SOFT = { a: 0.05 };
export const VIDEO03_END = 70.0;

/* ── shared: the canyon from the hook (reused in scenes 18 and 20) ── */
const CLIFF_Y = 700;
const GAP = { l: 600, r: 1260 };
const BOTTOM = 1700;

const Canyon: React.FC<{ crowd?: number }> = ({ crowd = 1 }) => {
  const back = Array.from({ length: 40 }, (_, i) => ({
    x: GAP.l + 30 + random(`bx${i}`) * (GAP.r - GAP.l - 60),
    y: BOTTOM - 150 - random(`by${i}`) * 60,
  }));
  const front = Array.from({ length: 11 }, (_, i) => ({
    x: GAP.l + 60 + i * ((GAP.r - GAP.l - 120) / 10) + (random(`fx${i}`) - 0.5) * 20,
    y: BOTTOM - (i % 2) * 50,
    sit: i % 3 !== 1,
    hair: i % 4 === 2,
  }));
  return (
    <g>
      <path
        d={`M-600 ${CLIFF_Y} H${GAP.l} L${GAP.l - 30} ${BOTTOM} M${GAP.r} ${BOTTOM} L${GAP.r + 20} ${CLIFF_Y} H2600`}
        stroke={WHITE}
        strokeWidth={5}
        fill="none"
        strokeLinejoin="round"
      />
      <path d={`M${GAP.l - 30} ${BOTTOM} H${GAP.r}`} stroke={MID} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${GAP.l - 8 - k * 4} ${CLIFF_Y + 160 + k * 180} l-40 30 M${GAP.r + 10 + k * 3} ${CLIFF_Y + 220 + k * 170} l40 26`} stroke={MID} strokeWidth={3} />
      ))}
      <g opacity={crowd}>
        {back.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(0.6)`} opacity={0.3}>
            <circle cx={0} cy={-62} r={11} fill={WHITE} />
            <path d="M-17 0 V-30 a17 17 0 0 1 34 0 V0 Z" fill={WHITE} />
          </g>
        ))}
        {front.map((p, i) => (
          <Human key={i} x={p.x} y={p.y - (p.sit ? 0 : 0)} pose={p.sit ? POSES.sitSad : POSES.sad} face="strain" hair={p.hair} dir={i % 2 ? -1 : 1} scale={0.95} dim={0.55} glowK={0} />
        ))}
      </g>
    </g>
  );
};

/* 1 · HOOK — "The advice of successful people might be the worst advice you can follow." (0 – 4.32) */

export const Hook: React.FC = () => {
  const t = useTime();
  // the jump: already in the air on frame 0, lands at 0.55
  const jp = prog(t, -0.35, 0.9, (x) => x);
  const jx = lerp(jp, [0, 1], [GAP.l - 40, GAP.r + 140], (x) => x);
  const jy = CLIFF_Y - Math.sin(Math.PI * jp) * 230;
  const landed = t > 0.55;
  const cheer = landed && t < 2.3;
  const bubble = prog(t, 1.2, 0.25, fastOut);
  const crowdOut = prog(t, 2.25, 0.2);
  const count = prog(t, 3.1, 0.3, fastOut);
  const cam = camPath([
    { t: 0, x: 900, y: 440, z: 1.8 },
    { t: 0.55, x: 1380, y: 560, z: 1.6 },
    { t: 2.2, x: 1420, y: 550, z: 1.55, ease: (x) => x },
    { t: 2.75, x: 930, y: BOTTOM - 240, z: 1.05 },
    { t: 4.6, x: 930, y: BOTTOM - 230, z: 1.1, ease: (x) => x },
  ]);
  const fans = [1760, 1880, 2000];
  return (
    <Shot id="h3" from={0} to={4.32} outDir="U" cam={cam} light={{ x: t < 2.3 ? 1400 : 930, y: t < 2.3 ? 560 : BOTTOM - 200, r: 620, a: 0.06 }}>
      <Layer>
        <Canyon />
        <Trophy x={1600} y={CLIFF_Y} s={1.1} />
        {/* the crowd cheering on the far side */}
        {fans.map((x, i) => (
          <Human
            key={x}
            x={x}
            y={CLIFF_Y}
            pose={cheer && Math.sin(t * 9 + i) > 0 ? POSES.cheer : POSES.clap}
            face="happy"
            hair={i === 1}
            dir={-1}
            scale={1.05}
            dim={crowdOut * 0.6}
          />
        ))}
        {/* speed lines behind the jumper while in the air */}
        {!landed
          ? [0, 1, 2].map((k) => (
              <line key={k} x1={jx - 160} x2={jx - 70} y1={jy - 150 + k * 34} y2={jy - 150 + k * 34} stroke={WHITE} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
            ))
          : null}
        <Human
          x={landed ? GAP.r + 140 : jx}
          y={landed ? CLIFF_Y : jy}
          pose={landed ? poseAt(t, [[0.55, POSES.stand], [0.75, POSES.cheer]], 0.2) : { lean: 18, armF: [150, 10], armB: [-120, 20], legF: [70, -60], legB: [-40, -30] }}
          face={landed ? "happy" : "surprised"}
          scale={1.25}
        />
        {bubble > 0 ? <SpeechBubble x={GAP.r + 280} y={CLIFF_Y - 320} text="JUST JUMP!" size={40} o={bubble * (1 - crowdOut)} /> : null}
      </Layer>
      {count > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 930,
            top: BOTTOM - 600,
            transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * count})`,
            opacity: count,
            display: "flex",
            gap: 46,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 42,
            color: WHITE,
            letterSpacing: "0.08em",
          }}
        >
          <span>1 MADE IT</span>
          <span style={{ color: "#9a9a9a" }}>·</span>
          <span>999 DIDN'T</span>
        </div>
      ) : null}
    </Shot>
  );
};

/* 2 · "During World War Two, the US military studied the planes that came back from battle." (4.32 – 9.16) */

export const Airfield: React.FC = () => {
  const t = useTime();
  const floor = 860;
  const land = (start: number) => {
    const p = prog(t, start, 2.0, (x) => 1 - (1 - x) * (1 - x));
    return { x: lerp(p, [0, 1], [-300, 1100], (x) => x), y: lerp(p, [0, 1], [380, floor - 50], (x) => x) };
  };
  const p1 = land(4.4);
  const p2 = land(6.2);
  const cam = camPath([
    { t: 4.32, x: 900, y: 600, z: 1.1 },
    { t: 9.4, x: 1000, y: 620, z: 1.2, ease: (x) => x },
  ]);
  return (
    <Shot id="airfield" from={4.32} to={9.16} inDir="U" outDir="zoom" cam={cam} light={{ x: 1300, y: 500, r: 700, a: 0.06 }}>
      <Layer>
        {/* setting sun on the horizon */}
        <Floor y={floor} x1={-400} x2={2300} />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <line key={k} x1={-200 + k * 340 - ((t * 0) % 1)} x2={-80 + k * 340} y1={floor + 40} y2={floor + 40} stroke={MID} strokeWidth={6} strokeLinecap="round" />
        ))}
        <PlaneSide x={p2.x - 380} y={p2.y} s={0.9} t={t} opacity={prog(t, 6.2, 0.3)} holes />
        <PlaneSide x={p1.x} y={p1.y} s={1.1} t={t} holes />
        {/* officers studying */}
        <Human x={1420} y={floor} pose={POSES.stand} face="neutral" cap tie dir={-1} scale={1.3} />
        <Human x={1640} y={floor} pose={{ ...POSES.workStand, armF: [60, 60] }} face="neutral" cap tie dir={-1} scale={1.3} />
        <rect x={1545} y={floor - 160} width={34} height={46} rx={4} fill={WHITE} transform={`rotate(-20, 1562, ${floor - 137})`} />
      </Layer>
      <At t={t} at={4.5} x={400} y={230}>
        <Tag size={26}>WWII · 1943</Tag>
      </At>
    </Shot>
  );
};

/* 3–5 · "They were covered in bullet holes… So the plan seemed simple. Add more armor where the planes were getting hit." (9.16 – 16.94) */

export const Diagram: React.FC = () => {
  const t = useTime();
  const holes = lerp(t, [9.4, 12.6], [0, 46], (x) => x);
  const armor = prog(t, 15.1, 0.6, fastOut);
  const point = poseAt(t, [[0, POSES.stand], [13.1, POSES.point]]);
  const slam = 1 + 0.03 * Math.sin(Math.PI * prog(t, 15.1, 0.25));
  const cam = camPath([
    { t: 9.16, x: 960, y: 520, z: 1.0 },
    { t: 12.8, x: 960, y: 520, z: 1.06, ease: (x) => x },
    { t: 13.2, x: 1160, y: 560, z: 0.95 },
    { t: 17.2, x: 1160, y: 560, z: 1.0, ease: (x) => x },
  ]);
  return (
    <Shot id="diagram" from={9.16} to={16.94} inDir="zoom" outDir="L" cam={(tt) => ({ ...cam(tt), z: cam(tt).z * slam })} light={{ x: 960, y: 520, r: 700, ...SOFT }}>
      <Layer>
        <PlaneTop x={960} y={540} s={1.0} holes={holes} armorWings={armor} />
        <Human x={1700} y={980} pose={point} face="smug" cap tie dir={-1} scale={1.5} />
      </Layer>
      <At t={t} at={13.3} x={1700} y={540}>
        <Tag size={24}>The plan</Tag>
      </At>
      <At t={t} at={15.2} x={960} y={130}>
        <Caps size={30} color={WHITE} weight={600}>
          + Armor here
        </Caps>
      </At>
    </Shot>
  );
};

/* 6 · "But a mathematician named Abraham Wald noticed something nobody else did." (16.94 – 21.3) */

export const Wald: React.FC = () => {
  const t = useTime();
  const floor = 880;
  const turn = t > 18.9;
  const cam = camPath([
    { t: 16.94, x: 960, y: 620, z: 1.25 },
    { t: 18.2, x: 760, y: 620, z: 1.4 },
    { t: 21.5, x: 780, y: 610, z: 1.48, ease: (x) => x },
  ]);
  return (
    <Shot id="wald" from={16.94} to={21.3} inDir="L" outDir="R" cam={cam} light={{ x: 760, y: 560, r: 560, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={300} x2={1700} />
        <Human x={720} y={floor} pose={poseAt(t, [[0, POSES.stand], [18.4, { ...POSES.point, armF: [150, -20] }]])} face="smug" glasses tie scale={1.6} />
        <rect x={640} y={floor - 175} width={36} height={48} rx={4} fill={WHITE} />
        <Human x={1080} y={floor} pose={POSES.armsCrossed} face={turn ? "surprised" : "neutral"} cap tie dir={turn ? -1 : 1} scale={1.45} />
        <Human x={1260} y={floor} pose={POSES.stand} face={turn ? "surprised" : "neutral"} cap tie dir={turn ? -1 : 1} scale={1.45} />
      </Layer>
      <At t={t} at={17.9} x={720} y={420}>
        <div style={{ textAlign: "center" }}>
          <Num size={40}>ABRAHAM WALD</Num>
          <Caps size={18}>Mathematician</Caps>
        </div>
      </At>
    </Shot>
  );
};

/* 7 · "They were only looking at the planes that survived." (21.3 – 24.08) */

export const Survived: React.FC = () => {
  const t = useTime();
  const cam = camPath([
    { t: 21.3, x: 960, y: 560, z: 1.45 },
    { t: 22.6, x: 960, y: 560, z: 0.95 },
    { t: 24.3, x: 960, y: 560, z: 0.92, ease: (x) => x },
  ]);
  const xs = [460, 960, 1460];
  return (
    <Shot id="survived" from={21.3} to={24.08} inDir="R" outDir="L" cam={cam} light={{ x: 960, y: 560, r: 800, ...SOFT }}>
      <Layer>
        {xs.map((x, i) => (
          <PlaneTop key={x} x={x} y={560} s={0.48} holes={46} />
        ))}
      </Layer>
      <At t={t} at={23.4} x={960} y={300}>
        <Tag size={30}>Survived</Tag>
      </At>
    </Shot>
  );
};

/* 8 · "The planes that got hit in the engines never came back at all." (24.08 – 27.38) */

export const Missing: React.FC = () => {
  const t = useTime();
  const fall = prog(t, 25.3, 1.4, (x) => x * x);
  const ghosts = prog(t, 26.1, 0.6);
  const cam = camPath([
    { t: 24.08, x: 960, y: 480, z: 1.05 },
    { t: 27.6, x: 960, y: 520, z: 1.0, ease: (x) => x },
  ]);
  return (
    <Shot id="missing" from={24.08} to={27.38} inDir="L" outDir="zoom" cam={cam} light={{ x: 960, y: 400, r: 700, a: 0.04 }}>
      <Layer>
        {/* the one hit in an engine: smoke, then it falls away */}
        <g transform={`translate(${960 + fall * 300}, ${330 + fall * 700}) rotate(${fall * 35})`} opacity={1 - fall * 0.8}>
          <PlaneSide x={0} y={0} s={1.2} t={t} smoke />
          <circle cx={50} cy={20} r={10} fill={WHITE} />
        </g>
        {/* runway with empty spots */}
        <Floor y={900} x1={100} x2={1820} />
        {[420, 960, 1500].map((x, i) => (
          <g key={x} opacity={ghosts}>
            <rect x={x - 170} y={760} width={340} height={120} rx={14} fill="none" stroke={MID} strokeWidth={4} strokeDasharray="16 12" />
            <text x={x} y={832} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={26} letterSpacing="0.2em" fill={MID}>
              MISSING
            </text>
          </g>
        ))}
      </Layer>
      <At t={t} at={25.5} x={1450} y={250}>
        <Caps size={26} color={WHITE} weight={600}>
          Hit in the engines
        </Caps>
      </At>
    </Shot>
  );
};

/* 9–10 · "So the armor didn't belong where the holes were. It belonged where they weren't." (27.38 – 31.8) */

export const ArmorMove: React.FC = () => {
  const t = useTime();
  const off = prog(t, 28.1, 0.6, fastOut);
  const on = prog(t, 30.25, 0.6, fastOut);
  const cam = camPath([
    { t: 27.38, x: 960, y: 520, z: 1.0 },
    { t: 30.0, x: 960, y: 520, z: 1.04, ease: (x) => x },
    { t: 31.0, x: 960, y: 470, z: 1.22 },
    { t: 31.9, x: 960, y: 470, z: 1.24, ease: (x) => x },
  ]);
  return (
    <Shot id="armor" from={27.38} to={31.8} inDir="zoom" outDir="zoom" cam={cam} light={{ x: 960, y: 460, r: 600, a: 0.05 + on * 0.04 }}>
      <Layer>
        <PlaneTop x={960} y={540} s={1.0} holes={46} armorWings={1 - off} armorEngines={on} />
        {off > 0 && off < 1 ? (
          <g opacity={1 - off} stroke={WHITE} strokeWidth={12} strokeLinecap="round">
            <path d="M260 420 l80 80 M340 420 l-80 80 M1580 420 l80 80 M1660 420 l-80 80" />
          </g>
        ) : null}
      </Layer>
      <At t={t} at={30.4} x={960} y={200}>
        <Tag size={28}>Armor the engines</Tag>
      </At>
    </Shot>
  );
};

/* 11–15 · "And this is exactly how most people learn about money. Every day, you hear from the people who made it.
           The founder… The investor… The creator…" (31.8 – 43.77) — a phone feed */

const FounderArt: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Human x={-60} y={120} pose={POSES.cheer} face="happy" scale={1.1} />
    <g transform={`translate(${60 - ((t * 30) % 10)}, ${-60 - Math.sin(t * 6) * 6})`} stroke={WHITE} strokeWidth={4} fill={INK}>
      <path d="M60 -90 Q90 -40 80 60 H40 Q30 -40 60 -90 Z" />
      <path d="M40 30 l-20 30 h20 M80 30 l20 30 h-20" />
    </g>
    <g transform={`translate(-150, ${-100 - ((t * 120) % 60)}) rotate(${t * 200})`}>
      <path d="M-20 -6 H20 L0 -16 Z M-6 -6 V6 H6 V-6" fill={WHITE} />
    </g>
  </g>
);

const InvestorArt: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Human x={-90} y={120} pose={POSES.give} face="smug" tie scale={1.1} />
    {Array.from({ length: Math.floor(lerp(t, [40.4, 41.6], [3, 11], (x) => x)) }, (_, i) => (
      <ellipse key={i} cx={90} cy={100 - i * 14} rx={50} ry={12} fill={i % 2 ? INK : WHITE} stroke={WHITE} strokeWidth={3} />
    ))}
  </g>
);

const CreatorArt: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Human x={-60} y={120} pose={POSES.thumbsUp} face="happy" hair scale={1.1} />
    <g stroke={WHITE} strokeWidth={4} fill={INK}>
      <rect x={60} y={-40} width={80} height={56} rx={8} />
      <circle cx={100} cy={-12} r={16} />
      <path d="M100 16 V120 M70 120 H130" fill="none" />
    </g>
    <text x={100} y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={WHITE}>
      {Math.round(lerp(t, [42.2, 43.4], [10, 999], (x) => x * x))}K
    </text>
  </g>
);

export const Feed: React.FC = () => {
  const t = useTime();
  const scroll = lerp(t, [35.3, 43.6], [0, 1], (x) => x);
  const morph = prog(t, 31.85, 0.7, fastOut);
  const cam = camPath([
    { t: 31.8, x: 960, y: 540, z: 1.0 },
    { t: 35.2, x: 960, y: 540, z: 1.06, ease: (x) => x },
    { t: 43.9, x: 960, y: 540, z: 1.12, ease: (x) => x },
  ]);
  // posts are stacked vertically and scroll up through the phone
  const posts: { at: number; caption: string; art: React.ReactNode }[] = [
    { at: 35.3, caption: "I made it 🏆", art: <Trophy x={0} y={110} s={1.2} /> },
    { at: 37.9, caption: "Dropped out. Built this.", art: <FounderArt t={t} /> },
    { at: 40.0, caption: "Went all in.", art: <InvestorArt t={t} /> },
    { at: 41.95, caption: "Quit my job.", art: <CreatorArt t={t} /> },
  ];
  const active = posts.reduce((a, p, i) => (t >= p.at ? i : a), 0);
  const offset = lerp(t, [posts[active].at, posts[active].at + 0.35], [Math.max(0, active - 1) * 640, active * 640], (x) => 1 - (1 - x) * (1 - x));
  return (
    <Shot id="feed" from={31.8} to={43.77} inDir="zoom" outDir="none" cam={cam} light={{ x: 960, y: 540, r: 560, ...SOFT }}>
      <Layer>
        {/* the phone */}
        <g opacity={morph}>
          <rect x={700} y={60} width={520} height={960} rx={60} fill={INK} stroke={WHITE} strokeWidth={6} />
          <rect x={900} y={84} width={120} height={26} rx={13} fill={WHITE} />
        </g>
        <defs>
          <clipPath id="screen">
            <rect x={720} y={130} width={480} height={870} rx={40} />
          </clipPath>
        </defs>
        <g clipPath="url(#screen)">
          {t < 35.3 ? (
            <g opacity={1 - prog(t, 34.6, 0.5)}>
              <text x={960} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={WHITE}>
                HOW TO GET RICH
              </text>
              <rect x={790} y={600} width={340} height={14} rx={7} fill={MID} />
              <rect x={830} y={630} width={260} height={14} rx={7} fill="#444" />
            </g>
          ) : (
            <g transform={`translate(0, ${-offset})`}>
              {posts.map((p, i) => (
                <Post key={i} x={960} y={560 + i * 640} caption={p.caption}>
                  {p.art}
                </Post>
              ))}
            </g>
          )}
        </g>
        {/* swipe finger hint */}
        <circle cx={1290} cy={720 - ((t * 1.5) % 1) * 200} r={22} fill="none" stroke={WHITE} strokeWidth={3} opacity={t > 35.3 ? 0.5 : 0} />
      </Layer>
      <At t={t} at={32.3} x={390} y={540}>
        <Caps size={22} color={WHITE} weight={600}>
          How we learn about money
        </Caps>
      </At>
    </Shot>
  );
};

/* 16 · "But you never hear from the thousands who did the exact same thing and failed, because nobody interviews them." (43.77 – 50.34) */

export const Thousands: React.FC = () => {
  const t = useTime();
  const grid = Array.from({ length: 13 * 7 }, (_, i) => ({ c: i % 13, r: Math.floor(i / 13) }));
  const appear = prog(t, 44.6, 1.6, (x) => x);
  const mic = prog(t, 48.6, 1.4, (x) => x * (2 - x));
  const cam = camPath([
    { t: 43.77, x: 960, y: 540, z: 2.4 },
    { t: 45.3, x: 960, y: 540, z: 0.82 },
    { t: 50.6, x: 960, y: 540, z: 0.86, ease: (x) => x },
  ]);
  return (
    <Shot id="thousands" from={43.77} to={50.34} outDir="L" cam={cam} light={{ x: 960, y: 540, r: 400, a: 0.06 }}>
      <Layer>
        {grid.map(({ c, r }) => {
          const center = c === 6 && r === 3;
          const x = 960 + (c - 6) * 150;
          const y = 540 + (r - 3) * 170;
          const k = random(`g${c}-${r}`);
          if (!center && k > appear) return null;
          return (
            <g key={`${c}-${r}`} transform={`translate(${x}, ${y})`} opacity={center ? 1 : 0.35}>
              <rect x={-62} y={-75} width={124} height={150} rx={14} fill={INK} stroke={center ? WHITE : MID} strokeWidth={3} />
              <circle cx={0} cy={-15} r={14} fill={center ? WHITE : MID} />
              <path d="M-22 40 V18 a22 22 0 0 1 44 0 V40 Z" fill={center ? WHITE : MID} />
              {!center ? <path d="M-30 -60 l60 0" stroke={MID} strokeWidth={3} /> : <Trophy x={40} y={60} s={0.3} />}
            </g>
          );
        })}
        {/* the interviewer walks past everyone to the one winner */}
        {mic > 0 ? (
          <g>
            <Human x={lerp(mic, [0, 1], [200, 860], (x) => x)} y={1100} pose={{ ...POSES.give, armF: [110, -10] }} face="happy" tie scale={1.6} />
            <g transform={`translate(${lerp(mic, [0, 1], [200, 860], (x) => x) + 140}, 900)`}>
              <rect x={-10} y={0} width={20} height={70} rx={6} fill={WHITE} />
              <circle cx={0} cy={-6} r={20} fill={WHITE} stroke={INK} strokeWidth={3} />
            </g>
          </g>
        ) : null}
      </Layer>
      <At t={t} at={45.4} x={960} y={-40}>
        <Num size={64}>Thousands failed</Num>
      </At>
    </Shot>
  );
};

/* 17 · "That's the trap." (50.34 – 51.53) — spotlight + the term */

export const Spotlight: React.FC = () => {
  const t = useTime();
  const on = prog(t, 50.45, 0.25, fastOut);
  const cam = camPath([
    { t: 50.34, x: 960, y: 560, z: 1.2 },
    { t: 51.8, x: 960, y: 560, z: 1.3, ease: (x) => x },
  ]);
  return (
    <Shot id="spot" from={50.34} to={51.53} inDir="L" outDir="U" cam={cam} grid={false}>
      <Layer>
        <path d={`M900 0 L1020 0 L${1160} 900 L${760} 900 Z`} fill={`rgba(255,255,255,${0.16 * on})`} />
        <ellipse cx={960} cy={900} rx={200} ry={30} fill={`rgba(255,255,255,${0.22 * on})`} />
        <Human x={960} y={900} pose={POSES.cheer} face="happy" scale={1.6} />
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i} transform={`translate(${200 + i * 110 + (i > 6 ? 360 : 0)}, 960) scale(0.9)`} opacity={0.18}>
            <circle cx={0} cy={-62} r={11} fill={WHITE} />
            <path d="M-17 0 V-30 a17 17 0 0 1 34 0 V0 Z" fill={WHITE} />
          </g>
        ))}
      </Layer>
      <At t={t} at={50.5} x={960} y={200}>
        <Tag size={30}>Survivorship bias</Tag>
      </At>
    </Shot>
  );
};

/* 18 · "When you only study the winners, risky decisions start to look like smart ones." (51.53 – 56.19) */

export const DangerSign: React.FC = () => {
  const t = useTime();
  const flip = prog(t, 54.2, 0.4, fastOut);
  const queue = [GAP.l - 160, GAP.l - 290, GAP.l - 420, GAP.l - 550];
  const cam = camPath([
    { t: 51.53, x: 640, y: 560, z: 1.3 },
    { t: 56.4, x: 660, y: 560, z: 1.38, ease: (x) => x },
  ]);
  return (
    <Shot id="danger" from={51.53} to={56.19} inDir="U" outDir="L" cam={cam} light={{ x: 640, y: 520, r: 560, ...SOFT }}>
      <Layer>
        <Canyon crowd={0.6} />
        {/* the sign */}
        <g transform={`translate(${GAP.l - 60}, ${CLIFF_Y})`}>
          <path d="M0 0 V-220" stroke={WHITE} strokeWidth={6} />
          <g transform={`translate(0, -260) scale(${Math.abs(Math.cos(Math.PI * flip))}, 1)`}>
            <rect x={-120} y={-44} width={240} height={88} rx={10} fill={flip > 0.5 ? WHITE : INK} stroke={WHITE} strokeWidth={5} />
            <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={flip > 0.5 ? 30 : 38} letterSpacing="0.1em" fill={flip > 0.5 ? INK : WHITE}>
              {flip > 0.5 ? "SMART MOVE" : "⚠ DANGER"}
            </text>
          </g>
        </g>
        {queue.map((x, i) => (
          <Human key={x} x={x - (t - 51.5) * 12} y={CLIFF_Y} pose={POSES.stand} face={flip > 0.5 ? "happy" : "neutral"} hair={i % 2 === 1} scale={1.1} />
        ))}
      </Layer>
    </Shot>
  );
};

/* 19 · "Of course, successful people can still teach you a lot." (56.19 – 59.14) */

export const Mentor: React.FC = () => {
  const t = useTime();
  const floor = 880;
  const map = prog(t, 57.6, 0.6, fastOut);
  const cam = camPath([
    { t: 56.19, x: 960, y: 640, z: 1.35 },
    { t: 59.4, x: 960, y: 630, z: 1.45, ease: (x) => x },
  ]);
  return (
    <Shot id="mentor" from={56.19} to={59.14} inDir="L" outDir="R" cam={cam} light={{ x: 960, y: 600, r: 520, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={500} x2={1420} />
        <Human x={1140} y={floor} pose={poseAt(t, [[0, POSES.stand], [57.5, POSES.give]])} face="happy" dir={-1} scale={1.5} />
        <Human x={780} y={floor} pose={poseAt(t, [[0, POSES.stand], [58.0, POSES.give]])} face="happy" hair scale={1.5} />
        <g transform={`translate(${lerp(map, [0, 1], [1010, 930], (x) => x)}, ${floor - 190})`} opacity={map}>
          <rect x={-46} y={-34} width={92} height={68} rx={4} fill={WHITE} />
          <path d="M-46 -34 L-16 -26 V40 L-46 34 M-16 -26 L16 -34 V34 L-16 40 M16 -34 L46 -26 V40 L16 34" stroke={INK} strokeWidth={3} fill="none" />
        </g>
      </Layer>
      <At t={t} at={58.3} x={960} y={420}>
        <Caps size={28} color={WHITE} weight={600}>
          Learn from them ✓
        </Caps>
      </At>
    </Shot>
  );
};

/* 20 · "Just don't copy what they did without asking who else tried it." (59.14 – 62.9) */

export const LookDown: React.FC = () => {
  const t = useTime();
  const crouch = prog(t, 60.3, 0.5, fastOut);
  const beam = prog(t, 60.9, 0.5);
  const cam = camPath([
    { t: 59.14, x: GAP.l - 60, y: CLIFF_Y - 120, z: 1.5 },
    { t: 61.2, x: GAP.l - 40, y: CLIFF_Y - 100, z: 1.5, ease: (x) => x },
    { t: 61.8, x: GAP.l + 120, y: BOTTOM - 520, z: 0.8 },
    { t: 63.1, x: GAP.l + 120, y: BOTTOM - 520, z: 0.8, ease: (x) => x },
  ]);
  return (
    <Shot id="look" from={59.14} to={62.9} inDir="R" outDir="U" cam={cam} light={{ x: GAP.l + 180, y: CLIFF_Y + 500 * beam, r: 600, ...SOFT }}>
      <Layer>
        <Canyon />
        {beam > 0 ? <path d={`M${GAP.l - 10} ${CLIFF_Y - 70} L${GAP.l + 360} ${BOTTOM - 40} L${GAP.l + 40} ${BOTTOM - 40} Z`} fill={`rgba(255,255,255,${0.14 * beam})`} /> : null}
        <Human x={GAP.l - 70} y={CLIFF_Y} pose={poseAt(t, [[0, POSES.stand], [60.3, POSES.crouchLook]], 0.4)} face={crouch > 0.5 ? "surprised" : "neutral"} scale={1.25} />
        {/* flashlight */}
        {crouch > 0.5 ? <rect x={GAP.l - 20} y={CLIFF_Y - 92} width={40} height={18} rx={5} fill={WHITE} transform={`rotate(55, ${GAP.l}, ${CLIFF_Y - 83})`} /> : null}
      </Layer>
      <At t={t} at={61.7} x={960} y={250}>
        <Tag size={30}>Who else tried?</Tag>
      </At>
    </Shot>
  );
};

/* 21 · "Because the most important lessons aren't always on the planes that came back." (62.9 – 66.97) */

export const LastPlane: React.FC = () => {
  const t = useTime();
  const cam = camPath([
    { t: 62.9, x: 960, y: 640, z: 1.1 },
    { t: 67.2, x: 960, y: 600, z: 1.25, ease: (x) => x },
  ]);
  return (
    <Shot id="last" from={62.9} to={66.97} inDir="U" outDir="D" cam={cam} light={{ x: 960, y: 620, r: 560, ...SOFT }}>
      <Layer>
        <Floor y={860} x1={200} x2={1720} />
        <PlaneSide x={960} y={800} s={2.0} t={t} holes />
      </Layer>
      <At t={t} at={65.6} x={960} y={400}>
        <Caps size={28} color={WHITE} weight={600}>
          Came back
        </Caps>
      </At>
    </Shot>
  );
};

/* 22 · "Sometimes, they're in the ones that didn't." (66.97 – end) */

export const Ghosts: React.FC = () => {
  const t = useTime();
  const show = (i: number) => prog(t, 67.6 + i * 0.25, 0.6);
  const cam = camPath([
    { t: 66.97, x: 960, y: 640, z: 1.0 },
    { t: VIDEO03_END, x: 960, y: 520, z: 1.06, ease: (x) => x },
  ]);
  const ghosts = [
    { x: 520, y: 360, s: 0.32 },
    { x: 1400, y: 300, s: 0.28 },
    { x: 960, y: 520, s: 0.4 },
    { x: 300, y: 620, s: 0.22 },
    { x: 1640, y: 640, s: 0.24 },
  ];
  return (
    <Shot id="ghosts" from={66.97} to={VIDEO03_END} inDir="D" last cam={cam} light={{ x: 960, y: 480, r: 700, a: 0.04 }}>
      <Layer>
        {ghosts.map((g, i) => (
          <g key={i} opacity={show(i) * (0.55 + 0.25 * Math.sin(t * 2 + i))}>
            <PlaneTop x={g.x} y={g.y + Math.sin(t + i) * 6} s={g.s} ghost={1} />
          </g>
        ))}
      </Layer>
      <At t={t} at={68.2} x={960} y={900}>
        <Caps size={30} color={WHITE} weight={600}>
          The ones that didn't
        </Caps>
      </At>
    </Shot>
  );
};
