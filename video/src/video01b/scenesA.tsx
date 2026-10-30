import React from "react";
import { prog, useTime } from "../lib/anim";
import { Bills, Briefcase, TrendUp } from "../lib/icons";
import { FONT, WHITE } from "../lib/ui";
import { CloudPath, Pict, Walker } from "./figures";
import { Escalator, ESC, ESC_ANGLE, ESC_LEN, integrate, onLine, Sign, U } from "./escalator";
import { At, camPath, Caps, fastOut, glow, GREY_LINE, Layer, money, Num, Shot, Stroke, Tag } from "./kit";

/* 1 · HOOK — "The more you earn, the easier it becomes to stay broke." (0 – 3.52) */

const hookSpeed = (t: number) => prog(t, 0.25, 2.6, (x) => x);
const personD = (t: number) => ESC_LEN * (0.43 - 0.05 * Math.min(1, t / 3.4));

export const Hook: React.FC = () => {
  const t = useTime();
  const sp = hookSpeed(t);
  const travel = integrate(t, (x) => 110 + 420 * hookSpeed(x), -1);
  const phase = integrate(t, (x) => 9 + 13 * hookSpeed(x), -1);
  const feet = onLine(personD(t));
  const fx = feet.x + 6;
  const fy = feet.y;
  const broke = prog(t, 2.8, 0.3);
  const income = 4000 + Math.floor((12000 * sp) / 100) * 100;
  const cam = camPath([
    { t: 0, x: fx + 20, y: fy - 95, z: 2.6 },
    { t: 0.55, x: fx + 20, y: fy - 100, z: 2.4, ease: (x) => x },
    { t: 1.15, x: 960, y: 560, z: 1.0 },
    { t: 2.72, x: 960, y: 560, z: 1.06, ease: (x) => x },
    { t: 3.05, x: 360, y: 820, z: 1.75 },
    { t: 4, x: 360, y: 820, z: 1.8, ease: (x) => x },
  ]);
  const life = onLine(ESC_LEN * 0.62, 118);
  return (
    <Shot id="hook" from={0} to={3.52} outDir="U" cam={cam} light={{ x: fx, y: fy - 120, r: 560, a: 0.08 }}>
      <Layer>
        <Escalator travel={travel} />
        {/* speed lines behind the walker */}
        {[0, 1, 2, 3].map((k) => {
          const ph = (t * (2.4 + 2 * sp) + k * 0.27) % 1;
          const base = onLine(personD(t) - 70 - ph * 160, -40 - k * 26);
          const len = 60 + 60 * sp;
          return (
            <line
              key={k}
              x1={base.x}
              y1={base.y}
              x2={base.x - U.x * len}
              y2={base.y - U.y * len}
              stroke={WHITE}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={(1 - ph) * (0.35 + 0.5 * sp)}
            />
          );
        })}
        <g style={{ filter: glow(1) }}>
          <Walker x={fx} y={fy} phase={phase} stride={1} scale={1.45} lean={10} />
        </g>
        <Sign x={ESC.tx + 230} y={ESC.ty - 120} text="RICH" lit={0.1} />
        <Sign x={ESC.bx - 170} y={ESC.by - 120} text="BROKE" lit={broke} />
      </Layer>
      {/* income above the walker */}
      <At t={t} at={0.75} x={fx + 40} y={fy - 300}>
        <div style={{ textAlign: "center" }}>
          <Caps size={18}>Income</Caps>
          <div style={{ filter: glow(0.8), marginTop: 6 }}>
            <Num size={56}>
              {money(income)}
              <span style={{ fontSize: 28, color: "#bdbdbd" }}> /mo</span>
            </Num>
          </div>
        </div>
      </At>
      <At t={t} at={1.55} x={life.x} y={life.y} rot={ESC_ANGLE}>
        <Caps size={20} color="#9a9a9a">
          Lifestyle ↓
        </Caps>
      </At>
    </Shot>
  );
};

/* 2 · "Most people believe their money problems will disappear once they start making more." (3.52 – 7.63) */

