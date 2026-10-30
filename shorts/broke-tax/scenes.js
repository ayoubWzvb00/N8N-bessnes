  // ================= PROJECT: "Being broke is the most expensive thing you'll ever pay for" =================
  // Continues the closure from shorts-kit/lib/base.js + vertical.js. All times are seconds on voice.mp3 (see words.json).
  const DUR = 75.8;
  const LEATHER = ['#f2c08a', '#a8612c', '#4e2410'], PLASTIC = ['#dcd8ff', '#8f89c6', '#3f3880'];
  const BRAIN = ['#ffd0e6', '#ff86b8', '#9c2f6e'];

  // ---------- props for this short (same recipe: gradients, flat crescent shadows, glows, no outlines) ----------
  function boot(x, cx, by, s, o = {}) {
    if (s < 1) return;
    const pal = o.pal || LEATHER, torn = cl(o.torn || 0);
    x.save(); x.translate(cx, by); x.rotate(o.rot || 0);
    x.fillStyle = 'rgba(10,8,46,0.35)'; x.beginPath(); x.ellipse(0.1 * s, 0.04 * s, 0.6 * s, 0.07 * s, 0, 0, TAU); x.fill();
    // sole (the toe flaps open when torn)
    x.save(); x.translate(-0.42 * s, 0); x.rotate(torn * 0.32);
    x.fillStyle = '#2a1f3a'; rr(x, 0, -0.12 * s, 1.06 * s, 0.13 * s, 0.065 * s); x.fill(); x.restore();
    const g = x.createLinearGradient(-0.4 * s, -1.0 * s, 0.6 * s, 0); g.addColorStop(0, pal[0]); g.addColorStop(0.5, pal[1]); g.addColorStop(1, H.rgba(H.mix(pal[1], pal[2], 0.6)));
    x.fillStyle = g; x.beginPath(); x.moveTo(-0.42 * s, -0.1 * s); x.lineTo(-0.42 * s, -1.0 * s); x.lineTo(0.06 * s, -1.0 * s); x.lineTo(0.09 * s, -0.48 * s);
    x.quadraticCurveTo(0.6 * s, -0.46 * s, 0.64 * s, -0.18 * s); x.lineTo(0.64 * s, -0.1 * s); x.closePath(); x.fill();
    x.fillStyle = H.rgba(pal[2], 0.35); rr(x, -0.1 * s, -1.0 * s, 0.16 * s, 0.9 * s, 0.05 * s); x.fill();
    x.fillStyle = H.rgba(pal[0], 0.9); rr(x, -0.46 * s, -1.06 * s, 0.56 * s, 0.13 * s, 0.06 * s); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 0.035 * s; x.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const ly = -0.85 * s + i * 0.14 * s; x.beginPath(); x.moveTo(-0.02 * s, ly); x.lineTo(0.12 * s, ly + 0.05 * s); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,0.45)'; x.lineWidth = 0.04 * s; x.beginPath(); x.moveTo(-0.34 * s, -0.92 * s); x.lineTo(-0.34 * s, -0.3 * s); x.stroke();
    if (torn > 0) {
      x.fillStyle = '#1a1030'; x.beginPath(); x.moveTo(0.18 * s, -0.42 * s);
      [[0.26, -0.3], [0.2, -0.24], [0.32, -0.16], [0.24, -0.12]].forEach(([a, b]) => x.lineTo(lerp(0.18, a, torn) * s, lerp(-0.42, b, torn) * s));
      x.closePath(); x.fill();
    }
    if (o.shine) { spark(x, 0.36 * s, -0.36 * s, 0.13 * s * (0.6 + 0.4 * Math.sin((o.t || 0) * 5)), '#ffffff', 0.9); }
    x.restore();
  }
  function rainCloud(x, cx, cy, s, t, a) {
    if (a <= 0.01) return;
    x.save(); x.globalAlpha *= a;
    x.strokeStyle = '#7fe6ff'; x.lineWidth = 7; x.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const u = (t * 2.2 + i * 0.37) % 1, rx = cx + (i - 4) * s * 0.22, ry = cy + s * 0.2 + u * s * 1.1; x.globalAlpha = a * (1 - u); x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - 8, ry + 26); x.stroke(); }
    x.globalAlpha = a;
    const CP = ['#e6e3ff', '#9a95cc', '#4a4590'];
    [[-0.5, 0.05, 0.42], [0.45, 0.08, 0.4], [0, -0.12, 0.55]].forEach(([dx, dy, r]) => ball(x, cx + dx * s, cy + dy * s, r * s, CP, { sha: 0.35 }));
    x.restore();
  }
  function bill(x, cx, cy, w, label, s, rot) {
    if (s <= 0.01) return;
    const h = w * 1.25;
    x.save(); x.translate(cx, cy); x.rotate(rot || 0); x.scale(s, s);
    glow(x, 0, 0, w * 1.2, C.red, 0.3);
    const edge = () => { x.beginPath(); x.moveTo(-w / 2, -h / 2); x.lineTo(w / 2, -h / 2); x.lineTo(w / 2, h / 2); for (let i = 0; i <= 8; i++) x.lineTo(w / 2 - (i * w) / 8, h / 2 + (i % 2 ? -12 : 0)); x.closePath(); };
    x.save(); x.translate(8, 12); x.fillStyle = 'rgba(10,8,46,0.4)'; edge(); x.fill(); x.restore();
    x.fillStyle = '#ffffff'; edge(); x.fill();
    x.fillStyle = '#d9d5f5'; for (let i = 0; i < 4; i++) { rr(x, -w * 0.36, -h * 0.36 + i * h * 0.13, w * (i % 2 ? 0.5 : 0.72), h * 0.05, h * 0.025); x.fill(); }
    pill(x, 0, h * 0.24, label, 44, { bg: C.red, fg: '#ffffff' });
    x.restore();
  }
  function groceryBag(x, cx, by, s, a = 1) {
    if (s < 1 || a <= 0.01) return;
    x.save(); x.globalAlpha *= a; x.translate(cx, by);
    ball(x, -0.18 * s, -0.95 * s, 0.22 * s, ['#c9ff9a', '#4fc24a', '#1f6a2a']);
    x.fillStyle = '#ffd36b'; x.save(); x.translate(0.2 * s, -1.0 * s); x.rotate(0.35); rr(x, -0.08 * s, -0.32 * s, 0.16 * s, 0.6 * s, 0.08 * s); x.fill(); x.restore();
    ball(x, 0.05 * s, -0.86 * s, 0.17 * s, RUBY);
    const g = x.createLinearGradient(-0.5 * s, -0.8 * s, 0.5 * s, 0); g.addColorStop(0, '#f5d3a2'); g.addColorStop(1, '#b77b42');
    x.fillStyle = 'rgba(10,8,46,0.35)'; x.beginPath(); x.moveTo(-0.44 * s, -0.74 * s); x.lineTo(0.48 * s, -0.74 * s); x.lineTo(0.56 * s, 0.04 * s); x.lineTo(-0.36 * s, 0.04 * s); x.fill();
    x.fillStyle = g; x.beginPath(); x.moveTo(-0.48 * s, -0.78 * s); x.lineTo(0.48 * s, -0.78 * s); x.lineTo(0.54 * s, 0); x.lineTo(-0.54 * s, 0); x.closePath(); x.fill();
    x.fillStyle = 'rgba(120,70,30,0.3)'; rr(x, -0.48 * s, -0.78 * s, 0.96 * s, 0.1 * s, 0.03 * s); x.fill();
    x.restore();
  }
  function mysteryBox(x, cx, cy, s, open, t) {
    if (s < 1) return;
    const o = cl(open);
    glow(x, cx, cy, s * 1.9, '#8b5cff', 0.45 + 0.15 * Math.sin(t * 4));
    if (o > 0) {
      x.save(); x.globalAlpha *= o; x.translate(cx, cy - s * 0.5);
      for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.22; x.fillStyle = 'rgba(255,240,180,0.35)'; x.beginPath(); x.moveTo(-s * 0.3 + i * s * 0.1, 0); x.lineTo(Math.cos(a) * s * 2.4, Math.sin(a) * s * 2.4); x.lineTo(Math.cos(a + 0.08) * s * 2.4, Math.sin(a + 0.08) * s * 2.4); x.fill(); }
      glow(x, 0, 0, s * 1.4, '#fff3b0', 0.7); x.restore();
    }
    x.save(); x.translate(cx, cy);
    const g = x.createLinearGradient(-s * 0.5, -s * 0.5, s * 0.5, s * 0.5); g.addColorStop(0, '#b9a2ff'); g.addColorStop(0.5, '#6b46e0'); g.addColorStop(1, '#2c1a7a');
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -s * 0.5 + 10, -s * 0.5 + 14, s, s, s * 0.12); x.fill();
    x.fillStyle = g; rr(x, -s * 0.5, -s * 0.5, s, s, s * 0.12); x.fill();
    x.fillStyle = 'rgba(30,14,90,0.35)'; rr(x, s * 0.14, -s * 0.5, s * 0.36, s, s * 0.12); x.fill();
    x.fillStyle = C.yellow; rr(x, -s * 0.07, -s * 0.5, s * 0.14, s, s * 0.04); x.fill();
    if (o < 0.5) text(x, '?', 0, s * 0.06, s * 0.62, '#ffffff');
    x.save(); x.translate(-s * 0.56, -s * 0.5); x.rotate(-o * 1.1);
    const lg = x.createLinearGradient(0, -s * 0.2, s * 1.12, 0); lg.addColorStop(0, '#c9b6ff'); lg.addColorStop(1, '#5432c8');
    x.fillStyle = lg; rr(x, 0, -s * 0.2, s * 1.12, s * 0.22, s * 0.08); x.fill();
    x.fillStyle = C.yellow; rr(x, s * 0.49, -s * 0.2, s * 0.14, s * 0.22, s * 0.04); x.fill();
    ball(x, s * 0.56, -s * 0.28, s * 0.1, GOLD); x.restore();
    x.restore();
  }
  function brain(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const stress = cl(o.stress || 0), t = o.t || 0;
    glow(x, cx, cy, r * 2.2, H.rgba(H.mix('#ffd23f', C.red, stress)), 0.4 + 0.2 * Math.sin(t * 3));
    const pal = stress > 0.5 ? ['#ffb0bf', '#ff5470', '#8c1238'] : BRAIN;
    x.save(); x.translate(cx, cy); x.scale(1.18, 1);
    ball(x, 0, 0, r, pal, { sha: 0.4, inner: () => {
      x.strokeStyle = 'rgba(255,255,255,0.5)'; x.lineWidth = r * 0.06; x.lineCap = 'round';
      x.beginPath(); x.moveTo(0, -r); x.bezierCurveTo(-r * 0.12, -r * 0.4, r * 0.12, r * 0.3, 0, r); x.stroke();
      for (const [a, b, c2, d] of [[-0.75, -0.35, -0.3, -0.55], [-0.8, 0.2, -0.35, 0.05], [-0.6, 0.6, -0.2, 0.45], [0.25, -0.6, 0.7, -0.3], [0.3, 0.05, 0.8, 0.25], [0.2, 0.55, 0.6, 0.65]]) {
        x.beginPath(); x.moveTo(a * r, b * r); x.quadraticCurveTo((a + c2) / 2 * r, (b + d) / 2 * r - r * 0.18, c2 * r, d * r); x.stroke();
      }
    } });
    x.restore();
    if (stress > 0.3) for (let i = 0; i < 4; i++) { const a = t * 1.6 + (i * TAU) / 4; bill(x, cx + Math.cos(a) * r * 1.75, cy + Math.sin(a) * r * 0.75, 70, '$', 0.6 * cl((stress - 0.3) * 3), Math.sin(a) * 0.3); }
  }
  function battery(x, cx, cy, w, frac, a = 1, label) {
    if (a <= 0.01) return;
    const h = w * 0.5, f = cl(frac), col = f > 0.6 ? C.green : f > 0.3 ? C.yellow : C.red;
    x.save(); x.globalAlpha *= a; x.translate(cx, cy);
    if (f < 0.3) glow(x, 0, 0, w, C.red, 0.4);
    x.fillStyle = 'rgba(10,8,46,0.45)'; rr(x, -w / 2 + 8, -h / 2 + 10, w, h, h * 0.22); x.fill();
    x.fillStyle = '#2a2470'; rr(x, -w / 2, -h / 2, w, h, h * 0.22); x.fill();
    x.fillStyle = '#ffffff'; rr(x, w / 2 - 2, -h * 0.18, w * 0.08, h * 0.36, h * 0.06); x.fill();
    const iw = w - 24, ih = h - 24;
    x.fillStyle = col; rr(x, -iw / 2, -ih / 2, Math.max(ih * 0.3, iw * f), ih, ih * 0.16); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, -iw / 2 + 8, -ih / 2 + 6, Math.max(0, iw * f - 16), ih * 0.18, ih * 0.09); x.fill();
    x.restore();
    if (label) text(x, label, cx, cy + h / 2 + 46, 44, '#e6e0ff', { a });
  }
  const TRAP = [['LESS MONEY', 58.14], ['WORSE CHOICES', 58.96], ['MORE FEES', 60.1], ['LESS MONEY', 61.1]];
  function trapLoop(x, cx, cy, R, t, a, broken) {
    if (a <= 0.01) return;
    const brk = cl(broken || 0);
    x.save(); x.globalAlpha *= a;
    const ang = (i) => -Math.PI / 2 + (i % 4) * (Math.PI / 2);
    for (let i = 0; i < 3; i++) {
      const p = eio(seg(t, TRAP[i][1] + 0.05, TRAP[i + 1][1])), a0 = ang(i) + 0.32, a1 = ang(i + 1) - 0.32;
      if (p <= 0) continue;
      const e = a0 + (a1 - a0) * p, off = brk * 120 * (i % 2 ? 1 : -1);
      x.save(); x.translate(Math.cos(ang(i) + Math.PI / 4) * off, Math.sin(ang(i) + Math.PI / 4) * off);
      x.strokeStyle = C.red; x.lineWidth = 12; x.lineCap = 'round'; x.setLineDash([0.01, 24]);
      x.beginPath(); x.arc(cx, cy, R, a0, e); x.stroke(); x.setLineDash([]);
      x.translate(cx + Math.cos(e) * R, cy + Math.sin(e) * R); x.rotate(e + Math.PI / 2); x.fillStyle = C.red; x.beginPath(); x.moveTo(20, 0); x.lineTo(-14, 17); x.lineTo(-14, -17); x.closePath(); x.fill();
      x.restore();
    }
    // closing arc back to the top
    const pc = eio(seg(t, TRAP[3][1] + 0.05, TRAP[3][1] + 0.5));
    if (pc > 0 && brk < 1) { x.save(); x.globalAlpha *= 1 - brk; x.strokeStyle = C.red; x.lineWidth = 12; x.lineCap = 'round'; x.setLineDash([0.01, 24]); x.beginPath(); x.arc(cx, cy, R, ang(3) + 0.32, ang(3) + 0.32 + (Math.PI / 2 - 0.64) * pc); x.stroke(); x.restore(); }
    // a red pulse running round the loop once it is closed
    if (t > TRAP[3][1] + 0.5 && brk < 0.2) { const u = (t * 0.9) % 1, e = -Math.PI / 2 + u * TAU; glow(x, cx + Math.cos(e) * R, cy + Math.sin(e) * R, 60, C.red, 0.8); }
    [0, 1, 2].forEach((i) => {
      const k = back(seg(t, TRAP[i][1] - 0.05, TRAP[i][1] + 0.25), 2), hot = i === 0 ? t >= TRAP[3][1] && t < TRAP[3][1] + 0.6 : false;
      const off = brk * 160, px = cx + Math.cos(ang(i)) * (R + off), py = cy + Math.sin(ang(i)) * (R + off);
      pill(x, px, py, TRAP[i][0], 44, { s: k * (hot ? 1.15 : 1), bg: hot ? C.red : i === 1 ? '#ffd0d8' : '#ffffff', fg: hot ? '#ffffff' : C.ink });
    });
    x.restore();
  }
  function cushion(x, cx, cy, w, s) {
    if (s <= 0.01) return;
    const h = w * 0.36;
    x.save(); x.translate(cx, cy); x.scale(s, s);
    glow(x, 0, 0, w, '#ffd23f', 0.45);
    const shape = () => { x.beginPath(); x.moveTo(-w / 2, -h / 2); x.quadraticCurveTo(0, -h * 0.8, w / 2, -h / 2); x.quadraticCurveTo(w * 0.58, 0, w / 2, h / 2); x.quadraticCurveTo(0, h * 0.8, -w / 2, h / 2); x.quadraticCurveTo(-w * 0.58, 0, -w / 2, -h / 2); x.closePath(); };
    x.save(); x.translate(10, 14); x.fillStyle = 'rgba(10,8,46,0.4)'; shape(); x.fill(); x.restore();
    const g = x.createLinearGradient(-w / 2, -h, w / 2, h); g.addColorStop(0, '#fff3b0'); g.addColorStop(0.5, '#ffc93f'); g.addColorStop(1, '#c47a14');
    x.fillStyle = g; shape(); x.fill();
    x.save(); shape(); x.clip(); x.fillStyle = 'rgba(180,100,10,0.3)'; x.beginPath(); x.ellipse(w * 0.1, h * 0.5, w * 0.6, h * 0.4, 0, 0, TAU); x.fill(); x.restore();
    x.fillStyle = 'rgba(255,255,255,0.45)'; rr(x, -w * 0.32, -h * 0.42, w * 0.4, h * 0.1, h * 0.05); x.fill();
    text(x, '$', 0, 6, h * 0.62, '#b8650f', { shadow: 'rgba(255,255,255,0.4)' });
    x.restore();
  }
  function qBubble(x, cx, cy, r, s) {
    if (s <= 0.01) return;
    x.save(); x.translate(cx, cy); x.scale(s, s);
    ball(x, 0, 0, r, ['#ffffff', '#e8e4ff', '#9a8fe0'], { sha: 0.3 });
    text(x, '?', 0, 4, r * 1.3, C.violet, { shadow: 'rgba(0,0,0,0)' });
    x.restore();
  }

  // ================= TIMELINE =================
  const T = { whip1: [9.08, 9.5], sweep: [38.55, 39.25], dive: [70.75, 71.25] };
  hl(0, 3.75, 430, 104, "BEING@-1 BROKE@-1#r|IS@0.64 THE@1.04 MOST@1.18#r EXPENSIVE@1.34#r|THING@1.88 YOU'LL@2.28 EVER@2.54 PAY@2.84 FOR@3.12");
  hl(3.9, 5.95, 430, 108, "THE@3.96 REAL@4.06 PRICE@4.28|ISN'T@4.6 EVEN@5.0|MONEY@5.18#g*1.25");
  hl(6.02, 7.45, 450, 112, "YOU'LL@6.02 SEE@6.26 IT@6.4|AT@6.52 THE@6.6 END@6.72#c*1.25");
  hl(7.58, 9.3, 430, 104, "THINK@7.58 CHEAP@7.72#g|SAVES@7.98 YOU@8.24 MONEY?@8.36|WATCH@9.08#r*1.15");
  hl(10.0, 11.5, 440, 112, "TWO@10.0 PEOPLE@10.16|NEED@10.44 BOOTS@10.74#g");
  hl(11.58, 14.9, 430, 104, "ONE@11.58 PAYS@11.84 $200@12.14#g*1.2|THEY@13.3 LAST@13.52 10@13.78#g YEARS@14.06#g");
  hl(14.96, 18.95, 420, 100, "THE@14.96 OTHER@15.06 BUYS@15.32|$50@15.68#r*1.2 BOOTS@16.12|FALL@17.16#r APART@17.4#r");
  hl(19.0, 23.3, 420, 104, "10@19.0 YEARS@19.28 LATER@19.4|$500@20.24#r*1.35|STILL@21.9 WET@22.32#c FEET@22.56#c");
  hl(23.4, 26.65, 430, 112, "THAT'S@23.4 THE@23.92|BROKE@24.04#r*1.3 TAX@24.3#r*1.3|EVERYWHERE@25.68#r");
  hl(26.76, 28.3, 440, 108, "LATE@26.76 BILL?@26.94|FEE@27.56#r*1.3");
  hl(28.34, 30.6, 440, 104, "EMPTY@28.34 ACCOUNT?@28.6|OVERDRAFT@29.34#r FEE@29.88#r");
  hl(30.66, 34.95, 420, 96, "NO@30.66 SAVINGS?@30.82|YOU@31.68 BORROW@31.82#r|INTEREST@32.76#r ON@33.16|GROCERIES@33.86");
  hl(35.02, 38.6, 430, 104, "MEANWHILE@35.02|SAVINGS@36.18#g|EARN@36.52#g INTEREST@37.04#g");
  hl(38.9, 41.2, 430, 104, "HERE'S@39.12 THE@39.42 PART@39.5|NOBODY@39.72#r|TALKS@40.1 ABOUT@40.46");
  hl(41.32, 45.2, 420, 100, "THE@41.32 BIGGEST@41.42 BROKE@41.76#r TAX@42.06#r|ISN'T@42.32 IN@42.82 YOUR@42.94 BANK@43.04|IT'S@44.0 IN@44.2 YOUR@44.3 HEAD@44.42#c*1.3");
  hl(45.32, 47.85, 430, 100, "RESEARCHERS@45.32 FOUND@45.72|MONEY@46.36#r STRESS@46.66#r|HURTS@47.2 THINKING@47.62");
  hl(47.92, 50.45, 430, 100, "AS@47.92 MUCH@48.2 AS@48.46|LOSING@48.66 A@48.88 FULL@49.06#c|NIGHT@49.34#c OF@49.56 SLEEP@49.68#c");
  hl(50.52, 54.2, 430, 100, "WHEN@50.76 YOU'RE@50.9 BROKE@51.08#r|EVERY@51.34 DECISION@51.94|IS@52.4 MADE@52.66 EXHAUSTED@52.9#r");
  hl(54.26, 56.8, 440, 104, "EXHAUSTED@54.3 DECISIONS@54.68|COST@55.24#r MONEY@55.76#r");
  hl(56.88, 62.2, 380, 112, "THAT'S@56.88 THE@57.14|TRAP@57.26#r*1.3");
  hl(62.3, 64.45, 430, 104, "THE@62.3 WAY@62.42 OUT@62.58|ISN'T@62.84 A@63.26 BIGGER@63.34|PAYCHECK@63.56#r");
  hl(64.5, 66.0, 450, 116, "A@64.64 SMALL@64.72#g|CUSHION@65.04#g*1.3");
  hl(66.1, 71.0, 420, 100, "A@66.1 FEW@66.2 HUNDRED@66.38 DOLLARS@66.64|BUYS@67.56 BACK@67.94 YOUR@68.28|SLEEP@68.46#c FOCUS@69.28#c CHOICES@70.18#c");
  hl(71.2, DUR + 1, 400, 100, "THE@71.48 MOST@71.68 EXPENSIVE@71.88|THING@72.3 ABOUT@72.74 BEING@72.94 BROKE@73.2#r|IS@73.56 WHAT@74.12 IT@74.3 DOES@74.42|TO@74.62 YOUR@74.8#g*1.3 MIND@74.92#g*1.3");

  // ================= SCENE 1: the hook =================
  function s1(x, t) {
    const wx = 1700 * H.ease.in(seg(t, T.whip1[0], 9.3));
    const c = camAt(t, [[0, 540, 1150, 1.0, 0], [3.9, 540, 1130, 1.05, 0.3], [7.5, 540, 1170, 1.0, 0.3]]);
    skyP(x, t, { x: c[0] * 0.3 + wx * 0.4, y: c[1] * 0.25, z: c[2] });
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [0, 1.34, 5.18, 6.72, 7.72], 0.08) * (1 + 0.2 * (1 - eo(seg(t, 0, 0.35)))), shake: shakeK(t, [0.02, 1.34], 20) });
    planet(x, 150, 800, 55, PL.coral, { glowA: 0.25 });
    planet(x, 950, 1640, 44, PL.moon);
    if (t < 0.6) { const u = seg(t, 0, 0.6); x.save(); x.globalAlpha = 1 - u; x.strokeStyle = '#ffffff'; x.lineWidth = 26 * (1 - u) + 4; x.beginPath(); x.arc(540, 930, 220 + 700 * eo(u), 0, TAU); x.stroke(); x.restore(); }
    // the broke person, under a giant price tag that slams down on frame 0
    bean(x, 540, 1300 + Math.sin(t * 2) * 5, 160, { t, ...cloneOpt, shock: t < 7.5, happy: t > 7.6 ? 1 : 0, look: [0, -0.6], blink: blinkAt(t, 0.5), sweat: t < 7.4 ? seg(t, 1.3, 1.6) : 0, armUp: t > 7.7 ? 1 : 0 });
    const tagY = 930, tagS = 2.4 * (1 + 0.5 * (1 - eo(seg(t, 0, 0.25)))) * (1 - eio(seg(t, 5.9, 6.15)));
    if (tagS > 0.02) priceTag(x, 540, tagY, '$$$$$', tagS, { rot: -0.06 + Math.sin(t * 2) * 0.02, hot: C.red, bg: '#ffd0d8' });
    // "the real price isn't even money": coins fall out of the tag and fade
    for (let i = 0; i < 6; i++) { const ts = 4.1 + i * 0.12, u = (t - ts) / 1.0; if (u > 0 && u < 1 && t < 6.1) { x.save(); x.globalAlpha = 1 - u; coin(x, 540 + (i - 2.5) * 70, 960 + u * u * 500, 34, { flip: Math.cos(u * 8), glowA: 0 }); x.restore(); } }
    qBubble(x, 760, 1090, 62, back(seg(t, 5.0, 5.3), 2) * (1 - eio(seg(t, 7.4, 7.6))));
    // "you'll see it at the end": the tag becomes a sealed mystery box
    const mb = back(seg(t, 6.0, 6.4), 1.8) * (1 - eio(seg(t, 7.4, 7.65)));
    if (mb > 0) mysteryBox(x, 540, 940 + Math.sin(t * 3) * 8, 230 * mb, 0, t);
    // "think cheap saves you money?": a small cheap tag, happily
    priceTag(x, 760, 1080, '$', back(seg(t, 7.72, 8.0), 2.2), { rot: 0.1 + Math.sin(t * 6) * 0.08, bg: '#c9ffd9' });
    x.restore();
  }

  // ================= SCENE 2: two pairs of boots -> the broke tax -> fees everywhere -> savings =================
  const A2 = [300, 1290], B2 = [780, 1290];
  const BREAK = (k) => 17.3 + k * 0.29; // ten winters of cheap boots: one break per step, the last lands on "$500"
  function s2(x, t) {
    const wx = -1700 * (1 - H.ease.out(seg(t, 9.3, T.whip1[1])));
    const c = camAt(t, [[9.3, 540, 1180, 1.0, 0], [11.5, 330, 1200, 1.22, 0.4], [14.9, 760, 1200, 1.22, 0.4], [18.9, 540, 1150, 1.0, 0.4], [23.3, 540, 1130, 1.04, 0.3], [26.6, 780, 1160, 1.08, 0.4], [34.95, 300, 1180, 1.15, 0.4]]);
    skyP(x, t, { x: c[0] * 0.3 - wx * 0.4, y: c[1] * 0.25, z: c[2] });
    x.save(); camApply(x, t, c, { dx: -wx, punch: punchK(t, [10.74, 12.14, 13.78, 15.68, 17.16, 20.24, 24.04, 24.3, 27.56, 29.88, 32.76, 37.04]), shake: shakeK(t, [20.24, 24.3, 27.56, 29.88], 18) });
    planet(x, 540, 2900, 1400, PL.teal, { glowA: 0.2, atmo: 1 });
    // A: has savings (gold shirt) - one solid pair
    const aIn = back(seg(t, 10.0, 10.35), 1.8), aA = 1 - 0.7 * seg(t, 26.6, 26.9) * (1 - seg(t, 34.9, 35.2));
    x.save(); x.globalAlpha = aA;
    bean(x, A2[0], A2[1] + Math.sin(t * 2.2) * 5, 115 * aIn, { t, shirt: GOLD_SHIRT, happy: t > 21.8 && t < 26.5 ? 1 : 0, look: [0.3, -0.4], blink: blinkAt(t, 1), armUp: t > 36.5 ? 1 : 0 });
    x.restore();
    const ab = back(seg(t, 11.84, 12.2), 1.8) * (1 - eio(seg(t, 22.9, 23.2)));
    if (ab > 0) { boot(x, A2[0], 1100, 180 * ab, { t, shine: true }); priceTag(x, A2[0] + 30, 860, '$200', ab * back(seg(t, 12.14, 12.4), 2), { rot: -0.06, bg: '#fff3b0' }); }
    const cal = back(seg(t, 13.7, 14.0), 2) * (1 - eio(seg(t, 18.8, 19.1)));
    calendar(x, A2[0] + 190, 1010, 120 * cal, '10 YRS', 1, 1, 0.26);
    // B: broke (grey) - cheap boots that break every winter
    const bIn = back(seg(t, 10.16, 10.5), 1.8);
    x.save(); x.globalAlpha = 1 - 0.85 * seg(t, 34.95, 35.3);
    bean(x, B2[0], B2[1] + Math.sin(t * 2.4) * 5, 115 * bIn, { t, ...cloneOpt, tired: t > 17.2, sweat: seg(t, 20.2, 20.5), look: [-0.3, -0.4], blink: blinkAt(t, 1.7) });
    x.restore();
    const bb = back(seg(t, 15.32, 15.7), 1.8) * (1 - eio(seg(t, 22.9, 23.2)));
    if (bb > 0) {
      let k = -1; for (let i = 0; i < 9; i++) if (t >= BREAK(i)) k = i;
      const since = k >= 0 ? t - BREAK(k) : 0, torn = k >= 0 ? cl(since / 0.12) * (since < 0.17 ? 1 : 0) : 0, pop = k >= 0 && since >= 0.17 ? back(cl((since - 0.17) / 0.1), 2) : 1;
      boot(x, B2[0], 1100, 165 * bb * (since >= 0.17 || k < 0 ? pop : 1), { pal: PLASTIC, torn: t > 20.2 ? 1 : torn, rot: torn * 0.1 });
      priceTag(x, B2[0] + 30, 860, '$50', bb * back(seg(t, 15.68, 15.95), 2) * (1 - eio(seg(t, 18.85, 19.05))), { rot: 0.08, bg: '#ffd0d8' });
      for (let i = 0; i < 10; i++) { const u = (t * 0.7 + i * 0.13) % 1; if (t > 17.1 && t < 20.4) { x.save(); x.globalAlpha = 0.8 * Math.sin(u * Math.PI); spark(x, B2[0] - 150 + i * 32, 900 + u * 300, 10, '#e8f4ff', 1); x.restore(); } }
    }
    // the running total over B: $50 per winter, ten winters
    const tot = t < 15.68 ? 0 : 50 * (1 + [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => t >= BREAK(i)).length);
    const ta = seg(t, 19.0, 19.2) * (1 - eio(seg(t, 22.9, 23.15)));
    if (ta > 0) { const land = seg(t, 20.24, 20.6); x.save(); x.translate(B2[0], 870); x.scale(1 + 0.25 * Math.sin(land * Math.PI), 1 + 0.25 * Math.sin(land * Math.PI)); text(x, '$' + tot, 0, 0, 72, tot >= 500 ? '#ff5470' : '#ffffff', { a: ta }); x.restore(); }
    if (t > 20.24 && t < 21.6) burst(x, B2[0], 870, (t - 20.24) * 1.2, 2024, 220, ['#ff3b5c', '#ffb0bf', '#ffffff']);
    rainCloud(x, B2[0], 1040, 190, t, seg(t, 21.7, 22.0) * (1 - eio(seg(t, 26.4, 26.7))));
    // THE BROKE TAX: a big red stamp on B
    const st = back(seg(t, 24.04, 24.3), 2.4) * (1 - eio(seg(t, 26.4, 26.7)));
    if (st > 0) { x.save(); x.translate(B2[0], 1210); x.rotate(-0.12); x.scale(st, st); glow(x, 0, 0, 260, C.red, 0.4); x.strokeStyle = C.red; x.lineWidth = 12; rr(x, -190, -62, 380, 124, 26); x.stroke(); text(x, 'BROKE TAX', 0, 4, 64, '#ff5470', { shadow: 'rgba(10,8,46,0.6)' }); x.restore(); }
    // fees everywhere around B
    bill(x, B2[0] - 270, 1090, 220, 'LATE FEE', back(seg(t, 27.5, 27.8), 2) * (1 - eio(seg(t, 34.7, 35.0))), -0.12);
    bill(x, B2[0] + 250, 1060, 220, 'OVERDRAFT', back(seg(t, 29.82, 30.1), 2) * (1 - eio(seg(t, 34.7, 35.0))), 0.1);
    const gb = back(seg(t, 31.6, 31.95), 1.8) * (1 - eio(seg(t, 34.7, 35.0)));
    groceryBag(x, B2[0], 1080, 190 * gb);
    priceTag(x, B2[0] + 60, 860, '+ INTEREST', back(seg(t, 32.76, 33.05), 2) * gb, { rot: -0.08, hot: C.red, bg: '#ffd0d8' });
    // meanwhile: A's savings earn interest
    const pg = back(seg(t, 35.4, 35.8), 1.8);
    if (pg > 0) {
      piggy(x, A2[0] + 230, 1230, 100 * pg, { happy: 1, gulp: Math.max(0, Math.sin((t - 37) * 6)) * seg(t, 37, 37.2) });
      priceTag(x, A2[0] + 230, 1040, '+ INTEREST', back(seg(t, 37.04, 37.3), 2), { rot: 0.08, hot: C.green, bg: '#c9ffd9' });
      for (let i = 0; i < 6; i++) { const ts = 36.6 + i * 0.25, u = (t - ts) / 0.8; if (u > 0 && u < 1) coin(x, A2[0] + 520 - u * 290, 1000 + Math.sin(u * Math.PI) * -120 + u * 200, 26, { glowA: 0.4, flip: Math.cos(u * 9) }); }
    }
    x.restore();
  }

  // ================= SCENE 3: the hidden part -> in your head -> the trap -> the way out =================
  function s3(x, t) {
    const z = Math.exp(Math.log(12) * H.ease.in(seg(t, T.dive[0], T.dive[1])));
    const c = camAt(t, [[38.9, 540, 1150, 1.0, 0], [43.9, 540, 1250, 1.12, 0.35], [50.4, 540, 1200, 1.0, 0.4], [56.8, 540, 1150, 0.9, 0.4], [62.2, 540, 1200, 1.0, 0.4], [70.4, 540, 1130, 1.15, 0.35]]);
    skyP(x, t, { x: 300 + t * 12, y: c[1] * 0.25, z: c[2] * z, red: 0.35 * seg(t, 46.3, 47) * (1 - seg(t, 64.5, 65.2)) });
    x.save(); camApply(x, t, c, { punch: punchK(t, [39.72, 44.42, 46.66, 49.34, 52.9, 55.24, 57.26, 64.72, 65.04]), shake: shakeK(t, [44.42, 57.26, 64.72], 18) });
    x.translate(540, 1050); x.scale(z, z); x.translate(-540, -1050);
    planet(x, 160, 760, 50, PL.coral, { glowA: 0.25 });
    // the mystery box from the hook is back, and opens
    const bx = back(seg(t, 39.0, 39.4), 1.6) * (1 - eio(seg(t, 43.9, 44.2)));
    if (bx > 0) mysteryBox(x, 540, 1060 + Math.sin(t * 3) * 8, 260 * bx, eio(seg(t, 41.3, 41.9)), t);
    if (t > 41.4 && t < 44.3) { const rise = eo(seg(t, 41.5, 42.3)); x.save(); x.globalAlpha = rise * (1 - seg(t, 43.9, 44.2)); text(x, '$', 540 - 70, 960 - rise * 160, 90, '#ffd23f'); text(x, '$', 540 + 70, 980 - rise * 140, 70, '#ffd23f'); x.restore(); stampX(x, 640, 800, 60, back(seg(t, 43.04, 43.3), 2.2) * (1 - seg(t, 43.9, 44.2))); }
    // the broke person, with the cost inside their head
    const bIn = back(seg(t, 43.95, 44.35), 1.6), healed = eio(seg(t, 64.7, 65.6));
    const pY = lerp(1300, 1130, eio(seg(t, 56.8, 57.2))) + lerp(0, 120, eio(seg(t, 64.72, 65.3)));
    if (bIn > 0) {
      const tired = t > 47.2 && healed < 0.5, R = 170 * bIn * lerp(1, 0.6, eio(seg(t, 56.8, 57.3))) * lerp(1, 1.25, eio(seg(t, 64.72, 65.3)));
      x.save(); x.globalAlpha = 1 - healed; bean(x, 540, pY + Math.sin(t * 2) * 5, R, { t, ...cloneOpt, tired, sweat: tired ? 1 : 0, look: [0, -0.5], blink: blinkAt(t, 0.9), shock: t > 44.3 && t < 47.2 }); x.restore();
      if (healed > 0) { x.save(); x.globalAlpha = healed; bean(x, 540, pY + Math.sin(t * 2) * 5, R, { t, happy: 1, look: [0, -0.5], armUp: t > 70 ? 1 : 0 }); x.restore(); }
      // brain overlay on the head while we talk about stress
      const bv = seg(t, 44.3, 44.6) * (1 - eio(seg(t, 56.6, 56.9)));
      if (bv > 0) { x.save(); x.globalAlpha = bv; brain(x, 540, pY - R * 1.25, 120, { t, stress: seg(t, 46.3, 46.8) }); x.restore(); }
      battery(x, 860, 1090, 190, lerp(1, 0.12, eio(seg(t, 46.6, 49.7))) + 0.88 * eio(seg(t, 66.6, 69.0)) * (t > 66 ? 1 : 0) * 1, seg(t, 45.8, 46.1) * (1 - eio(seg(t, 56.6, 56.9))) + seg(t, 65.6, 65.9) * (1 - seg(t, 70.4, 70.7)), 'FOCUS');
      if (t > 49.0 && t < 56.8) { const mk = back(seg(t, 49.06, 49.4), 2) * (1 - eio(seg(t, 56.5, 56.8))); x.save(); x.translate(230, 1080); x.scale(mk, mk); crescentMoon(x, 0, 0, 80); stampX(x, 50, -50, 40, back(seg(t, 49.68, 49.9), 2.2)); x.restore(); }
      // exhausted decisions: coins leak away
      for (let i = 0; i < 6; i++) { const ts = 55.2 + i * 0.22, u = (t - ts) / 0.9; if (u > 0 && u < 1) { x.save(); x.globalAlpha = 1 - u; coin(x, 540 + (i - 2.5) * 50, pY + 60 + u * u * 400, 28, { glowA: 0, flip: Math.cos(u * 8) }); x.restore(); } }
      // the way out: a small cushion of savings under them
      cushion(x, 540, pY + R * 1.05 + 30, 360, back(seg(t, 64.72, 65.1), 2));
      [['moon', 68.46, 250], ['bulb', 69.28, 540], ['ok', 70.18, 830]].forEach(([k, ts, px]) => {
        const s = back(seg(t, ts, ts + 0.3), 2) * (1 - eio(seg(t, 70.6, 70.8))); if (s <= 0) return;
        x.save(); x.translate(px, 930); x.scale(s, s);
        if (k === 'moon') { glow(x, 0, 0, 120, '#ffd86a', 0.4); crescentMoon(x, 0, 0, 62); } else if (k === 'bulb') lightbulb(x, 0, 0, 56, 1); else badge(x, 0, 0, 56, 'ok', 1);
        x.restore();
      });
    }
    // the trap loop
    trapLoop(x, 540, 1130, 320, t, seg(t, 57.2, 57.5) * (1 - eio(seg(t, 65.4, 65.8))), eio(seg(t, 64.72, 65.3)));
    if (t > 64.72 && t < 66) burst(x, 540, 1130, (t - 64.72) * 1.2, 6472, 380);
    x.restore();
  }

  // ================= SCENE 4: what it does to your mind =================
  function s4(x, t) {
    const em = 1 + 1.4 * (1 - eo(seg(t, T.dive[1], T.dive[1] + 0.6)));
    skyP(x, t, { x: 600 + t * 14, y: 80, z: em });
    x.save(); camApply(x, t, [540, 1150, 1], { punch: punchK(t, [73.2, 74.92], 0.07) * em, shake: shakeK(t, [74.92], 16) });
    planet(x, 540, 2650, 1150, PL.teal, { glowA: 0.2, atmo: 1 });
    flare(x, 540, 1170, Math.max(0, 1 - Math.abs(t - 75.1) / 0.9) * (t > 74.92 ? 1 : 0) + 0.3 * seg(t, 75.3, 75.8), t);
    brain(x, 540, 1170 + Math.sin(t * 2) * 8, 200 * back(seg(t, 71.2, 71.6), 1.6), { t, stress: 1 - eio(seg(t, 74.8, 75.2)) });
    burst(x, 540, 1170, (t - 74.92) * 1.0, 7492, 420);
    if (t > 75.1) for (let i = 0; i < 9; i++) { const q = H.rng(800 + i); spark(x, q.range(80, 1000), q.range(250, 1500), q.range(10, 20) * (0.5 + 0.5 * Math.sin(t * 3 + i)), '#ffffff', seg(t, 75.1, 75.4)); }
    x.restore();
  }

  // ================= EXPLAINER =================
  function explainerV(ctx, W, H_, t) {
    const x = ctx;
    const sw = eio(seg(t, T.sweep[0], T.sweep[1]));
    const sx = lerp(PW + 1500, -1500, sw), sy = lerp(PH + 600, -600, sw);
    if (t < 9.3) s1(x, t);
    else if (t < T.sweep[0] || (sw < 1 && sx > 540)) s2(x, t);
    else if (t < T.dive[1]) s3(x, t);
    else s4(x, t);
    if (sw > 0 && sw < 1) planet(x, sx, sy, 1300, PL.magenta, { glowA: 0.4, ringA: 0 });
    speedLines(x, t, Math.max(0, 1 - Math.abs(t - 9.3) / 0.2) * 0.8, false);
    const wo = seg(t, T.dive[0] + 0.2, T.dive[1]) * (1 - seg(t, T.dive[1], T.dive[1] + 0.35));
    if (wo > 0) { const g = x.createRadialGradient(540, 960, 0, 540, 960, 1100); g.addColorStop(0, H.rgba('#ffffff', wo)); g.addColorStop(0.5, H.rgba('#ffd0e6', wo * 0.95)); g.addColorStop(1, H.rgba('#6a4cff', wo * 0.9)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); }
    for (const tf of [1.34, 24.3, 44.42, 57.26]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.14); if (f > 0) { const g = x.createRadialGradient(540, 960, 300, 540, 960, 1200); g.addColorStop(0, 'rgba(255,59,92,0)'); g.addColorStop(1, H.rgba(C.red, 0.5 * f)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); } }
    for (const tf of [0.02, 20.24, 64.72, 74.92]) { const f = Math.max(0, 1 - Math.abs(t - tf - 0.03) / 0.12); if (f > 0) { x.fillStyle = H.rgba('#ffffff', 0.32 * f); x.fillRect(0, 0, PW, PH); } }
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
    const rip = (t, g = 0.5) => k.noise(t, { dur: 0.14, filter: 'bandpass', f: [[0, 2600], [0.14, 900]], q: 0.8, gain: 0.2 * g, a: 0.005 });
    // hook
    k.play('thud', 0.0, { f: 110, gain: 0.35 }); k.play('swish', 0.0, { dur: 0.2, gain: 0.4 });
    k.play('stamp', 1.34, { gain: 0.3 });
    for (let i = 0; i < 6; i++) clink(4.15 + i * 0.12, 0.35, (i - 2.5) * 0.15);
    soft(5.05, 0.4);
    k.play('sparkle', 6.05, { gain: 0.3, n: 4 });
    k.play('tick', 7.75, { f: 3600, gain: 0.25 });
    whoosh(T.whip1[0], 0.42, 0.7, 2600);
    // boots
    soft(10.05, 0.45); soft(10.2, 0.45);
    k.play('tock', 12.15, { f: 420, gain: 0.3 }); k.play('sparkle', 12.3, { gain: 0.2, n: 3 });
    k.play('paper', 13.75, { dur: 0.18, gain: 0.35 });
    k.play('tock', 15.7, { f: 360, gain: 0.3 });
    for (let i = 0; i < 9; i++) { rip(BREAK(i), 0.45); k.play('tick', BREAK(i) + 0.18, { f: 3000 + i * 120, gain: 0.18 }); }
    k.play('stamp', 20.24, { gain: 0.3 }); k.tone(20.26, { f: 'E3', type: 'triangle', dur: 0.4, gain: 0.08, hold: 0.15, filter: 'lowpass', f2: 900 });
    k.noise(21.7, { dur: 2.6, color: 'pink', filter: 'bandpass', f: 2500, q: 0.4, gain: 0.05, a: 0.3, hold: 1.8 });
    // the broke tax
    k.play('impact', 24.3, { gain: 0.3 });
    whoosh(26.6, 0.4, 0.35);
    k.play('paper', 27.5, { dur: 0.2, gain: 0.4 }); k.play('stamp', 27.6, { gain: 0.22 });
    k.play('paper', 29.82, { dur: 0.2, gain: 0.4 }); k.play('stamp', 29.92, { gain: 0.22 });
    soft(31.65, 0.4); k.play('tick', 32.8, { f: 3200, gain: 0.25 });
    whoosh(34.95, 0.4, 0.35);
    soft(35.45, 0.4); for (let i = 0; i < 6; i++) clink(36.6 + i * 0.25 + 0.75, 0.4, -0.3);
    pluck(37.06, 'E5', 0.4); pluck(37.13, 'B5', 0.35);
    // the hidden part
    whoosh(T.sweep[0], T.sweep[1] - T.sweep[0], 0.6, 1300);
    k.noise(T.sweep[0] + 0.1, { dur: 0.7, color: 'brown', filter: 'lowpass', f: 260, gain: 0.2, a: 0.35 });
    soft(39.1, 0.45);
    k.play('riser', 40.8, { dur: 0.55, gain: 0.3 }); k.play('sparkle', 41.4, { gain: 0.3, n: 5 });
    k.play('stamp', 43.06, { gain: 0.2 });
    k.play('thud', 44.42, { f: 90, gain: 0.3 }); k.play('swish', 44.0, { dur: 0.25, gain: 0.3 });
    k.tone(46.6, { f: [[0, 520], [3.1, 160]], type: 'triangle', dur: 3.1, gain: 0.04, a: 0.2 });
    soft(49.1, 0.35); k.play('stamp', 49.7, { gain: 0.2 });
    for (let i = 0; i < 6; i++) clink(55.2 + i * 0.22, 0.3, (i - 2.5) * 0.15);
    // the trap
    whoosh(56.8, 0.4, 0.35);
    k.play('thud', 57.26, { f: 100, gain: 0.3 });
    TRAP.forEach(([, ts], i) => { k.play('tock', ts + 0.02, { f: 360 - i * 30, gain: 0.3 }); });
    // the way out
    k.play('impact', 64.72, { gain: 0.25 }); k.play('glitch', 64.75, { gain: 0.2 });
    k.play('pop', 65.05, { f: 420, gain: 0.3 }); k.play('sparkle', 65.1, { gain: 0.3, n: 5 });
    k.tone(66.6, { f: [[0, 220], [2.4, 660]], type: 'triangle', dur: 2.4, gain: 0.04, a: 0.2 });
    [68.46, 69.28, 70.18].forEach((ts, i) => pluck(ts + 0.02, ['C5', 'E5', 'G5'][i], 0.45));
    // into the mind
    k.play('riser', T.dive[0] - 0.1, { dur: 0.55, gain: 0.35 });
    k.play('impact', 74.92, { gain: 0.3 });
    ['C4', 'G4', 'C5', 'E5', 'G5'].forEach((n, i) => k.tone(74.94 + i * 0.012, { f: n, type: 'triangle', dur: 1.2, gain: 0.03, a: 0.02, verb: 0.3 }));
    k.play('sparkle', 75.0, { gain: 0.3, n: 6 });
  }

  window.FV = { explainer: explainerV, scoreSound: scoreSoundV, DURATION: DUR, W: PW, H: PH };
})();
