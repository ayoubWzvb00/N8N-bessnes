import React from "react";
import { interpolate, random } from "remotion";
import { prog, useTime } from "../lib/anim";
import { Apartment, Bag, Car, Cup } from "../lib/icons";
import { FONT, WHITE } from "../lib/ui";
import { CheckBadge, Coin, Moth, Snowflake, Walker } from "./figures";
import { At, camPath, Caps, fastOut, glow, GREY_LINE, Layer, Num, Shot, Stroke, Tag } from "./kit";

/* 8 · "At first, it feels like they're finally getting ahead." (24.78 – 27.7) */

export const Race: React.FC = () => {
  const t = useTime();
  const lanes = [520, 690, 860];
  const our = 560 + 640 * prog(t, 25.0, 2.2, (x) => x * x * (3 - 2 * x));
  const others = [880 + (t - 24.78) * 60, 1000 + (t - 24.78) * 45];
  const cam = camPath([
    { t: 24.78, x: 880, y: 640, z: 1.2 },
    { t: 27.3, x: 1080, y: 630, z: 1.3, ease: (x) => x },
  ]);
  return (
    <Shot id="race" from={24.78} to={27.7} inDir="L" outDir="D" cam={cam} light={{ x: our, y: 640, r: 420, a: 0.08 }}>
      <Layer>
        {lanes.map((y) => (
          <line key={y} x1={-200} x2={2200} y1={y + 70} y2={y + 70} stroke={GREY_LINE} strokeWidth={2.5} strokeDasharray="34 22" strokeDashoffset={t * 600} />
        ))}
        <Walker x={others[0]} y={lanes[0] + 70} phase={t * 13} scale={1.45} color="#6f6f6f" lean={6} />
        <Walker x={others[1]} y={lanes[2] + 70} phase={t * 13 + 1} scale={1.45} color="#6f6f6f" lean={6} />
        <g style={{ filter: glow(1) }}>
          <Walker x={our} y={lanes[1] + 70} phase={t * 16} scale={1.5} lean={10} />
        </g>
        {[0, 1, 2].map((k) => {
          const ph = (t * 2.8 + k * 0.33) % 1;
          const x2 = our - 50 - ph * 150;
          return <line key={k} x1={x2 - 90} x2={x2} y1={lanes[1] - k * 26} y2={lanes[1] - k * 26} stroke={WHITE} strokeWidth={3} strokeLinecap="round" opacity={(1 - ph) * 0.6} />;
        })}
      </Layer>
      <At t={t} at={26.95} x={our} y={lanes[1] - 200} g={1}>
        <Tag size={22}>Ahead ↑</Tag>
      </At>
    </Shot>
  );
};

/* 9 + 10 · "But slowly, their life starts to upgrade. A nicer apartment. A newer car. More expensive habits that quietly become normal." (27.7 – 35.66) */

const APPS: { at: number; icon: React.ReactNode; cost: string }[] = [
  { at: 30.95, icon: <Apartment size={70} />, cost: "-$1,900/mo" },
  { at: 32.25, icon: <Car size={78} />, cost: "-$650/mo" },
  { at: 33.7, icon: <Cup size={66} />, cost: "-$220/mo" },
  { at: 33.95, icon: <Bag size={66} />, cost: "-$380/mo" },
];

