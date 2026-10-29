  // ================= PROJECT: "Every dollar is a worker" =================
  // Continues the closure from shorts-kit/lib/base.js + vertical.js. All times are seconds on voice.mp3 (see words.json).
  const DUR = 68.9;

  // ================= TIMELINE (seconds on the voice track) =================
  const T = {
    sweep: [13.85, 14.55], whip1: [34.95, 35.35], dive: [44.3, 44.82], whip2: [51.15, 51.6], whip3: [61.45, 61.9],
  };
  const W1 = 35.15, W2 = 51.37, W3 = 61.67; // the middle of each whip: the frame where the scene swaps
  // headlines: only the lines that carry the idea, each word lands as it is spoken
  hl(0, 2.3, 450, 116, "EVERY@-1 DOLLAR@-1|YOU@0.6 SPEND@0.86#r*1.2|IS@1.12 GONE@1.6#r*1.3");
  hl(2.45, 4.95, 430, 108, "EVERY@2.54 DOLLAR@2.76|YOU@3.02 KEEP@3.24#g*1.2|GOES@3.56#g TO@4.0#g WORK@4.24#g*1.25");
  hl(5.1, 6.95, 430, 108, "MOST@5.16 PEOPLE@5.34 THINK@5.6|MONEY@5.9 IS@6.16 SIMPLE@6.36");
  hl(7.05, 9.0, 450, 120, "EARN@7.34#g IT@7.56#g|SPEND@8.12#r IT@8.34#r");
  hl(9.1, 11.25, 430, 104, "WEALTHY@9.26#g PEOPLE@9.58|SEE@9.9 IT@10.2|DIFFERENTLY@10.3#c*1.15");
  hl(11.35, 13.85, 430, 108, "EVERY@12.18 DOLLAR@12.5|IS@12.86 A@13.16|WORKER@13.28#g*1.35");
  hl(14.3, 16.95, 430, 108, "TWO@14.68 PEOPLE@15.08|SAME@15.76#g SALARY@16.06#g");
  hl(17.05, 19.6, 430, 104, "THE@17.14 FIRST@17.26|SPENDS@17.62#r|EVERYTHING@18.02#r*1.15");
  hl(19.65, 21.85, 450, 112, "EVERY@19.76 MONTH@20.08|STARTS@20.38 FROM@20.7|ZERO@20.98#r*1.35");
  hl(21.9, 24.6, 430, 104, "THE@21.98 SECOND@22.16|KEEPS@22.52#g A@22.84#g SMALL@23.02#g|PART@23.3#g");
  hl(24.65, 25.95, 450, 116, "PUTS@24.8 IT@25.0|TO@25.12#g WORK@25.26#g*1.2");
  hl(26.0, 28.4, 430, 108, "DOLLARS@26.32 BRING@26.72|BACK@27.04|MORE@27.32#g DOLLARS@27.64#g");
  hl(28.45, 30.65, 430, 108, "NEW@28.94#g DOLLARS@29.16#g|GO@29.48 TO@29.72 WORK@29.82#g|TOO@30.12#c*1.2");
  hl(30.7, 32.75, 395, 104, "THEY@30.78 EARN@30.98|EXACTLY@31.26|THE@31.84 SAME@32.08#g");
  hl(32.8, 34.95, 410, 108, "ONLY@33.04 ONE@33.34|IS@33.9 BUILDING@34.06|A@34.3#c TEAM@34.46#c*1.35");
  hl(35.35, 38.95, 420, 100, "SPEND@35.72#r A@35.92 DOLLAR@36.08|IT@36.74 WORKS@36.84 ONCE@37.06#r*1.25|FOR@37.78 SOMEONE@37.94 ELSE@38.2#r");
  hl(39.0, 42.95, 420, 96, "KEEP@39.42#g IT@39.68|PUT@40.04 IT@40.2 TO@40.3 WORK@40.44#g|WORKS@41.44 FOR@41.62 YOU@41.84|FOR@42.02 YEARS@42.22#c*1.25");
  hl(43.05, 44.6, 450, 116, "EVEN@43.2 WHILE@43.56|YOU@43.74 SLEEP@43.88#p*1.3");
  hl(44.85, 48.1, 420, 100, "WEALTHY@45.34#g PEOPLE@45.6|DON'T@45.9#r ASK@46.22|CAN@46.9#r I@47.0#r AFFORD@47.14#r THIS?@47.42#r");
  hl(48.2, 51.15, 420, 100, "THEY@48.26 ASK@48.5|WHAT@49.3 COULD@49.48|THIS@49.64#g DOLLAR@49.86#g|BECOME?@50.14#g*1.3");
  hl(51.3, 53.85, 430, 104, "YOUR@51.96 FIRST@52.08|WORKERS@52.36#g|WILL@52.72 BE@52.92 SMALL@53.06#p*1.2");
  hl(53.9, 56.65, 420, 96, "FOR@53.94 A@54.12 WHILE@54.26|IT@54.78 WILL@54.86 FEEL@54.96 LIKE@55.16|NOTHING@55.38#r*1.2|IS@55.72 HAPPENING@55.98");
  hl(56.7, 59.5, 430, 108, "EVERY@57.04 TEAM@57.5#c|STARTS@57.82 WITH@58.2|ONE@58.48#g WORKER@58.76#g*1.2");
  hl(59.55, 61.5, 430, 108, "IT@59.82 GROWS@59.92#n|ONE@60.18#g DOLLAR@60.6#g|AT@60.96 A@61.16 TIME@61.24");
  hl(62.0, 65.2, 420, 100, "GETTING@62.4 RICH@62.64#g|ISN'T@63.0#r ABOUT@63.4|WORKING@63.56 FOR@63.88 MONEY@64.12|FOREVER@64.38#r*1.2");
  hl(65.25, DUR + 1, 420, 100, "BUILDING@65.82 A@66.24|TEAM@66.44#c*1.25 OF@66.84 MONEY@67.04#g|THAT@67.32 WORKS@67.54#g*1.3|FOR@67.84 YOU@68.08#g*1.3");

  // ================= NEW PROPS (same recipe: ball + crescent shadows + glow, no outlines) =================
  // the worker coin: a gold coin with a face, a hard hat, stubby arms, feet and (optionally) a hammer
  // arm angle a is measured from straight down, outward positive: 0.6 = resting, 2.6 = raised
  function worker(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const t = o.t || 0, w = o.walk || 0, ph = t * 9 + (o.ph || 0);
    const bob = w ? Math.abs(Math.sin(ph)) * r * 0.16 * w : 0;
    x.save(); x.translate(cx, cy - bob); x.rotate(o.rot || 0);
    x.fillStyle = '#2b2f7a';
    for (const sd of [-1, 1]) { const fx = sd * r * 0.4 + (w ? Math.sin(ph + (sd > 0 ? Math.PI : 0)) * r * 0.18 * w : 0); x.beginPath(); x.ellipse(fx, r * 0.98 + bob, r * 0.27, r * 0.15, 0, 0, TAU); x.fill(); }
    const up = o.armUp || 0, sw = o.swing || 0;
    for (const sd of [-1, 1]) {
      let a = lerp(0.6 + 0.1 * Math.sin(t * 2.4 + sd), 2.6 + 0.12 * Math.sin(t * 9 + sd), up);
      if (sd > 0 && sw > 0) a = lerp(a, 1.75 + 0.75 * Math.sin(t * 10 + (o.ph || 0)), sw * (1 - up));
      const sx = sd * r * 0.86, sy = r * 0.12, L = r * 0.5, ex = sx + sd * Math.sin(a) * L, ey = sy + Math.cos(a) * L;
      x.strokeStyle = '#d98d1a'; x.lineWidth = r * 0.14; x.lineCap = 'round'; x.beginPath(); x.moveTo(sx, sy); x.lineTo(ex, ey); x.stroke();
      if (sd > 0 && sw > 0.05 && up < 0.5) {
        // hammer: handle continues from the hand, head across its tip
        const th = Math.atan2(ey - sy, ex - sx) - 1.1, hl2 = r * 0.62, hx = ex + Math.cos(th) * hl2, hy = ey + Math.sin(th) * hl2;
        x.save(); x.globalAlpha *= cl(sw * 3);
        x.strokeStyle = '#9a5a26'; x.lineWidth = r * 0.11; x.beginPath(); x.moveTo(ex, ey); x.lineTo(hx, hy); x.stroke();
        x.translate(hx, hy); x.rotate(th + Math.PI / 2);
        x.fillStyle = '#6e74c8'; rr(x, -r * 0.24, -r * 0.13, r * 0.48, r * 0.26, r * 0.07); x.fill();
        x.fillStyle = 'rgba(255,255,255,0.4)'; rr(x, -r * 0.18, -r * 0.1, r * 0.36, r * 0.06, r * 0.03); x.fill();
        x.restore();
      }
      ball(x, ex, ey, r * 0.14, GOLD, { sha: 0.4 });
    }
    coin(x, 0, 0, r, { face: 1, flip: 1, hard: o.hard == null ? 1 : o.hard, happy: o.happy, look: o.look, blink: o.blink, glowA: o.glowA == null ? 0.22 : o.glowA });
    if (o.sweat > 0) { const sx = -r * 0.85, sy = -r * 0.3 + ((t * 40) % (r * 0.3)); x.save(); x.globalAlpha *= cl(o.sweat); x.fillStyle = '#7fe6ff'; x.beginPath(); x.moveTo(sx, sy - r * 0.16); x.quadraticCurveTo(sx + r * 0.09, sy, sx, sy + r * 0.06); x.quadraticCurveTo(sx - r * 0.09, sy, sx, sy - r * 0.16); x.fill(); x.restore(); }
    x.restore();
  }
  // a fat wallet: back pocket, front body, a snap tab with a gold stud; gulp squashes it
  function wallet(x, cx, cy, w, o = {}) {
    if (w < 2) return;
    const h = w * 0.64, g = o.gulp || 0;
    x.save(); x.translate(cx, cy); x.scale(1 + g * 0.08, 1 - g * 0.08);
    glow(x, 0, 0, w * 0.9, '#8b5cff', 0.28);
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2 + 12, -h / 2 + 16, w, h, w * 0.1); x.fill();
    x.fillStyle = '#3d2390'; rr(x, -w / 2 + w * 0.04, -h / 2 - h * 0.14, w * 0.92, h * 0.5, w * 0.08); x.fill();
    x.fillStyle = '#1a1050'; rr(x, -w * 0.3, -h / 2 - h * 0.06, w * 0.6, h * 0.12, h * 0.06); x.fill();
    const gr = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, '#c4b0ff'); gr.addColorStop(0.45, '#8b5cff'); gr.addColorStop(1, '#4b2a9c');
    x.fillStyle = gr; rr(x, -w / 2, -h / 2, w, h, w * 0.1); x.fill();
    x.fillStyle = 'rgba(40,16,110,0.3)'; rr(x, w * 0.1, -h / 2, w * 0.4, h, w * 0.1); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.32)'; rr(x, -w / 2 + w * 0.06, -h / 2 + h * 0.07, w * 0.6, h * 0.07, h * 0.035); x.fill();
    x.fillStyle = '#5a35c0'; rr(x, w * 0.16, -h * 0.2, w * 0.4, h * 0.4, h * 0.18); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.22)'; rr(x, w * 0.2, -h * 0.16, w * 0.3, h * 0.06, h * 0.03); x.fill();
    ball(x, w * 0.42, 0, h * 0.09, GOLD, { sha: 0.4 });
    x.restore();
  }
  // a paycheck: green bill with a $ medallion
  function bill(x, cx, cy, w, s, o = {}) {
    if (s <= 0.01) return;
    const h = w * 0.52;
    x.save(); x.translate(cx, cy); x.rotate(o.rot || 0); x.scale(s, s);
    if (o.glowA) glow(x, 0, 0, w * 0.9, C.green, o.glowA);
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2 + 8, -h / 2 + 12, w, h, h * 0.16); x.fill();
    const gr = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, '#c4ffdf'); gr.addColorStop(0.5, '#38e08e'); gr.addColorStop(1, '#178a5a');
    x.fillStyle = gr; rr(x, -w / 2, -h / 2, w, h, h * 0.16); x.fill();
    x.fillStyle = 'rgba(10,90,60,0.25)'; rr(x, -w / 2 + h * 0.12, -h / 2 + h * 0.12, w - h * 0.24, h * 0.76, h * 0.1); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, -w / 2 + h * 0.2, -h / 2 + h * 0.06, w * 0.5, h * 0.06, h * 0.03); x.fill();
    ball(x, 0, 0, h * 0.3, ['#eafff3', '#9ff0c4', '#178a5a'], { sha: 0.3 });
    text(x, '$', 0, h * 0.02, h * 0.42, '#11744a', { shadow: 'rgba(0,0,0,0)' });
    for (const sd of [-1, 1]) { x.fillStyle = 'rgba(255,255,255,0.35)'; x.beginPath(); x.arc(sd * w * 0.36, 0, h * 0.09, 0, TAU); x.fill(); }
    x.restore();
  }
  // thought cloud with a trail of little puffs toward (tx, ty)
  function cloud(x, cx, cy, w, h, s, tx, ty) {
    if (s <= 0.01) return;
    const puffs = [[-0.32, -0.12, 0.34], [0, -0.26, 0.4], [0.32, -0.12, 0.34], [-0.4, 0.16, 0.3], [0.4, 0.16, 0.3], [-0.12, 0.2, 0.36], [0.16, 0.2, 0.36]];
    x.save(); x.translate(cx, cy); x.scale(s, s);
    glow(x, 0, 0, w * 0.75, '#bfb2ff', 0.3);
    for (const [col, dx, dy] of [['rgba(10,8,46,0.35)', 10, 14], ['#f4f1ff', 0, 0]]) {
      x.fillStyle = col; x.beginPath();
      for (const [px, py, pr] of puffs) { x.moveTo(px * w + dx + pr * h, py * h + dy); x.arc(px * w + dx, py * h + dy, pr * h, 0, TAU); }
      x.fill();
      [[0.62, 0.12], [0.82, 0.07]].forEach(([u, pr]) => { x.beginPath(); x.arc((tx - cx) * u / s + dx, (ty - cy) * u / s + dy, pr * h, 0, TAU); x.fill(); });
    }
    x.fillStyle = 'rgba(255,255,255,0.7)'; rr(x, -w * 0.3, -h * 0.5, w * 0.24, h * 0.07, h * 0.035); x.fill();
    x.restore();
  }
  // hamster wheel on a stand; rot spins the spokes
  function wheel(x, cx, cy, R, rot) {
    x.save(); x.translate(cx, cy);
    x.fillStyle = '#3d3a9c'; x.beginPath(); x.moveTo(-14, 0); x.lineTo(-R * 0.62, R + 50); x.lineTo(-R * 0.4, R + 50); x.lineTo(0, 30); x.lineTo(R * 0.4, R + 50); x.lineTo(R * 0.62, R + 50); x.lineTo(14, 0); x.closePath(); x.fill();
    glow(x, 0, 0, R * 1.3, '#8b5cff', 0.25);
    x.save(); x.rotate(rot); x.strokeStyle = 'rgba(191,178,255,0.55)'; x.lineWidth = R * 0.035; x.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * R, Math.sin(a) * R); x.stroke(); }
    x.restore();
    const g = x.createLinearGradient(-R, -R, R, R); g.addColorStop(0, '#d9ccff'); g.addColorStop(0.5, '#8b5cff'); g.addColorStop(1, '#3d2390');
    x.strokeStyle = 'rgba(10,8,46,0.4)'; x.lineWidth = R * 0.13; x.beginPath(); x.arc(8, 12, R, 0, TAU); x.stroke();
    x.strokeStyle = g; x.beginPath(); x.arc(0, 0, R, 0, TAU); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = R * 0.03; x.beginPath(); x.arc(0, 0, R - R * 0.03, Math.PI * 1.05, Math.PI * 1.45); x.stroke();
    x.save(); x.rotate(rot); x.fillStyle = 'rgba(40,16,110,0.55)'; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; x.beginPath(); x.arc(Math.cos(a) * R, Math.sin(a) * R, R * 0.022, 0, TAU); x.fill(); } x.restore();
    ball(x, 0, 0, R * 0.09, GOLD, { sha: 0.4 });
    x.restore();
  }
  // a coin that hops along an arc from p0 to p1 (u in 0..1)
  const hopPos = (p0, p1, u, hgt) => [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - hgt * Math.sin(u * Math.PI)];
  const ring0 = (x, cx, cy, r, u, col) => { if (u <= 0 || u >= 1) return; x.save(); x.globalAlpha = 1 - u; x.strokeStyle = col; x.lineWidth = 26 * (1 - u) + 4; x.beginPath(); x.arc(cx, cy, r + 650 * eo(u), 0, TAU); x.stroke(); x.restore(); };

  // ================= SCENE 1: the hook -> earn & spend -> every dollar is a worker =================
  const ROW = [[180, 1140, 80], [400, 1130, 86], [540, 1370, 118], [680, 1130, 86], [880, 1140, 80], [300, 1360, 104], [780, 1360, 104]];
  const ROW_HAT = [12.86, 12.5, 12.18, 12.5, 12.86, 12.5, 12.86];
  function s1(x, t) {
    const c = camAt(t, [[0, 540, 1150, 1.0, 0], [2.3, 540, 1150, 1.0, 0.3], [4.95, 540, 1170, 1.0, 0.4], [9.0, 540, 1160, 1.0, 0.4], [11.3, 540, 1150, 0.95, 0.4]]);
    const red = seg(t, 0.86, 1.0) * (1 - seg(t, 2.0, 2.5));
    skyP(x, t, { x: c[0] * 0.3, y: c[1] * 0.25, z: c[2], red: 0.35 * red });
    x.save(); camApply(x, t, c, { punch: punchK(t, [0, 0.86, 1.6, 3.24, 4.24, 7.34, 8.12, 10.3, 13.28], 0.08), shake: shakeK(t, [0.02, 1.6, 13.28], 20) });
    planet(x, 120, 1720, 60, PL.coral, { glowA: 0.25 });
    planet(x, 960, 1680, 46, PL.moon);
    // the hook coin: slams in huge and spinning; on "spend" it flies off, on "gone" it pops
    ring0(x, 540, 1200, 250, seg(t, 0, 0.6), '#ffffff');
    const cIn = eo(seg(t, 0, 0.3)), fly = eio(seg(t, 0.86, 1.58));
    if (t < 1.6) coin(x, lerp(540, 840, fly), lerp(1200, 980, fly), 260 * lerp(1.45, 1, cIn) * (1 - 0.6 * fly), { flip: Math.cos(t * 6.5), glowA: 0.45, rot: fly * 0.7 });
    if (t >= 1.6) burst(x, 840, 980, (t - 1.6) * 1.2, 16, 300, ['#ff5470', '#ffffff', '#ffb0c4']);
    const gone = seg(t, 1.6, 1.75) * (1 - eio(seg(t, 2.25, 2.5)));
    if (gone > 0) { x.save(); x.globalAlpha = gone; x.strokeStyle = '#ffffff'; x.lineWidth = 9; x.setLineDash([2, 24]); x.lineCap = 'round'; x.beginPath(); x.arc(540, 1200, 250, 0, TAU); x.stroke(); x.restore(); }
    stampX(x, 540, 1200, 115, back(seg(t, 1.6, 1.85), 2.4) * (1 - eio(seg(t, 2.25, 2.5))));
    // the kept dollar: pops in, gets a hard hat and a hammer, goes to work
    const kIn = back(seg(t, 3.02, 3.35), 1.8), kOut = eio(seg(t, 4.95, 5.25));
    if (kIn > 0 && kOut < 1) {
      const r = 235 * kIn * (1 - kOut);
      if (t < 3.56) coin(x, 540, 1200, r, { face: 1, look: [0, -0.2], blink: blinkAt(t, 1), glowA: 0.5 });
      else worker(x, 540, 1200, r, { t, hard: seg(t, 3.56, 3.85), swing: seg(t, 4.0, 4.2), happy: t > 4.24 ? 1 : 0, glowA: 0.45 });
      if (t > 3.56) burst(x, 540, 1060, (t - 3.56) * 1.3, 35, 260);
    }
    // ...and a line of little workers marches through on "work"
    if (t > 4.24 && t < 5.3) for (let i = 0; i < 4; i++) {
      const px = -160 + (t - 4.24) * 620 + i * 200, k = back(seg(t, 4.24 + i * 0.04, 4.5 + i * 0.04), 1.8) * (1 - eio(seg(t, 4.95, 5.25)));
      worker(x, px, 1530, 72 * k, { t, walk: 1, ph: i * 1.7, hard: 1 });
    }
    // money is simple: earn it, spend it (a wallet with coins in, coins out)
    const wIn = back(seg(t, 5.16, 5.5), 1.6), wMove = eio(seg(t, 9.16, 9.6)), wOut = eio(seg(t, 11.3, 11.6));
    const wx = lerp(540, 290, wMove), wy = lerp(1300, 1340, wMove), ws = 640 * wIn * lerp(1, 0.6, wMove) * (1 - wOut);
    const slot = [wx, wy - ws * 0.36];
    let gulp = 0;
    [6.6, 7.79, 8.01, 8.23].forEach((ta) => { gulp = Math.max(gulp, Math.max(0, 1 - Math.abs(t - ta) / 0.12)); });
    if (ws > 1) wallet(x, wx, wy, ws, { gulp });
    const mc = back(seg(t, 5.9, 6.15), 2) * (1 - seg(t, 6.55, 6.6)), md = eio(seg(t, 6.36, 6.6));
    if (mc > 0) coin(x, 540, lerp(920, slot[1], md), 84 * mc * (1 - 0.4 * md), { flip: Math.cos(t * 4), glowA: 0.4 });
    for (let i = 0; i < 3; i++) {
      const ts = 7.34 + i * 0.22, u = seg(t, ts, ts + 0.45);
      if (u > 0 && u < 1) { const p = hopPos([-120, 980], slot, eio(u), 260); coin(x, p[0], p[1], 70 * (1 - 0.4 * u), { flip: Math.cos(t * 8 + i), glowA: 0.35 }); }
      const ts2 = 8.12 + i * 0.22, v = seg(t, ts2, ts2 + 0.5);
      if (v > 0 && v < 1) { const p = hopPos(slot, [1220, 900], eio(v), 300); coin(x, p[0], p[1], 66 * (0.6 + 0.4 * v), { flip: Math.cos(t * 8 + i), glowA: 0.35 }); }
    }
    if (t > 8.12 && t < 9.2) glow(x, 1000, 960, 260, C.red, 0.3 * (1 - seg(t, 8.8, 9.2)));
    // wealthy people see it differently: the gold-shirt person studies one coin; it flips to show a face
    const bIn = back(seg(t, 9.26, 9.6), 1.8) * (1 - wOut);
    bean(x, 770, 1340 + Math.sin(t * 2.2) * 5, 150 * bIn, { t, shirt: GOLD_SHIRT, look: [-0.5, -0.5], blink: blinkAt(t, 2), happy: t > 10.6 ? 1 : 0 });
    // the coin they look at becomes the centre of the row of workers
    const fcIn = back(seg(t, 9.9, 10.2), 1.8), mv = eio(seg(t, 11.3, 11.7));
    if (fcIn > 0) {
      const p = [lerp(560, ROW[2][0], mv), lerp(1000, ROW[2][1], mv)], r = lerp(95, ROW[2][2], mv) * fcIn, fl = Math.cos(seg(t, 10.3, 10.8) * TAU);
      glow(x, p[0], p[1], 200, '#ffd23f', 0.5 * Math.max(0, 1 - Math.abs(t - 10.6) / 0.5));
      if (t < ROW_HAT[2]) coin(x, p[0], p[1] + Math.sin(t * 2.6) * 8 * (1 - mv), r, { face: t > 10.55, flip: fl, look: [0.4, -0.2], blink: blinkAt(t, 0.5), glowA: 0.45 });
    }
    if (t > 10.3 && t < 11.6) burst(x, 560, 1000, (t - 10.3) * 1.3, 103, 200, ['#9ff7ff', '#ffffff']);
    // every dollar is a worker: the row gets hard hats, salutes, then picks up hammers
    [0, 1, 3, 4, 5, 6, 2].forEach((i) => {
      const [px, py, r] = ROW[i];
      const k = i === 2 ? 1 : back(seg(t, 11.54 + i * 0.05, 11.9 + i * 0.05), 1.8);
      if (k <= 0 || (i === 2 && t < ROW_HAT[2])) return;
      const yy = py + Math.sin(t * 2.4 + i) * 5;
      if (t < ROW_HAT[i]) coin(x, px, yy, r * k, { face: 1, look: [(540 - px) / 900, -0.3], blink: blinkAt(t, i * 0.7), glowA: 0.3 });
      else worker(x, px, yy, r * k, { t, ph: i * 1.3, hard: seg(t, ROW_HAT[i], ROW_HAT[i] + 0.25), armUp: seg(t, 13.28, 13.4) * (1 - seg(t, 13.75, 13.9)), swing: seg(t, 13.75, 13.9), happy: t > 13.28 ? 1 : 0, glowA: 0.35 });
      if (t > ROW_HAT[i]) burst(x, px, py - r * 0.6, (t - ROW_HAT[i]) * 1.4, 120 + i, 120);
    });
    if (t > 13.28) burst(x, 540, 1250, (t - 13.28) * 1.1, 132, 460);
    x.restore();
  }

  // ================= SCENE 2: two people, same salary -> only one is building a team =================
  const PA = [300, 1355], PB = [780, 1355];
  // team: [x, y, r, appears, gets its hard hat]
  const TEAM = [
    [610, 1455, 70, 25.0, 25.05], [500, 1505, 62, 27.32, 28.94], [700, 1515, 62, 27.64, 29.16],
    [440, 1440, 54, 29.82, 29.95], [590, 1565, 58, 29.92, 30.05], [810, 1570, 58, 30.02, 30.15], [905, 1505, 52, 30.12, 30.25],
    [420, 1575, 54, 34.06, 34.12], [700, 1605, 54, 34.16, 34.22], [505, 1615, 50, 34.26, 34.32], [880, 1605, 50, 34.36, 34.42], [470, 1380, 46, 34.46, 34.5],
  ];
  function s2(x, t) {
    const wx = 1700 * H.ease.in(seg(t, T.whip1[0], W1));
    const c = camAt(t, [[13.9, 540, 1300, 0.95, 0], [15.0, 540, 1290, 1.0, 0.4], [17.1, 370, 1270, 1.25, 0.4], [21.95, 720, 1270, 1.25, 0.45], [25.9, 650, 1370, 1.15, 0.45], [30.7, 590, 1370, 1.12, 0.45]]);
    skyP(x, t, { x: c[0] * 0.3 + wx * 0.4, y: c[1] * 0.25, z: c[2], red: 0.3 * seg(t, 20.9, 21.05) * (1 - seg(t, 21.6, 22.0)) });
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [16.06, 18.02, 20.98, 23.02, 25.26, 27.64, 30.12, 32.08, 34.46]), shake: shakeK(t, [20.98, 34.46], 20) });
    planet(x, 540, 2900, 1400, PL.teal, { glowA: 0.2, atmo: 1 });
    glow(x, 650, 1520, 560, '#ffd23f', 0.3 * seg(t, 33.04, 33.5));
    const drawTeam = (back_) => TEAM.forEach(([px, py, r, ta, th], i) => {
      if ((py < 1480) !== back_ || t < ta || (i === 0 && t < 25.05)) return;
      const k = i === 0 ? 1 : back(seg(t, ta, ta + 0.3), 2), yy = py + Math.sin(t * 2.6 + i) * 4;
      if (t < th) coin(x, px, yy, r * k, { face: 1, look: [0, -0.3], blink: blinkAt(t, i), glowA: 0.3 });
      else worker(x, px, yy, r * k, { t, ph: i * 1.3, hard: seg(t, th, th + 0.25), swing: t > 34.46 ? 0 : seg(t, th + 0.25, th + 0.4), armUp: seg(t, 34.46, 34.6), happy: t > 34.46 ? 1 : 0 });
      if (i > 0) burst(x, px, py, (t - ta) * 1.4, 300 + i, 100);
    });
    drawTeam(true);
    // person A: the viewer, spends everything
    const aIn = back(seg(t, 14.68, 15.0), 1.8);
    x.save(); x.globalAlpha = 1 - 0.45 * seg(t, 33.04, 33.4);
    bean(x, PA[0], PA[1] + Math.sin(t * 2.2) * 6, 150 * aIn, { t, look: t < 21.9 ? [0.3, -0.4] : [0.7, 0], blink: blinkAt(t, 1), tired: t > 19.7, sweat: seg(t, 18.2, 18.5) * (1 - seg(t, 21.5, 22)) });
    x.restore();
    // person B: the gold shirt, keeps a part and puts it to work
    const bIn = back(seg(t, 15.08, 15.4), 1.8);
    bean(x, PB[0], PB[1] + Math.sin(t * 2.4) * 6, 150 * bIn, { t, shirt: GOLD_SHIRT, look: t > 24.8 ? [-0.7, 0.3] : [-0.2, -0.4], blink: blinkAt(t, 2), happy: (t > 27.3 && t < 30.7) || t > 33.9 ? 1 : 0, armUp: t > 34.46 ? 1 : 0 });
    drawTeam(false);
    // the same paycheck lands over both
    const p1 = back(seg(t, 15.76, 16.1), 1.8), pulse = Math.max(0, 1 - Math.abs(t - 16.2) / 0.3);
    bill(x, PA[0], 1105, 230, p1 * (1 - eio(seg(t, 17.26, 17.45))), { rot: -0.06, glowA: 0.4 * pulse });
    bill(x, PB[0], 1105, 230, p1 * (1 - eio(seg(t, 17.0, 17.2))) + back(seg(t, 22.16, 22.45), 1.8) * (1 - eio(seg(t, 22.52, 22.7))), { rot: 0.06, glowA: 0.4 * pulse });
    // A: the paycheck turns into coins and every one of them flies away
    if (t > 17.26 && t < 20) for (let i = 0; i < 5; i++) {
      const fan = [PA[0] + (i - 2) * 84, 1100 - (2 - Math.abs(i - 2)) * 20], k = back(seg(t, 17.26 + i * 0.04, 17.5 + i * 0.04), 2);
      const fl = eio(seg(t, 18.02 + i * 0.16, 18.62 + i * 0.16));
      if (fl < 1) { const p = hopPos(fan, [-160 + i * 50, 640], fl, 120); coin(x, p[0], p[1], 48 * k * (1 - 0.5 * fl), { flip: Math.cos(t * 8 + i), glowA: 0.3 }); }
    }
    // every month starts from zero
    const calK = back(seg(t, 19.76, 20.05), 1.8) * (1 - eio(seg(t, 21.6, 21.85)));
    const mi = t < 20.38 ? 0 : t < 20.7 ? 1 : 2, flk = Math.min(1, Math.abs(t - 20.38) / 0.1, Math.abs(t - 20.7) / 0.1);
    calendar(x, 475, 1180, 165 * calK, ['JAN', 'FEB', 'MAR'][mi], flk, 1, 0.3);
    pill(x, PA[0], 1600, '$0', 64, { s: back(seg(t, 20.98, 21.25), 2.2) * (1 - eio(seg(t, 21.6, 21.85))), bg: '#ffd0d8', fg: C.red });
    // B: keeps one coin out of five, then puts it to work
    if (t > 22.52 && t < 25.1) for (let i = 0; i < 5; i++) {
      const fan = [PB[0] + (i - 2) * 84, 1090 - (2 - Math.abs(i - 2)) * 20], k = back(seg(t, 22.52 + i * 0.04, 22.8 + i * 0.04), 2);
      if (i > 0) {
        const fl = eio(seg(t, 23.02 + (i - 1) * 0.12, 23.6 + (i - 1) * 0.12));
        if (fl < 1) { const p = hopPos(fan, [1320, 700 + i * 30], fl, 120); coin(x, p[0], p[1], 48 * k * (1 - 0.4 * fl), { flip: Math.cos(t * 8 + i), glowA: 0.3 }); }
      } else {
        const d = eio(seg(t, 24.8, 25.05)), p = hopPos(fan, [TEAM[0][0], TEAM[0][1]], d, 140), hi = seg(t, 23.02, 23.3);
        glow(x, p[0], p[1], 140, '#ffd23f', 0.55 * hi * (1 - d));
        coin(x, p[0], p[1], lerp(48, TEAM[0][2], d) * k * (1 + 0.15 * Math.max(0, 1 - Math.abs(t - 23.4) / 0.25)), { face: t > 23.3, look: [0.3, 0.3], glowA: 0.4 });
        if (hi > 0) spark(x, p[0] + 34, p[1] - 34, 18 * hi * (0.7 + 0.3 * Math.sin(t * 8)), '#ffffff', 1);
      }
    }
    // they earn exactly the same: the same paycheck again, with "=" between
    const sm = back(seg(t, 32.08, 32.4), 1.8) * (1 - eio(seg(t, 33.6, 33.9)));
    bill(x, PA[0], 1118, 180, sm, { rot: -0.05 }); bill(x, PB[0], 1118, 180, sm, { rot: 0.05 });
    if (sm > 0) text(x, '=', 540, 1118, 110, '#ffffff', { a: cl(sm) });
    if (t > 34.46) burst(x, 650, 1500, (t - 34.46) * 1.1, 346, 420);
    x.restore();
  }

  // ================= SCENE 3: spent once vs. working for years (even while you sleep) =================
  const KEEP_W = [560, 2530], PILE = [410, 2620];
  function s3(x, t) {
    const wx = -1700 * (1 - H.ease.out(seg(t, W1, T.whip1[1])));
    const z = Math.exp(Math.log(10) * H.ease.in(seg(t, T.dive[0], T.dive[1])));
    const c = camAt(t, [[35.15, 497, 1215, 1.22, 0], [38.95, 520, 2390, 1.3, 0.42]]);
    const night = eio(seg(t, 43.15, 43.5));
    skyP(x, t, { x: c[0] * 0.3 - wx * 0.4, y: c[1] * 0.25, z: c[2] * z });
    if (night > 0) { x.fillStyle = H.rgba('#05041a', 0.5 * night); x.fillRect(0, 0, PW, PH); }
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [37.06, 38.2, 40.44, 42.22, 43.88]) });
    x.translate(KEEP_W[0], KEEP_W[1]); x.scale(z, z); x.translate(-KEEP_W[0], -KEEP_W[1]);
    // spend it: the dollar walks into someone else's shop, works once and is gone
    bean(x, 200, 1330 + Math.sin(t * 2.2) * 5, 105 * back(seg(t, 35.3, 35.6), 1.8), { t, look: [0.6, 0], blink: blinkAt(t, 1), tired: t > 38.2 });
    const oIn = back(seg(t, 37.94, 38.25), 1.8);
    bean(x, 640, 1160 + (1 - cl(oIn)) * 90, 80 * oIn, { t, shirt: ['#ff8fc8', '#b23a6e'], happy: t > 38.2 ? 1 : 0, look: [-0.4, 0.2] });
    const sk = back(seg(t, 35.45, 35.8), 1.6);
    if (sk > 0.01) { x.save(); x.translate(640, 1450); x.scale(sk, sk); shop(x, 0, 0, 330); x.restore(); }
    glow(x, 726, 1390, 220, '#ffd86a', 0.6 * Math.max(0, 1 - Math.abs(t - 37.0) / 0.35));
    const sc = back(seg(t, 35.72, 36.0), 1.8), walkU = eio(seg(t, 36.08, 36.74)), inU = eio(seg(t, 37.78, 38.1));
    if (sc > 0 && inU < 1) {
      const p = [lerp(lerp(310, 650, walkU), 726, inU), lerp(1330, 1395, walkU) - 60 * Math.sin(inU * Math.PI)];
      worker(x, p[0], p[1], 56 * sc * (1 - 0.8 * inU), { t, walk: walkU > 0 && walkU < 1 ? 1 : 0, hard: seg(t, 35.92, 36.1), swing: seg(t, 36.8, 36.84) * (1 - seg(t, 37.15, 37.25)), look: [0.5, 0] });
    }
    if (t > 37.9) burst(x, 726, 1380, (t - 37.9) * 1.3, 379, 160, ['#ffb0d0', '#ffffff']);
    pill(x, 470, 1215, '×1', 56, { s: back(seg(t, 37.06, 37.3), 2.2) * (1 - eio(seg(t, 38.8, 39.0))), bg: '#ffd0d8', fg: C.red });
    // keep it: the dollar goes to work for you; coins keep hopping onto your pile, year after year
    const v2 = back(seg(t, 39.1, 39.4), 1.8) * (1 - eio(seg(t, 43.2, 43.45)));
    bean(x, 250, 2480 + Math.sin(t * 2.2) * 5, 110 * v2, { t, look: [0.6, 0.1], blink: blinkAt(t, 1.5), happy: t > 41.5 ? 1 : 0 });
    const kc = back(seg(t, 39.42, 39.7), 1.8), hop = eio(seg(t, 40.04, 40.4));
    if (kc > 0) {
      const p = hopPos([380, 2430], KEEP_W, hop, 160), r = lerp(50, 85, hop) * kc;
      if (night > 0) glow(x, KEEP_W[0], KEEP_W[1], 260, '#ffd23f', 0.45 * night);
      if (t < 40.44) coin(x, p[0], p[1], r, { face: 1, look: [-0.3, 0], blink: blinkAt(t, 3), glowA: 0.45 });
      else worker(x, p[0], p[1], r, { t, hard: seg(t, 40.44, 40.7), swing: seg(t, 40.7, 40.85), happy: t > 41.4 ? 1 : 0, glowA: 0.4 });
    }
    let landed = 0;
    for (let k = 0; k < 9; k++) {
      const ts = 41.44 + k * 0.34, u = seg(t, ts, ts + 0.3);
      if (u >= 1) landed++;
      else if (u > 0) { const p = hopPos([KEEP_W[0] - 40, KEEP_W[1] - 60], [PILE[0], PILE[1] - landed * 22], eio(u), 120); coin(x, p[0], p[1], 34, { flip: Math.cos(t * 9 + k), glowA: 0.3 }); }
    }
    for (let j = 0; j < landed; j++) coin(x, PILE[0] + (j % 2) * 8 - 4, PILE[1] - j * 22, 36, { glowA: j === landed - 1 ? 0.5 : 0, flip: 1 });
    const ck = back(seg(t, 41.9, 42.2), 1.8), yi = t < 42.22 ? 1 : Math.min(9, 2 + Math.floor((t - 42.22) / 0.32));
    const yflip = t < 42.22 ? 1 : Math.min(1, ((t - 42.22) % 0.32) / 0.1);
    calendar(x, 800, 2275, 165 * ck, 'YEAR ' + yi, yflip, 1, 0.22);
    // even while you sleep
    const mk = back(seg(t, 43.2, 43.55), 1.6);
    if (mk > 0) {
      crescentMoon(x, 250, 2390, 160 * mk);
      const s = moonSeat(250, 2390, 160 * mk, 75 * mk); bean(x, s[0], s[1], 75 * mk, { t, sleep: true, cap: 1, noFeet: true, rot: -0.12, zzz: mk });
    }
    x.restore();
  }

  // ================= SCENE 4: "can I afford this?" vs. "what could this dollar become?" =================
  const GHOST = [[170, 1030, 78], [910, 1030, 74], [210, 1275, 70], [860, 1275, 70], [300, 880, 58], [780, 880, 58]];
  function s4(x, t) {
    const em = 1 + 1.4 * (1 - eo(seg(t, T.dive[1], T.dive[1] + 0.6)));
    const wy = 1900 * H.ease.in(seg(t, T.whip2[0], W2));
    skyP(x, t, { x: 200 + t * 10, y: wy * 0.3, z: em });
    x.save(); camApply(x, t, [540, 1120, 1.0], { dy: wy, punch: punchK(t, [45.34, 47.42, 49.86, 50.14]) * em });
    const bIn = back(seg(t, 44.95, 45.35), 1.6);
    bean(x, 540, 1430 + Math.sin(t * 2) * 5, 180 * bIn, { t, shirt: GOLD_SHIRT, look: [0, -0.7], blink: blinkAt(t, 1), happy: t > 50.14 ? 1 : 0, armUp: t > 50.3 ? 1 : 0 });
    // the question they don't ask: a thought cloud with a price tag, crossed out
    const bk = back(seg(t, 46.22, 46.55), 1.6) * (1 - eio(seg(t, 48.26, 48.5)));
    cloud(x, 540, 1000, 600, 330, bk, 540, 1250);
    if (bk > 0.01) {
      priceTag(x, 490, 1005, '$$$', 1.5 * back(seg(t, 47.0, 47.3), 2) * bk, { rot: -0.08 });
      text(x, '?', 690, 995, 150 * back(seg(t, 47.42, 47.62), 2) * bk, C.pink, { shadow: 'rgba(10,8,46,0.25)' });
      stampX(x, 800, 880, 84, back(seg(t, 47.62, 47.85), 2.2) * (bk > 0.2 ? 1 : 0));
    }
    // the question they do ask: one dollar, and the team it could become
    const ck = back(seg(t, 48.5, 48.85), 1.6), pul = 1 + 0.12 * Math.max(0, 1 - Math.abs(t - 49.95) / 0.25);
    if (ck > 0) {
      glow(x, 540, 1000, 340, '#ffd23f', 0.35 + 0.35 * seg(t, 49.6, 50.1));
      const la = seg(t, 49.3, 49.6);
      if (la > 0) loopArrow(x, 540, 1000, 215, -Math.PI / 2 + t * 1.2, -Math.PI / 2 + t * 1.2 + TAU * 0.82 * eo(la), '#ffe28a', 10, la * (1 - seg(t, 50.1, 50.3)));
      if (t < 50.14) coin(x, 540, 1000 + Math.sin(t * 2.6) * 8, 150 * ck * pul, { glowA: 0.5, flip: 1 });
      else worker(x, 540, 1000, 150 * pul, { t, hard: seg(t, 50.14, 50.35), happy: 1, armUp: seg(t, 50.3, 50.45), glowA: 0.5 });
    }
    GHOST.forEach(([px, py, r], i) => {
      const k = back(seg(t, 50.14 + i * 0.06, 50.45 + i * 0.06), 1.8);
      if (k <= 0) return;
      x.save(); x.globalAlpha = lerp(0.4, 1, seg(t, 50.6, 50.9));
      worker(x, px, py + Math.sin(t * 2.4 + i) * 5, r * k, { t, hard: 1, swing: 1, ph: i * 1.1, happy: 1 });
      x.restore();
      arrow(x, [[540, 1000], [lerp(540, px, 0.3), lerp(1000, py, 0.3)], [lerp(540, px, 0.6), lerp(1000, py, 0.6)], [lerp(540, px, 0.78), lerp(1000, py, 0.78)]], eio(seg(t, 50.14, 50.4)), '#ffe28a', 7, { dots: true, head: false, a: 0.7 * (1 - seg(t, 50.7, 51.0)) });
    });
    if (t > 50.14) burst(x, 540, 1000, (t - 50.14) * 1.2, 501, 460);
    x.restore();
  }

  // ================= SCENE 5: small at first, nothing seems to happen; one dollar at a time =================
  const NEWW = [[400, 1440, 56, 60.18], [680, 1440, 56, 60.6], [265, 1446, 54, 60.96], [815, 1446, 54, 61.24]];
  function s5(x, t) {
    const wy = -1900 * (1 - H.ease.out(seg(t, W2, T.whip2[1])));
    const up = 1900 * H.ease.in(seg(t, T.whip3[0], W3));
    const c = camAt(t, [[51.37, 540, 1330, 1.5, 0], [53.9, 540, 1330, 1.35, 0.4], [56.7, 540, 1400, 1.15, 0.45]]);
    skyP(x, t, { x: 300 + t * 12, y: (wy + up) * 0.3 + c[1] * 0.25, z: c[2] });
    x.save(); camApply(x, t, c, { dy: wy + up, punch: punchK(t, [53.06, 55.38, 58.76, 60.18, 60.6, 60.96, 61.24]) });
    planet(x, 540, 2700, 1200, PL.teal, { glowA: 0.2, atmo: 1 });
    glow(x, 540, 1432, 340, '#ffd23f', 0.45 * seg(t, 57.4, 57.8));
    // time passes, the bar barely moves
    const ck = back(seg(t, 53.94, 54.25), 1.8) * (1 - eio(seg(t, 56.6, 56.9)));
    alarmClock(x, 540, 1268, 62 * ck, { t, h: 9 + Math.max(0, t - 53.94) * 10 });
    let frac = 0.04 + 0.02 * seg(t, 54.3, 56.7);
    NEWW.forEach(([, , , ts]) => { frac += 0.1 * eio(seg(t, ts, ts + 0.25)); });
    gauge(x, 540, 1625, 600, frac, '', C.yellow, seg(t, 54.3, 54.6));
    pill(x, 540, 1548, 'YOUR TEAM', 34, { s: back(seg(t, 54.3, 54.6), 1.6), bg: '#ffffff' });
    pill(x, 645, 1362, '...', 34, { s: back(seg(t, 55.38, 55.6), 2) * (1 - eio(seg(t, 56.6, 56.8))), bg: '#e6e0ff' });
    // the first worker: tiny, but working; then a check, then a team, one dollar at a time
    const happy = t > 58.76 ? 1 : 0;
    worker(x, 540, 1432, 60 * back(seg(t, 51.45, 51.75), 1.8), { t, hard: 1, swing: t > 58.76 && t < 59.4 ? 0 : 1, armUp: t > 58.76 && t < 59.4 ? 1 : 0, sweat: seg(t, 54.5, 54.8) * (1 - seg(t, 56.6, 56.8)), happy });
    badge(x, 612, 1365, 26, 'ok', back(seg(t, 58.76, 59.0), 2.2));
    NEWW.forEach(([px, py, r, ts], i) => {
      const k = back(seg(t, ts, ts + 0.3), 2);
      if (k <= 0) return;
      worker(x, px, py, r * k, { t, hard: 1, swing: 1, ph: i * 1.5, happy: 1 });
      burst(x, px, py, (t - ts) * 1.4, 600 + i, 90);
    });
    x.restore();
  }

  // ================= SCENE 6: not working for money forever -> a team of money that works for you =================
  const ARMY = (() => {
    const rows = [[1440, 46, [140, 265, 815, 890]], [1545, 54, [165, 295, 430, 650, 780, 885]], [1650, 60, [235, 385, 540, 695, 845]]], a = [];
    rows.forEach(([y, r, xs]) => xs.forEach((px) => a.push([px, y, r])));
    a.sort((p, q) => Math.abs(q[0] - 540) - Math.abs(p[0] - 540) || p[1] - q[1]);
    return a.map((p, i) => [...p, 65.82 + i * 0.075]);
  })();
  function s6(x, t) {
    const wy = -1900 * (1 - H.ease.out(seg(t, W3, T.whip3[1])));
    const c = camAt(t, [[61.67, 540, 1290, 1.0, 0], [65.3, 540, 1420, 1.04, 0.5]]);
    skyP(x, t, { x: 500 + t * 14, y: wy * 0.3 + c[1] * 0.25, z: c[2] });
    x.save(); camApply(x, t, c, { dy: wy, punch: punchK(t, [62.64, 64.38, 65.82, 66.44, 67.54], 0.07), shake: shakeK(t, [64.38, 67.54], 16) });
    planet(x, 540, 2650, 1150, PL.teal, { glowA: 0.2, atmo: 1 });
    flare(x, 540, 1330, Math.max(0, 1 - Math.abs(t - 67.75) / 0.9) * (t > 67.54 ? 1 : 0) + 0.35 * seg(t, 68.0, 68.4), t);
    // working for money forever: running in a wheel after a coin on a stick
    const wk = back(seg(t, 61.75, 62.1), 1.6) * (1 - eio(seg(t, 64.9, 65.3)));
    if (wk > 0.01) {
      x.save(); x.translate(540, 1275); x.scale(wk, wk);
      wheel(x, 0, 0, 228, t * 3.2);
      const sw = Math.sin(t * 5) * 0.12;
      x.strokeStyle = '#9a5a26'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(-40, -30); x.lineTo(160, -40); x.stroke();
      const cx2 = 160 + Math.sin(sw) * 100, cy2 = -40 + Math.cos(sw) * 100;
      x.strokeStyle = '#e6e0ff'; x.lineWidth = 4; x.beginPath(); x.moveTo(160, -40); x.lineTo(cx2, cy2); x.stroke();
      coin(x, cx2, cy2 + 30, 36, { glowA: 0.5, flip: Math.cos(t * 4) });
      bean(x, 0, 100 - Math.abs(Math.sin(t * 14)) * 12, 100, { t: t * 3, hard: 1, tired: 1, sweat: 1, look: [1, -0.4] });
      x.restore();
    }
    stampX(x, 790, 1130, 80, back(seg(t, 64.38, 64.6), 2.2) * (1 - eio(seg(t, 64.9, 65.2))));
    // the person, now in gold, and a whole team of money marching in to work for them
    const gIn = back(seg(t, 65.2, 65.55), 1.8);
    const drawArmy = (back_) => ARMY.forEach(([px, py, r, ta], i) => {
      if ((py < 1500) !== back_) return;
      const k = eo(seg(t, ta, ta + 0.5));
      if (k <= 0) return;
      const sx = px < 540 ? -120 : 1200, cheer = seg(t, 67.54, 67.66);
      worker(x, lerp(sx, px, k), py + Math.sin(t * 2.6 + i) * 4, r, { t, walk: k < 1 ? 1 : 0, ph: i * 1.3, hard: 1, swing: k >= 1 ? 1 - cheer : 0, armUp: cheer, happy: t > 66.44 ? 1 : 0, look: [(540 - px) / 700, -0.2] });
    });
    drawArmy(true);
    bean(x, 540, 1360 + Math.sin(t * 2) * 5, 140 * gIn, { t, shirt: GOLD_SHIRT, happy: t > 66.44 ? 1 : 0, look: [0, -0.3], blink: blinkAt(t, 1), armUp: t > 67.84 ? 1 : 0 });
    if (t > 65.36) burst(x, 540, 1360, (t - 65.36) * 1.3, 653, 220);
    drawArmy(false);
    burst(x, 540, 1300, (t - 67.54) * 1.0, 675, 460);
    if (t > 67.8) for (let i = 0; i < 9; i++) { const q = H.rng(700 + i); spark(x, q.range(80, 1000), q.range(700, 1500), q.range(10, 20) * (0.5 + 0.5 * Math.sin(t * 3 + i)), '#ffffff', seg(t, 67.8, 68.1)); }
    x.restore();
  }

  // ================= EXPLAINER =================
  function explainerV(ctx, W, H_, t) {
    const x = ctx;
    const sw = eio(seg(t, T.sweep[0], T.sweep[1]));
    const sx = lerp(PW + 1500, -1500, sw), sy = lerp(PH + 600, -600, sw);
    if (t < T.sweep[0] || sx > 540) s1(x, t);
    else if (t < W1) s2(x, t);
    else if (t < T.dive[1]) s3(x, t);
    else if (t < W2) s4(x, t);
    else if (t < W3) s5(x, t);
    else s6(x, t);
    if (sw > 0 && sw < 1) planet(x, sx, sy, 1300, PL.magenta, { glowA: 0.4, ringA: 0 });
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - W1) / 0.2) * 0.8, false);
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - W2) / 0.22) * 0.8, true);
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - W3) / 0.22) * 0.8, true);
    const wo = seg(t, T.dive[0] + 0.2, T.dive[1]) * (1 - seg(t, T.dive[1], T.dive[1] + 0.35));
    if (wo > 0) { const g = x.createRadialGradient(540, 960, 0, 540, 960, 1100); g.addColorStop(0, H.rgba('#ffffff', wo)); g.addColorStop(0.5, H.rgba('#ffe9a8', wo * 0.95)); g.addColorStop(1, H.rgba('#6a4cff', wo * 0.9)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); }
    // red flash on the trap words of the hook, white flashes on the biggest hits
    for (const tf of [0.86, 1.6]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.14); if (f > 0) { const g = x.createRadialGradient(540, 960, 300, 540, 960, 1200); g.addColorStop(0, 'rgba(255,59,92,0)'); g.addColorStop(1, H.rgba(C.red, 0.55 * f)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); } }
    for (const tf of [0.02, 13.28, 34.46, 67.54]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.12); if (f > 0) { x.fillStyle = H.rgba('#ffffff', 0.35 * f); x.fillRect(0, 0, PW, PH); } }
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
    const tap = (t, g = 0.5) => k.play('tock', t, { f: 700, gain: 0.18 * g });
    // the hook: low hit + swish on frame 0, the coin flies off and pops
    k.play('thud', 0.0, { f: 110, gain: 0.35 }); k.play('swish', 0.0, { dur: 0.2, gain: 0.4 });
    clink(0.05, 0.5);
    k.play('swish', 0.86, { dur: 0.35, gain: 0.35 });
    k.play('stamp', 1.6, { gain: 0.3 });
    soft(3.05, 0.5); k.play('tock', 3.6, { f: 380, gain: 0.3 }); k.play('sparkle', 3.62, { gain: 0.25, n: 4 });
    [4.05, 4.3, 4.55].forEach((tt) => tap(tt, 0.6));
    for (let i = 0; i < 4; i++) soft(4.26 + i * 0.04, 0.25);
    whoosh(4.95, 0.35, 0.35, 1200);
    // earn it, spend it
    soft(5.2, 0.45); clink(5.92, 0.4); k.play('pop', 6.6, { f: 300, gain: 0.25 });
    for (let i = 0; i < 3; i++) clink(7.79 + i * 0.22, 0.4, -0.3);
    for (let i = 0; i < 3; i++) k.play('swish', 8.12 + i * 0.22, { dur: 0.2, gain: 0.18 });
    soft(9.3, 0.4); k.play('swish', 10.3, { dur: 0.3, gain: 0.25 }); k.play('sparkle', 10.35, { gain: 0.25, n: 4 });
    whoosh(11.3, 0.35, 0.3);
    for (let i = 0; i < 5; i++) soft(11.56 + Math.abs(i - 2) * 0.08, 0.3);
    [12.18, 12.5, 12.86].forEach((tt, i) => k.play('tock', tt, { f: 360 + i * 60, gain: 0.28 }));
    k.play('impact', 13.28, { gain: 0.25 }); k.play('sparkle', 13.3, { gain: 0.3, n: 6 });
    // sweep to the two people
    whoosh(T.sweep[0], T.sweep[1] - T.sweep[0], 0.6, 1300);
    soft(14.7, 0.45); soft(15.1, 0.45); k.play('paper', 15.8, { dur: 0.2, gain: 0.4 });
    k.play('swish', 17.3, { dur: 0.2, gain: 0.25 });
    for (let i = 0; i < 5; i++) k.play('swish', 18.02 + i * 0.16, { dur: 0.15, gain: 0.15 });
    whoosh(17.1, 0.4, 0.3);
    [20.38, 20.7].forEach((tt) => k.play('paper', tt, { dur: 0.15, gain: 0.3 }));
    k.play('stamp', 20.98, { gain: 0.3 });
    whoosh(21.95, 0.45, 0.3);
    k.play('paper', 22.2, { dur: 0.2, gain: 0.35 });
    for (let i = 0; i < 4; i++) k.play('swish', 23.02 + i * 0.12, { dur: 0.15, gain: 0.14 });
    k.play('ding', 23.3, { f: 'G6', gain: 0.15 });
    k.play('swish', 24.8, { dur: 0.25, gain: 0.25 }); k.play('tock', 25.05, { f: 380, gain: 0.3 });
    for (let tt = 25.5; tt < 34.4; tt += 0.62) tap(tt, 0.35);
    [27.32, 27.64].forEach((tt, i) => pluck(tt, ['E5', 'G5'][i], 0.4));
    [28.94, 29.16].forEach((tt, i) => k.play('tock', tt, { f: 420 + i * 60, gain: 0.25 }));
    [29.82, 29.92, 30.02, 30.12].forEach((tt, i) => pluck(tt, ['C5', 'E5', 'G5', 'C6'][i], 0.35));
    k.play('paper', 32.1, { dur: 0.2, gain: 0.3 });
    for (let i = 0; i < 5; i++) soft(34.06 + i * 0.1, 0.3);
    k.play('impact', 34.46, { gain: 0.28 }); k.play('sparkle', 34.48, { gain: 0.3, n: 6 }); for (let i = 0; i < 5; i++) clink(34.5 + i * 0.07, 0.35);
    // whip to spend once vs. keep
    whoosh(T.whip1[0], 0.4, 0.7, 2600);
    soft(35.5, 0.35); soft(35.75, 0.35);
    for (let tt = 36.1; tt < 36.74; tt += 0.16) k.play('tick', tt, { f: 2600, gain: 0.15 });
    tap(36.86, 0.8); k.play('ding', 37.06, { f: 'E6', gain: 0.12 });
    k.play('swish', 37.8, { dur: 0.25, gain: 0.25 }); soft(37.96, 0.35);
    whoosh(38.95, 0.45, 0.4);
    soft(39.45, 0.4); k.play('swish', 40.05, { dur: 0.3, gain: 0.25 }); k.play('tock', 40.45, { f: 380, gain: 0.3 });
    for (let kk = 0; kk < 9; kk++) clink(41.74 + kk * 0.34, 0.3, -0.2);
    [42.22, 42.54, 42.86].forEach((tt) => k.play('paper', tt, { dur: 0.12, gain: 0.2 }));
    k.tone(43.2, { f: [[0, 660], [0.8, 440]], type: 'sine', dur: 0.9, gain: 0.03, a: 0.1, verb: 0.4 });
    // dive into the worker
    k.play('riser', T.dive[0] - 0.1, { dur: 0.6, gain: 0.4 });
    soft(45.05, 0.4); soft(46.25, 0.4); k.play('tick', 47.05, { f: 3000, gain: 0.25 });
    k.play('stamp', 47.62, { gain: 0.25 });
    k.play('swish', 48.3, { dur: 0.25, gain: 0.25 }); clink(48.55, 0.45);
    k.noise(49.3, { dur: 0.8, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.8, 2400]], q: 1.2, gain: 0.06, a: 0.6 });
    k.play('sparkle', 50.14, { gain: 0.35, n: 6 }); pluck(50.16, 'C5', 0.45); pluck(50.22, 'G5', 0.4);
    // whip down to the first small worker
    whoosh(T.whip2[0], 0.45, 0.6, 2200);
    soft(51.5, 0.35);
    for (let tt = 52.0; tt < 56.6; tt += 0.62) tap(tt, 0.25);
    for (let tt = 54.0; tt < 56.6; tt += 0.11) k.play('tick', tt, { f: 4200, gain: 0.08 });
    k.play('ding', 58.78, { f: 'A6', gain: 0.15 });
    NEWW.forEach(([, , , ts], i) => { soft(ts, 0.35); pluck(ts + 0.02, ['C5', 'E5', 'G5', 'C6'][i], 0.4); });
    // whip up to the finale
    whoosh(T.whip3[0], 0.45, 0.6, 2200);
    soft(61.8, 0.4);
    for (let tt = 62.0; tt < 64.8; tt += 0.14) k.play('tick', tt, { f: 2400, gain: 0.07 });
    k.play('stamp', 64.38, { gain: 0.25 });
    k.play('swish', 64.95, { dur: 0.3, gain: 0.25 }); k.play('sparkle', 65.38, { gain: 0.3, n: 5 });
    ARMY.forEach(([, , , ta], i) => { if (i % 2 === 0) soft(ta + 0.4, 0.22); });
    [65.82, 66.44, 67.04].forEach((tt, i) => pluck(tt, ['E5', 'G5', 'C6'][i], 0.35));
    k.play('impact', 67.54, { gain: 0.3 });
    ['C4', 'G4', 'C5', 'E5', 'G5'].forEach((n, i) => k.tone(67.56 + i * 0.012, { f: n, type: 'triangle', dur: 1.3, gain: 0.03, a: 0.02, verb: 0.3 }));
    k.play('sparkle', 67.7, { gain: 0.3, n: 6 });
  }


  window.FV = { explainer: explainerV, scoreSound: scoreSoundV, DURATION: DUR, W: PW, H: PH };
})();
