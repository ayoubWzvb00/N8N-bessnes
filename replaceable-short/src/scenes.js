  // ================= 9:16 SHORT: "You're paid for how replaceable you are" =================
  // Continues the closure opened in base.js. Logical canvas is 1080 x 1920; times come from the voice track (words.json).
  const PW = 1080, PH = 1920, DUR = 68.4;
  const GREY = ['#ecebff', '#aaa6d6', '#4a3f8c'], GREY_SHIRT = ['#8f89c6', '#4e4886'];
  const GOLD_SHIRT = ['#ffd23f', '#d98d1a'];
  const RUBY = ['#ffb0c4', '#ff3b5c', '#8c1238'];
  const COL = { g: C.yellow, r: '#ff5470', c: C.cyan, p: '#ff8fc8', n: C.green, w: '#ffffff' };

  // ---------- portrait sky (same recipe as sky(), re-laid for 9:16) ----------
  let STARS2 = null;
  function stars2() {
    if (STARS2) return STARS2;
    const r = H.rng(78), a = [], sp = [];
    for (let i = 0; i < 900; i++) a.push({ x: r.range(0, 1400), y: r.range(0, 2240), d: r.pick([0.15, 0.3, 0.3, 0.55, 1]), s: r.range(0.9, 2.8), ph: r.range(0, TAU), sp: r.range(0.8, 2.6), c: r.pick(['#ffffff', '#cfe4ff', '#ffe9c7', '#dccbff']) });
    for (let i = 0; i < 22; i++) sp.push({ x: r.range(0, 1400), y: r.range(0, 2240), d: r.range(0.3, 0.9), s: r.range(9, 18), ph: r.range(0, TAU) });
    STARS2 = { a, sp }; return STARS2;
  }
  function skyP(x, t, cam = {}) {
    const px = cam.x || 0, py = cam.y || 0, lz = Math.log(cam.z || 1), red = cam.red || 0;
    const g = x.createLinearGradient(0, 0, PW * 0.4, PH);
    g.addColorStop(0, H.rgba(H.mix(C.sky0, '#2a0a24', red))); g.addColorStop(0.5, H.rgba(H.mix(C.sky1, '#4a1030', red))); g.addColorStop(1, H.rgba(H.mix(C.sky2, '#7a1a3c', red)));
    x.fillStyle = g; x.fillRect(0, 0, PW, PH);
    glow(x, PW * 0.95, PH * 0.08, 950, '#7b34c6', 0.34);
    glow(x, 0, PH, 900, '#2448b4', 0.4);
    glow(x, PW * 0.5, PH * 0.58, 760, '#4a2a9c', 0.18);
    const S = stars2();
    const place = (s) => {
      const k = Math.exp(lz * s.d * 0.6);
      const sx = (((s.x - px * s.d) % 1400) + 1400) % 1400 - 160, sy = (((s.y - py * s.d) % 2240) + 2240) % 2240 - 160;
      return [(sx - 540) * k + 540, (sy - 960) * k + 960];
    };
    for (const s of S.a) {
      const [sx, sy] = place(s);
      if (sx < -4 || sx > PW + 4 || sy < -4 || sy > PH + 4) continue;
      x.globalAlpha = (0.55 + 0.45 * Math.sin(t * s.sp + s.ph)) * (0.45 + s.d * 0.55);
      x.fillStyle = s.c; x.beginPath(); x.arc(sx, sy, s.s * (0.7 + 0.35 * s.d), 0, TAU); x.fill();
    }
    x.globalAlpha = 1;
    for (const s of S.sp) {
      const [sx, sy] = place(s); const tw = 0.6 + 0.4 * Math.sin(t * 1.7 + s.ph);
      glow(x, sx, sy, s.s * 2.2, '#bfa8ff', 0.25 * tw);
      spark(x, sx, sy, s.s * tw, '#ffffff', 0.9);
    }
  }

  // ---------- camera: keyframed framings with fast eased moves, punch-ins and shake ----------
  // K = [[tStart, cx, cy, z, dur], ...]: from tStart the camera eases to (cx, cy, z) over dur seconds
  function camAt(t, K) {
    let c = [K[0][1], K[0][2], K[0][3]];
    for (let i = 1; i < K.length; i++) {
      const [ts, cx, cy, z, d] = K[i]; if (t < ts) break;
      const u = eio(seg(t, ts, ts + d));
      c = [lerp(c[0], cx, u), lerp(c[1], cy, u), Math.exp(lerp(Math.log(c[2]), Math.log(z), u))];
    }
    return c;
  }
  const punchK = (t, times, amt = 0.06) => { let k = 0; for (const tk of times) { if (t < tk) continue; const u = t - tk; k = Math.max(k, u < 0.07 ? u / 0.07 : Math.exp(-(u - 0.07) * 7)); } return 1 + amt * k; };
  const shakeK = (t, times, amp = 16) => { let sx = 0, sy = 0; for (const tk of times) { const u = t - tk; if (u < 0 || u > 0.5) continue; const e = amp * Math.exp(-u * 9); sx += Math.sin(u * 71) * e; sy += Math.cos(u * 53) * e * 0.7; } return [sx, sy]; };
  function camApply(x, t, c, o = {}) {
    const [sx, sy] = o.shake || [0, 0], drift = 1 + 0.012 * Math.sin(t * 0.9);
    const z = c[2] * (o.punch || 1) * drift;
    x.translate(PW / 2 + sx + (o.dx || 0), PH / 2 + sy + (o.dy || 0)); x.rotate(o.rot || 0); x.scale(z, z); x.translate(-c[0], -c[1]);
  }

  // ---------- headlines (screen space): words pop in on the exact spoken word ----------
  // line syntax: "WORD@time#colour*scale WORD@time ..." ; lines split by "|"
  function parseHL(s) {
    return s.split('|').map((ln) => ln.trim().split(/\s+/).map((tok) => {
      const m = /^(.+?)@(-?[\d.]+)(?:#(\w))?(?:\*([\d.]+))?$/.exec(tok);
      return { w: m[1], t: +m[2], col: COL[m[3] || 'w'], sc: m[4] ? +m[4] : 1, key: !!m[3] };
    }));
  }
  const HL = [];
  const hl = (t0, t1, y, px, s) => HL.push({ t0, t1, y, px, lines: parseHL(s) });
  function capText(x, s, cx, cy, px, col, a) {
    x.save(); x.globalAlpha *= a; x.font = F(900, px); x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
    x.fillStyle = 'rgba(10,8,46,0.6)'; x.fillText(s, cx + px * 0.04, cy + px * 0.1);
    x.strokeStyle = '#0d0b33'; x.lineWidth = px * 0.17; x.strokeText(s, cx, cy);
    x.fillStyle = col; x.fillText(s, cx, cy); x.restore();
  }
  function drawHL(x, t) {
    for (const h of HL) {
      if (t < h.t0 - 0.4 || t > h.t1 + 0.25) continue;
      const out = eio(seg(t, h.t1, h.t1 + 0.18));
      const n = h.lines.length, lh = h.px * 1.14;
      h.lines.forEach((ln, li) => {
        x.font = F(900, h.px);
        const sp = x.measureText(' ').width * 1.15;
        const ws = ln.map((p) => { x.font = F(900, h.px * p.sc); return x.measureText(p.w).width + h.px * p.sc * 0.05; });
        const tot = ws.reduce((a, b) => a + b, 0) + sp * (ln.length - 1), fit = Math.min(1, 900 / tot);
        const ly = h.y + (li - (n - 1) / 2) * lh * (ln.some((p) => p.sc > 1.1) ? 1.08 : 1);
        let wx = 540 - (tot * fit) / 2;
        ln.forEach((p, i) => {
          const k = back(seg(t, p.t - 0.04, p.t + 0.2), 2.4);
          const cx = wx + (ws[i] * fit) / 2; wx += (ws[i] + sp) * fit;
          if (k <= 0.01) return;
          const wig = p.key ? 1 + 0.035 * Math.sin(seg(t, p.t, p.t + 0.5) * Math.PI) : 1;
          x.save(); x.translate(cx, ly + (1 - cl(k)) * 26 - out * 30); x.scale(k * wig * (1 - out * 0.3), k * wig * (1 - out * 0.3));
          if (p.key && t > p.t) glow(x, 0, 0, h.px * p.sc * 1.3, p.col, 0.22 * (1 - out));
          capText(x, p.w, 0, 0, h.px * p.sc * fit, p.col, 1 - out);
          x.restore();
        });
      });
    }
  }

  // ---------- new props ----------
  function gem(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const t = o.t || 0;
    glow(x, cx, cy, r * 2.6, '#56e8ff', (o.glowA == null ? 0.45 : o.glowA) * (0.85 + 0.15 * Math.sin(t * 3)));
    x.save(); x.translate(cx, cy); x.rotate(o.rot || 0);
    const T = [[-0.48, -0.62], [0.48, -0.62]], G = [[-1, -0.18], [1, -0.18]], B = [0, 1.0];
    const P = (p) => [p[0] * r, p[1] * r];
    const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); pts.map(P).forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); };
    x.fillStyle = 'rgba(10,8,46,0.35)'; x.save(); x.translate(r * 0.06, r * 0.1); poly([T[0], T[1], G[1], B, G[0]], 'rgba(10,8,46,0.35)'); x.restore();
    poly([G[0], T[0], [-0.16, -0.18]], '#bdfcff');
    poly([T[0], T[1], [0.16, -0.18], [-0.16, -0.18]], '#8af3ff');
    poly([T[1], G[1], [0.16, -0.18]], '#3ccbdc');
    poly([G[0], [-0.16, -0.18], B], '#5fe0f0');
    poly([[-0.16, -0.18], [0.16, -0.18], B], '#2fa8d6');
    poly([[0.16, -0.18], G[1], B], '#1d64b0');
    x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = r * 0.04; x.lineCap = 'round'; x.beginPath(); x.moveTo(-0.38 * r, -0.52 * r); x.lineTo(-0.1 * r, -0.52 * r); x.stroke();
    x.restore();
    spark(x, cx - r * 0.35, cy - r * 0.45, r * 0.22 * (0.6 + 0.4 * Math.sin(t * 5)), '#ffffff', 0.95);
    spark(x, cx + r * 0.55, cy - r * 0.05, r * 0.14 * (0.6 + 0.4 * Math.sin(t * 4 + 2)), '#ffffff', 0.85);
  }
  function building(x, cx, by, w, h, o = {}) {
    const t = o.t || 0, sh = o.shake || 0, x0 = cx - w / 2 + Math.sin(t * 60) * 8 * sh, y0 = by - h;
    if (o.alarm > 0) glow(x, cx, y0 + h * 0.4, w * 1.6, C.red, 0.45 * o.alarm * (0.6 + 0.4 * Math.sin(t * 14)));
    glow(x, cx, y0 + h * 0.5, w * 1.2, '#7a8cff', 0.25);
    const g = x.createLinearGradient(x0, y0, x0 + w, by); g.addColorStop(0, '#b9c6ff'); g.addColorStop(0.5, '#7d86e8'); g.addColorStop(1, '#3d3a9c');
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, x0 + 12, y0 + 16, w, h, w * 0.06); x.fill();
    x.fillStyle = g; rr(x, x0, y0, w, h, w * 0.06); x.fill();
    x.fillStyle = 'rgba(30,24,110,0.35)'; rr(x, x0 + w * 0.62, y0, w * 0.38, h, w * 0.06); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, x0 + w * 0.06, y0 + h * 0.02, w * 0.05, h * 0.9, w * 0.025); x.fill();
    const cols = 4, rows = 6, ww = w * 0.13, wh = h * 0.08;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const wx = x0 + w * 0.14 + i * w * 0.2, wy = y0 + h * 0.2 + j * h * 0.115, lit = (i * 7 + j * 3) % 5 !== 0;
      x.fillStyle = lit ? (o.alarm > 0.3 ? '#ff9aa8' : '#ffe680') : '#3a3290'; rr(x, wx, wy, ww, wh, ww * 0.2); x.fill();
    }
    x.fillStyle = '#ff5d8f'; rr(x, x0 + w * 0.18, y0 - h * 0.1, w * 0.64, h * 0.11, h * 0.04); x.fill();
    x.font = F(900, h * 0.065); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ffffff'; x.fillText('COMPANY', x0 + w / 2, y0 - h * 0.045);
    x.fillStyle = '#2f5fc0'; rr(x, x0 + w * 0.4, by - h * 0.12, w * 0.2, h * 0.12, w * 0.04); x.fill();
    if (o.crack > 0) {
      const P = [[0.5, 0.0], [0.42, 0.14], [0.56, 0.26], [0.44, 0.4], [0.6, 0.55], [0.47, 0.7], [0.55, 0.86]];
      const n = Math.max(2, Math.ceil(P.length * o.crack));
      x.strokeStyle = '#140f3a'; x.lineWidth = w * 0.035; x.lineJoin = 'round'; x.lineCap = 'round'; x.beginPath();
      P.slice(0, n).forEach(([a, b], i) => (i ? x.lineTo(x0 + a * w, y0 + b * h) : x.moveTo(x0 + a * w, y0 + b * h))); x.stroke();
    }
    if (o.alarm > 0) { const on = Math.sin(t * 14) > 0; glow(x, cx, y0 - h * 0.16, 90, C.red, on ? 0.8 * o.alarm : 0.2); ball(x, cx, y0 - h * 0.15, 22, RUBY); }
  }
  function clipboard(x, cx, cy, w, prog) {
    const h = w * 1.3;
    x.save(); x.translate(cx, cy); x.rotate(-0.06);
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2 + 10, -h / 2 + 14, w, h, w * 0.1); x.fill();
    x.fillStyle = '#8b5cff'; rr(x, -w / 2, -h / 2, w, h, w * 0.1); x.fill();
    x.fillStyle = '#ffffff'; rr(x, -w / 2 + w * 0.08, -h / 2 + w * 0.12, w * 0.84, h - w * 0.2, w * 0.05); x.fill();
    ball(x, 0, -h / 2 + w * 0.04, w * 0.12, GOLD, { sha: 0.4 });
    for (let i = 0; i < 3; i++) {
      const ly = -h / 2 + w * 0.42 + i * w * 0.3, bx = -w * 0.32;
      x.strokeStyle = '#c9c4ee'; x.lineWidth = w * 0.035; x.strokeRect(bx - w * 0.07, ly - w * 0.07, w * 0.14, w * 0.14);
      x.fillStyle = '#d9d5f5'; rr(x, -w * 0.15, ly - w * 0.03, w * 0.48, w * 0.06, w * 0.03); x.fill();
      const k = cl(prog * 3 - i);
      if (k > 0) { x.strokeStyle = C.green; x.lineWidth = w * 0.05; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(bx - w * 0.06, ly); x.lineTo(bx - w * 0.06 + w * 0.05 * cl(k * 2), ly + w * 0.05 * cl(k * 2)); if (k > 0.5) x.lineTo(bx - w * 0.01 + w * 0.11 * cl(k * 2 - 1), ly + w * 0.05 - w * 0.13 * cl(k * 2 - 1)); x.stroke(); }
    }
    x.restore();
  }
  function priceTag(x, cx, cy, label, s, o = {}) {
    if (s <= 0.01) return;
    x.save(); x.translate(cx, cy); x.rotate(o.rot || 0); x.scale(s, s);
    x.font = F(900, 46); const w = Math.max(110, x.measureText(label).width + 70), h = 76;
    if (o.hot) glow(x, 0, 0, w, o.hot, 0.55);
    x.strokeStyle = '#d6cdff'; x.lineWidth = 4; x.beginPath(); x.moveTo(-w / 2 + 22, 0); x.quadraticCurveTo(-w / 2 - 10, -50, -w / 2 + 10, -80); x.stroke();
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2 + 6, -h / 2 + 8, w, h, 16); x.fill();
    x.fillStyle = o.bg || '#ffffff'; x.beginPath(); x.moveTo(-w / 2, 0); x.lineTo(-w / 2 + 26, -h / 2); x.lineTo(w / 2 - 14, -h / 2); x.arcTo(w / 2, -h / 2, w / 2, h / 2, 14); x.arcTo(w / 2, h / 2, -w / 2, h / 2, 14); x.lineTo(-w / 2 + 26, h / 2); x.closePath(); x.fill();
    x.fillStyle = '#2a2470'; x.beginPath(); x.arc(-w / 2 + 24, 0, 7, 0, TAU); x.fill();
    x.fillStyle = o.fg || C.ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label, 12, 3);
    x.restore();
  }
  function gauge(x, cx, cy, w, frac, label, col, a = 1) {
    if (a <= 0.01) return;
    const h = 64;
    x.save(); x.globalAlpha *= a;
    text(x, label, cx, cy - 74, 48, '#e6e0ff');
    x.fillStyle = 'rgba(10,8,46,0.45)'; rr(x, cx - w / 2 + 6, cy - h / 2 + 10, w, h, h / 2); x.fill();
    x.fillStyle = '#2a2470'; rr(x, cx - w / 2, cy - h / 2, w, h, h / 2); x.fill();
    const fw = Math.max(h, w * cl(frac, 0, 1.2));
    const g = x.createLinearGradient(cx - w / 2, 0, cx - w / 2 + fw, 0); g.addColorStop(0, H.rgba(H.mix(col, '#ffffff', 0.35))); g.addColorStop(1, col);
    x.fillStyle = g; rr(x, cx - w / 2, cy - h / 2, fw, h, h / 2); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, cx - w / 2 + 18, cy - h / 2 + 10, Math.max(0, fw - 36), 12, 6); x.fill();
    if (frac > 1) glow(x, cx - w / 2 + fw, cy, 120, col, 0.6);
    x.restore();
  }
  function icon(x, kind, cx, cy, s) {
    x.save(); x.translate(cx, cy); x.strokeStyle = '#ffffff'; x.fillStyle = '#ffffff'; x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = s * 0.12;
    if (kind === 'pen') { x.beginPath(); x.moveTo(0, s * 0.75); x.lineTo(-s * 0.42, -s * 0.05); x.lineTo(0, -s * 0.7); x.lineTo(s * 0.42, -s * 0.05); x.closePath(); x.fill(); x.strokeStyle = 'rgba(40,20,90,0.8)'; x.lineWidth = s * 0.07; x.beginPath(); x.moveTo(0, s * 0.68); x.lineTo(0, s * 0.02); x.stroke(); x.fillStyle = 'rgba(40,20,90,0.8)'; x.beginPath(); x.arc(0, 0, s * 0.1, 0, TAU); x.fill(); }
    else if (kind === 'chart') { [0.35, 0.6, 0.9].forEach((hh, i) => { rr(x, -s * 0.6 + i * s * 0.42, s * 0.6 - hh * s, s * 0.3, hh * s, s * 0.08); x.fill(); }); }
    else if (kind === 'gear') { x.beginPath(); for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU, rr2 = i % 2 ? s * 0.48 : s * 0.66; x.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } x.closePath(); x.fill(); x.fillStyle = 'rgba(30,40,120,0.9)'; x.beginPath(); x.arc(0, 0, s * 0.2, 0, TAU); x.fill(); }
    else if (kind === 'speech') { rr(x, -s * 0.66, -s * 0.5, s * 1.32, s * 0.88, s * 0.3); x.fill(); x.beginPath(); x.moveTo(-s * 0.3, s * 0.3); x.lineTo(-s * 0.45, s * 0.7); x.lineTo(0, s * 0.36); x.fill(); x.fillStyle = 'rgba(120,80,10,0.85)'; for (const k of [-1, 0, 1]) { x.beginPath(); x.arc(k * s * 0.3, -s * 0.06, s * 0.09, 0, TAU); x.fill(); } }
    else if (kind === 'heart') { x.beginPath(); x.moveTo(0, s * 0.55); x.bezierCurveTo(-s * 0.9, -s * 0.05, -s * 0.45, -s * 0.75, 0, -s * 0.28); x.bezierCurveTo(s * 0.45, -s * 0.75, s * 0.9, -s * 0.05, 0, s * 0.55); x.fill(); }
    x.restore();
  }
  function bubbleIcon(x, cx, cy, r, kind, col, s) {
    if (s <= 0.01) return;
    x.save(); x.translate(cx, cy); x.scale(s, s);
    glow(x, 0, 0, r * 1.8, col, 0.35);
    ball(x, 0, 0, r, ['#ffffff', H.rgba(H.mix(col, '#ffffff', 0.4)), col], { sha: 0.35 });
    icon(x, kind, 0, 0, r * 0.62);
    x.restore();
  }
  function lightbulb(x, cx, cy, r, on) {
    if (r < 1) return;
    if (on > 0) { glow(x, cx, cy, r * 3.2, '#ffe066', 0.6 * on); x.save(); x.globalAlpha *= on; x.strokeStyle = '#ffe680'; x.lineWidth = r * 0.12; x.lineCap = 'round'; for (let i = 0; i < 7; i++) { const a = -Math.PI + (i / 6) * Math.PI; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r * 1.35); x.lineTo(cx + Math.cos(a) * r * 1.75, cy + Math.sin(a) * r * 1.75); x.stroke(); } x.restore(); }
    x.fillStyle = '#9a96c8'; rr(x, cx - r * 0.42, cy + r * 0.78, r * 0.84, r * 0.5, r * 0.15); x.fill();
    ball(x, cx, cy, r, on > 0.5 ? ['#fffbe0', '#ffe066', '#e8961c'] : ['#f0eeff', '#c9c4ee', '#6a63b0'], { sha: 0.35 });
  }
  function lever(x, fx, fy, len, ang, k) {
    if (k <= 0.01) return;
    x.save(); x.globalAlpha *= cl(k);
    x.fillStyle = '#5a63e6'; x.beginPath(); x.moveTo(fx, fy - 10); x.lineTo(fx - 70, fy + 110); x.lineTo(fx + 70, fy + 110); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.3)'; x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx - 50, fy + 100); x.lineTo(fx - 20, fy + 100); x.closePath(); x.fill();
    x.translate(fx, fy); x.rotate(ang);
    const g = x.createLinearGradient(0, -18, 0, 18); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#c46a2a');
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -len * 0.3 + 6, -14, len, 36, 18); x.fill();
    x.fillStyle = g; rr(x, -len * 0.3, -20, len, 36, 18); x.fill();
    x.restore();
  }
  function block(x, cx, cy, w, h, label, pal, s) {
    if (s <= 0.01) return;
    x.save(); x.translate(cx, cy); x.scale(s, s);
    x.fillStyle = 'rgba(10,8,46,0.45)'; rr(x, -w / 2 + 10, -h / 2 + 14, w, h, 22); x.fill();
    const g = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, pal[0]); g.addColorStop(0.5, pal[1]); g.addColorStop(1, pal[2]);
    x.fillStyle = g; rr(x, -w / 2, -h / 2, w, h, 22); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, -w / 2 + 16, -h / 2 + 10, w - 32, 12, 6); x.fill();
    x.fillStyle = H.rgba(pal[2], 0.35); rr(x, -w / 2, h / 2 - 22, w, 22, 11); x.fill();
    text(x, label, 0, 4, 44, '#ffffff', { shadow: H.rgba(pal[2], 0.8) });
    x.restore();
  }
  function stampX(x, cx, cy, r, s) { badge(x, cx, cy, r, 'no', s); }
  function speedLines(x, t, a, vertical) {
    if (a <= 0.01) return;
    const r = H.rng(Math.floor(t * 30) + 5);
    x.save(); x.globalAlpha = a; x.strokeStyle = '#ffffff'; x.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const p = r.range(0, vertical ? PW : PH), l = r.range(200, 700), q = r.range(-300, vertical ? PH : PW);
      x.lineWidth = r.range(3, 10); x.globalAlpha = a * r.range(0.2, 0.7); x.beginPath();
      if (vertical) { x.moveTo(p, q); x.lineTo(p, q + l); } else { x.moveTo(q, p); x.lineTo(q + l, p); }
      x.stroke();
    }
    x.restore();
  }
  const cloneOpt = { pal: GREY, shirt: GREY_SHIRT, lid: '#b9b4e2' };

  // ================= TIMELINE (seconds on the voice track) =================
  const T = {
    sweep: [13.15, 13.85], whip1: [34.95, 35.32], dive: [44.2, 44.72], whip2: [53.45, 53.92], whip3: [61.0, 61.42],
  };
  // headlines: only the lines that carry the idea, each word lands as it is spoken
  hl(0, 1.85, 470, 124, "YOU'RE@-1 NOT@-1 PAID@-1|FOR@0.7 YOUR@0.9 TIME@1.04#g*1.15");
  hl(1.92, 4.5, 430, 100, "YOU'RE@1.92 PAID@2.14 FOR@2.42 HOW@2.62|REPLACEABLE@2.8#r*1.25|YOU@3.56 ARE@3.78");
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
    x.save(); camApply(x, t, c, { punch: punchK(t, [0, 1.04, 2.8, 6.96, 7.86, 10.2, 12.1]) * (1 + 0.25 * (1 - eo(seg(t, 0, 0.35)))), shake: shakeK(t, [0.02, 1.04, 10.2], 18) });
    planet(x, 140, 820, 60, PL.coral, { glowA: 0.25 });
    planet(x, 960, 1650, 46, PL.moon);
    // the hook clock: "you're not paid for your time"
    const cOut = eio(seg(t, 1.9, 2.25));
    if (cOut < 1) {
      alarmClock(x, lerp(540, 1250, cOut), lerp(1150, 700, cOut), 230 * (1 - 0.4 * cOut), { t, ring: t < 1.0 ? 0.6 : 0, h: 9 + t * 3 });
      stampX(x, 700, 980, 80, back(seg(t, 1.04, 1.3), 2.2) * (1 - cOut));
    }
    // the person, swapped for a clone on "replaceable"
    const pin = back(seg(t, 1.95, 2.3), 1.8), sw = eio(seg(t, 2.8, 3.15));
    if (t > 1.9 && t < 4.75) {
      bean(x, lerp(540, -260, sw), 1220, 170 * pin, { t, look: [0.2, -0.3], blink: blinkAt(t, 0.3), shock: sw > 0.1 });
      if (sw > 0) bean(x, lerp(1340, 540, sw), 1220, 170, { t, ...cloneOpt, look: [-0.3, -0.2] });
      const pk = eo(seg(t, 3.56, 3.9));
      if (pk > 0) [[-1, 200], [1, 880]].forEach(([d, px]) => bean(x, px, 1290, 120 * pk, { t: t + d, ...cloneOpt, look: [-d * 0.6, 0] }));
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
    k.play('stamp', 1.04, { gain: 0.25 });
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
