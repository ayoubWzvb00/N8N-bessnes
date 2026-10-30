import React from "react";
import { random } from "remotion";
import { prog, useTime } from "../lib/anim";
import { FONT, WHITE } from "../lib/ui";
import { CheckBadge, Coin, Pict, Walker } from "./figures";
import { Escalator, ESC, Sign } from "./escalator";
import { At, camPath, Caps, fastOut, glow, GREY_LINE, Layer, money, Num, Shot, Stroke, Tag } from "./kit";

/* 15 · "This is why so many people with high salaries still live paycheck to paycheck." (51.7 – 56.07) */

const MONTHS = ["JAN", "FEB", "MAR", "APR"];

export const FuelGauge: React.FC = () => {
  const t = useTime();
  const cx = 960;
  const cy = 760;
  const R = 360;
  const period = 1.15;
  const lt = t - 52.0;
  const cyc = Math.max(0, Math.floor(lt / period));
  const ph = lt < 0 ? 0 : (lt % period) / period;
  const level = lt < 0 ? 0.5 : ph < 0.12 ? ph / 0.12 : 1 - (ph - 0.12) / 0.88; // 1 = full
  const ang = Math.PI + level * Math.PI; // left (E) → right (F)
  const payday = lt >= 0 && ph < 0.25 ? 1 - ph / 0.25 : 0;
  const ticks = Array.from({ length: 11 }, (_, i) => Math.PI + (i / 10) * Math.PI);
  const cam = camPath([
    { t: 51.7, x: 960, y: 580, z: 1.1 },
    { t: 56.3, x: 960, y: 600, z: 1.18, ease: (x) => x },
  ]);
  return (
    <Shot id="fuel" from={51.7} to={56.07} inDir="L" outDir="R" cam={cam} light={{ x: cx, y: cy - 120, r: 560, a: 0.06 + payday * 0.05 }}>
      <Layer>
        {/* crowd of high earners */}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} opacity={prog(t, 52.6 + i * 0.04, 0.3)}>
            <Pict x={960 + (i - 4) * 90} y={320} s={1.1} color="#bdbdbd" />
          </g>
        ))}
        {/* gauge */}
        <g opacity={prog(t, 51.75, 0.3)}>
          <path d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={WHITE} strokeWidth={4} />
          <path d={`M${cx - R + 34} ${cy} A${R - 34} ${R - 34} 0 0 1 ${cx + R - 34} ${cy}`} fill="none" stroke={GREY_LINE} strokeWidth={2} strokeDasharray="3 9" />
          {ticks.map((a, i) => (
            <line
              key={i}
              x1={cx + Math.cos(a) * (R - 6)}
              y1={cy + Math.sin(a) * (R - 6)}
              x2={cx + Math.cos(a) * (R - (i % 5 === 0 ? 40 : 24))}
              y2={cy + Math.sin(a) * (R - (i % 5 === 0 ? 40 : 24))}
              stroke={WHITE}
              strokeWidth={i % 5 === 0 ? 4 : 2}
            />
          ))}
          <text x={cx - R + 70} y={cy - 20} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={44} fill={WHITE}>
            E
          </text>
          <text x={cx + R - 70} y={cy - 20} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={44} fill={WHITE}>
            F
          </text>
          <g style={{ filter: glow(1) }}>
            <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (R - 60)} y2={cy + Math.sin(ang) * (R - 60)} stroke={WHITE} strokeWidth={7} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={18} fill={WHITE} />
          </g>
          <text x={cx} y={cy + 70} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} letterSpacing="0.3em" fill={WHITE}>
            {MONTHS[Math.min(cyc, MONTHS.length - 1)]}
          </text>
        </g>
      </Layer>
      {payday > 0 ? (
        <div style={{ position: "absolute", left: cx + R - 20, top: cy - R - 10, transform: "translate(-50%, -50%)", opacity: payday, filter: glow(1) }}>
          <Tag size={18}>Payday</Tag>
        </div>
      ) : null}
      <At t={t} at={53.5} x={960} y={190} g={1}>
        <Tag size={22}>$180K / year</Tag>
      </At>
      <At t={t} at={54.8} x={960} y={900}>
        <Caps size={24} color={WHITE}>
          Paycheck to paycheck
        </Caps>
      </At>
    </Shot>
  );
};

