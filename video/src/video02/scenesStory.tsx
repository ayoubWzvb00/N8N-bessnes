import React from "react";
import { lerp, prog, useTime } from "../lib/anim";
import { FONT, WHITE } from "../lib/ui";
import { At, camPath, Caps, fastOut, Layer, Num, Shot, Stroke, Tag } from "../video01b/kit";
import { Human, mixPose, poseAt, POSES } from "./Human";
import { Bubble, CoinG, Door, Floor, INK, Jar, KeyRing, LockPlate, MID, PriceTag, Receipt, WallClock } from "./props";

const SOFT = { a: 0.05 };

/** Coin thrown along an arc from a to b during [at, at+dur]. */
const Toss: React.FC<{ t: number; at: number; dur?: number; a: [number, number]; b: [number, number]; h?: number; r?: number }> = ({
  t,
  at,
  dur = 0.6,
  a,
  b,
  h = 160,
  r = 16,
}) => {
  const p = prog(t, at, dur, (x) => x);
  if (p <= 0 || p >= 1) return null;
  const x = a[0] + (b[0] - a[0]) * p;
  const y = a[1] + (b[1] - a[1]) * p - Math.sin(Math.PI * p) * h;
  return <CoinG x={x} y={y} r={r} squash={Math.abs(Math.cos(p * 14))} />;
};

/* 1 · HOOK — "People will pay you less for being good at your job." (0 – 2.95)
   One clear moment, big on a phone: the expert opens the door in two seconds,
   the customer is unimpressed, and the price collapses from $100 to $40. */

export const Hook: React.FC = () => {
  const t = useTime();
  const floor = 900;
  const doorX = 1300;
  const snap = prog(t, 0.05, 0.2, fastOut);
  const tagIn = prog(t, 0.6, 0.3, fastOut);
  const fall = prog(t, 1.08, 0.55, (x) => x * x);
  const price = Math.round(100 - 60 * prog(t, 1.12, 0.45));
  const badge = prog(t, 1.9, 0.3, fastOut);
  const cam = camPath([
    { t: 0, x: doorX - 40, y: floor - 160, z: 3.1 },
    { t: 0.42, x: doorX - 40, y: floor - 165, z: 2.9, ease: (x) => x },
    { t: 0.85, x: 1110, y: floor - 230, z: 1.7 },
    { t: 3.2, x: 1110, y: floor - 235, z: 1.78, ease: (x) => x },
  ]);
  return (
    <Shot id="h2" from={0} to={2.95} outDir="L" cam={cam} light={{ x: 1110, y: floor - 230, r: 640, a: 0.06 }}>
      <Layer>
        <Floor y={floor} x1={600} x2={1700} />
        <Door x={doorX} floor={floor} open={snap} warm={snap * 0.45} />
        {snap > 0 && snap < 1
          ? [0, 1, 2].map((k) => (
              <line key={k} x1={doorX + 90} x2={doorX + 130} y1={floor - 260 + k * 40} y2={floor - 270 + k * 40} stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
            ))
          : null}
        <text x={doorX + 200} y={floor - 230} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing="0.16em" fill={WHITE} opacity={prog(t, 0.22, 0.2)}>
          2 SECONDS
        </text>
        <Human x={1160} y={floor} pose={POSES.workStand} face="smug" cap hold="key" scale={1.6} />
        <Human x={870} y={floor} pose={poseAt(t, [[0, POSES.give], [1.15, POSES.armsCrossed]], 0.25)} face={t < 1.1 ? "neutral" : "angry"} hair scale={1.6} hold={t < 1.1 ? "coin" : undefined} />
        {/* the price, then it collapses */}
        {tagIn > 0 ? (
          <g opacity={tagIn} transform={`translate(0, ${fall * 36}) rotate(${fall * 10}, 960, 450)`}>
            <PriceTag x={960} y={450} text={`$${price}`} size={60} rot={-4} />
          </g>
        ) : null}
        {fall > 0.3 ? (
          <g stroke={WHITE} strokeWidth={5} strokeLinecap="round" opacity={1 - prog(t, 1.7, 0.4)}>
            <path d="M1070 400 l30 -24 M1084 450 h38 M1070 500 l30 24" />
          </g>
        ) : null}
        {/* expert badge */}
        {badge > 0 ? (
          <g transform={`translate(1180, ${floor - 400}) scale(${0.7 + 0.3 * badge})`} opacity={badge}>
            <rect x={-92} y={-26} width={184} height={52} rx={26} fill={WHITE} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} letterSpacing="0.16em" fill={INK}>
              ★ EXPERT
            </text>
          </g>
        ) : null}
      </Layer>
    </Shot>
  );
};