export const Believe: React.FC = () => {
  const t = useTime();
  const xs = [-3, -2, -1, 0, 1, 2, 3].map((i) => 960 + i * 190);
  const sun = prog(t, 6.85, 0.8, fastOut);
  const clear = prog(t, 7.0, 0.5);
  const cam = camPath([
    { t: 3.52, x: 960, y: 640, z: 1.12 },
    { t: 6.8, x: 960, y: 630, z: 1.2, ease: (x) => x },
    { t: 7.4, x: 960, y: 560, z: 1.08 },
  ]);
  return (
    <Shot id="believe" from={3.52} to={7.63} inDir="U" outDir="L" cam={cam} light={{ x: 960, y: 1000 - 420 * sun, r: 600, a: 0.05 + 0.08 * sun }}>
      <Layer>
        {/* rising coin-sun behind the crowd */}
        {sun > 0 ? (
          <g transform={`translate(960, ${1040 - 470 * sun}) rotate(${t * 20})`} style={{ filter: glow(1.4) }} opacity={sun}>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 -175 V-215" stroke={WHITE} strokeWidth={4} strokeLinecap="round" transform={`rotate(${i * 22.5})`} />
            ))}
            <circle r={140} fill="none" stroke={WHITE} strokeWidth={5} />
            <circle r={108} fill="none" stroke={WHITE} strokeWidth={2} strokeDasharray="6 8" />
            <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={120} fill={WHITE} transform={`rotate(${-t * 20})`}>
              $
            </text>
          </g>
        ) : null}
        <path d="M200 812 H1720" stroke={GREY_LINE} strokeWidth={2.5} />
        {xs.map((x, i) => {
          const pIn = prog(t, 3.6 + i * 0.05, 0.35, fastOut);
          const cIn = prog(t, 5.05 + i * 0.07, 0.35, fastOut);
          const cy = 560 + Math.sin(t * 2.2 + i) * 7 - clear * 90;
          const co = cIn * (1 - clear);
          const flash = Math.max(0, Math.sin(t * 9 + i * 1.7)) > 0.93 ? 1 : 0.55;
          return (
            <g key={i}>
              <g opacity={pIn} transform={`translate(0, ${(1 - pIn) * 30})`}>
                <Pict x={x} y={810} s={1.9} />
              </g>
              {co > 0 ? (
                <g transform={`translate(${x}, ${cy}) scale(1.05)`} opacity={co}>
                  <path d={CloudPath} fill="rgba(255,255,255,0.06)" stroke={WHITE} strokeWidth={3} />
                  <text x={4} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={WHITE}>
                    $
                  </text>
                  <path d="M-4 26 l-12 22 h14 l-10 22" stroke={WHITE} strokeWidth={3} fill="none" opacity={flash} strokeLinejoin="round" />
                  {/* rain */}
                  {[-30, 0, 30].map((rx, k) => {
                    const ry = ((t * 260 + k * 37 + i * 19) % 90) + 30;
                    return <line key={k} x1={rx} y1={ry} x2={rx - 4} y2={ry + 14} stroke={WHITE} strokeWidth={2} opacity={0.5} strokeLinecap="round" />;
                  })}
                </g>
              ) : null}
            </g>
          );
        })}
      </Layer>
      <At t={t} at={3.65} x={960} y={360} opacity={1 - prog(t, 6.8, 0.3)}>
        <Caps size={24}>Most people</Caps>
      </At>
      <At t={t} at={7.05} x={960} y={330}>
        <Tag size={22}>More</Tag>
      </At>
    </Shot>
  );
};

/* 3 · "So they chase a raise, a better job, or a bigger income." (7.63 – 11.27) */

const PRIZES: { at: number; icon: React.ReactNode; label: string }[] = [
  { at: 7.6, icon: <TrendUp size={84} />, label: "A raise" },
  { at: 9.3, icon: <Briefcase size={84} />, label: "Better job" },
  { at: 10.42, icon: <Bills size={84} />, label: "Bigger income" },
];