export const Upgrade: React.FC = () => {
  const t = useTime();
  const install = prog(t, 29.85, 5.1, (x) => x);
  const pct = Math.round(
    interpolate(t, [29.85, 30.95, 32.25, 33.7, 35.0], [0, 24, 51, 78, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const pressed = prog(t, 29.75, 0.12) * (1 - prog(t, 29.9, 0.15));
  const normal = prog(t, 35.1, 0.5);
  const dockIn = prog(t, 30.8, 0.4, fastOut);
  const cam = camPath([
    { t: 27.7, x: 960, y: 470, z: 1.4 },
    { t: 30.6, x: 960, y: 475, z: 1.48, ease: (x) => x },
    { t: 31.1, x: 960, y: 640, z: 1.05 },
    { t: 35.9, x: 960, y: 650, z: 1.1, ease: (x) => x },
  ]);
  const dockX = (i: number) => 960 + (i - 1.5) * 190;
  return (
    <Shot id="upgrade" from={27.7} to={35.66} inDir="D" outDir="L" cam={cam} light={{ x: 960, y: 520, r: 620, a: 0.06 }}>
      <Layer>
        <g opacity={prog(t, 27.75, 0.3)}>
          <rect x={580} y={290} width={760} height={360} rx={20} fill="rgba(255,255,255,0.035)" stroke={WHITE} strokeWidth={3} />
          <line x1={580} x2={1340} y1={348} y2={348} stroke={GREY_LINE} strokeWidth={2} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={616 + i * 26} cy={319} r={7} fill="none" stroke={GREY_LINE} strokeWidth={2} />
          ))}
          <text x={960} y={327} textAnchor="middle" fontFamily={FONT} fontSize={16} letterSpacing="0.3em" fill="#a8a8a8">
            SYSTEM UPDATE
          </text>
          <g transform="translate(690, 450)" style={{ filter: glow(0.8) }}>
            <circle r={52} fill="none" stroke={WHITE} strokeWidth={3} />
            <path d="M0 26 V-24 M-18 -6 L0 -24 L18 -6" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle r={68} fill="none" stroke={WHITE} strokeWidth={1.5} opacity={0.4 + 0.4 * Math.sin(t * 5)} strokeDasharray="4 6" transform={`rotate(${t * 40})`} />
          </g>
          <text x={780} y={445} fontFamily={FONT} fontWeight={600} fontSize={48} fill={WHITE}>
            Lifestyle 2.0
          </text>
          <text x={782} y={485} fontFamily={FONT} fontSize={20} letterSpacing="0.12em" fill="#a8a8a8">
            {install <= 0 ? "UPDATE AVAILABLE" : install < 1 ? `INSTALLING… ${pct}%` : "INSTALLED ✓"}
          </text>
          {/* progress */}
          <rect x={782} y={530} width={500} height={10} rx={5} fill="#2c2c2c" />
          <rect x={782} y={530} width={5 * pct} height={10} rx={5} fill={WHITE} style={{ filter: glow(0.8) }} />
        </g>
        {/* dock */}
        <g opacity={dockIn}>
          <rect x={560} y={840} width={800} height={170} rx={34} fill="rgba(255,255,255,0.04)" stroke={GREY_LINE} strokeWidth={2.5} />
        </g>
      </Layer>
      <At t={t} at={28.15} x={1200} y={600} scale={1 - pressed * 0.12}>
        <Tag size={20} solid={install <= 0}>
          Update
        </Tag>
      </At>
      {APPS.map((a, i) => {
        const p = prog(t, a.at, 0.55, fastOut);
        if (p <= 0) return null;
        const x = 1250 + (dockX(i) - 1250) * p;
        const y = 420 + (900 - 420) * p - Math.sin(Math.PI * p) * 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${0.5 + 0.5 * p})`,
              opacity: Math.min(1, p * 2) * (1 - normal * 0.55),
              filter: normal < 0.5 ? glow(0.9) : undefined,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 118, height: 118, borderRadius: 28, border: `3px solid ${WHITE}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
              {a.icon}
            </div>
          </div>
        );
      })}
      {APPS.map((a, i) => (
        <At key={i} t={t} at={a.at + 0.45} x={dockX(i)} y={1052} opacity={1 - normal * 0.4}>
          <Num size={24} color="#d0d0d0">
            {a.cost}
          </Num>
        </At>
      ))}
      <At t={t} at={35.15} x={960} y={790}>
        <Caps size={22} color={WHITE}>
          The new normal
        </Caps>
      </At>
    </Shot>
  );
};

/* 11 · "Years later, they're earning twice as much, but still have nothing left at the end of the month." (35.66 – 40.55) */

