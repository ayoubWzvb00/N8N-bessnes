import React from "react";
import { interpolate } from "remotion";
import { lerp, prog, useTime } from "../lib/anim";
import { FONT, WHITE } from "../lib/ui";
import { At, camPath, Caps, fastOut, Layer, Num, Shot, Stroke, Tag } from "../video01b/kit";
import { Human, POSES } from "./Human";
import { CoinG, Door, Floor, Hourglass, INK, KeyRing, MID, PriceTag } from "./props";

const SOFT = { a: 0.05 };
export const VIDEO02_END = 68.7;

/* 10 · "Here's what most people don't understand." (29.12 – 31.32) — through the keyhole */

export const Keyhole: React.FC = () => {
  const t = useTime();
  const cam = camPath([
    { t: 29.12, x: 960, y: 560, z: 1.0 },
    { t: 30.4, x: 960, y: 560, z: 1.15, ease: (x) => x },
    { t: 31.32, x: 960, y: 600, z: 2.2, ease: (x) => x * x },
  ]);
  const light = prog(t, 30.2, 0.8);
  return (
    <Shot id="keyhole" from={29.12} to={31.32} inDir="zoom" outDir="zoom" cam={cam} grid={false}>
      <Layer>
        <rect x={0} y={0} width={1920} height={1080} fill="#050505" />
        <rect x={560} y={-40} width={800} height={1160} rx={12} fill="#0b0b0b" stroke={MID} strokeWidth={3} />
        <g transform="translate(960, 560)">
          <circle r={180} fill={INK} stroke={WHITE} strokeWidth={6} />
          <path d="M-46 -40 a62 62 0 1 1 92 0 L80 120 H-80 Z" fill={`rgba(255,255,255,${0.08 + light * 0.75})`} stroke={WHITE} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </Layer>
      <At t={t} at={29.6} x={960} y={250}>
        <Caps size={26} color={WHITE}>
          What most people miss
        </Caps>
      </At>
    </Shot>
  );
};

/* 11 + 12 · "Customers rarely pay for the result itself. They pay for the effort they can see." (31.32 – 36.28) */

const Item: React.FC<{ x: number; y: number; label: string; icon: React.ReactNode }> = ({ x, y, label, icon }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-95} y={-130} width={190} height={150} rx={18} fill={INK} stroke={WHITE} strokeWidth={4} />
    <g transform="translate(0, -58)">{icon}</g>
    <text y={58} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} letterSpacing="0.18em" fill={WHITE}>
      {label}
    </text>
  </g>
);

