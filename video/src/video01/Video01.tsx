import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { easeInOut, fmtMoney, lerp, prog, useTime } from "../lib/anim";
import { Apartment, Bag, Bills, Briefcase, Calendar, Car, Check, Cup, Lock, Person, Phone, Plane, TrendUp } from "../lib/icons";
import { Appear, Big, Brackets, DIM, FONT, GLOW, Label, Pill, Scene, WHITE } from "../lib/ui";
import { Bar, Bubble, DigitCard, DrawPath, Scale } from "../lib/widgets";
import { coinsInJar, Jar, spawnTimes } from "./Jar";

export const VIDEO01_DURATION = 77.6;

const COIN_VALUE = 900;

/* ───────────── 1 · HOOK — "The more you earn, the easier it becomes to stay broke." ───────────── */

const HOOK_SPAWNS = spawnTimes(-1.6, 3.8, 10, 9);
const HOOK_CRACK = 1.47; // "the easier"

const Counter: React.FC<{ x: number; label: string; value: number; glow?: number }> = ({ x, label, value, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: 500, transform: "translate(-50%, -50%)", textAlign: "center" }}>
    <Label size={22}>{label}</Label>
    <div
      style={{
        marginTop: 14,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 78,
        color: WHITE,
        fontVariantNumeric: "tabular-nums",
        filter: `drop-shadow(0 0 ${6 + glow * 18}px rgba(255,255,255,${0.45 + glow * 0.4}))`,
      }}
    >
      {fmtMoney(value)}
    </div>
  </div>
);

const Hook: React.FC = () => {
  const t = useTime();
  const spawned = HOOK_SPAWNS.filter((s) => s <= t).length;
  const earned = 4000 + spawned * COIN_VALUE;
  const left = coinsInJar(t, HOOK_SPAWNS, HOOK_CRACK, "hook") * COIN_VALUE;
  const punch = 1 + 0.035 * Math.sin(Math.PI * prog(t, HOOK_CRACK, 0.35));
  const broke = prog(t, 2.95, 0.4);
  return (
    <Scene from={0} to={3.85} enter={false} push={0.07} cam={() => ({ zoom: punch })} light={{ y: 580, strength: 0.08 }}>
      <Jar spawns={HOOK_SPAWNS} crackAt={HOOK_CRACK} seed="hook" />
      <Counter x={380} label="Earned" value={earned} />
      <Counter x={1540} label="Left" value={left} glow={broke} />
      <Appear at={2.95} x={1540} y={640} dur={0.35}>
        <Pill size={22}>Broke</Pill>
      </Appear>
    </Scene>
  );
};

/* ───────────── 2 · "Most people believe their money problems will disappear once they start making more." ───────────── */

const crowd = (cols: number, rows: number, cx: number, cy: number, dx: number, dy: number) =>
  Array.from({ length: cols * rows }, (_, i) => ({
    i,
    x: cx + ((i % cols) - (cols - 1) / 2) * dx,
    y: cy + (Math.floor(i / cols) - (rows - 1) / 2) * dy,
  }));

const MostPeople: React.FC = () => {
  const t = useTime();
  const people = crowd(9, 3, 960, 610, 140, 170);
  return (
    <Scene from={3.85} to={8.25}>
      <Appear at={4.0} x={960} y={250}>
        <Label size={26}>Most people</Label>
      </Appear>
      {people.map((p) => {
        const d = (p.i % 9) * 0.03 + Math.floor(p.i / 9) * 0.05;
        const problem = prog(t, 5.4 + d, 0.25) * (1 - prog(t, 6.15 + d, 0.3));
        const more = prog(t, 7.25 + d, 0.3);
        return (
          <React.Fragment key={p.i}>
            <Appear at={4.05 + d} x={p.x} y={p.y + 30}>
              <Person size={64} />
            </Appear>
            <Appear at={4.3 + d} x={p.x + 26} y={p.y - 52} glow={false}>
              <Bubble size={62}>
                <span style={{ opacity: problem, position: "absolute" }}>!</span>
                <span style={{ opacity: more, position: "absolute", fontSize: 19 }}>+$</span>
              </Bubble>
            </Appear>
          </React.Fragment>
        );
      })}
    </Scene>
  );
};

/* ───────────── 3 · "So they chase a raise, a better job, or a bigger income." ───────────── */