/* 2 · "A locksmith once explained this to a famous economist." (2.95 – 6.0) */

export const Economist: React.FC = () => {
  const t = useTime();
  const floor = 860;
  const icons = [3.95, 4.3, 4.65].map((a) => prog(t, a, 0.3, fastOut));
  const write = Math.sin(t * 14) * 6;
  const cam = camPath([
    { t: 2.95, x: 960, y: 620, z: 1.4 },
    { t: 6.2, x: 975, y: 610, z: 1.5, ease: (x) => x },
  ]);
  return (
    <Shot id="econ" from={2.95} to={6.0} inDir="L" outDir="U" cam={cam} light={{ x: 960, y: 520, r: 620, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={300} x2={1620} />
        {/* table */}
        <g stroke={WHITE} strokeWidth={5} strokeLinecap="round">
          <line x1={760} x2={1160} y1={712} y2={712} />
          <line x1={800} x2={800} y1={712} y2={floor} />
          <line x1={1120} x2={1120} y1={712} y2={floor} />
        </g>
        {/* chairs */}
        {[640, 1280].map((x) => (
          <g key={x} stroke={MID} strokeWidth={4} strokeLinecap="round" fill="none">
            <path d={`M${x - 40} 790 H${x + 40} M${x - 34} 790 V${floor} M${x + 34} 790 V${floor}`} />
          </g>
        ))}
        <Human x={620} y={floor - 66} pose={POSES.sit} face="neutral" cap scale={1.35} />
        <Human x={1300} y={floor - 66} pose={{ ...POSES.sitWrite, armF: [70 + write, 30] }} face="neutral" tie dir={-1} scale={1.35} />
        {/* notebook */}
        <rect x={1090} y={688} width={70} height={14} rx={3} fill={WHITE} />
        <Bubble x={800} y={360} w={300} h={130}>
          <g opacity={icons[0]} transform="translate(710, 360)">
            <rect x={-26} y={-6} width={52} height={40} rx={8} fill="none" stroke={WHITE} strokeWidth={4} />
            <path d="M-16 -6 v-12 a16 16 0 0 1 32 0 v12" fill="none" stroke={WHITE} strokeWidth={4} />
          </g>
          <g opacity={icons[1]} transform="translate(800, 360)">
            <circle r={28} fill="none" stroke={WHITE} strokeWidth={4} />
            <path d="M0 0 V-18 M0 0 L12 8" stroke={WHITE} strokeWidth={4} strokeLinecap="round" />
          </g>
          <text x={890} y={378} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill={WHITE} opacity={icons[2]}>
            $
          </text>
        </Bubble>
      </Layer>
      <At t={t} at={3.3} x={620} y={500}>
        <Caps size={20}>Locksmith</Caps>
      </At>
      <At t={t} at={5.3} x={1300} y={560}>
        <Caps size={20} color={WHITE}>
          Economist
        </Caps>
      </At>
    </Shot>
  );
};

/* 3 · "When he was just starting out, opening a lock took him almost an hour." (6.0 – 10.05) */

export const YearOne: React.FC = () => {
  const t = useTime();
  const floor = 860;
  const spin = prog(t, 7.6, 2.1, (x) => x);
  const work = Math.sin(t * 13) * 7;
  const cam = camPath([
    { t: 6.0, x: 960, y: 620, z: 1.1 },
    { t: 7.5, x: 960, y: 600, z: 1.14, ease: (x) => x },
    { t: 8.0, x: 1040, y: 470, z: 1.3 },
    { t: 10.3, x: 1040, y: 460, z: 1.36, ease: (x) => x },
  ]);
  return (
    <Shot id="year1" from={6.0} to={10.05} inDir="U" outDir="zoom" cam={cam} light={{ x: 1060, y: 420, r: 560, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={360} x2={1600} />
        <Door x={1140} floor={floor} open={0} />
        <WallClock x={1140} y={360} r={78} minute={spin * 360} hour={300 + spin * 30} />
        <Human x={990} y={floor} pose={{ ...POSES.workKneel, armF: [70 + work, 25], armB: [55 - work, 40] }} face="strain" cap scale={1.4} sweat={prog(t, 8.6, 0.5)} t={t} />
      </Layer>
      <At t={t} at={6.15} x={560} y={260}>
        <Tag size={24}>Year 1</Tag>
      </At>
      <At t={t} at={9.6} x={1140} y={490}>
        <Caps size={26} color={WHITE} weight={600}>
          1 hour
        </Caps>
      </At>
    </Shot>
  );
};

/* 4 · "He struggled, he sweated, and sometimes he even broke the lock." (10.05 – 14.35) */

export const Struggle: React.FC = () => {
  const t = useTime();
  const jiggle = Math.sin(t * 22) * 9 * (1 - prog(t, 11.0, 0.2));
  const brk = prog(t, 13.35, 0.7, fastOut);
  const cam = camPath([
    { t: 10.05, x: 560, y: 540, z: 1.25 },
    { t: 11.0, x: 560, y: 540, z: 1.3, ease: (x) => x },
    { t: 11.25, x: 1420, y: 470, z: 1.55 },
    { t: 12.2, x: 1420, y: 470, z: 1.6, ease: (x) => x },
    { t: 12.45, x: 560, y: 540, z: 1.25 },
    { t: 14.6, x: 560, y: 540, z: 1.32, ease: (x) => x },
  ]);
  return (
    <Shot id="struggle" from={10.05} to={14.35} inDir="zoom" outDir="R" cam={cam} light={{ x: 560, y: 520, r: 500, ...SOFT }}>
      <Layer>
        {/* door surface */}
        <rect x={250} y={60} width={620} height={980} rx={10} fill="rgba(255,255,255,0.03)" stroke={MID} strokeWidth={3} />
        {brk === 0 ? (
          <g>
            <LockPlate x={560} y={560} s={1.25} />
            {/* pick + tension wrench */}
            <g transform={`translate(560, 485) rotate(${jiggle})`} stroke={WHITE} strokeWidth={7} strokeLinecap="round" fill="none">
              <path d="M0 0 L190 26 L230 70" />
              <path d="M-4 10 L170 70 L172 120" stroke="#cfcfcf" />
            </g>
          </g>
        ) : (
          <g>
            {/* the plate splits in two along a jagged crack */}
            {[
              { dx: -1, r: -14, clip: "M-120 -230 H8 L-14 -120 L16 -20 L-12 80 L10 230 H-120 Z" },
              { dx: 1, r: 16, clip: "M120 -230 H8 L-14 -120 L16 -20 L-12 80 L10 230 H120 Z" },
            ].map((pc, i) => (
              <g key={i} transform={`translate(${560 + pc.dx * 120 * brk}, ${560 + 80 * brk * brk}) rotate(${pc.r * brk})`}>
                <clipPath id={`pc${i}`}>
                  <path d={pc.clip} />
                </clipPath>
                <g clipPath={`url(#pc${i})`}>
                  <LockPlate x={0} y={0} s={1.25} />
                </g>
              </g>
            ))}
            {/* spring flying out */}
            <path
              d="M0 0 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10"
              transform={`translate(${560 + 260 * brk}, ${470 - 220 * brk}) rotate(${brk * 220})`}
              stroke={WHITE}
              strokeWidth={5}
              fill="none"
              strokeLinejoin="round"
            />
          </g>
        )}
        {/* face close-up of the struggling apprentice */}
        <Human x={1400} y={760} pose={POSES.wipeBrow} face="strain" cap scale={2.6} sweat={1} t={t} />
      </Layer>
      <At t={t} at={13.4} x={560} y={180}>
        <Tag size={26}>Broken</Tag>
      </At>
    </Shot>
  );
};

/* 5 · "And his customers were happy to pay, and they often gave him a tip." (14.35 – 18.05) */

export const HappyTip: React.FC = () => {
  const t = useTime();
  const floor = 860;
  const heart = prog(t, 15.5, 0.35, fastOut);
  const cam = camPath([
    { t: 14.35, x: 980, y: 640, z: 1.25 },
    { t: 18.3, x: 980, y: 630, z: 1.33, ease: (x) => x },
  ]);
  return (
    <Shot id="happy" from={14.35} to={18.05} inDir="R" outDir="U" cam={cam} light={{ x: 1000, y: 560, r: 640, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={260} x2={1660} />
        <Door x={1420} floor={floor} open={1} warm={0.35} />
        <Human x={720} y={floor} pose={POSES.carry} face="happy" cap bag scale={1.5} />
        <Human x={1160} y={floor} pose={poseAt(t, [[0, POSES.stand], [15.75, POSES.give]])} face="happy" hair dir={-1} scale={1.5} hold={t > 15.9 && t < 17.2 ? "coin" : undefined} />
        {/* heart */}
        <g transform={`translate(1160, ${470 - heart * 30}) scale(${heart})`} opacity={heart}>
          <path d="M0 18 C-40 -10 -28 -44 0 -24 C28 -44 40 -10 0 18 Z" fill={WHITE} />
        </g>
        {/* cash then tip */}
        <Toss t={t} at={16.05} dur={0.45} a={[1050, 690]} b={[800, 700]} h={60} r={20} />
        <Toss t={t} at={17.2} dur={0.7} a={[1050, 690]} b={[680, 800]} h={200} r={18} />
      </Layer>
      <At t={t} at={17.75} x={680} y={560}>
        <Tag size={26}>+ Tip</Tag>
      </At>
    </Shot>
  );
};

/* 6 · "But years later, he could open the same door in a few seconds." (18.05 – 22.05) */

export const YearsLater: React.FC = () => {
  const t = useTime();
  const keys = Math.round(lerp(t, [18.4, 19.25], [1, 13], (x) => x));
  const doors = Math.round(lerp(t, [18.4, 19.3], [1, 2000], (x) => x * x));
  const floor = 1000 + 380;
  const flick = prog(t, 21.2, 0.2, fastOut);
  const cam = camPath([
    { t: 18.05, x: 960, y: 470, z: 1.2 },
    { t: 19.15, x: 960, y: 470, z: 1.28, ease: (x) => x },
    { t: 19.55, x: 960, y: floor - 220, z: 1.15 },
    { t: 22.3, x: 960, y: floor - 210, z: 1.2, ease: (x) => x },
  ]);
  return (
    <Shot id="years" from={18.05} to={22.05} inDir="U" outDir="L" cam={cam} light={{ x: 960, y: t < 19.4 ? 470 : floor - 220, r: 560, ...SOFT }}>
      <Layer>
        <KeyRing x={960} y={380} n={keys} r={90} swing={Math.sin(t * 3) * 6} />
        <Floor y={floor} x1={360} x2={1600} />
        <Door x={1100} floor={floor} open={flick} warm={flick * 0.35} />
        <Human x={930} y={floor} pose={POSES.workStand} face="smug" cap hold="key" scale={1.4} />
        {flick > 0 && flick < 1
          ? [0, 1, 2].map((k) => <line key={k} x1={1010} x2={1060} y1={floor - 240 + k * 22} y2={floor - 250 + k * 22} stroke={WHITE} strokeWidth={4} strokeLinecap="round" />)
          : null}
      </Layer>
      <At t={t} at={18.7} x={960} y={250}>
        <Tag size={24}>Year 10</Tag>
      </At>
      <At t={t} at={18.6} x={1330} y={380}>
        <div style={{ textAlign: "center" }}>
          <Num size={60}>{doors.toLocaleString("en-US")}</Num>
          <Caps size={18}>Doors opened</Caps>
        </div>
      </At>
      <At t={t} at={21.35} x={1100} y={floor - 400}>
        <Caps size={28} color={WHITE} weight={600}>
          2 seconds
        </Caps>
      </At>
    </Shot>
  );
};

/* 7 · "Same result, better service." (22.05 – 24.05) */

export const SameResult: React.FC = () => {
  const t = useTime();
  const floor = 820;
  const cam = camPath([
    { t: 22.05, x: 960, y: 600, z: 1.1 },
    { t: 24.3, x: 960, y: 590, z: 1.18, ease: (x) => x },
  ]);
  return (
    <Shot id="same" from={22.05} to={24.05} inDir="L" outDir="R" cam={cam} light={{ x: 960, y: 600, r: 600, ...SOFT }}>
      <Layer>
        <Floor y={floor} x1={420} x2={1500} />
        <Door x={680} floor={floor} open={1} warm={0.35} />
        <Door x={1240} floor={floor} open={1} warm={0.35} />
        <text x={960} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={110} fill={WHITE} opacity={prog(t, 22.45, 0.3)}>
          =
        </text>
      </Layer>
      <At t={t} at={22.2} x={680} y={880}>
        <Caps size={24}>1 hour</Caps>
      </At>
      <At t={t} at={22.3} x={1240} y={880}>
        <Caps size={24}>2 seconds</Caps>
      </At>
      <At t={t} at={23.1} x={1240} y={420}>
        <Tag size={24}>★ Better</Tag>
      </At>
    </Shot>
  );
};

/* 8 · "And suddenly, people started complaining about the price." (24.05 – 27.32) */

export const Complain: React.FC = () => {
  const t = useTime();
  const len = lerp(t, [24.2, 25.1], [0, 470], (x) => x);
  const angry = prog(t, 25.6, 0.35);
  const cam = camPath([
    { t: 24.05, x: 960, y: 560, z: 1.08 },
    { t: 27.5, x: 980, y: 550, z: 1.16, ease: (x) => x },
  ]);
  return (
    <Shot id="complain" from={24.05} to={27.32} inDir="R" outDir="U" cam={cam} light={{ x: 900, y: 520, r: 600, ...SOFT }}>
      <Layer>
        <Floor y={880} x1={420} x2={1640} />
        {/* printer */}
        <rect x={600} y={170} width={320} height={80} rx={14} fill={INK} stroke={WHITE} strokeWidth={4} />
        <rect x={630} y={236} width={260} height={10} rx={4} fill={MID} />
        <Receipt x={760} y={246} len={len} circle={prog(t, 26.8, 0.4)} />
        <Human
          x={1280}
          y={880}
          pose={mixPose(POSES.stand, POSES.complain, angry)}
          face={angry > 0.5 ? "angry" : "surprised"}
          hair
          dir={-1}
          scale={1.6}
        />
        {angry > 0 ? (
          <g opacity={angry} transform={`translate(1290, ${470 - angry * 20})`}>
            <Bubble x={0} y={0} w={170} h={90} tail="left">
              <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={WHITE}>
                #!?
              </text>
            </Bubble>
          </g>
        ) : null}
      </Layer>
    </Shot>
  );
};

/* 9 · "Some refused to tip at all." (27.32 – 29.12) */

export const NoTip: React.FC = () => {
  const t = useTime();
  const back = prog(t, 28.1, 0.4, fastOut);
  const cam = camPath([
    { t: 27.32, x: 960, y: 600, z: 1.15 },
    { t: 29.4, x: 940, y: 600, z: 1.24, ease: (x) => x },
  ]);
  const coinX = 900 + 260 * back;
  const coinY = 420 + 160 * back;
  return (
    <Shot id="notip" from={27.32} to={29.12} inDir="U" outDir="zoom" cam={cam} light={{ x: 900, y: 560, r: 520, ...SOFT }}>
      <Layer>
        <line x1={520} x2={1500} y1={720} y2={720} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
        <Jar x={900} y={716} label="TIPS" />
        <Human x={1230} y={980} pose={poseAt(t, [[0, POSES.reach], [28.2, POSES.armsCrossed]])} face={back > 0.5 ? "smug" : "neutral"} hair dir={-1} scale={1.7} />
        {back < 0.95 ? <CoinG x={coinX} y={coinY} r={20} /> : null}
        {back > 0.6 ? (
          <g stroke={WHITE} strokeWidth={8} strokeLinecap="round" opacity={prog(t, 28.5, 0.25)}>
            <path d="M870 470 l60 60 M930 470 l-60 60" />
          </g>
        ) : null}
      </Layer>
    </Shot>
  );
};