/* 16 · "Of course, there's nothing wrong with enjoying the money you make." (56.07 – 58.95) */

export const Beach: React.FC = () => {
  const t = useTime();
  const cam = camPath([
    { t: 56.07, x: 960, y: 560, z: 1.0 },
    { t: 59.2, x: 960, y: 580, z: 1.08, ease: (x) => x },
  ]);
  const waves = [800, 850, 900].map((y, i) => {
    let d = "";
    for (let x = 100; x <= 1820; x += 20) {
      const yy = y + Math.sin(x / 70 + t * 2.2 + i) * 6;
      d += `${x === 100 ? "M" : "L"}${x} ${yy} `;
    }
    return d;
  });
  return (
    <Shot id="beach" from={56.07} to={58.95} inDir="R" outDir="L" cam={cam} light={{ x: 1350, y: 330, r: 520, a: 0.09 }}>
      <Layer>
        {/* sun */}
        <g transform={`translate(1350, 320) rotate(${t * 18})`} style={{ filter: glow(1.2) }}>
          <circle r={70} fill="none" stroke={WHITE} strokeWidth={4} />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={0} y1={-95} x2={0} y2={-125} stroke={WHITE} strokeWidth={4} strokeLinecap="round" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <line x1={100} x2={1820} y1={760} y2={760} stroke={WHITE} strokeWidth={3} />
        {waves.map((d, i) => (
          <path key={i} d={d} stroke={GREY_LINE} strokeWidth={2.5} fill="none" opacity={0.8 - i * 0.2} />
        ))}
        {/* umbrella */}
        <g stroke={WHITE} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={prog(t, 56.1, 0.3)}>
          <path d="M640 760 L700 440" />
          <path d="M520 470 Q700 330 880 420 Q830 430 800 455 Q770 430 700 440 Q650 440 620 470 Q580 455 520 470 Z" fill="rgba(255,255,255,0.05)" />
        </g>
        {/* lounge chair with a relaxed person */}
        <g stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: glow(0.8) }}>
          <path d="M780 700 L1080 700 L1160 590" />
          <path d="M800 700 L780 760 M1060 700 L1080 760 M1120 645 L1150 760" />
        </g>
        <g fill={WHITE} style={{ filter: glow(0.8) }}>
          <circle cx={1150} cy={560} r={20} />
          <path d="M1130 590 L1080 680 L880 680 L880 660 L1060 650 L1110 575 Z" />
        </g>
        {/* drink */}
        <g stroke={WHITE} strokeWidth={3} fill="none" strokeLinejoin="round">
          <path d="M1240 690 L1290 690 L1270 730 L1260 730 Z" />
          <path d="M1265 730 V760 M1250 760 H1280 M1280 690 L1300 660" />
        </g>
      </Layer>
      <At t={t} at={56.8} x={1290} y={520} g={1.2}>
        <svg width={90} height={90} viewBox="-45 -45 90 90" style={{ overflow: "visible" }}>
          <CheckBadge x={0} y={0} r={38} />
        </svg>
      </At>
      <At t={t} at={57.6} x={960} y={960}>
        <Caps size={26} color={WHITE}>
          Enjoy it
        </Caps>
      </At>
    </Shot>
  );
};

/* 17 · "The problem starts when your expenses grow every time your income does." (58.95 – 62.98) */