const GoalCard: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 26,
        border: `3px solid ${WHITE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <Label size={20}>{label}</Label>
  </div>
);

const Chase: React.FC = () => {
  const t = useTime();
  const px = lerp(t, [8.3, 12.7], [430, 560], (x) => x);
  const bob = Math.abs(Math.sin(t * 9)) * -10;
  return (
    <Scene from={8.25} to={12.75} cam={(tt) => ({ x: lerp(tt, [8.25, 12.75], [40, -60], (x) => x) })}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d="M160 760 H1780" at={8.3} dur={1.0} width={2.5} />
        </g>
        {[0, 1, 2].map((k) => {
          const phase = (t * 2.2 + k * 0.33) % 1;
          const x2 = px - 70 - phase * 140;
          return (
            <line
              key={k}
              x1={x2 - 110}
              x2={x2}
              y1={640 + k * 34}
              y2={640 + k * 34}
              stroke={WHITE}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={(1 - phase) * 0.7 * prog(t, 8.4, 0.3)}
            />
          );
        })}
      </svg>
      <Appear at={8.35} x={px} y={706 + bob}>
        <Person size={104} />
      </Appear>
      <Appear at={9.45} x={960} y={600}>
        <GoalCard icon={<TrendUp size={96} />} label="A raise" />
      </Appear>
      <Appear at={10.05} x={1260} y={600}>
        <GoalCard icon={<Briefcase size={96} />} label="Better job" />
      </Appear>
      <Appear at={11.15} x={1560} y={600}>
        <GoalCard icon={<Bills size={96} />} label="Bigger income" />
      </Appear>
    </Scene>
  );
};

/* ───────────── 4 · "But here's what most people don't understand." ───────────── */

const Miss: React.FC = () => {
  const t = useTime();
  const people = crowd(7, 2, 960, 640, 110, 130);
  const q = prog(t, 14.55, 0.5);
  return (
    <Scene from={12.75} to={15.55} push={0.06}>
      <Appear at={13.0} x={960} y={560}>
        <Brackets w={980} h={500} label="What most people miss" />
      </Appear>
      {people.map((p) => (
        <Appear key={p.i} at={13.05 + p.i * 0.02} x={p.x} y={p.y + 20} glow={false}>
          <div style={{ opacity: 0.3 }}>
            <Person size={58} />
          </div>
        </Appear>
      ))}
      <Appear at={14.5} x={960} y={445} dur={0.5}>
        <div style={{ filter: `drop-shadow(0 0 ${10 + q * 20}px rgba(255,255,255,0.7))` }}>
          <Big size={150}>?</Big>
        </div>
      </Appear>
    </Scene>
  );
};

/* ───────────── 5 · "Your income was never what made you wealthy." ───────────── */

const IncomeNotWealth: React.FC = () => (
  <Scene from={15.55} to={18.55} push={0.05}>
    <Appear at={15.95} x={960} y={400}>
      <Big tracking="0.16em">INCOME</Big>
    </Appear>
    <Appear at={16.6} x={960} y={535}>
      <Big size={90}>≠</Big>
    </Appear>
    <Appear at={17.65} x={960} y={670}>
      <Big tracking="0.16em">WEALTH</Big>
    </Appear>
  </Scene>
);

/* ───────────── 6 · "What makes you wealthy is the gap between what you earn and what you spend." ───────────── */

const Gap: React.FC = () => {
  const t = useTime();
  const base = 830;
  const earnH = 470 * prog(t, 21.35, 0.6);
  const spendH = 250 * prog(t, 22.45, 0.6);
  const gapGlow = prog(t, 22.75, 0.4);
  return (
    <Scene from={18.55} to={23.35} push={0.05}>
      <Appear at={18.75} x={960} y={190}>
        <Label size={26}>What makes you wealthy</Label>
      </Appear>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d={`M600 ${base} H1320`} at={18.9} dur={0.8} width={2.5} />
        </g>
      </svg>
      {/* outlines before they fill */}
      <Appear at={19.95} x={800} y={base - 235} glow={false}>
        <div style={{ width: 130, height: 470, border: `2px dashed ${DIM}`, borderRadius: 10 }} />
      </Appear>
      <Appear at={20.05} x={1080} y={base - 125} glow={false}>
        <div style={{ width: 130, height: 250, border: `2px dashed ${DIM}`, borderRadius: 10 }} />
      </Appear>
      <Bar x={800} base={base} width={130} height={earnH} label="Earn" />
      <Bar x={1080} base={base} width={130} height={spendH} label="Spend" />
      {/* the gap */}
      <Appear at={20.3} x={1080} y={base - 360} glow={false}>
        <div
          style={{
            width: 150,
            height: 220,
            border: `2.5px dashed ${WHITE}`,
            borderRadius: 10,
            background: `rgba(255,255,255,${0.06 + gapGlow * 0.22})`,
            boxShadow: `0 0 ${gapGlow * 50}px rgba(255,255,255,${gapGlow * 0.5})`,
          }}
        />
      </Appear>
      <Appear at={20.3} x={1300} y={base - 360}>
        <Pill>The gap</Pill>
      </Appear>
      <Appear at={22.75} x={1080} y={base - 360}>
        <Label size={22} color={"#000"} weight={700}>
          Wealth
        </Label>
      </Appear>
    </Scene>
  );
};

/* ───────────── 7 · "Imagine someone who goes from making $4,000 a month to $8,000." ───────────── */

const Imagine: React.FC = () => {
  const t = useTime();
  const income = lerp(t, [26.85, 27.4], [4000, 8000]);
  return (
    <Scene from={23.35} to={28.25} push={0.04}>
      <Appear at={23.5} x={960} y={560}>
        <Brackets w={1360} h={640} label="Imagine" />
      </Appear>
      <Appear at={23.9} x={560} y={600}>
        <Person size={150} />
      </Appear>
      <Appear at={25.3} x={1150} y={560}>
        <DigitCard title="Monthly income" value={income} size={92} />
      </Appear>
      <Appear at={27.45} x={1150} y={360} dur={0.35}>
        <Pill size={24}>2×</Pill>
      </Appear>
    </Scene>
  );
};

/* ───────────── 8 · "At first, it feels like they're finally getting ahead." ───────────── */

const AHEAD_PTS: [number, number][] = [
  [520, 790],
  [660, 740],
  [780, 750],
  [910, 650],
  [1030, 665],
  [1160, 540],
  [1270, 545],
  [1400, 400],
];

const pointAt = (pts: [number, number][], p: number): [number, number] => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let d = p * segs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const f = d / segs[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
};

const Ahead: React.FC = () => {
  const t = useTime();
  const p = prog(t, 28.5, 2.1, easeInOut);
  const [hx, hy] = pointAt(AHEAD_PTS, p);
  const d = "M" + AHEAD_PTS.map((q) => q.join(" ")).join(" L");
  return (
    <Scene from={28.25} to={31.5} push={0.05}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d="M500 300 V830 H1460" at={28.3} dur={0.6} width={2.5} opacity={0.6} />
          <path
            d={d}
            fill="none"
            stroke={WHITE}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
          {p > 0 ? <circle cx={hx} cy={hy} r={11} fill={WHITE} /> : null}
        </g>
      </svg>
      {p > 0 ? (
        <div
          style={{
            position: "absolute",
            left: hx,
            top: hy - 26,
            transform: "translate(-50%, -100%)",
            filter: GLOW,
          }}
        >
          <Person size={70} />
        </div>
      ) : null}
      <Appear at={30.7} x={1400} y={250}>
        <Pill size={22}>Getting ahead</Pill>
      </Appear>
    </Scene>
  );
};

/* ───────────── 9 · "But slowly, their life starts to upgrade. A nicer apartment. A newer car. More expensive habits that quietly become normal." ───────────── */

const IconTile: React.FC<{ icon: React.ReactNode; label: string; dim?: number }> = ({ icon, label, dim = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: 1 - dim * 0.6 }}>
    <div
      style={{
        width: 130,
        height: 130,
        borderRadius: 22,
        border: `3px solid ${WHITE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <Label size={20} style={{ width: 300 }}>
      {label}
    </Label>
  </div>
);