export const EmptyWallet: React.FC = () => {
  const t = useTime();
  const pages = [0, 1, 2, 3, 4];
  const yearNow = 2026 + pages.filter((i) => t > 35.8 + i * 0.14).length;
  const open = prog(t, 38.2, 0.3, fastOut);
  const shake = Math.sin(t * 40) * 10 * prog(t, 38.45, 0.1) * (1 - prog(t, 38.95, 0.2));
  const mothT = Math.max(0, t - 38.75);
  const cam = camPath([
    { t: 35.66, x: 640, y: 540, z: 1.05 },
    { t: 37.95, x: 680, y: 540, z: 1.1, ease: (x) => x },
    { t: 38.3, x: 1320, y: 560, z: 1.25 },
    { t: 40.8, x: 1330, y: 540, z: 1.32, ease: (x) => x },
  ]);
  return (
    <Shot id="wallet" from={35.66} to={40.55} inDir="L" outDir="R" cam={cam} light={{ x: t < 38 ? 640 : 1300, y: 520, r: 480, a: 0.07 }}>
      <Layer>
        {/* tear-off calendar */}
        <g opacity={prog(t, 35.7, 0.3)}>
          <rect x={480} y={330} width={320} height={380} rx={20} fill="rgba(255,255,255,0.04)" stroke={WHITE} strokeWidth={3} />
          <rect x={480} y={330} width={320} height={80} rx={20} fill="rgba(255,255,255,0.12)" stroke={WHITE} strokeWidth={3} />
          {[560, 720].map((x) => (
            <rect key={x} x={x - 8} y={300} width={16} height={56} rx={8} fill="#000" stroke={WHITE} strokeWidth={3} />
          ))}
          <text x={640} y={384} textAnchor="middle" fontFamily={FONT} fontSize={22} letterSpacing="0.3em" fill={WHITE}>
            YEAR
          </text>
          <text x={640} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={110} fill={WHITE} style={{ filter: glow(0.6) }}>
            {yearNow}
          </text>
        </g>
        {pages.map((i) => {
          const p = prog(t, 35.8 + i * 0.14, 0.5, (x) => x);
          if (p <= 0 || p >= 1) return null;
          return (
            <g key={i} transform={`translate(${640 + p * 260}, ${520 + p * p * 300}) rotate(${p * 70})`} opacity={1 - p}>
              <rect x={-160} y={-110} width={320} height={300} rx={14} fill="#000" stroke={WHITE} strokeWidth={2.5} />
              <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={110} fill={WHITE}>
                {2026 + i}
              </text>
            </g>
          );
        })}
        {/* wallet: opens, shakes empty, a moth flies out */}
        <g transform={`translate(${1300 + shake}, 560)`} style={{ filter: glow(0.7) }}>
          <rect x={-200} y={-70} width={400} height={180} rx={20} fill="rgba(0,0,0,0.75)" stroke={WHITE} strokeWidth={4} />
          <line x1={-170} x2={170} y1={20} y2={20} stroke={GREY_LINE} strokeWidth={2} strokeDasharray="6 8" />
          <text y={80} textAnchor="middle" fontFamily={FONT} fontSize={18} letterSpacing="0.3em" fill="#8f8f8f" opacity={open}>
            EMPTY
          </text>
          <g transform={`translate(0, -70) scale(1, ${1 - 1.9 * open})`}>
            <rect x={-200} y={-150} width={400} height={150} rx={20} fill="rgba(0,0,0,0.85)" stroke={WHITE} strokeWidth={4} />
            <rect x={130} y={-100} width={48} height={42} rx={10} fill="none" stroke={WHITE} strokeWidth={3} />
          </g>
        </g>
        {mothT > 0 ? (
          <Moth x={1300 + Math.sin(mothT * 3.2) * 110 + mothT * 60} y={540 - mothT * 230} flap={mothT * 22} s={2} />
        ) : null}
      </Layer>
      <At t={t} at={37.2} x={640} y={790} g={1}>
        <Tag size={22}>Income 2×</Tag>
      </At>
      <At t={t} at={39.05} x={1300} y={790} g={1.3}>
        <div style={{ textAlign: "center" }}>
          <Caps size={18}>Left at month end</Caps>
          <Num size={110}>$0</Num>
        </div>
      </At>
    </Shot>
  );
};

/* 12 · "And the interesting part is that it rarely feels like a decision." (40.55 – 43.8) */

const ROWS = ["Nicer apartment", "Newer car", "Expensive habits"];