export const Shadow: React.FC = () => {
  const t = useTime();
  const g1 = prog(t, 60.85, 0.5, fastOut);
  const g2 = prog(t, 62.1, 0.5, fastOut);
  const s = 2.3 + 0.8 * g1 + 0.8 * g2;
  const px = 720;
  const gy = 760;
  const cam = camPath([
    { t: 58.95, x: 960, y: 600, z: 1.0 },
    { t: 63.2, x: 990, y: 560, z: 0.96, ease: (x) => x },
  ]);
  return (
    <Shot id="shadow" from={58.95} to={62.98} inDir="L" outDir="U" cam={cam} light={{ x: 380, y: 240, r: 700, a: 0.08 }}>
      <Layer>
        {/* lamp */}
        <g style={{ filter: glow(1.4) }}>
          <circle cx={380} cy={240} r={34} fill={WHITE} />
          <circle cx={380} cy={240} r={58} fill="none" stroke={WHITE} strokeWidth={2} opacity={0.5 + 0.3 * Math.sin(t * 4)} />
        </g>
        <line x1={260} x2={1760} y1={gy} y2={gy} stroke={WHITE} strokeWidth={3} />
        {/* shadow on the floor */}
        <g transform={`translate(${px + 6}, ${gy + 4}) skewX(58) scale(1, -0.62)`} opacity={0.4}>
          <g transform={`scale(${s})`}>
            <circle cx={0} cy={-62} r={11} fill={WHITE} />
            <path d="M-17 0 V-30 a17 17 0 0 1 34 0 V0 Z" fill={WHITE} />
          </g>
        </g>
        <g style={{ filter: glow(1) }}>
          <Pict x={px} y={gy} s={s} />
        </g>
      </Layer>
      <At t={t} at={59.2} x={960} y={150} g={0.9}>
        <Tag size={22}>The problem</Tag>
      </At>
      <At t={t} at={60.3} x={px} y={gy - 75 * s - 70}>
        <Caps size={22} color={WHITE}>
          Income
        </Caps>
      </At>
      <At t={t} at={60.4} x={px + 60 * s + 140} y={gy + 30 * s + 40}>
        <Caps size={22} color="#9a9a9a">
          Expenses
        </Caps>
      </At>
    </Shot>
  );
};

/* 18 · "Because becoming wealthy isn't about how much money comes in." (62.98 – 66.15) */

const streamCoins = (t: number, start: number, x: number, y0: number, rate: number) =>
  Array.from({ length: Math.max(0, Math.floor((t - start) * rate)) }, (_, i) => {
    const s = start + i / rate;
    const dt = t - s;
    return {
      i,
      x: x + (random(`c${i}`) - 0.5) * 30,
      y: y0 + 120 * dt + 0.5 * 2200 * dt * dt,
      rot: (random(`r${i}`) - 0.5) * 600 * dt,
      sq: 0.35 + 0.65 * Math.abs(Math.cos(dt * 9 + i)),
    };
  }).filter((c) => c.y < 1500);

export const Tap: React.FC = () => {
  const t = useTime();
  const strike = prog(t, 65.45, 0.35);
  const cam = camPath([
    { t: 62.98, x: 960, y: 520, z: 1.0 },
    { t: 66.2, x: 960, y: 560, z: 1.06, ease: (x) => x },
  ]);
  return (
    <Shot id="tap" from={62.98} to={66.15} inDir="U" outDir="U" cam={cam} light={{ x: 960, y: 420, r: 560, a: 0.07 }}>
      <Layer>
        {/* faucet */}
        <g stroke={WHITE} strokeWidth={4} fill="rgba(0,0,0,0.6)" strokeLinejoin="round" style={{ filter: glow(0.8) }}>
          <path d="M520 230 H900 Q1000 230 1000 330 V360 H930 V330 Q930 300 900 300 H520 Z" />
          <rect x={880} y={170} width={40} height={60} rx={6} />
          <path d="M830 170 H970" strokeWidth={10} strokeLinecap="round" />
          <rect x={480} y={210} width={40} height={110} rx={6} />
        </g>
        {streamCoins(t, 63.05, 965, 380, 14).map((c) => (
          <Coin key={c.i} x={c.x} y={c.y} r={22} rot={c.rot} squash={c.sq} />
        ))}
      </Layer>
      <At t={t} at={63.55} x={560} y={600} g={1}>
        <Num size={72}>
          <span style={{ letterSpacing: "0.14em" }}>WEALTH</span>
        </Num>
      </At>
      <At t={t} at={63.95} x={790} y={600}>
        <Num size={64}>≠</Num>
      </At>
      <At t={t} at={65.0} x={1250} y={600}>
        <div style={{ position: "relative" }}>
          <Caps size={34} color={WHITE}>
            Money in
          </Caps>
          <div style={{ position: "absolute", left: -10, top: "50%", height: 4, width: `${strike * 108}%`, background: WHITE, borderRadius: 3 }} />
        </div>
      </At>
    </Shot>
  );
};