const Upgrade: React.FC = () => {
  const t = useTime();
  const base = 860;
  const steps: [number, number][] = [
    [31.7, 2500],
    [35.2, 4500],
    [36.5, 6200],
    [38.1, 7400],
  ];
  let spend = 0;
  for (const [at, v] of steps) {
    const prev = spend;
    spend = prev + (v - prev) * prog(t, at, 0.6);
  }
  const k = 0.058; // px per $
  const normal = prog(t, 39.2, 0.6);
  return (
    <Scene from={31.5} to={40.35} push={0.03}>
      <Appear at={33.6} x={760} y={150}>
        <Pill size={22}>Upgrade</Pill>
      </Appear>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d={`M520 ${base} H1000`} at={31.6} dur={0.6} width={2.5} />
        </g>
      </svg>
      <Bar x={640} base={base} width={130} height={8000 * k * prog(t, 31.75, 0.6)} label="Earn" value={8000} />
      <Bar x={880} base={base} width={130} height={spend * k} label="Spend" value={spend} />
      <Appear at={35.1} x={1390} y={330}>
        <IconTile icon={<Apartment size={84} />} label="Nicer apartment" dim={normal} />
      </Appear>
      <Appear at={36.4} x={1390} y={530}>
        <IconTile icon={<Car size={92} />} label="Newer car" dim={normal} />
      </Appear>
      <Appear at={38.0} x={1390} y={730}>
        <IconTile
          icon={
            <div style={{ display: "flex", gap: 4 }}>
              <Bag size={52} />
              <Cup size={52} />
            </div>
          }
          label="Expensive habits"
          dim={normal}
        />
      </Appear>
      <Appear at={39.5} x={1390} y={900}>
        <Label size={22} color={WHITE}>
          ↳ the new normal
        </Label>
      </Appear>
    </Scene>
  );
};

