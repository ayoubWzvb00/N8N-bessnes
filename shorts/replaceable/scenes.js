  // ================= PROJECT: "You're paid for how replaceable you are" (the reference short) =================
  // Continues the closure from shorts-kit/lib/base.js + vertical.js. All times are seconds on voice.mp3 (see words.json).
  const DUR = 68.4;

  // ================= TIMELINE (seconds on the voice track) =================
  const T = {
    sweep: [13.15, 13.85], whip1: [34.95, 35.32], dive: [44.2, 44.72], whip2: [53.45, 53.92], whip3: [61.0, 61.42],
  };
  // headlines: only the lines that carry the idea, each word lands as it is spoken
  hl(0, 1.85, 470, 124, "YOU'RE@-1 NOT@-1 PAID@-1|FOR@0.7 YOUR@0.9 TIME@1.04#g*1.15");
  hl(1.92, 4.5, 430, 100, "YOU'RE@1.92 PAID@2.14 FOR@2.42 HOW@2.62|REPLACEABLE@2.8#r*1.15|YOU@3.56 ARE@3.78");
  hl(4.7, 6.85, 430, 100, "MOST@4.7 PEOPLE@4.92 BELIEVE@5.18|TO@5.86 EARN@6.0#g MORE@6.24#g");
  hl(6.96, 8.6, 450, 116, "WORK@6.96 HARDER?@7.14#g|OR@7.54 LONGER?@7.86#g");
  hl(8.72, 10.95, 420, 104, "THE@8.96 MARKET@9.08|DOESN'T@9.36 PAY@9.74 FOR@10.0|EFFORT@10.2#r*1.3");
  hl(11.08, 13.1, 420, 104, "IT@11.08 PAYS@11.2 FOR@11.54 WHAT'S@11.8|HARD@12.1#c*1.2 TO@12.28#c*1.2|REPLACE@12.44#c*1.2");
  hl(13.64, 15.95, 420, 108, "TWO@13.96 PEOPLE@14.34|SAME@14.98#g COMPANY@15.26#g");
  hl(16.18, 18.95, 420, 100, "ONE@16.18 DOES@16.48 EXACTLY@16.7#g|WHAT@17.24 THE@17.42 JOB@17.54|DESCRIPTION@17.76 SAYS@18.1");
  hl(19.06, 22.7, 420, 104, "IF@19.06 THEY@19.22 LEFT@19.36#r|SOMEONE@20.32 NEW@20.56|BY@21.58 NEXT@21.72#r WEEK@21.9#r");
  hl(22.82, 25.05, 430, 104, "THE@22.82 OTHER@23.0|UNDERSTANDS@23.36|CUSTOMERS@24.36#p");
  hl(25.16, 27.2, 430, 104, "SOLVES@25.16 PROBLEMS@25.68#c|NOBODY@26.06 ELSE@26.6|CAN@26.92");
  hl(27.28, 31.05, 420, 104, "IF@27.28 THEY@27.96 LEFT@28.2#r|THE@28.8 COMPANY@28.92|FEELS@29.46#r IT@29.76#r");
  hl(31.24, 32.55, 450, 116, "SAME@31.84#g|HOURS@32.04#g");
  hl(32.6, 34.95, 430, 108, "ONLY@32.9 ONE@33.2|HAS@33.86|LEVERAGE@34.12#g*1.3");
  hl(35.28, 40.3, 400, 96, "EASY@35.58#r TO@35.88#r REPLACE@36.06#r|PAY@37.02 SET@37.48 BY@37.68|THE@37.84 CHEAPEST@37.96#r*1.2");
  hl(40.42, 44.2, 400, 96, "HARD@40.8#c TO@41.04#c REPLACE@41.22#c|SET@42.26 BY@42.46 WHAT@42.64|IT@42.86 WOULD@42.98 COST@43.06#g|TO@43.42 LOSE@43.64#g YOU@43.92#g");
  hl(44.74, 46.35, 430, 108, "THE@45.18 MOST@45.3|VALUABLE@45.62#g|PEOPLE@46.0");
  hl(46.42, 48.65, 430, 108, "RARELY@46.42 HAVE@46.88|JUST@47.34 ONE@47.56#r|SKILL@47.86#r");
  hl(48.76, 51.05, 420, 104, "A@48.76 DESIGNER@48.88#p|WHO@49.3 UNDERSTANDS@49.58|SALES@50.08#n*1.2");
  hl(51.14, 53.45, 420, 100, "AN@51.14 ENGINEER@51.3#c|WHO@51.62 CAN@52.04 EXPLAIN@52.18#g|IDEAS@52.56 CLEARLY@53.08");
  hl(54.06, 57.6, 420, 100, "HARD@55.1#c TO@55.48#c REPLACE@55.64#c|DOESN'T@56.0 HAPPEN@56.48|OVERNIGHT@56.78#r*1.2");
  hl(57.78, 61.0, 420, 104, "ONE@58.16 SKILL@58.5#c|ONE@59.32 SOLVED@59.48 PROBLEM@59.88#p|AT@60.32 A@60.52 TIME@60.62");
  hl(61.4, 64.5, 420, 104, "BECOMING@61.6 WEALTHY@61.96#g|ISN'T@62.44#r ABOUT@62.94|MORE@63.56 HOURS@63.8");
  hl(64.68, DUR + 1, 400, 100, "BECOME@65.02 THE@65.38 PERSON@65.62|WHOSE@66.0 HOURS@66.22 ARE@66.72|WORTH@67.06#g*1.35 MORE@67.36#g*1.35");
  const KEYS = []; HL.forEach((h) => h.lines.forEach((ln) => ln.forEach((p) => { if (p.key && p.t > 0) KEYS.push(p.t); })));

  // ================= SCENE 1: the hook -> effort -> what's hard to replace =================
  const CROWD = [-2, -1, 0, 1, 2].map((i) => [540 + i * 225, 1340]);
  function s1(x, t) {
    const c = camAt(t, [[0, 540, 1150, 1.0, 0], [1.9, 540, 1150, 1.0, 0.3], [4.6, 540, 1220, 0.95, 0.55], [8.65, 540, 1180, 1.0, 0.4], [10.95, 540, 2200, 1.0, 0.38]]);
    const night = seg(t, 7.6, 8.2) * (1 - seg(t, 8.7, 9.2));
    skyP(x, t, { x: c[0] * 0.3, y: c[1] * 0.25, z: c[2], red: 0.35 * night });
    x.save(); camApply(x, t, c, { punch: punchK(t, [0, 1.04, 2.8, 3.56, 6.96, 7.86, 10.2, 12.1], 0.08) * (1 + 0.03 * seg(t, 1.9, 4.5)), shake: shakeK(t, [0.02, 1.04, 2.8, 10.2], 20) });
    planet(x, 140, 820, 60, PL.coral, { glowA: 0.25 });
    planet(x, 960, 1650, 46, PL.moon);
    // the hook clock: slams in huge with a shockwave, hands racing, until "time" stamps it out
    const cOut = eio(seg(t, 1.9, 2.25)), cIn = eo(seg(t, 0, 0.3)), stop = t >= 1.04;
    if (t < 0.6) { const u = seg(t, 0, 0.6); x.save(); x.globalAlpha = 1 - u; x.strokeStyle = '#ffffff'; x.lineWidth = 26 * (1 - u) + 4; x.beginPath(); x.arc(540, 1150, 250 + 700 * eo(u), 0, TAU); x.stroke(); x.restore(); }
    if (t > 1.04 && t < 1.7) { const u = seg(t, 1.04, 1.7); x.save(); x.globalAlpha = 1 - u; x.strokeStyle = C.red; x.lineWidth = 20 * (1 - u) + 4; x.beginPath(); x.arc(540, 1150, 260 + 600 * eo(u), 0, TAU); x.stroke(); x.restore(); }
    if (cOut < 1) {
      const shake = stop && t < 1.5 ? Math.sin(t * 90) * 0.08 * (1 - seg(t, 1.04, 1.5)) : 0;
      x.save(); x.translate(lerp(540, 1250, cOut), lerp(1150, 700, cOut)); x.rotate(shake + cOut * 0.8);
      alarmClock(x, 0, 0, 240 * lerp(1.45, 1, cIn) * (1 - 0.4 * cOut), { t, ring: stop ? 0 : 0.8, h: stop ? 9 + 1.04 * 14 : 9 + t * 14 });
      x.restore();
      if (stop) glow(x, 540, 1150, 420, C.red, 0.35 * (1 - seg(t, 1.04, 1.8)) * (1 - cOut));
      stampX(x, 730, 960, 110, back(seg(t, 1.04, 1.28), 2.4) * (1 - cOut));
    }
    // the person, swapped for a clone on "replaceable", then an army of identical clones floods in
    const pin = back(seg(t, 1.95, 2.3), 1.8), sw = eio(seg(t, 2.8, 3.1));
    if (t > 1.9 && t < 4.75) {
      const ARMY = [[140, 1010], [940, 1010], [330, 960], [750, 960], [80, 1450], [1000, 1450], [250, 1600], [830, 1600], [540, 1720], [110, 1230]];
      ARMY.forEach(([px, py], i) => { const k = back(seg(t, 3.5 + i * 0.035, 3.8 + i * 0.035), 2); if (k > 0) bean(x, px, py + Math.sin(t * 3 + i) * 6, 105 * k, { t: t + i, ...cloneOpt, look: [(540 - px) / 600, (1220 - py) / 900], blink: blinkAt(t, i * 0.4) }); });
      bean(x, lerp(540, -260, sw), 1220, 170 * pin, { t, look: [0.2, -0.3], blink: blinkAt(t, 0.3), shock: sw > 0.1 });
      if (sw > 0) bean(x, lerp(1340, 540, sw), 1220, 170, { t, ...cloneOpt, look: [-0.3, -0.2] });
    }
    // the crowd working harder and longer
    const cw = eo(seg(t, 4.62, 5.0));
    if (t > 4.6 && t < 11.3) {
      CROWD.forEach(([px, py], i) => {
        const s = back(seg(t, 4.62 + Math.abs(i - 2) * 0.06, 5.0 + Math.abs(i - 2) * 0.06), 1.6), speed = t > 6.96 ? 3 : 1;
        const bob = Math.abs(Math.sin(t * 5 * speed + i)) * 16 * (t > 6.96 ? 1 : 0.4);
        const dim = 1 - 0.55 * seg(t, 8.9, 9.3);
        x.save(); x.globalAlpha = dim;
        bean(x, px, py - bob, 104 * s, { t: t * speed + i, ...(i === 2 ? {} : cloneOpt), tired: true, hard: 1, sweat: seg(t, 6.96, 7.2), armUp: t > 6.96 ? 0.5 + 0.5 * Math.sin(t * 12 + i) : 0 });
        alarmClock(x, px, py - 245, 52 * back(seg(t, 5.2 + i * 0.05, 5.5 + i * 0.05)), { t, h: 9 + (t - 5.2) * (t > 7.86 ? 9 : 2) });
        x.restore();
      });
      // the effort drop gets crossed out
      const es = back(seg(t, 9.05, 9.4), 1.8) * (1 - eio(seg(t, 10.95, 11.2)));
      if (es > 0) {
        x.save(); x.translate(540, 960); x.scale(es * 1.25, es * 1.25);
        glow(x, 0, 0, 260, '#56e8ff', 0.35);
        x.fillStyle = '#7fe6ff'; x.beginPath(); x.moveTo(0, -150); x.quadraticCurveTo(110, 10, 0, 100); x.quadraticCurveTo(-110, 10, 0, -150); x.fill();
        x.fillStyle = 'rgba(255,255,255,0.6)'; x.beginPath(); x.ellipse(-30, 10, 18, 34, -0.3, 0, TAU); x.fill();
        x.restore();
        pill(x, 540, 1160, 'EFFORT', 54, { s: es, bg: '#bff6ff' });
        stampX(x, 660, 900, 80, back(seg(t, 10.2, 10.45), 2.2) * (es > 0.1 ? 1 : 0));
      }
    }
    // what's hard to replace: a rare gem, coins orbiting
    if (t > 10.8) {
      const gs = back(seg(t, 11.15, 11.6), 1.6);
      gem(x, 540, 2260 + Math.sin(t * 2) * 10, 250 * gs, { t, glowA: 0.45 + 0.4 * Math.max(0, 1 - Math.abs(t - 12.2) / 0.4) });
      for (let i = 0; i < 5; i++) { const a = t * 1.3 + (i * TAU) / 5, d = Math.sin(a); coin(x, 540 + Math.cos(a) * 380, 2260 + d * 110, 52 * gs * (0.8 + 0.2 * d), { glowA: 0.3 }); }
      burst(x, 540, 2260, (t - 12.1) * 1.2, 121, 380);
    }
    x.restore();
  }

  // ================= SCENE 2: two people at the same company -> leverage =================
  const A = [300, 1280], B = [780, 1280];
  function s2(x, t) {
    const wx = 1700 * H.ease.in(seg(t, T.whip1[0], 35.12));
    const c = camAt(t, [[13.5, 540, 1250, 0.95, 0], [15.0, 540, 1240, 1.0, 0.45], [16.15, 370, 1270, 1.3, 0.4], [19.0, 430, 1250, 1.12, 0.35], [22.8, 750, 1270, 1.3, 0.4], [27.25, 540, 1240, 1.0, 0.4], [31.2, 600, 1250, 1.0, 0.35]]);
    const alarm = seg(t, 28.5, 28.8) * (1 - seg(t, 30.8, 31.2));
    skyP(x, t, { x: c[0] * 0.3 + wx * 0.4, y: c[1] * 0.25, z: c[2], red: 0.45 * alarm });
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [15.26, 21.9, 25.68, 29.46, 32.04, 34.12]), shake: shakeK(t, [28.25, 29.92, 34.12], 20) });
    // horizon + company tower
    planet(x, 540, 2950, 1400, PL.teal, { glowA: 0.2, atmo: 1 });
    const bs = back(seg(t, 14.9, 15.35), 1.4) * (1 - eio(seg(t, 31.0, 31.35)));
    if (bs > 0) { x.save(); x.translate(540, 1560); x.scale(bs, bs); building(x, 0, 0, 300, 500, { t, alarm, crack: eio(seg(t, 28.9, 29.95)), shake: alarm * (t < 30.2 ? 1 : 0.3) }); x.restore(); }
    // person A: does the job description; leaves; a clone does it by next week
    const aOut = eio(seg(t, 19.36, 19.7)), aIn = back(seg(t, 13.96, 14.3), 1.8);
    if (aOut < 1) bean(x, lerp(A[0], -260, aOut), A[1] + Math.sin(t * 2.2) * 6, 120 * aIn, { t, look: [0.4, -0.2], blink: blinkAt(t, 1), tired: t > 31.2 });
    const cIn = eo(seg(t, 20.32, 20.65));
    if (cIn > 0) bean(x, lerp(-260, A[0], cIn), A[1] + Math.sin(t * 2.2) * 6, 120, { t, ...cloneOpt, look: [0.4, -0.2], tired: t > 31.2, sweat: seg(t, 33.5, 33.8) });
    const cbs = back(seg(t, 16.5, 16.85), 1.8) * (1 - eio(seg(t, 19.0, 19.3)));
    if (cbs > 0) { x.save(); x.translate(520, 1130); x.scale(cbs, cbs); clipboard(x, 0, 0, 200, seg(t, 16.7, 18.2)); x.restore(); }
    const cal = back(seg(t, 21.65, 22.0), 2) * (1 - eio(seg(t, 22.75, 23.0)));
    calendar(x, 540, 1040, 170 * cal, '+7 DAYS', 1, 1, 0.26);
    const lift = seg(t, 33.2, 34.1), LV = { fx: 660, fy: 1470, len: 560 }, ang = lerp(-0.18, 0.2, eio(lift)), onL = eio(seg(t, 32.85, 33.2));
    // leverage: B pushes the long arm, a heavy pile of coins rises on the short arm
    const lk = back(seg(t, 32.6, 32.95), 1.4);
    if (lk > 0) {
      const { fx, fy, len } = LV;
      lever(x, fx, fy, len, ang, lk);
      const px = fx + Math.cos(ang) * (-len * 0.3 + 70), py = fy + Math.sin(ang) * (-len * 0.3 + 70) - 30;
      for (let i = 0; i < 6; i++) coin(x, px + (i % 2) * 10 - 5, py - i * 34, 48 * lk, { glowA: i === 5 ? 0.5 : 0, flip: 1 });
      if (t > 34.12) { glow(x, px, py - 120, 300, '#ffd23f', 0.5 * Math.max(0, 1 - (t - 34.12) / 0.8)); burst(x, px, py - 120, (t - 34.12) * 1.2, 341, 260); }
    }
    // person B: customers, solved problems; leaves and the company feels it
    const bIn = back(seg(t, 14.34, 14.7), 1.8), bOut = eio(seg(t, 28.2, 28.5)) * (1 - eio(seg(t, 31.0, 31.3)));
    const bxPos = lerp(lerp(B[0], 1340, bOut), LV.fx + Math.cos(ang) * (LV.len * 0.7 - 70), onL);
    const byPos = lerp(B[1], LV.fy + Math.sin(ang) * (LV.len * 0.7 - 70) - 20 - 120 * 1.05, onL);
    bean(x, bxPos, byPos + Math.sin(t * 2.4) * 6 * (1 - onL), 120 * bIn, { t, shirt: GOLD_SHIRT, happy: t > 25.9 && t < 27.9 ? 1 : 0, look: [-0.3, -0.3], blink: blinkAt(t, 2), armUp: t > 34.1 ? 1 : 0 });
    ['heart', 'heart', 'heart'].forEach((k, i) => { const s = back(seg(t, 24.36 + i * 0.12, 24.7 + i * 0.12), 2) * (1 - eio(seg(t, 25.1, 25.3))); bubbleIcon(x, B[0] + [-170, 0, 170][i], 1060 + [30, -40, 30][i] + Math.sin(t * 3 + i) * 8, 52, k, C.pink, s); });
    const lb = back(seg(t, 25.16, 25.5), 1.8) * (1 - eio(seg(t, 27.1, 27.4)));
    lightbulb(x, B[0], 1010, 70 * lb, seg(t, 25.68, 25.8));
    if (t > 25.7 && t < 27.3) burst(x, B[0], 1010, (t - 25.7) * 1.3, 255, 200);
    // empty spot where B stood
    const gap = seg(t, 28.3, 28.5) * (1 - seg(t, 30.9, 31.1));
    if (gap > 0) { x.save(); x.globalAlpha = gap; x.strokeStyle = '#ffffff'; x.lineWidth = 8; x.setLineDash([2, 22]); x.lineCap = 'round'; x.beginPath(); x.arc(B[0], B[1], 120, 0, TAU); x.stroke(); x.restore(); text(x, '?', B[0], B[1], 120, '#ffffff', { a: gap }); }
    // same hours: a clock over each
    const ck = back(seg(t, 31.4, 31.75), 1.8) * (1 - eio(seg(t, 34.9, 35.0)));
    if (ck > 0) { alarmClock(x, A[0], 1020, 62 * ck, { t, h: 9 + (t - 31.4) * 2 }); alarmClock(x, B[0], 1020, 62 * ck, { t, h: 9 + (t - 31.4) * 2 }); }
    x.restore();
  }

  // ================= SCENE 3: what sets your pay =================
  const QUEUE = [['$$$$', 200], ['$$$', 427], ['$$', 653], ['$', 880]];
  function s3(x, t) {
    const wx = -1700 * (1 - H.ease.out(seg(t, 35.12, T.whip1[1])));
    const z = Math.exp(Math.log(10) * H.ease.in(seg(t, T.dive[0], T.dive[1])));
    const c = camAt(t, [[35.1, 540, 1140, 1.12, 0], [40.35, 540, 2230, 1.12, 0.42]]);
    skyP(x, t, { x: c[0] * 0.3 - wx * 0.4, y: c[1] * 0.25, z: c[2] * z });
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [36.06, 37.96, 41.22, 43.06]) });
    x.translate(540, 2300); x.scale(z, z); x.translate(-540, -2300);
    // easy to replace: a queue of look-alikes with falling price tags
    QUEUE.forEach(([lab, px], i) => {
      const s = back(seg(t, 35.5 + i * 0.12, 35.85 + i * 0.12), 1.8), cheap = i === 3 && t > 37.96;
      bean(x, px, 1180 + Math.sin(t * 2 + i) * 5, 90 * s, { t: t + i, ...cloneOpt, look: [0, -0.4], blink: blinkAt(t, i) });
      priceTag(x, px, 1010, lab, back(seg(t, 36.3 + i * 0.15, 36.6 + i * 0.15), 2), { rot: (i - 1.5) * 0.05, hot: cheap ? C.red : null, bg: cheap ? '#ffd0d8' : '#ffffff' });
    });
    if (t > 37.96) arrow(x, [[880, 1080], [920, 1260], [760, 1330], [600, 1390]], eio(seg(t, 37.96, 38.3)), '#ff8fa8', 10, { dots: true });
    gauge(x, 540, 1460, 760, lerp(0.75, 0.16, eio(seg(t, 38.3, 38.9))), 'YOUR PAY', seg(t, 38.3, 38.9) > 0.5 ? '#ff5d8f' : '#ffd23f', seg(t, 36.8, 37.1) * (1 - seg(t, 40.3, 40.5)));
    // hard to replace: the gold-shirt person with a gem badge, pay set by the cost to lose them
    const bs = back(seg(t, 40.5, 40.9), 1.6);
    bean(x, 540, 2230 + Math.sin(t * 2) * 6, 140 * bs, { t, shirt: GOLD_SHIRT, happy: t > 43.0 ? 1 : 0, look: [0, -0.3], armUp: t > 43.06 ? 1 : 0 });
    gem(x, 540, 2300, 46 * back(seg(t, 41.2, 41.5), 2), { t, glowA: 0.6 });
    const bd = back(seg(t, 42.6, 42.9), 1.6);
    if (bd > 0) { x.save(); x.translate(860, 2190); x.scale(bd * 0.3, bd * 0.3); building(x, 0, 0, 380, 640, { t, crack: seg(t, 43.6, 44.0), alarm: seg(t, 43.6, 43.8) }); x.restore(); }
    const g2 = lerp(0.3, 1.12, eio(seg(t, 43.06, 43.9)));
    gauge(x, 540, 2520, 760, g2, 'YOUR PAY', '#ffd23f', seg(t, 41.6, 41.9));
    if (t > 43.9) burst(x, 540 + 380 * 1.1, 2520, (t - 43.9) * 1.3, 439, 200);
    x.restore();
  }

  // ================= SCENE 4: two skills that overlap =================
  const ORB = { design: ['#ffc4e6', '#ff5db0', '#8a1c6a'], sales: ['#b6ffd6', '#2fcf7e', '#126a4a'], eng: ['#a4fbef', '#3a9be0', '#1d2f86'], talk: ['#fff3b0', '#ffc93f', '#b5620e'] };
  function s4(x, t) {
    const em = 1 + 1.4 * (1 - eo(seg(t, T.dive[1], T.dive[1] + 0.6)));
    const wy = 1900 * H.ease.in(seg(t, T.whip2[0], 53.67));
    skyP(x, t, { x: 200 + t * 10, y: wy * 0.3, z: em });
    x.save(); camApply(x, t, [540, 1060, 1.08], { dy: wy, punch: punchK(t, [47.86, 50.08, 52.18]) * em });
    // one skill alone, then crossed out
    const one = back(seg(t, 44.8, 45.2), 1.6) * (1 - eio(seg(t, 48.7, 48.95)));
    if (one > 0) {
      ball(x, 540, 1160, 200 * one, ORB.design, { sha: 0.4 });
      icon(x, 'pen', 540, 1160, 120 * one);
      pill(x, 540, 1440, 'ONE SKILL', 48, { s: one });
      stampX(x, 720, 1000, 74, back(seg(t, 47.86, 48.1), 2.2) * (one > 0.2 ? 1 : 0));
    }
    // two overlapping skills: design + sales, then engineering + communication
    const two = back(seg(t, 48.85, 49.3), 1.4);
    if (two > 0) {
      const m = eio(seg(t, 51.14, 51.6)), sp = lerp(320, 210, eo(seg(t, 49.0, 50.1)));
      const left = m < 0.5 ? ORB.design : ORB.eng, right = m < 0.5 ? ORB.sales : ORB.talk, li = m < 0.5 ? 'pen' : 'gear', ri = m < 0.5 ? 'chart' : 'speech';
      const flip = Math.abs(Math.cos(m * Math.PI)), R = 230 * two;
      const L = [540 - sp, 1160], Rp = [540 + sp, 1160];
      x.save(); x.globalAlpha = 0.92;
      x.save(); x.translate(L[0], L[1]); x.scale(flip, 1); ball(x, 0, 0, R, left, { sha: 0.35 }); x.restore();
      x.save(); x.translate(Rp[0], Rp[1]); x.scale(flip, 1); ball(x, 0, 0, R, right, { sha: 0.35 }); x.restore();
      x.restore();
      // the overlap glows: that's the rare part
      const ov = seg(t, 49.6, 50.1);
      x.save(); x.beginPath(); x.arc(L[0], L[1], R, 0, TAU); x.clip(); x.beginPath(); x.arc(Rp[0], Rp[1], R, 0, TAU); x.fillStyle = H.rgba('#fff3b0', 0.85 * ov); x.fill(); x.restore();
      if (ov > 0) { glow(x, 540, 1160, 260, '#ffd23f', 0.6 * ov); spark(x, 540, 1160, 70 * ov * (0.85 + 0.15 * Math.sin(t * 6)), '#ffffff', 1); }
      x.save(); x.translate(L[0] - R * 0.42, L[1]); x.scale(flip, 1); icon(x, li, 0, 0, 100 * two); x.restore();
      x.save(); x.translate(Rp[0] + R * 0.42, Rp[1]); x.scale(flip, 1); icon(x, ri, 0, 0, 100 * two); x.restore();
      pill(x, 540, 1440, 'RARE MIX', 52, { s: back(seg(t, 50.1, 50.45), 2), bg: C.yellow });
      const lab = m < 0.5 ? ['DESIGN', 'SALES'] : ['ENGINEERING', 'EXPLAINING'];
      text(x, lab[0], L[0] - 40, 880, 46, H.rgba(left[0]), { a: two * flip });
      text(x, lab[1], Rp[0] + 40, 880, 46, H.rgba(right[0]), { a: two * flip });
      if (t > 50.08) burst(x, 540, 1160, (t - 50.08) * 1.2, 500, 300);
      if (t > 52.18) burst(x, 540, 1160, (t - 52.18) * 1.2, 521, 300);
    }
    x.restore();
  }

  // ================= SCENE 5: not overnight, one block at a time =================
  const STEPS = [[58.5, 'SKILL', ORB.eng], [59.88, 'PROBLEM', ORB.design], [60.4, 'SKILL', ORB.sales], [60.7, 'PROBLEM', ORB.talk]];
  const stepPos = (i) => [200 + i * 225, 1640 - i * 170];
  function s5(x, t) {
    const wy = -1900 * (1 - H.ease.out(seg(t, 53.67, T.whip2[1])));
    const up = 1900 * H.ease.in(seg(t, T.whip3[0], 61.2));
    skyP(x, t, { x: 300 + t * 12, y: (wy + up) * 0.3 });
    const top = STEPS.filter(([ts]) => t >= ts).length;
    const camY = lerp(1220, 1200, seg(t, 58.3, 61));
    x.save(); camApply(x, t, [540, camY, 1], { dy: wy + up, punch: punchK(t, [56.78, 58.5, 59.88]), shake: shakeK(t, [56.78], 14) });
    // overnight? no.
    const mo = back(seg(t, 54.1, 54.5), 1.6) * (1 - eio(seg(t, 57.7, 58.0)));
    if (mo > 0) {
      crescentMoon(x, 540, 1160, 230 * mo);
      const s = moonSeat(540, 1160, 230 * mo, 92 * mo); bean(x, s[0], s[1], 92 * mo, { t, sleep: true, cap: 1, noFeet: true, rot: -0.12, zzz: mo });
      stampX(x, 760, 960, 90, back(seg(t, 56.78, 57.05), 2.2) * (mo > 0.2 ? 1 : 0));
    }
    // the staircase, one block per skill / solved problem; the person climbs it
    if (t > 57.9) {
      STEPS.forEach(([ts, lab, pal], i) => { const [bx, by] = stepPos(i); block(x, bx, by + (1 - cl(back(seg(t, ts, ts + 0.3), 1.6))) * -200, 210, 160, lab, pal, back(seg(t, ts - 0.05, ts + 0.25), 1.6)); });
      const k = Math.max(0, top - 1), prev = Math.max(0, top - 2), ts = top ? STEPS[top - 1][0] : 58, hop = eio(seg(t, ts + 0.05, ts + 0.3));
      const p0 = top > 1 ? stepPos(prev) : [120, 1800], p1 = top ? stepPos(k) : [120, 1800];
      const bxp = lerp(p0[0], p1[0], hop), byp = lerp(p0[1] - 80, p1[1] - 80, hop) - 130 * Math.sin(hop * Math.PI) - 92;
      bean(x, bxp, byp, 92 * back(seg(t, 57.95, 58.3), 1.6), { t, shirt: GOLD_SHIRT, happy: 1, hard: 1, armUp: hop < 1 ? 1 : 0 });
    }
    x.restore();
  }

  // ================= SCENE 6: hours that are worth more =================
  function s6(x, t) {
    const wy = -1900 * (1 - H.ease.out(seg(t, 61.2, T.whip3[1])));
    const g = eio(seg(t, 64.68, 65.2));
    skyP(x, t, { x: 500 + t * 14, y: wy * 0.3 });
    x.save(); camApply(x, t, [540, 1180, 1], { dy: wy, punch: punchK(t, [61.96, 63.8, 67.06], 0.07), shake: shakeK(t, [67.06], 16) });
    planet(x, 540, 2650, 1150, PL.teal, { glowA: 0.2, atmo: 1 });
    flare(x, 540, 1060, Math.max(0, 1 - Math.abs(t - 67.25) / 0.9) * (t > 67.06 ? 1 : 0) + 0.35 * seg(t, 67.6, 68), t);
    // the clock: spinning through more hours, then turning gold
    const cs = back(seg(t, 61.3, 61.7), 1.6), spin = t < 64.6 ? (t - 61.3) * 6 : 20 + (t - 64.6) * 0.5;
    x.save(); x.translate(540, 1060); x.scale(cs, cs);
    if (g > 0) glow(x, 0, 0, 400, '#ffd23f', 0.5 * g);
    alarmClock(x, 0, 0, 170, { t, h: 9 + spin });
    if (g > 0) { x.save(); x.globalAlpha = g; ball(x, 0, 0, 170, GOLD, { sha: 0.4 }); x.fillStyle = '#fffaf0'; x.beginPath(); x.arc(0, 0, 126, 0, TAU); x.fill(); text(x, '$', 0, 8, 150, '#d98d1a', { shadow: 'rgba(0,0,0,0)' }); x.restore(); }
    x.restore();
    pill(x, 540, 1330, '+ MORE HOURS', 50, { s: back(seg(t, 63.56, 63.85), 2) * (1 - eio(seg(t, 64.6, 64.8))), bg: '#ffd0d8' });
    stampX(x, 790, 1310, 64, back(seg(t, 63.8, 64.05), 2.2) * (1 - eio(seg(t, 64.6, 64.8))));
    // the price of one hour climbs
    const tags = ['$', '$$', '$$$', '$$$$'], ti = t < 66.22 ? 0 : t < 66.72 ? 1 : t < 67.06 ? 2 : 3;
    priceTag(x, 800, 880, tags[ti] + ' / HR', back(seg(t, 65.6, 65.9), 2) * (1 + 0.15 * Math.sin(seg(t, [66.22, 66.72, 67.06][Math.max(0, ti - 1)] || 0, ([66.22, 66.72, 67.06][Math.max(0, ti - 1)] || 0) + 0.3) * Math.PI)), { rot: 0.12, bg: ti === 3 ? C.yellow : '#ffffff' });
    bean(x, 540, 1440 + Math.sin(t * 2) * 5, 120 * back(seg(t, 61.5, 61.9), 1.6), { t, shirt: GOLD_SHIRT, happy: t > 64.7 ? 1 : 0, tired: t < 64.7, sweat: t < 64.6 ? seg(t, 62.5, 62.8) : 0, armUp: t > 67.06 ? 1 : 0 });
    for (let i = 0; i < 8; i++) { const ts = 65.2 + i * 0.32, u = (t - ts) / 1.2; if (u > 0 && u < 1) coin(x, 540 + Math.sin(i * 2.3) * 300 * u, 1060 - 200 * u + 400 * u * u, 30 * back(cl(u / 0.15)), { glowA: 0.3, flip: Math.cos(u * 9) }); }
    burst(x, 540, 1060, (t - 67.06) * 1.0, 671, 420);
    if (t > 67.3) for (let i = 0; i < 9; i++) { const q = H.rng(700 + i); spark(x, q.range(80, 1000), q.range(250, 1500), q.range(10, 20) * (0.5 + 0.5 * Math.sin(t * 3 + i)), '#ffffff', seg(t, 67.3, 67.6)); }
    x.restore();
  }

  // ================= EXPLAINER =================
  function explainerV(ctx, W, H_, t) {
    const x = ctx;
    const sw = eio(seg(t, T.sweep[0], T.sweep[1]));
    const sx = lerp(PW + 1500, -1500, sw), sy = lerp(PH + 600, -600, sw);
    if (t < T.sweep[0] || sx > 540) s1(x, t);
    else if (t < 35.12) s2(x, t);
    else if (t < T.dive[1]) s3(x, t);
    else if (t < 53.67) s4(x, t);
    else if (t < 61.2) s5(x, t);
    else s6(x, t);
    if (sw > 0 && sw < 1) planet(x, sx, sy, 1300, PL.magenta, { glowA: 0.4, ringA: 0 });
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - 35.12) / 0.2) * 0.8, false);
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - 53.67) / 0.22) * 0.8, true);
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - 61.2) / 0.22) * 0.8, true);
    const wo = seg(t, T.dive[0] + 0.2, T.dive[1]) * (1 - seg(t, T.dive[1], T.dive[1] + 0.35));
    if (wo > 0) { const g = x.createRadialGradient(540, 960, 0, 540, 960, 1100); g.addColorStop(0, H.rgba('#ffffff', wo)); g.addColorStop(0.5, H.rgba('#8ff0ff', wo * 0.95)); g.addColorStop(1, H.rgba('#6a4cff', wo * 0.9)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); }
    // quick white flashes on the hardest hits
    for (const tf of [1.04, 2.8]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.14); if (f > 0) { const g = x.createRadialGradient(540, 960, 300, 540, 960, 1200); g.addColorStop(0, 'rgba(255,59,92,0)'); g.addColorStop(1, H.rgba(C.red, 0.55 * f)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); } }
    for (const tf of [0.02, 29.92, 34.12, 67.06]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.12); if (f > 0) { x.fillStyle = H.rgba('#ffffff', 0.35 * f); x.fillRect(0, 0, PW, PH); } }
    drawHL(x, t);
    finish(x, PW, PH, t);
  }

  // ================= SOUND: effects only, quiet under the voice =================
  function scoreSoundV(k) {
    const hz = k.hz;
    const whoosh = (t, d, g = 0.5, top = 1800) => k.noise(t, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 300], [d * 0.6, top], [d, 400]], q: 0.6, gain: 0.22 * g, a: d * 0.6, verb: 0.15 });
    const pluck = (t, n, g = 0.5, p = 0) => { const f = hz(n); k.tone(t, { f, dur: 0.6, gain: 0.12 * g, a: 0.003, pan: p, verb: 0.2 }); k.tone(t, { f: f * 2, type: 'triangle', dur: 0.2, gain: 0.03 * g, pan: p }); };
    const clink = (t, g = 0.5, p = 0) => { k.tone(t, { f: 'E7', dur: 0.25, gain: 0.04 * g, a: 0.001, pan: p }); k.tone(t + 0.004, { f: hz('E7') * 1.47, dur: 0.14, gain: 0.025 * g, a: 0.001, pan: p }); };
    const soft = (t, g = 0.5) => k.play('pop', t, { f: 520, gain: 0.35 * g });
    // the hook hit, kept low and short so the first words stay clear
    k.play('thud', 0.0, { f: 110, gain: 0.35 }); k.play('swish', 0.0, { dur: 0.2, gain: 0.4 });
    for (let tt = 0.05; tt < 1.0; tt += 0.09) k.play('tick', tt, { f: 4400, gain: 0.08 });
    k.play('stamp', 1.04, { gain: 0.32 });
    k.play('thud', 2.8, { f: 90, gain: 0.25 });
    for (let i = 0; i < 10; i++) k.play('pop', 3.5 + i * 0.035, { f: 480 + i * 30, gain: 0.08 });
    whoosh(1.9, 0.35, 0.4);
    k.play('swish', 2.8, { dur: 0.25, gain: 0.35 });
    whoosh(4.6, 0.5, 0.35, 1200);
    for (let i = 0; i < 5; i++) soft(4.66 + Math.abs(i - 2) * 0.06, 0.4);
    for (let tt = 7.0; tt < 8.6; tt += 0.12) k.play('tick', tt, { f: 3800, gain: 0.12 });
    k.play('stamp', 10.2, { gain: 0.3 });
    whoosh(10.95, 0.4, 0.45);
    k.play('sparkle', 12.1, { gain: 0.35, n: 5 });
    for (let i = 0; i < 4; i++) clink(11.6 + i * 0.3, 0.4);
    // sweep to the company
    whoosh(T.sweep[0], T.sweep[1] - T.sweep[0], 0.6, 1300);
    soft(14.05, 0.45); soft(14.45, 0.45); k.play('tock', 15.3, { f: 420, gain: 0.25 });
    whoosh(16.15, 0.4, 0.3);
    [16.95, 17.55, 18.1].forEach((tt) => k.play('tick', tt, { f: 3200, gain: 0.25 }));
    k.play('swish', 19.36, { dur: 0.3, gain: 0.35 }); k.play('swish', 20.32, { dur: 0.3, gain: 0.3 });
    k.play('paper', 21.7, { dur: 0.2, gain: 0.4 });
    whoosh(22.8, 0.4, 0.3);
    [24.4, 24.52, 24.64].forEach((tt, i) => pluck(tt, ['E5', 'G5', 'B5'][i], 0.4));
    k.play('ding', 25.7, { f: 'G6', gain: 0.18 });
    k.play('swish', 28.2, { dur: 0.3, gain: 0.35 });
    k.play('thud', 28.3, { f: 80, gain: 0.3 });
    for (let tt = 28.6; tt < 30.8; tt += 0.28) k.tone(tt, { f: 'A4', type: 'triangle', dur: 0.12, gain: 0.03, filter: 'lowpass', f2: 1400 });
    k.play('impact', 29.92, { gain: 0.3 });
    k.play('swish', 31.0, { dur: 0.25, gain: 0.3 }); soft(31.5, 0.35);
    k.play('tock', 32.95, { f: 300, gain: 0.3 });
    k.noise(33.2, { dur: 0.9, color: 'brown', filter: 'lowpass', f: [[0, 200], [0.9, 700]], gain: 0.12, a: 0.8 });
    k.play('sparkle', 34.12, { gain: 0.35, n: 6 }); for (let i = 0; i < 5; i++) clink(34.15 + i * 0.07, 0.4);
    // whip to pay
    whoosh(T.whip1[0], 0.4, 0.7, 2600);
    for (let i = 0; i < 4; i++) soft(35.62 + i * 0.12, 0.35);
    for (let i = 0; i < 4; i++) k.play('tick', 36.45 + i * 0.15, { f: 3000, gain: 0.25 });
    k.tone(38.3, { f: [[0, 520], [0.6, 180]], type: 'triangle', dur: 0.6, gain: 0.05, a: 0.02 });
    whoosh(40.35, 0.45, 0.4);
    k.play('sparkle', 41.25, { gain: 0.25, n: 4 });
    k.tone(43.06, { f: [[0, 220], [0.8, 660]], type: 'triangle', dur: 0.85, gain: 0.05, a: 0.1 });
    k.play('sparkle', 43.9, { gain: 0.3, n: 5 });
    // dive into the gem
    k.play('riser', T.dive[0] - 0.1, { dur: 0.6, gain: 0.4 });
    k.play('stamp', 47.86, { gain: 0.25 });
    k.play('swish', 48.85, { dur: 0.3, gain: 0.3 }); pluck(50.08, 'C5', 0.5); pluck(50.15, 'G5', 0.4);
    k.play('swish', 51.14, { dur: 0.3, gain: 0.3 }); pluck(52.18, 'D5', 0.5); pluck(52.25, 'A5', 0.4);
    whoosh(T.whip2[0], 0.45, 0.6, 2200);
    soft(54.25, 0.4); k.play('stamp', 56.78, { gain: 0.28 });
    k.play('swish', 57.7, { dur: 0.25, gain: 0.3 });
    STEPS.forEach(([ts], i) => { k.play('tock', ts + 0.1, { f: 300 + i * 60, gain: 0.35 }); pluck(ts + 0.12, ['C5', 'E5', 'G5', 'C6'][i], 0.4); });
    whoosh(T.whip3[0], 0.45, 0.6, 2200);
    soft(61.5, 0.4);
    for (let tt = 61.7; tt < 63.6; tt += 0.11) k.play('tick', tt, { f: 4200, gain: 0.1 });
    k.play('stamp', 63.8, { gain: 0.25 });
    k.play('sparkle', 64.75, { gain: 0.3, n: 5 });
    [66.22, 66.72].forEach((tt, i) => pluck(tt, ['E5', 'G5'][i], 0.4));
    for (let i = 0; i < 8; i++) clink(65.3 + i * 0.32, 0.35);
    k.play('impact', 67.06, { gain: 0.3 });
    ['C4', 'G4', 'C5', 'E5', 'G5'].forEach((n, i) => k.tone(67.08 + i * 0.012, { f: n, type: 'triangle', dur: 1.4, gain: 0.03, a: 0.02, verb: 0.3 }));
    k.play('sparkle', 67.2, { gain: 0.3, n: 6 });
  }


  window.FV = { explainer: explainerV, scoreSound: scoreSoundV, DURATION: DUR, W: PW, H: PH };
})();