export const Chase: React.FC = () => {
  const t = useTime();
  const phase = t * 15;
  const rx = 760;
  const ry = 790;
  const swing = Math.sin(t * 3.2) * 7;
  const tipX = 1120;
  const tipY = 330;
  const len = 220;
  const cx = tipX + Math.sin((swing * Math.PI) / 180) * len;
  const cy = tipY + Math.cos((swing * Math.PI) / 180) * len;
  let idx = 0;
  PRIZES.forEach((p, i) => {
    if (t >= p.at) idx = i;
  });
  const sw = PRIZES[idx].at;
  const flip = Math.abs(Math.cos(Math.PI * prog(t, sw - 0.08, 0.2, (x) => x)));
  const cam = camPath([
    { t: 7.63, x: 940, y: 600, z: 1.15 },
    { t: 11.6, x: 980, y: 590, z: 1.24, ease: (x) => x },
  ]);
  return (
    <Shot id="chase" from={7.63} to={11.27} inDir="L" outDir="U" cam={cam} light={{ x: cx, y: cy, r: 420, a: 0.08 }}>
      <Layer>
        <line x1={150} x2={1800} y1={ry + 2} y2={ry + 2} stroke={GREY_LINE} strokeWidth={3} strokeDasharray="40 26" strokeDashoffset={t * 520} />
        {[0, 1, 2].map((k) => {
          const ph = (t * 2.6 + k * 0.33) % 1;
          const x2 = rx - 80 - ph * 180;
          return (
            <line key={k} x1={x2 - 120} x2={x2} y1={ry - 150 - k * 40} y2={ry - 150 - k * 40} stroke={WHITE} strokeWidth={3} strokeLinecap="round" opacity={(1 - ph) * 0.7} />
          );
        })}
        {/* the stick strapped to his own back */}
        <Stroke t={t} at={8.1} dur={0.4} d={`M${rx - 26} ${ry - 175} Q${rx + 40} ${tipY - 60} ${tipX} ${tipY}`} w={5} />
        <g opacity={prog(t, 8.3, 0.3)}>
          <line x1={tipX} y1={tipY} x2={cx} y2={cy - 70} stroke={WHITE} strokeWidth={2} />
        </g>
        <g style={{ filter: glow(1) }}>
          <Walker x={rx} y={ry} phase={phase} stride={1.1} scale={2.1} lean={8} />
        </g>
      </Layer>
      <At t={t} at={8.35} x={cx} y={cy + 40} g={1} rot={-swing} scale={1.3}>
        <div style={{ transform: `scaleX(${Math.max(0.04, flip)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 24,
              border: `3px solid ${WHITE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {PRIZES[idx].icon}
          </div>
          <Caps size={20} color={WHITE}>
            {PRIZES[idx].label}
          </Caps>
        </div>
      </At>
    </Shot>
  );
};

/* 4 · "But here's what most people don't understand." (11.27 – 13.62) */

export const FinePrint: React.FC = () => {
  const t = useTime();
  const p = prog(t, 11.4, 1.5, (x) => x * x * (3 - 2 * x));
  const lx = 760 + (980 - 760) * p;
  const ly = 420 + (640 - 420) * p;
  const reveal = prog(t, 12.55, 0.35);
  const lines = Array.from({ length: 19 }, (_, i) => ({ y: 300 + i * 28, w: 380 - ((i * 53) % 140) }));
  const cam = camPath([
    { t: 11.27, x: 960, y: 540, z: 1.0 },
    { t: 13.0, x: 975, y: 620, z: 1.18, ease: (x) => x },
    { t: 13.62, x: 980, y: 640, z: 1.3 },
  ]);
  return (
    <Shot id="fine" from={11.27} to={13.62} inDir="U" outDir="zoom" cam={cam} light={{ x: lx, y: ly, r: 380, a: 0.07 }}>
      <Layer>
        <defs>
          <clipPath id="lens-clip">
            <circle cx={lx} cy={ly} r={112} />
          </clipPath>
        </defs>
        <g opacity={prog(t, 11.3, 0.3)}>
          <rect x={700} y={220} width={520} height={680} rx={14} fill="rgba(255,255,255,0.03)" stroke={GREY_LINE} strokeWidth={2.5} />
          <text x={740} y={268} fontFamily={FONT} fontWeight={600} fontSize={20} letterSpacing="0.3em" fill="#bdbdbd">
            TERMS
          </text>
          {lines.map((l, i) => (
            <rect key={i} x={740} y={l.y} width={l.w} height={7} rx={3} fill="#5c5c5c" />
          ))}
        </g>
        {/* magnified content */}
        <g clipPath="url(#lens-clip)">
          <circle cx={lx} cy={ly} r={112} fill="#000" />
          {lines.map((l, i) => (
            <rect key={i} x={740 + (lx - 740) * -0.6} y={ly + (l.y - ly) * 2.2} width={l.w * 2.2} height={14} rx={6} fill="#4a4a4a" opacity={1 - reveal} />
          ))}
          <text x={lx} y={ly - 8} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing="0.1em" fill={WHITE} opacity={reveal}>
            INCOME
          </text>
          <text x={lx} y={ly + 34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing="0.1em" fill={WHITE} opacity={reveal}>
            ≠ WEALTH
          </text>
        </g>
        <g style={{ filter: glow(0.6 + reveal) }}>
          <circle cx={lx} cy={ly} r={112} fill="none" stroke={WHITE} strokeWidth={7} />
          <path d={`M${lx + 80} ${ly + 80} l90 90`} stroke={WHITE} strokeWidth={22} strokeLinecap="round" />
        </g>
      </Layer>
    </Shot>
  );
};

/* 5 · "Your income was never what made you wealthy." (13.62 – 16.08) */

export const Paycheck: React.FC = () => {
  const t = useTime();
  const card = prog(t, 13.62, 0.5, fastOut);
  const slam = prog(t, 14.45, 0.16, (x) => x * x);
  const hit = prog(t, 14.61, 0.25);
  const punch = 1 + 0.05 * Math.sin(Math.PI * hit);
  const pulse = prog(t, 15.5, 0.4);
  const cam = camPath([
    { t: 13.62, x: 960, y: 540, z: 1.0 },
    { t: 16.2, x: 960, y: 540, z: 1.06, ease: (x) => x },
  ]);
  return (
    <Shot id="paycheck" from={13.62} to={16.08} inDir="zoom" outDir="L" cam={(tt) => ({ ...cam(tt), z: cam(tt).z * punch })} light={{ x: 960, y: 540, r: 650, a: 0.06 }}>
      <Layer>
        <g opacity={card} transform={`translate(0, ${(1 - card) * 40})`}>
          <rect x={470} y={330} width={980} height={420} rx={18} fill="rgba(255,255,255,0.04)" stroke={WHITE} strokeWidth={3} />
          <rect x={490} y={350} width={940} height={380} rx={12} fill="none" stroke={GREY_LINE} strokeWidth={1.5} strokeDasharray="4 6" />
          <text x={530} y={410} fontFamily={FONT} fontWeight={600} fontSize={26} letterSpacing="0.3em" fill={WHITE}>
            PAYCHECK
          </text>
          <text x={1390} y={410} textAnchor="end" fontFamily={FONT} fontSize={20} letterSpacing="0.2em" fill="#9a9a9a">
            NO. 0421
          </text>
          <text x={530} y={505} fontFamily={FONT} fontSize={18} letterSpacing="0.22em" fill="#9a9a9a">
            PAY TO THE ORDER OF
          </text>
          <text x={530} y={556} fontFamily="Georgia, serif" fontStyle="italic" fontSize={46} fill={WHITE}>
            You
          </text>
          <line x1={530} x2={1040} y1={572} y2={572} stroke={GREY_LINE} strokeWidth={2} />
          <rect x={1110} y={470} width={280} height={96} rx={10} fill="none" stroke={WHITE} strokeWidth={3} />
          <text x={1250} y={534} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={44} fill={WHITE}>
            $8,000.00
          </text>
          <Stroke t={t} at={13.95} dur={0.6} d="M1130 690 c20 -40 40 -40 46 -6 c6 30 26 -50 46 -20 c14 22 30 -10 50 -6 c16 4 30 10 70 -4" w={3} />
          <line x1={1120} x2={1400} y1={704} y2={704} stroke={GREY_LINE} strokeWidth={2} />
          <text x={530} y={700} fontFamily={FONT} fontSize={18} letterSpacing="0.22em" fill="#9a9a9a">
            MEMO: MONTHLY SALARY
          </text>
        </g>
        {/* the stamp */}
        {slam > 0 ? (
          <g
            transform={`translate(960, 540) rotate(-11) scale(${2.4 - 1.4 * slam})`}
            opacity={Math.min(1, slam * 1.5)}
            style={{ filter: glow(0.6 + pulse * 0.9) }}
          >
            <rect x={-290} y={-82} width={580} height={164} rx={14} fill="rgba(0,0,0,0.75)" stroke={WHITE} strokeWidth={7} />
            <rect x={-270} y={-62} width={540} height={124} rx={8} fill="none" stroke={WHITE} strokeWidth={2.5} />
            <text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} letterSpacing="0.14em" fill={WHITE}>
              NOT WEALTH
            </text>
          </g>
        ) : null}
        {/* ink specks on impact */}
        {hit > 0 && hit < 1
          ? Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2 + 0.3;
              const r = 300 + hit * 120;
              return <circle key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r * 0.45} r={4 * (1 - hit)} fill={WHITE} />;
            })
          : null}
      </Layer>
    </Shot>
  );
};