export const AutoRenew: React.FC = () => {
  const t = useTime();
  const strike = prog(t, 43.2, 0.35);
  const cam = camPath([
    { t: 40.55, x: 960, y: 540, z: 1.0 },
    { t: 41.7, x: 960, y: 560, z: 1.04, ease: (x) => x },
    { t: 42.0, x: 1040, y: 560, z: 1.18 },
    { t: 43.0, x: 1040, y: 560, z: 1.2, ease: (x) => x },
    { t: 43.3, x: 960, y: 470, z: 1.05 },
  ]);
  return (
    <Shot id="renew" from={40.55} to={43.8} inDir="L" outDir="U" cam={cam} light={{ x: 960, y: 540, r: 560, a: 0.06 }}>
      <Layer>
        <g opacity={prog(t, 40.6, 0.3)}>
          <rect x={560} y={330} width={800} height={460} rx={22} fill="rgba(255,255,255,0.035)" stroke={WHITE} strokeWidth={3} />
          <text x={610} y={392} fontFamily={FONT} fontSize={20} letterSpacing="0.3em" fill="#bdbdbd">
            SUBSCRIPTIONS
          </text>
          {ROWS.map((r, i) => {
            const y = 470 + i * 110;
            const on = prog(t, [41.85, 42.1, 42.32][i], 0.22, fastOut);
            return (
              <g key={r}>
                <line x1={600} x2={1320} y1={y - 48} y2={y - 48} stroke="#333" strokeWidth={1.5} />
                <text x={610} y={y + 4} fontFamily={FONT} fontSize={30} fill={WHITE}>
                  {r}
                </text>
                <text x={610} y={y + 34} fontFamily={FONT} fontSize={16} letterSpacing="0.2em" fill="#8f8f8f">
                  AUTO-RENEW · MONTHLY
                </text>
                <g style={{ filter: on > 0.5 ? glow(1) : undefined }}>
                  <rect x={1190} y={y - 22} width={100} height={52} rx={26} fill={`rgba(255,255,255,${on})`} stroke={WHITE} strokeWidth={3} />
                  <circle cx={1216 + 48 * on} cy={y + 4} r={19} fill={on > 0.5 ? "#000" : WHITE} />
                </g>
              </g>
            );
          })}
        </g>
        {/* an idle cursor nobody moves */}
        <g transform="translate(1520, 860)" opacity={prog(t, 40.9, 0.3) * 0.75}>
          <path d="M0 0 L0 46 L12 34 L22 56 L30 52 L20 31 L36 31 Z" fill="#000" stroke={WHITE} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      </Layer>
      <At t={t} at={42.95} x={960} y={250} g={0.8}>
        <div style={{ position: "relative" }}>
          <Num size={60} weight={600}>
            <span style={{ letterSpacing: "0.3em" }}>DECISION</span>
          </Num>
          <div style={{ position: "absolute", left: -12, top: "52%", height: 5, width: `${strike * 105}%`, background: WHITE, borderRadius: 4 }} />
        </div>
      </At>
    </Shot>
  );
};

/* 13 + 14 · "Every upgrade seems small and reasonable on its own. But together, they turn every raise into a bigger lifestyle instead of more freedom." (43.8 – 51.7) */

const FLAKES = ["+$12", "+$40", "+$85", "+$29", "+$60", "+$120", "+$15"];
const SLOPE = { x0: 380, y0: 560, x1: 1900, y1: 930 };
const slopeY = (x: number) => SLOPE.y0 + ((x - SLOPE.x0) * (SLOPE.y1 - SLOPE.y0)) / (SLOPE.x1 - SLOPE.x0);