/* ───────────── 10 · "Years later, they're earning twice as much, but still have nothing left at the end of the month." ───────────── */

const YearsLater: React.FC = () => {
  const t = useTime();
  const base = 860;
  const k = 0.028;
  const year = Math.round(lerp(t, [40.6, 41.4], [2026, 2031]));
  const earn = lerp(t, [42.1, 42.8], [8000, 16000]);
  const spend = lerp(t, [42.4, 43.2], [7400, 16000]);
  const zero = prog(t, 43.6, 0.4);
  return (
    <Scene from={40.35} to={45.75} push={0.04}>
      <Appear at={40.5} x={470} y={470}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Calendar size={90} />
          <Label size={18}>Year</Label>
          <Big size={84}>{year}</Big>
        </div>
      </Appear>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d={`M760 ${base} H1220`} at={40.5} dur={0.6} width={2.5} />
        </g>
      </svg>
      <Bar x={880} base={base} width={130} height={earn * k * prog(t, 40.6, 0.5)} label="Earn" value={earn} />
      <Bar x={1100} base={base} width={130} height={spend * k * prog(t, 40.7, 0.5)} label="Spend" value={spend} />
      <Appear at={42.05} x={880} y={base - earn * k - 105}>
        <Pill size={18}>2×</Pill>
      </Appear>
      <Appear at={43.6} x={1530} y={520}>
        <div style={{ textAlign: "center" }}>
          <Label size={20}>Left at month end</Label>
          <div style={{ filter: `drop-shadow(0 0 ${8 + zero * 20}px rgba(255,255,255,0.7))`, marginTop: 12 }}>
            <Big size={120}>$0</Big>
          </div>
        </div>
      </Appear>
    </Scene>
  );
};

/* ───────────── 11 · "And the interesting part is that it rarely feels like a decision." ───────────── */

const Decision: React.FC = () => {
  const t = useTime();
  const fade = prog(t, 47.6, 0.6);
  const strike = prog(t, 48.6, 0.45);
  return (
    <Scene from={45.75} to={49.4} push={0.05}>
      <Appear at={46.0} x={960} y={540}>
        <div
          style={{
            width: 640,
            height: 300,
            borderRadius: 24,
            border: `3px ${fade > 0.5 ? "dashed" : "solid"} ${WHITE}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: 1 - fade * 0.65,
          }}
        >
          <Label size={30} color={WHITE}>
            Upgrade your life?
          </Label>
          <div style={{ display: "flex", gap: 30 }}>
            {["Yes", "No"].map((b) => (
              <div
                key={b}
                style={{ width: 170, height: 64, borderRadius: 999, border: `2.5px solid ${WHITE}`, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Label size={20} color={WHITE}>
                  {b}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </Appear>
      <Appear at={46.9} x={960} y={300}>
        <div style={{ position: "relative" }}>
          <Big size={64} tracking="0.3em">
            DECISION
          </Big>
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 5,
              width: `${strike * 104}%`,
              background: WHITE,
              borderRadius: 4,
            }}
          />
        </div>
      </Appear>
    </Scene>
  );
};

/* ───────────── 12 · "Every upgrade seems small and reasonable on its own." ───────────── */

const SMALL_ITEMS: { icon: React.ReactNode; price: string }[] = [
  { icon: <Cup size={70} />, price: "+$6" },
  { icon: <Phone size={70} />, price: "+$40" },
  { icon: <Bag size={70} />, price: "+$85" },
  { icon: <Plane size={70} />, price: "+$300" },
  { icon: <Car size={78} />, price: "+$450" },
  { icon: <Apartment size={70} />, price: "+$900" },
];

const SmallUpgrades: React.FC = () => (
  <Scene from={49.4} to={52.8} push={0.04}>
    <Appear at={50.6} x={960} y={250}>
      <Pill size={22}>Small · Reasonable</Pill>
    </Appear>
    {SMALL_ITEMS.map((it, i) => {
      const x = 960 + (i - 2.5) * 210;
      return (
        <React.Fragment key={i}>
          <Appear at={49.6 + i * 0.27} x={x} y={530}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 22,
                  border: `3px solid ${WHITE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {it.icon}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: WHITE }}>{it.price}</div>
            </div>
          </Appear>
          <Appear at={51.2 + i * 0.07} x={x} y={740}>
            <Check size={54} stroke={3} />
          </Appear>
        </React.Fragment>
      );
    })}
  </Scene>
);

