  // ================= 9:16 VERTICAL TOOLKIT (shared by every short) =================
  // Continues the closure opened in base.js; the project's scenes.js continues it and closes it.
  // Logical canvas is 1080 x 1920. A project sets its own DUR (voice length + ~0.4 s hold).
  const PW = 1080, PH = 1920;
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
        const sp = x.measureText(' ').width * 1.6;
        const ws = ln.map((p) => { x.font = F(900, h.px * p.sc); return x.measureText(p.w).width + h.px * p.sc * 0.08; });
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