/* 6 · "What makes you wealthy is the gap between what you earn and what you spend." (16.08 – 20.41) */

export const Caliper: React.FC = () => {
  const t = useTime();
  const earnY = 360;
  const spendY = 730;
  const slideIn = prog(t, 17.3, 0.45, fastOut);
  const open = prog(t, 17.75, 0.7);
  const jawY = earnY + 26 + (spendY - earnY - 26) * open;
  const earnLit = prog(t, 18.9, 0.3);
  const spendLit = prog(t, 19.9, 0.3);
  const gapLit = prog(t, 18.35, 0.4);
  const bx = 1420 + (1 - slideIn) * 700;
  const ticks = Array.from({ length: 30 }, (_, i) => 250 + i * 20);
  const cam = camPath([
    { t: 16.08, x: 960, y: 545, z: 1.0 },
    { t: 20.6, x: 1000, y: 545, z: 1.06, ease: (x) => x },
  ]);
  return (
    <Shot id="caliper" from={16.08} to={20.41} inDir="L" outDir="R" cam={cam} light={{ x: 1150, y: 545, r: 600, a: 0.06 }}>
      <Layer>
        <g style={{ filter: earnLit > 0 ? glow(earnLit) : undefined }}>
          <Stroke t={t} at={16.25} d={`M460 ${earnY} H1240`} w={4} color={earnLit > 0.5 ? WHITE : GREY_LINE} />
        </g>
        <g style={{ filter: spendLit > 0 ? glow(spendLit) : undefined }}>
          <Stroke t={t} at={16.45} d={`M460 ${spendY} H1240`} w={4} color={spendLit > 0.5 ? WHITE : GREY_LINE} />
        </g>
        {/* caliper */}
        <g opacity={slideIn} style={{ filter: glow(0.7) }}>
          <rect x={bx - 18} y={230} width={36} height={640} rx={6} fill="rgba(0,0,0,0.6)" stroke={WHITE} strokeWidth={3} />
          {ticks.map((y, i) => (
            <line key={y} x1={bx - 18} x2={bx - 18 + (i % 5 === 0 ? 16 : 9)} y1={y} y2={y} stroke={WHITE} strokeWidth={1.6} />
          ))}
          {/* fixed jaw */}
          <path d={`M${bx - 18} ${earnY - 30} H${1262} L${1240} ${earnY} L${bx - 18} ${earnY} Z`} fill="rgba(0,0,0,0.6)" stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
          {/* sliding jaw */}
          <path d={`M${bx - 18} ${jawY + 30} H${1262} L${1240} ${jawY} L${bx - 18} ${jawY} Z`} fill="rgba(0,0,0,0.6)" stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
          <rect x={bx - 30} y={jawY - 8} width={60} height={80} rx={8} fill="rgba(0,0,0,0.7)" stroke={WHITE} strokeWidth={3} />
        </g>
        {/* dimension line */}
        {gapLit > 0 ? (
          <g opacity={gapLit} stroke={WHITE} strokeWidth={2.5} fill="none">
            <path d={`M1120 ${earnY + 8} V${spendY - 8}`} strokeDasharray="8 8" />
            <path d={`M1108 ${earnY + 22} l12 -14 l12 14 M1108 ${spendY - 22} l12 14 l12 -14`} />
          </g>
        ) : null}
        <rect x={460} y={earnY} width={780} height={Math.max(0, spendY - earnY) * gapLit} fill={`rgba(255,255,255,${0.05 * gapLit})`} />
      </Layer>
      <At t={t} at={16.15} x={960} y={190}>
        <Caps size={24}>What makes you wealthy</Caps>
      </At>
      <At t={t} at={16.3} x={380} y={earnY}>
        <Caps size={22} color={earnLit > 0.5 ? WHITE : "#9a9a9a"}>
          Earn
        </Caps>
      </At>
      <At t={t} at={16.5} x={380} y={spendY}>
        <Caps size={22} color={spendLit > 0.5 ? WHITE : "#9a9a9a"}>
          Spend
        </Caps>
      </At>
      <At t={t} at={18.35} x={900} y={(earnY + spendY) / 2} g={1.2}>
        <Tag size={26}>Wealth</Tag>
      </At>
    </Shot>
  );
};