export const Register: React.FC = () => {
  const t = useTime();
  const i1 = prog(t, 32.1, 0.6, fastOut);
  const i2 = prog(t, 34.3, 0.6, fastOut);
  const out1 = prog(t, 34.2, 0.4);
  const val = t < 35.05 ? 0 : interpolate(t, [35.05, 35.6], [0, 100], { extrapolateRight: "clamp" });
  const drawer = prog(t, 35.6, 0.25, fastOut) * (1 - prog(t, 36.0, 0.3));
  const beep = (a: number) => (t > a && t < a + 0.25 ? 1 : 0);
  const cam = camPath([
    { t: 31.32, x: 1000, y: 580, z: 1.2 },
    { t: 36.5, x: 1000, y: 570, z: 1.3, ease: (x) => x },
  ]);
  return (
    <Shot id="register" from={31.32} to={36.28} inDir="zoom" outDir="L" cam={cam} light={{ x: 1150, y: 450, r: 600, ...SOFT }}>
      <Layer>
        {/* counter + scanner */}
        <line x1={300} x2={1700} y1={760} y2={760} stroke={WHITE} strokeWidth={5} />
        <rect x={720} y={700} width={200} height={60} rx={10} fill={INK} stroke={WHITE} strokeWidth={4} />
        <line x1={740} x2={900} y1={712} y2={712} stroke={WHITE} strokeWidth={6} opacity={0.4 + 0.6 * Math.max(beep(32.6), beep(34.8))} />
        {/* register */}
        <g>
          <path d="M1040 760 L1080 520 H1440 L1480 760 Z" fill={INK} stroke={WHITE} strokeWidth={5} strokeLinejoin="round" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={1120 + (i % 3) * 70} y={570 + Math.floor(i / 3) * 52} width={56} height={38} rx={8} fill="none" stroke={MID} strokeWidth={3} />
          ))}
          <rect x={1130} y={370} width={260} height={120} rx={14} fill={INK} stroke={WHITE} strokeWidth={5} />
          <line x1={1260} x2={1260} y1={490} y2={520} stroke={WHITE} strokeWidth={6} />
          <text x={1260} y={452} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill={WHITE}>
            ${val.toFixed(2)}
          </text>
          <rect x={1060} y={760 + drawer * 40} width={400} height={48} rx={6} fill={INK} stroke={WHITE} strokeWidth={4} />
        </g>
        {/* items sliding onto the scanner */}
        {i1 > 0 && out1 < 1 ? (
          <g opacity={1 - out1} transform={`translate(${-200 * out1}, 0)`}>
            <Item
              x={300 + 520 * i1}
              y={680}
              label="RESULT"
              icon={
                <g stroke={WHITE} strokeWidth={4} fill="none">
                  <rect x={-24} y={-34} width={48} height={68} rx={3} />
                  <path d="M-24 -34 L8 -26 V42 L-24 34" fill={WHITE} />
                </g>
              }
            />
          </g>
        ) : null}
        {i2 > 0 ? (
          <Item
            x={300 + 520 * i2}
            y={680}
            label="EFFORT"
            icon={<path d="M0 -38 Q26 0 20 18 A20 20 0 0 1 -20 18 Q-26 0 0 -38 Z" fill={WHITE} />}
          />
        ) : null}
      </Layer>
      {/* an eye that "sees" the effort */}
      <At t={t} at={35.7} x={820} y={420}>
        <svg width={160} height={100} viewBox="-80 -50 160 100" style={{ overflow: "visible" }}>
          <path d="M-70 0 Q0 -60 70 0 Q0 60 -70 0 Z" fill="none" stroke={WHITE} strokeWidth={5} />
          <circle r={20} fill={WHITE} />
        </svg>
      </At>
      <At t={t} at={35.6} x={1560} y={360}>
        <Num size={44}>KA-CHING</Num>
      </At>
    </Shot>
  );
};

/* 13 · "And the better you get, the less effort they see." (36.28 – 38.95) */

export const BlurHands: React.FC = () => {
  const t = useTime();
  const speed = 10 + 40 * prog(t, 36.7, 1.2);
  const blind = prog(t, 37.8, 0.35);
  const cam = camPath([
    { t: 36.28, x: 1060, y: 600, z: 1.2 },
    { t: 39.2, x: 1080, y: 590, z: 1.3, ease: (x) => x },
  ]);
  const ghosts = [0, 1, 2, 3, 4];
  return (
    <Shot id="blur" from={36.28} to={38.95} inDir="L" outDir="U" cam={cam} light={{ x: 760, y: 560, r: 520, ...SOFT }}>
      <Layer>
        <Door x={980} floor={880} open={0} />
        {ghosts.map((g) => {
          const ph = t * speed - g * 0.18;
          return (
            <g key={g} opacity={g === 0 ? 1 : 0.25 * (1 - g / 5) * prog(t, 36.8, 0.5)}>
              <Human x={760} y={880} pose={{ ...POSES.workStand, armF: [75 + Math.sin(ph) * 22, 10], armB: [60 + Math.cos(ph) * 18, 25] }} face="smug" cap scale={1.5} glowK={0} />
            </g>
          );
        })}
        {/* the viewer's eye */}
        <g transform="translate(1450, 380)">
          <path d="M-110 0 Q0 -90 110 0 Q0 90 -110 0 Z" fill={INK} stroke={WHITE} strokeWidth={6} />
          <circle r={34 * (1 - blind)} fill={WHITE} />
          <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={84} fill={WHITE} opacity={blind}>
            ?
          </text>
        </g>
      </Layer>
      <At t={t} at={36.8} x={760} y={440}>
        <Tag size={22}>Skill ↑</Tag>
      </At>
      <At t={t} at={37.9} x={1450} y={540}>
        <Caps size={22} color={WHITE}>
          Effort seen ↓
        </Caps>
      </At>
    </Shot>
  );
};