/* ───────────── 13 · "But together, they turn every raise into a bigger lifestyle instead of more freedom." ───────────── */

const Together: React.FC = () => {
  const t = useTime();
  const tilt = lerp(t, [54.3, 56.3], [0, 13]);
  const blocks = [0, 1, 2, 3, 4, 5].map((i) => prog(t, 53.15 + i * 0.12, 0.4));
  const leftStack = (
    <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 6 }}>
      {blocks.map((p, i) => (
        <div
          key={i}
          style={{
            width: 120 - (i % 2) * 14,
            height: 30,
            borderRadius: 7,
            background: WHITE,
            opacity: p,
            transform: `translateY(${(1 - p) * -60}px)`,
            boxShadow: "0 0 14px rgba(255,255,255,0.45)",
          }}
        />
      ))}
    </div>
  );
  const freedom = prog(t, 56.9, 0.45);
  return (
    <Scene from={52.8} to={58.15} push={0.04}>
      <Appear at={52.95} x={960} y={540} glow={false}>
        <div style={{ width: 1920, height: 1080, position: "relative" }}>
          <Scale
            x={960}
            y={380}
            tilt={tilt}
            left={leftStack}
            right={<div style={{ opacity: freedom, filter: GLOW }}><Lock open size={78} /></div>}
            leftLabel={t > 55.9 ? "Lifestyle" : ""}
            rightLabel={t > 57.3 ? "Freedom" : ""}
          />
        </div>
      </Appear>
      <Appear at={54.7} x={960} y={250}>
        <Pill size={20}>Every raise</Pill>
      </Appear>
    </Scene>
  );
};

/* ───────────── 14 · "This is why so many people with high salaries still live paycheck to paycheck." ───────────── */

const SALARIES = ["$120K", "$185K", "$95K", "$250K", "$140K", "$210K", "$160K"];