/* 7 · "Imagine someone who goes from making $4,000 a month to $8,000." (20.41 – 24.78) */

const Notif: React.FC<{ amount: string; bright: boolean }> = ({ amount, bright }) => (
  <div
    style={{
      width: 300,
      borderRadius: 18,
      border: `2px solid ${bright ? WHITE : "#6a6a6a"}`,
      background: "rgba(255,255,255,0.07)",
      padding: "14px 16px",
      display: "flex",
      gap: 14,
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        border: `2px solid ${WHITE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 24,
        color: WHITE,
      }}
    >
      $
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Caps size={12} color="#a8a8a8">
        Bank · now
      </Caps>
      <div style={{ fontFamily: FONT, fontSize: 17, color: "#dcdcdc" }}>Salary deposited</div>
      <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: WHITE }}>{amount}</div>
    </div>
  </div>
);

export const Phone: React.FC = () => {
  const t = useTime();
  const n1 = prog(t, 21.9, 0.35, fastOut);
  const n2 = prog(t, 23.62, 0.35, fastOut);
  const cam = camPath([
    { t: 20.41, x: 960, y: 550, z: 1.2 },
    { t: 23.5, x: 970, y: 520, z: 1.38, ease: (x) => x },
    { t: 24.0, x: 1040, y: 500, z: 1.55 },
  ]);
  return (
    <Shot id="phone" from={20.41} to={24.78} inDir="R" outDir="L" cam={cam} light={{ x: 960, y: 520, r: 520, a: 0.07 }}>
      <Layer>
        <Stroke t={t} at={20.45} d="M450 160 v-40 h40 M1430 120 h40 v40 M1470 960 v40 h-40 M490 1000 h-40 v-40" w={3} />
        <g opacity={prog(t, 20.5, 0.3)}>
          <rect x={795} y={220} width={330} height={660} rx={48} fill="rgba(255,255,255,0.03)" stroke={WHITE} strokeWidth={4} />
          <rect x={915} y={240} width={90} height={22} rx={11} fill={WHITE} />
          <text x={960} y={370} textAnchor="middle" fontFamily={FONT} fontWeight={300} fontSize={84} fill={WHITE}>
            9:41
          </text>
          <text x={960} y={405} textAnchor="middle" fontFamily={FONT} fontSize={18} letterSpacing="0.12em" fill="#a8a8a8">
            FRIDAY, MAY 1
          </text>
        </g>
      </Layer>
      <At t={t} at={20.5} x={505} y={150}>
        <Caps size={18}>Imagine</Caps>
      </At>
      {n1 > 0 ? (
        <div style={{ position: "absolute", left: 960, top: 300 + 170 * n1 + 112 * n2, transform: "translate(-50%, -50%)", opacity: n1 * (1 - 0.45 * n2) }}>
          <Notif amount="+$4,000.00" bright={n2 < 0.5} />
        </div>
      ) : null}
      {n2 > 0 ? (
        <div style={{ position: "absolute", left: 960, top: 300 + 170 * n2, transform: "translate(-50%, -50%)", opacity: n2, filter: glow(0.9) }}>
          <Notif amount="+$8,000.00" bright />
        </div>
      ) : null}
      <At t={t} at={23.95} x={1230} y={470} g={1}>
        <Tag size={26}>2×</Tag>
      </At>
    </Shot>
  );
};