/* 14 · "That's the trap of being good at something." (38.95 – 41.28) */

export const Trap: React.FC = () => {
  const t = useTime();
  const reach = prog(t, 39.2, 0.5, fastOut);
  const snap = prog(t, 39.85, 0.12, (x) => x * x);
  const shake = snap > 0 && snap < 1 ? 0 : Math.sin(t * 60) * 3 * (1 - prog(t, 40.0, 0.3)) * (t > 39.97 ? 1 : 0);
  const ang = -170 + 170 * snap;
  const cam = camPath([
    { t: 38.95, x: 960, y: 600, z: 1.1 },
    { t: 39.8, x: 960, y: 610, z: 1.2, ease: (x) => x },
    { t: 40.0, x: 960, y: 610, z: 1.27 },
    { t: 41.5, x: 960, y: 610, z: 1.3, ease: (x) => x },
  ]);
  return (
    <Shot id="trap" from={38.95} to={41.28} inDir="U" outDir="R" cam={(tt) => ({ ...cam(tt), x: cam(tt).x + shake })} light={{ x: 960, y: 620, r: 520, ...SOFT }}>
      <Layer>
        <line x1={420} x2={1500} y1={760} y2={760} stroke={MID} strokeWidth={3} />
        {/* trap base */}
        <rect x={640} y={700} width={640} height={60} rx={10} fill={INK} stroke={WHITE} strokeWidth={5} />
        <circle cx={860} cy={700} r={12} fill={WHITE} />
        {/* snapping bar (hinged at 860,700) */}
        <g transform={`rotate(${ang}, 860, 700)`}>
          <path d="M860 700 H1180 V680" stroke={WHITE} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* bait: gold medal */}
        <g transform="translate(1060, 640)">
          <path d="M-20 -70 L0 -30 L20 -70" stroke={WHITE} strokeWidth={6} fill="none" />
          <circle r={36} fill={WHITE} />
          <circle r={24} fill="none" stroke={INK} strokeWidth={3} />
          <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={INK}>
            1
          </text>
        </g>
        {/* the expert's hand reaching for it */}
        <path d={`M1700 ${520} Q${1500 - 260 * reach} ${560} ${1420 - 300 * reach} ${630}`} stroke={WHITE} strokeWidth={22} fill="none" strokeLinecap="round" />
        <circle cx={1420 - 300 * reach} cy={630} r={20} fill={WHITE} />
        <path d={`M1700 ${505} v30`} stroke={INK} strokeWidth={6} />
        {snap >= 1 ? (
          <g stroke={WHITE} strokeWidth={5} strokeLinecap="round" opacity={1 - prog(t, 40.1, 0.4)}>
            <path d="M1000 600 l-30 -40 M1060 580 v-50 M1120 600 l30 -40" />
          </g>
        ) : null}
      </Layer>
      <At t={t} at={39.5} x={1060} y={830}>
        <Caps size={24} color={WHITE}>
          Being good
        </Caps>
      </At>
      <At t={t} at={39.95} x={960} y={330}>
        <Tag size={30}>The trap</Tag>
      </At>
    </Shot>
  );
};

/* 15 · "Your skill starts to look easy, and your speed starts to look like overcharging." (41.28 – 46.05) */