export const Snowball: React.FC = () => {
  const t = useTime();
  const gather = prog(t, 46.9, 0.6, (x) => x * x);
  const roll = prog(t, 47.4, 3.9, (x) => x * (0.6 + 0.4 * x));
  const r = 40 + 200 * roll;
  const bx = 520 + 1000 * roll;
  const ang = (bx / Math.max(r, 1)) * 57;
  const by = slopeY(bx) - r - 4;
  const hitP = prog(t, 51.0, 0.45, fastOut);
  const cam = camPath([
    { t: 43.8, x: 960, y: 440, z: 1.12 },
    { t: 46.8, x: 960, y: 480, z: 1.18, ease: (x) => x },
    { t: 47.3, x: 700, y: 600, z: 1.2 },
    { t: 51.9, x: 1350, y: 700, z: 0.95, ease: (x) => x },
  ]);
  return (
    <Shot id="snow" from={43.8} to={51.7} inDir="U" outDir="L" cam={cam} light={{ x: t < 47 ? 960 : bx, y: t < 47 ? 450 : by, r: 520, a: 0.07 }}>
      <Layer>
        {/* ambient flakes */}
        {Array.from({ length: 40 }, (_, i) => {
          const x0 = random(`ax${i}`) * 2200 - 140;
          const sp = 40 + random(`as${i}`) * 50;
          const y = ((random(`ay${i}`) * 1200 + (t - 43.8) * sp) % 1300) - 150;
          return <circle key={i} cx={x0 + Math.sin(t + i) * 14} cy={y} r={2 + random(`ar${i}`) * 2.5} fill={WHITE} opacity={0.35} />;
        })}
        {/* the slope */}
        <Stroke t={t} at={46.9} dur={0.5} d={`M${SLOPE.x0 - 300} ${SLOPE.y0 - 60} Q${SLOPE.x0 - 100} ${SLOPE.y0} ${SLOPE.x0} ${SLOPE.y0} L${SLOPE.x1 + 200} ${slopeY(SLOPE.x1 + 200)}`} w={3} color={GREY_LINE} />
        {/* labelled flakes */}
        {FLAKES.map((f, i) => {
          const x0 = 480 + i * 160;
          const fall = Math.min(t, 46.9) - 43.85 - i * 0.12;
          if (fall < 0) return null;
          const fx = x0 + Math.sin(t * 1.4 + i) * 22;
          const fy = 250 + fall * 95 + (i % 3) * 70;
          const tx = fx + (bx - fx) * gather;
          const ty = fy + (by - fy) * gather;
          const check = prog(t, 45.3 + i * 0.06, 0.25, fastOut);
          if (gather >= 1) return null;
          return (
            <g key={i} opacity={1 - gather * 0.6}>
              <Snowflake x={tx} y={ty} r={38} rot={t * 40 + i * 20} />
              <text x={tx} y={ty + 80} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill={WHITE} opacity={1 - gather}>
                {f}
              </text>
              {check > 0 ? (
                <g opacity={check * (1 - gather)} style={{ filter: glow(0.8) }}>
                  <CheckBadge x={tx + 56} y={ty - 40} r={18} />
                </g>
              ) : null}
            </g>
          );
        })}
        {/* the snowball */}
        {gather > 0.3 ? (
          <g transform={`translate(${bx}, ${by})`} style={{ filter: glow(0.9) }}>
            <circle r={r} fill="rgba(255,255,255,0.08)" stroke={WHITE} strokeWidth={4} />
            <g transform={`rotate(${ang})`} stroke={WHITE} strokeWidth={2.4} fill="none" opacity={0.75}>
              <path d={`M${-r * 0.6} ${-r * 0.2} q${r * 0.4} ${-r * 0.5} ${r * 0.9} ${-r * 0.2}`} />
              <path d={`M${-r * 0.3} ${r * 0.5} q${r * 0.5} ${-r * 0.1} ${r * 0.8} ${-r * 0.5}`} />
              <path d={`M${r * 0.1} ${-r * 0.7} q${-r * 0.3} ${r * 0.4} ${-r * 0.1} ${r * 0.9}`} />
            </g>
            {roll > 0.55 ? (
              <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={Math.max(18, r * 0.2)} letterSpacing="0.16em" fill={WHITE} opacity={prog(t, 49.6, 0.3)}>
                LIFESTYLE
              </text>
            ) : null}
          </g>
        ) : null}
        {/* raises sucked into the ball */}
        {[0, 1, 2].map((i) => {
          const p = prog(t, 48.45 + i * 0.12, 0.5, (x) => x * x);
          if (p <= 0 || p >= 1) return null;
          const sx = bx + 200 + i * 120;
          const sy = by - 380;
          return <Coin key={i} x={sx + (bx - sx) * p} y={sy + (by - sy) * p} r={22} rot={p * 200} />;
        })}
        {/* FREEDOM sign knocked over */}
        {t > 50.3 ? (
          <g
            transform={`translate(1560, ${slopeY(1560)}) rotate(${hitP * 75}) translate(${hitP * 40}, ${-hitP * 20}) scale(1.5)`}
            opacity={prog(t, 50.3, 0.3) * (1 - hitP * 0.7)}
          >
            <line x1={0} y1={0} x2={0} y2={-150} stroke={WHITE} strokeWidth={4} />
            <rect x={-10} y={-210} width={210} height={66} rx={10} fill="rgba(0,0,0,0.7)" stroke={WHITE} strokeWidth={3} />
            <text x={95} y={-166} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={24} letterSpacing="0.2em" fill={WHITE}>
              FREEDOM
            </text>
          </g>
        ) : null}
      </Layer>
      <At t={t} at={44.85} x={960} y={170} opacity={1 - gather}>
        <Caps size={22}>Small · Reasonable</Caps>
      </At>
      <At t={t} at={48.5} x={bx + 260} y={by - 440} opacity={1 - prog(t, 49.2, 0.3)}>
        <Caps size={20} color={WHITE}>
          Every raise
        </Caps>
      </At>
    </Shot>
  );
};