const Paycheck: React.FC = () => {
  const t = useTime();
  const loopP = prog(t, 61.3, 0.9);
  const ang = (t - 61.3) * 4.2;
  const cx = 960;
  const cy = 760;
  const r = 130;
  return (
    <Scene from={58.15} to={63.05} push={0.04}>
      {SALARIES.map((s, i) => {
        const x = 960 + (i - 3) * 170;
        return (
          <React.Fragment key={i}>
            <Appear at={59.5 + i * 0.05} x={x} y={400}>
              <Person size={84} />
            </Appear>
            <Appear at={60.15 + i * 0.06} x={x} y={300} glow={false}>
              <div
                style={{
                  border: `2px solid ${WHITE}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 22,
                  color: WHITE,
                }}
              >
                {s}
              </div>
            </Appear>
          </React.Fragment>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={WHITE}
            strokeWidth={3}
            strokeDasharray="10 12"
            pathLength={1}
            opacity={loopP}
            transform={`rotate(${-90 + loopP * 0}, ${cx}, ${cy})`}
          />
          {loopP > 0 ? (
            <circle cx={cx + r * Math.cos(ang)} cy={cy + r * Math.sin(ang)} r={13} fill={WHITE} opacity={loopP} />
          ) : null}
        </g>
      </svg>
      <Appear at={61.4} x={cx} y={cy - 20}>
        <Label size={20} color={WHITE}>
          Paycheck
        </Label>
      </Appear>
      <Appear at={61.95} x={cx} y={cy + 22}>
        <Label size={20}>to paycheck</Label>
      </Appear>
    </Scene>
  );
};

/* ───────────── 15 · "Of course, there's nothing wrong with enjoying the money you make." ───────────── */

const Enjoy: React.FC = () => (
  <Scene from={63.05} to={66.35} push={0.05} light={{ strength: 0.11 }}>
    <Appear at={63.3} x={960} y={500}>
      <Cup size={230} stroke={2.2} />
    </Appear>
    <Appear at={63.95} x={1120} y={380}>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 999,
          border: `3px solid ${WHITE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={56} stroke={3.4} />
      </div>
    </Appear>
    <Appear at={64.75} x={960} y={720}>
      <Label size={28} color={WHITE}>
        Enjoy it
      </Label>
    </Appear>
  </Scene>
);

/* ───────────── 16 · "The problem starts when your expenses grow every time your income does." ───────────── */

const stepPts = (y0: number, lag: number): [number, number][] => {
  const pts: [number, number][] = [[520, y0]];
  const xs = [640, 820, 1000, 1180, 1360];
  let y = y0;
  xs.forEach((x) => {
    pts.push([x + lag, y]);
    y -= 95;
    pts.push([x + lag + 30, y]);
  });
  pts.push([1440, y]);
  return pts;
};

const Problem: React.FC = () => {
  const t = useTime();
  const inc = stepPts(760, 0);
  const exp = stepPts(790, 40);
  const pi = prog(t, 67.4, 2.6, easeInOut);
  const pe = prog(t, 67.7, 2.6, easeInOut);
  const path = (pts: [number, number][]) => "M" + pts.map((q) => q.join(" ")).join(" L");
  return (
    <Scene from={66.35} to={70.65} push={0.04}>
      <Appear at={66.7} x={960} y={190}>
        <Pill size={22}>The problem</Pill>
      </Appear>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: GLOW }}>
          <DrawPath d="M500 280 V850 H1480" at={66.6} dur={0.6} width={2.5} opacity={0.6} />
          <path d={path(inc)} fill="none" stroke={WHITE} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pi} />
          <path
            d={path(exp)}
            fill="none"
            stroke={WHITE}
            strokeOpacity={0.55}
            strokeWidth={4}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - pe}
          />
        </g>
      </svg>
      <Appear at={69.7} x={1560} y={inc[inc.length - 1][1]}>
        <Label size={20} color={WHITE}>
          Income
        </Label>
      </Appear>
      <Appear at={70.0} x={1575} y={exp[exp.length - 1][1] + 26}>
        <Label size={20}>Expenses</Label>
      </Appear>
    </Scene>
  );
};

/* ───────────── 17 · "Because becoming wealthy isn't about how much money comes in." ───────────── */

const NotComesIn: React.FC = () => (
  <Scene from={70.65} to={74.15} push={0.05}>
    <Appear at={71.3} x={960} y={420}>
      <Big tracking="0.16em">WEALTH</Big>
    </Appear>
    <Appear at={71.6} x={960} y={545}>
      <Big size={90}>≠</Big>
    </Appear>
    <Appear at={72.6} x={960} y={660}>
      <Label size={38} color={WHITE}>
        How much comes in
      </Label>
    </Appear>
  </Scene>
);

/* ───────────── 18 · "It's about how much of it stays with you." ───────────── */

const FINAL_SPAWNS = spawnTimes(74.2, 77.0, 8, 10);

const Stays: React.FC = () => {
  const t = useTime();
  const kept = coinsInJar(t, FINAL_SPAWNS, null, "final") * COIN_VALUE;
  const glow = prog(t, 75.6, 0.6);
  return (
    <Scene from={74.15} to={VIDEO01_DURATION} push={0.06} light={{ y: 600, strength: 0.08 + glow * 0.06 }}>
      <Jar spawns={FINAL_SPAWNS} seed="final" glowAt={75.6} />
      <Counter x={1540} label="Kept" value={kept} glow={glow} />
      <Appear at={76.1} x={960} y={900}>
        <Label size={30} color={WHITE}>
          You
        </Label>
      </Appear>
    </Scene>
  );
};

export const Video01: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Hook />
    <MostPeople />
    <Chase />
    <Miss />
    <IncomeNotWealth />
    <Gap />
    <Imagine />
    <Ahead />
    <Upgrade />
    <YearsLater />
    <Decision />
    <SmallUpgrades />
    <Together />
    <Paycheck />
    <Enjoy />
    <Problem />
    <NotComesIn />
    <Stays />
    <Audio src={staticFile("mix-01.wav")} />
  </AbsoluteFill>
);