export const LooksEasy: React.FC = () => {
  const t = useTime();
  const open = prog(t, 41.6, 0.7, fastOut);
  const calc = prog(t, 44.9, 0.4, fastOut);
  const cam = camPath([
    { t: 41.28, x: 760, y: 560, z: 1.1 },
    { t: 43.1, x: 760, y: 560, z: 1.15, ease: (x) => x },
    { t: 43.45, x: 1380, y: 540, z: 1.15 },
    { t: 46.3, x: 1380, y: 540, z: 1.2, ease: (x) => x },
  ]);
  const pile = Array.from({ length: 34 }, (_, i) => ({ x: 560 + ((i * 47) % 400), y: 840 - Math.floor(i / 9) * 40 - ((i * 13) % 20), r: (i * 37) % 60 - 30 }));
  return (
    <Shot id="easy" from={41.28} to={46.05} inDir="R" outDir="L" cam={cam} light={{ x: t < 43.3 ? 760 : 1380, y: 540, r: 560, ...SOFT }}>
      <Layer>
        {/* stage */}
        <line x1={440} x2={1080} y1={880} y2={880} stroke={WHITE} strokeWidth={5} />
        <path d="M440 200 H1080" stroke={WHITE} strokeWidth={8} strokeLinecap="round" />
        {/* backstage: ten years of broken locks */}
        <g opacity={open}>
          {pile.map((p, i) => (
            <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.r})`} stroke={MID} strokeWidth={3} fill={INK}>
              <rect x={-18} y={-12} width={36} height={30} rx={5} />
              <path d="M-10 -12 v-10 a10 10 0 0 1 20 0" fill="none" />
            </g>
          ))}
          <text x={760} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={60} fill={WHITE}>
            10 YEARS
          </text>
          <text x={760} y={480} textAnchor="middle" fontFamily={FONT} fontSize={22} letterSpacing="0.3em" fill="#bdbdbd">
            OF PRACTICE
          </text>
        </g>
        {/* curtains */}
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={s < 0 ? `M450 200 H${760 - 300 * open} Q${740 - 300 * open} 540 ${770 - 300 * open} 880 H450 Z` : `M1070 200 H${760 + 300 * open} Q${780 + 300 * open} 540 ${750 + 300 * open} 880 H1070 Z`}
            fill="#141414"
            stroke={WHITE}
            strokeWidth={4}
          />
        ))}
        {/* calculator */}
        <g transform="translate(1380, 560)">
          <rect x={-170} y={-260} width={340} height={480} rx={26} fill={INK} stroke={WHITE} strokeWidth={5} />
          <rect x={-140} y={-230} width={280} height={130} rx={12} fill="none" stroke={WHITE} strokeWidth={4} />
          <text x={120} y={-185} textAnchor="end" fontFamily={FONT} fontSize={30} fill="#bdbdbd" opacity={prog(t, 43.7, 0.3)}>
            $100 ÷ 2 sec
          </text>
          <text x={120} y={-122} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={40} fill={WHITE} opacity={calc}>
            $3,000/min
          </text>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-140 + (i % 3) * 96} y={-70 + Math.floor(i / 3) * 70} width={84} height={56} rx={10} fill="none" stroke={MID} strokeWidth={3} />
          ))}
        </g>
        <Human x={1700} y={900} pose={calc > 0.5 ? POSES.surprised : POSES.stand} face={calc > 0.5 ? "surprised" : "neutral"} hair dir={-1} scale={1.3} />
      </Layer>
      <At t={t} at={42.75} x={760} y={150} opacity={1 - prog(t, 43.2, 0.3)}>
        <Caps size={26} color={WHITE}>
          They only see 2 seconds
        </Caps>
      </At>
    </Shot>
  );
};

/* 16 · "This is why so many experts feel underpaid, even when they're the best at what they do." (46.05 – 50.95) */

export const Podium: React.FC = () => {
  const t = useTime();
  const coin = prog(t, 47.9, 0.7);
  const shine = prog(t, 49.8, 0.4);
  const cam = camPath([
    { t: 46.05, x: 960, y: 640, z: 1.25 },
    { t: 51.2, x: 960, y: 620, z: 1.35, ease: (x) => x },
  ]);
  return (
    <Shot id="podium" from={46.05} to={50.95} inDir="L" outDir="U" cam={cam} light={{ x: 960, y: 480, r: 560, a: 0.05 + shine * 0.04 }}>
      <Layer>
        <line x1={420} x2={1500} y1={900} y2={900} stroke={WHITE} strokeWidth={4} />
        {[
          { x: 700, h: 120, n: "2" },
          { x: 960, h: 200, n: "1" },
          { x: 1220, h: 80, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <rect x={p.x - 120} y={900 - p.h} width={240} height={p.h} fill={INK} stroke={WHITE} strokeWidth={4} />
            <text x={p.x} y={900 - p.h / 2 + 20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill={WHITE}>
              {p.n}
            </text>
          </g>
        ))}
        <Human x={700} y={780} pose={POSES.stand} face="neutral" scale={1.1} dim={0.6} glowK={0} />
        <Human x={1220} y={820} pose={POSES.stand} face="neutral" scale={1.1} dim={0.6} glowK={0} />
        <Human x={960} y={700} pose={t > 48.3 ? POSES.sad : POSES.proud} face={t > 48.3 ? "strain" : "smug"} cap scale={1.35} />
        {/* gold medal */}
        <g transform="translate(975, 560)">
          <circle r={18} fill={WHITE} stroke={INK} strokeWidth={3} />
          {shine > 0 ? <path d="M30 -30 l10 -10 M36 0 h14 M30 30 l10 10" stroke={WHITE} strokeWidth={4} strokeLinecap="round" opacity={shine} /> : null}
        </g>
        {/* a tiny coin handed over */}
        {coin > 0 ? <CoinG x={1400 - 360 * coin} y={560 - Math.sin(Math.PI * coin) * 60} r={9} /> : null}
      </Layer>
      <At t={t} at={48.05} x={1360} y={420}>
        <Tag size={24}>Underpaid</Tag>
      </At>
      <At t={t} at={49.8} x={960} y={220}>
        <Caps size={28} color={WHITE} weight={600}>
          The best
        </Caps>
      </At>
    </Shot>
  );
};

/* 17 · "Of course, getting faster isn't the problem." (50.95 – 53.38) */

export const FastShoe: React.FC = () => {
  const t = useTime();
  const flap = Math.sin(t * 18) * 18;
  const cam = camPath([
    { t: 50.95, x: 960, y: 540, z: 1.1 },
    { t: 53.6, x: 960, y: 540, z: 1.2, ease: (x) => x },
  ]);
  return (
    <Shot id="shoe" from={50.95} to={53.38} inDir="U" outDir="L" cam={cam} light={{ x: 920, y: 540, r: 500, ...SOFT }}>
      <Layer>
        {[0, 1, 2, 3].map((k) => {
          const ph = (t * 2.4 + k * 0.25) % 1;
          return <line key={k} x1={560 - ph * 200} x2={700 - ph * 200} y1={500 + k * 40} y2={500 + k * 40} stroke={WHITE} strokeWidth={4} strokeLinecap="round" opacity={1 - ph} />;
        })}
        <g transform={`translate(960, ${560 + Math.sin(t * 6) * 10})`} stroke={WHITE} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
          {/* wing */}
          <g transform={`rotate(${-20 + flap}, -40, -60)`}>
            <path d="M-40 -60 Q-120 -170 -10 -190 Q-30 -150 20 -150 Q0 -110 40 -100 Q0 -80 -40 -60 Z" fill={INK} />
          </g>
          {/* sneaker */}
          <path d="M-170 40 Q-170 -10 -120 -20 L-60 -70 Q-20 -90 10 -60 L40 -30 Q130 -20 170 20 Q180 50 150 60 H-150 Q-170 60 -170 40 Z" fill={INK} />
          <path d="M-170 46 H170" strokeWidth={10} />
          <path d="M-30 -50 l30 20 M-50 -30 l30 20" strokeWidth={4} />
        </g>
      </Layer>
      <At t={t} at={52.3} x={1230} y={420} g={0.4}>
        <svg width={110} height={110} viewBox="-55 -55 110 110">
          <circle r={48} fill="none" stroke={WHITE} strokeWidth={5} />
          <path d="M-22 2 L-6 18 L24 -16" fill="none" stroke={WHITE} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </At>
      <At t={t} at={51.7} x={960} y={250}>
        <Caps size={28} color={WHITE} weight={600}>
          Faster is fine
        </Caps>
      </At>
    </Shot>
  );
};

/* 18 · "The problem is selling your time instead of what it gives people." (53.38 – 57.1) */

export const TagSwap: React.FC = () => {
  const t = useTime();
  const strike = prog(t, 55.25, 0.35);
  const fly = prog(t, 55.75, 0.7, fastOut);
  const tx = 700 + (1300 - 700) * fly;
  const ty = 380 - Math.sin(Math.PI * fly) * 160 + (420 - 380) * fly;
  const cam = camPath([
    { t: 53.38, x: 880, y: 540, z: 1.05 },
    { t: 55.6, x: 900, y: 540, z: 1.08, ease: (x) => x },
    { t: 56.4, x: 1080, y: 540, z: 1.12 },
    { t: 57.4, x: 1090, y: 540, z: 1.14, ease: (x) => x },
  ]);
  return (
    <Shot id="tagswap" from={53.38} to={57.1} inDir="L" outDir="R" cam={cam} light={{ x: tx, y: 520, r: 600, ...SOFT }}>
      <Layer>
        <Hourglass x={700} y={600} t={t} />
        <Floor y={820} x1={1100} x2={1520} />
        <Door x={1300} floor={820} open={1} warm={0.5} />
        {fly < 0.05 ? <line x1={700} y1={450} x2={700} y2={410} stroke={WHITE} strokeWidth={3} /> : null}
        <PriceTag x={tx} y={ty} text={fly > 0.5 ? "WHAT IT GIVES" : "$ / HOUR"} size={34} rot={-6 + fly * 6} strike={fly > 0.5 ? 0 : strike} />
      </Layer>
      <At t={t} at={53.7} x={880} y={170}>
        <Tag size={24}>The problem</Tag>
      </At>
    </Shot>
  );
};

/* 19 + 20 · "Because the door was never worth an hour of struggle. It was worth getting back inside your home." (57.1 – 62.27) */

export const Home: React.FC = () => {
  const t = useTime();
  const floor = 860;
  const open = prog(t, 60.45, 0.6, fastOut);
  const walk = prog(t, 60.9, 1.1, (x) => x);
  const cx = 600 + 520 * walk;
  const step = Math.sin(t * 9) * 22 * (walk > 0 && walk < 1 ? 1 : 0);
  const cam = camPath([
    { t: 57.1, x: 960, y: 560, z: 1.08 },
    { t: 60.3, x: 980, y: 560, z: 1.12, ease: (x) => x },
    { t: 62.6, x: 1150, y: 600, z: 1.45, ease: (x) => x },
  ]);
  return (
    <Shot id="home" from={57.1} to={62.27} inDir="R" outDir="L" cam={cam} light={{ x: 1150, y: 600, r: 480, a: 0.05 + open * 0.12 }}>
      <Layer>
        <Floor y={floor} x1={300} x2={1700} />
        {/* home interior behind the door */}
        <g opacity={open}>
          <rect x={1080} y={560} width={140} height={300} fill="rgba(255,255,255,0.08)" />
          <path d="M1092 800 h116 v-36 a14 14 0 0 0 -14 -14 h-88 a14 14 0 0 0 -14 14 Z" fill="none" stroke={WHITE} strokeWidth={4} />
          <path d="M1190 660 l-16 30 h32 Z M1190 690 v60" stroke={WHITE} strokeWidth={4} fill="none" strokeLinejoin="round" />
          <path d="M1112 726 c0 -8 6 -8 6 -16 M1124 726 c0 -8 6 -8 6 -16" stroke={WHITE} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
        </g>
        <Door x={1150} floor={floor} open={open} warm={open * 0.6} />
        <g opacity={1 - prog(t, 58.9, 0.4) * 0.15}>
          <text x={1150} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill={WHITE} opacity={prog(t, 57.6, 0.3) * (1 - open)}>
            1 HOUR
          </text>
          <line x1={1040} x2={1040 + 220 * prog(t, 58.25, 0.35)} y1={444} y2={444} stroke={WHITE} strokeWidth={7} strokeLinecap="round" opacity={1 - open} />
        </g>
        <Human
          x={cx}
          y={floor}
          pose={{ ...POSES.stand, legF: [step, 0], legB: [-step, 0], armF: [-step * 0.6, 6], armB: [step * 0.6, 6] }}
          face={open > 0.5 ? "happy" : "neutral"}
          hair
          scale={1.4}
        />
      </Layer>
      <At t={t} at={61.4} x={1150} y={430} g={0.4}>
        <Caps size={26} color={WHITE} weight={600}>
          Home
        </Caps>
      </At>
    </Shot>
  );
};

/* 21 · "And once you understand that, you stop charging for your effort, and start charging for the difference you make." (62.27 – end) */

export const Difference: React.FC = () => {
  const t = useTime();
  const s1 = prog(t, 64.3, 0.4);
  const lit = prog(t, 66.95, 0.4);
  const cam = camPath([
    { t: 62.27, x: 1040, y: 580, z: 1.12 },
    { t: VIDEO02_END, x: 1020, y: 570, z: 1.22, ease: (x) => x },
  ]);
  return (
    <Shot id="diff" from={62.27} to={VIDEO02_END} inDir="L" last cam={cam} light={{ x: 1300, y: 460, r: 600, a: 0.05 + lit * 0.05 }}>
      <Layer>
        <Floor y={880} x1={260} x2={1700} />
        {/* price board on an easel */}
        <g stroke={WHITE} strokeLinecap="round">
          <path d="M1230 650 L1170 880 M1430 650 L1490 880" strokeWidth={5} />
          <rect x={1090} y={260} width={500} height={390} rx={16} fill={INK} strokeWidth={5} />
        </g>
        <text x={1340} y={320} textAnchor="middle" fontFamily={FONT} fontSize={22} letterSpacing="0.3em" fill="#bdbdbd">
          PRICE LIST
        </text>
        <g opacity={prog(t, 62.5, 0.3)}>
          <text x={1130} y={420} fontFamily={FONT} fontWeight={600} fontSize={34} fill={WHITE} opacity={1 - s1 * 0.6}>
            EFFORT
          </text>
          <text x={1550} y={420} textAnchor="end" fontFamily={FONT} fontWeight={600} fontSize={34} fill={WHITE} opacity={1 - s1 * 0.6}>
            $ / hour
          </text>
          <line x1={1120} x2={1120 + 440 * s1} y1={408} y2={408} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
        </g>
        <g opacity={prog(t, 65.8, 0.3)}>
          <rect x={1110} y={470} width={460} height={120} rx={12} fill={`rgba(255,255,255,${lit})`} />
          <text x={1340} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing="0.08em" fill={lit > 0.5 ? INK : WHITE}>
            THE DIFFERENCE
          </text>
          <text x={1340} y={570} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing="0.08em" fill={lit > 0.5 ? INK : WHITE}>
            YOU MAKE
          </text>
        </g>
        {/* expert + happy customer tipping (mirror of the hook) */}
        <Human x={860} y={880} pose={POSES.proud} face="smug" cap scale={1.45} />
        <KeyRing x={900} y={760} n={10} r={22} swing={Math.sin(t * 4) * 10} />
        <Human x={520} y={880} pose={t > 66.0 ? POSES.give : POSES.stand} face="happy" hair scale={1.45} hold={t > 66.0 && t < 66.7 ? "coin" : undefined} />
        {t > 66.7 && t < 67.4 ? <CoinG x={lerp(t, [66.7, 67.4], [640, 830], (x) => x)} y={700 - Math.sin(Math.PI * prog(t, 66.7, 0.7, (x) => x)) * 120} r={16} /> : null}
      </Layer>
      <At t={t} at={67.35} x={860} y={470}>
        <Tag size={24}>+ Tip</Tag>
      </At>
    </Shot>
  );
};