/* 19 · "It's about how much of it stays with you." (66.15 – end) — mirror of the hook */

export const VIDEO01B_END = 69.0;

export const Stays: React.FC = () => {
  const t = useTime();
  const px = ESC.tx + 90;
  const py = ESC.ty;
  const bagX = px + 62;
  const bagY = py - 52;
  const zip = prog(t, 67.4, 0.3, fastOut);
  const coins = streamCoins(Math.min(t, 67.45), 66.1, bagX, bagY - 520, 12).filter((c) => c.y < bagY - 10);
  const landed = Math.max(0, Math.floor((Math.min(t, 67.45) - 66.1) * 12) - coins.length);
  const lit = prog(t, 67.9, 0.4);
  const cam = camPath([
    { t: 66.15, x: bagX, y: bagY - 60, z: 2.6 },
    { t: 67.75, x: bagX, y: bagY - 60, z: 2.45, ease: (x) => x },
    { t: 68.35, x: 1060, y: 520, z: 0.98 },
    { t: 69.2, x: 1060, y: 520, z: 0.96, ease: (x) => x },
  ]);
  return (
    <Shot id="stays" from={66.15} to={VIDEO01B_END} inDir="U" last cam={cam} light={{ x: px, y: py - 100, r: 520, a: 0.08 + 0.06 * lit }}>
      <Layer>
        <Escalator travel={0} />
        <Sign x={ESC.tx + 270} y={ESC.ty - 120} text="RICH" lit={lit} />
        <Sign x={ESC.bx - 170} y={ESC.by - 120} text="BROKE" lit={0} />
        {coins.map((c) => (
          <Coin key={c.i} x={c.x} y={c.y} r={10} rot={c.rot} squash={c.sq} />
        ))}
        <g style={{ filter: glow(1) }}>
          <Walker x={px} y={py} stride={0} scale={0.9} />
          {/* the bag */}
          <g transform={`translate(${bagX}, ${bagY})`}>
            <path d="M-30 -8 Q-38 40 -24 46 H24 Q38 40 30 -8 Z" fill="rgba(0,0,0,0.7)" stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M-30 -8 Q0 ${-8 - 14 * (1 - zip)} 30 -8`} fill="none" stroke={WHITE} strokeWidth={3} />
            <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={WHITE}>
              $
            </text>
            <path d="M-22 -10 Q-30 -40 -16 -44" fill="none" stroke={WHITE} strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>
      </Layer>
      <At t={t} at={66.3} x={px - 20} y={py - 190} scale={0.45}>
        <div style={{ textAlign: "left" }}>
          <Caps size={18}>Kept</Caps>
          <Num size={56}>{money(landed * 500)}</Num>
        </div>
      </At>
      <At t={t} at={67.95} x={px} y={py + 40}>
        <Caps size={22} color={WHITE}>
          You
        </Caps>
      </At>
    </Shot>
  );
};
