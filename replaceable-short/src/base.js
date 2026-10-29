// Flat-Vector Science helpers, copied from the first explainer (passive-income-explainer/src/style.js).
(function () {
  const TAU = Math.PI * 2;
  const cl = H.clamp, lerp = H.lerp;
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const eo = H.ease.out, eio = H.ease.inOut;
  // gentle overshoot
  const back = (u, s = 1.5) => { if (u <= 0) return 0; if (u >= 1) return 1; return 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2); };
  const FONT = '"Nunito", "Fredoka", sans-serif';
  const F = (w, px) => `${w} ${px}px ${FONT}`;

  const C = {
    sky0: '#090b2c', sky1: '#18134f', sky2: '#3a1a6c',
    ink: '#141846',
    teal: ['#a4fbef', '#3ccbdc', '#1d64b0'],
    yellow: '#ffd23f', pink: '#ff5d8f', red: '#ff3b5c', green: '#38e08e', cyan: '#56e8ff', violet: '#8b5cff', lav: '#bfb2ff',
  };
  const GOLD = ['#fff3b0', '#ffc93f', '#b5620e'];
  const SKIN = ['#ffe6cc', '#f6ae80', '#a85a3c'];
  const PINK = ['#ffd0e0', '#ff86b0', '#b23a6e'];
  const REDB = ['#ff9aa8', '#ff4d6a', '#9c1638'];
  const MOONP = ['#fff6c8', '#ffd86a', '#c9862a'];
  const NZ = H.makeNoise(11);

  // ================= TIMELINE (shared with scoreSound) =================
  const D = 28;
  const TL = {
    title: 0.15, shrink: [1.75, 2.35],
    alarm: 2.45, ring: [2.55, 3.15], wake: 2.62, capOff: [2.9, 3.1], moonOut: [2.85, 3.65], hop: [2.9, 3.6],
    head2: 3.3, hat: 3.4, clockMove: [3.2, 3.7], arrow2: [3.7, 4.1], hours: [3.75, 5.05], payLbl: 4.45,
    sweep: [5.55, 6.35],
    coinIn: [6.15, 6.85], line1: 6.4, strike: [6.95, 7.3], line2: 7.4, yourLbl: 7.8, coinHat: 8.05, babies: 8.4,
    split: [9.3, 9.85], bloom: 9.8, head4: 9.55, moonIn: [10.9, 11.5], streams: 11.35, incomeLbl: 11.95,
    rearr: [13.2, 13.9], cal: 13.75, pig: 13.9, month0: 14.05, step: 0.42, travel: 0.5, toC: [16.9, 17.5],
    head6a: 17.6, axes: [17.75, 18.2], head6b: 18.95, curves: [19.0, 20.9], hit: 20.9, compLbl: 21.1,
    head7: 21.85, ast: [21.95, 22.6], cone: [22.75, 23.3], noGuar: 23.35,
    take: [24.6, 25.4], bean8: 25.15, line1T: 25.35, line2T: 25.65, sleep8: 26.5, D,
  };
  const HOUR = (i) => TL.hours[0] + ((i + 1) * (TL.hours[1] - TL.hours[0])) / 8; // coin i pops when hour i+1 ends
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const MT = (k) => TL.month0 + k * TL.step;
  const RENT = 1500, DIV = 300; // assumed: $1,500 rent a month, $300 dividend a quarter
  const DIVM = [2, 5]; // March and June
  const V = (yr) => 10000 * Math.pow(1.07, yr); // assumed: $10,000 at 7% a year, reinvested
  // stream coin spawns in the asset scene: [stream, spawnTime]
  const STREAM_SP = (() => { const a = []; for (let s = 0; s < 3; s++) for (let ts = 11.75 + s * 0.15; ts < 13.0; ts += 0.45) a.push([s, ts]); return a; })();
  const STREAM_TRAVEL = 0.7;

  // ================= ref helpers =================
  function rr(x, X, Y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  }
  function glow(x, cx, cy, r, col, a) {
    if (a <= 0 || r <= 0) return;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, H.rgba(col, a)); g.addColorStop(0.35, H.rgba(col, a * 0.4)); g.addColorStop(1, H.rgba(col, 0));
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
  }
  function spark(x, cx, cy, r, col, a) {
    if (a <= 0 || r <= 0) return;
    x.save(); x.globalAlpha *= a; x.fillStyle = col; x.beginPath();
    x.moveTo(cx, cy - r); x.quadraticCurveTo(cx, cy, cx + r, cy); x.quadraticCurveTo(cx, cy, cx, cy + r);
    x.quadraticCurveTo(cx, cy, cx - r, cy); x.quadraticCurveTo(cx, cy, cx, cy - r); x.fill(); x.restore();
  }
  function crescent(x, cx, cy, r, dx, dy, fill) {
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.clip();
    x.beginPath(); x.rect(cx - r - 2, cy - r - 2, 2 * r + 4, 2 * r + 4); x.arc(cx + dx, cy + dy, r * 1.02, 0, TAU);
    x.fillStyle = fill; x.fill('evenodd'); x.restore();
  }
  function ball(x, cx, cy, r, col, o = {}) {
    if (r <= 0.3) return;
    const la = o.la == null ? -2.25 : o.la, lx = Math.cos(la), ly = Math.sin(la);
    const g = x.createLinearGradient(cx + lx * r, cy + ly * r, cx - lx * r, cy - ly * r);
    g.addColorStop(0, col[0]); g.addColorStop(0.45, col[1]); g.addColorStop(1, H.rgba(H.mix(col[1], col[2], 0.6)));
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    if (o.inner) { x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.clip(); o.inner(); x.restore(); }
    const sh = o.sh == null ? 0.3 : o.sh;
    crescent(x, cx, cy, r, lx * r * sh, ly * r * sh, H.rgba(col[2], o.sha == null ? 0.5 : o.sha));
    crescent(x, cx, cy, r, lx * r * sh * 2.2, ly * r * sh * 2.2, H.rgba(col[2], (o.sha == null ? 0.5 : o.sha) * 0.45));
    crescent(x, cx, cy, r, -lx * r * 0.075, -ly * r * 0.075, H.rgba(o.rim || '#ffffff', o.rima == null ? 0.42 : o.rima));
  }
  const bez = (P, u) => { const v = 1 - u; return [v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0], v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1]]; };
  function arrow(x, P, prog, col, lw, o = {}) {
    if (prog <= 0) return;
    const n = 48, a = o.a == null ? 1 : o.a;
    if (a <= 0.01) return;
    x.save(); x.globalAlpha *= a; x.strokeStyle = col; x.fillStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dots) x.setLineDash([0.01, lw * 1.9]);
    x.beginPath(); const p0 = bez(P, o.from || 0); x.moveTo(p0[0], p0[1]);
    for (let i = 1; i <= n; i++) { const u = (o.from || 0) + ((prog - (o.from || 0)) * i) / n; const p = bez(P, u); x.lineTo(p[0], p[1]); }
    x.stroke(); x.setLineDash([]);
    if (o.head !== false && prog > 0.08) {
      const e = bez(P, prog), e0 = bez(P, prog - 0.02), ang = Math.atan2(e[1] - e0[1], e[0] - e0[0]), hs = lw * 1.5 * cl(prog * 5);
      x.translate(e[0], e[1]); x.rotate(ang); x.beginPath(); x.moveTo(hs * 1.1, 0); x.lineTo(-hs * 0.8, hs); x.lineTo(-hs * 0.8, -hs); x.closePath();
      x.lineWidth = lw * 0.7; x.fill(); x.stroke();
    }
    x.restore();
  }
  function text(x, s, cx, cy, px, col, o = {}) {
    x.save(); x.font = F(o.w || 900, px); x.textAlign = o.align || 'center'; x.textBaseline = 'middle';
    x.globalAlpha *= o.a == null ? 1 : o.a;
    x.fillStyle = o.shadow || 'rgba(10,8,46,0.55)'; x.fillText(s, cx + px * 0.03, cy + px * 0.07);
    x.fillStyle = col; x.fillText(s, cx, cy); x.restore();
  }
  function pill(x, cx, cy, s, px, o = {}) {
    const sc = o.s == null ? 1 : o.s, a = o.a == null ? 1 : o.a;
    if (sc <= 0.01 || a <= 0.01) return;
    x.save(); x.font = F(o.w || 900, px);
    const tw = x.measureText(s).width, w = tw + px * 1.15, h = px * 1.6;
    x.translate(cx, cy); x.scale(sc, sc); x.globalAlpha *= a;
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2, -h / 2 + px * 0.2, w, h, h / 2); x.fill();
    x.fillStyle = o.bg || '#ffffff';
    if (o.ptr) { x.beginPath(); x.moveTo(-px * 0.35, h / 2 - 2); x.lineTo(0, h / 2 + px * 0.45); x.lineTo(px * 0.35, h / 2 - 2); x.fill(); }
    rr(x, -w / 2, -h / 2, w, h, h / 2); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.35)'; rr(x, -w / 2 + h * 0.25, -h / 2 + h * 0.12, w - h * 0.5, h * 0.16, h * 0.08); x.fill();
    x.fillStyle = o.fg || C.ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, 0, px * 0.06);
    x.restore();
    return w;
  }
  // multi-colour word line, centred on (0,0): parts = [[word, colour], ...]
  function words(x, parts, px) {
    x.font = F(900, px);
    const sp = x.measureText(' ').width, ws = parts.map(([w]) => x.measureText(w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1);
    let wx = -tot / 2;
    parts.forEach(([w, c], i) => { text(x, w, wx + ws[i] / 2, 0, px, c); wx += ws[i] + sp; });
  }
  // a headline that pops in at tin and lifts out at tout
  function headline(x, t, parts, y, px, tin, tout) {
    const kin = back(seg(t, tin, tin + 0.4), 1.4), kout = tout == null ? 0 : eio(seg(t, tout, tout + 0.3));
    if (kin <= 0.01 || kout >= 0.99) return;
    x.save(); x.translate(640, y - kout * 50 + (1 - cl(kin)) * 30); const s = kin * (1 - kout * 0.25); x.scale(s, s); x.globalAlpha *= 1 - kout;
    words(x, typeof parts === 'string' ? [[parts, '#ffffff']] : parts, px); x.restore();
  }

  // ---------- sky (ref, plus a dawn mix for the "wake up" beat) ----------
  let STARS = null;
  function stars() {
    if (STARS) return STARS;
    const r = H.rng(77), a = [], sp = [];
    for (let i = 0; i < 620; i++) a.push({ x: r.range(0, 1680), y: r.range(0, 1120), d: r.pick([0.15, 0.3, 0.3, 0.55, 1]), s: r.range(0.6, 2.0), ph: r.range(0, TAU), sp: r.range(0.8, 2.6), c: r.pick(['#ffffff', '#cfe4ff', '#ffe9c7', '#dccbff']) });
    for (let i = 0; i < 16; i++) sp.push({ x: r.range(0, 1680), y: r.range(0, 1120), d: r.range(0.3, 0.9), s: r.range(6, 13), ph: r.range(0, TAU) });
    STARS = { a, sp }; return STARS;
  }
  function sky(x, W, H_, t, cam = {}) {
    const px = cam.x || 0, py = cam.y || 0, lz = Math.log(cam.z || 1), dn = cam.dawn || 0;
    const g = x.createLinearGradient(0, 0, W * 0.3, H_);
    g.addColorStop(0, H.rgba(H.mix(C.sky0, '#2a2378', dn))); g.addColorStop(0.5, H.rgba(H.mix(C.sky1, '#6a3a9a', dn))); g.addColorStop(1, H.rgba(H.mix(C.sky2, '#ff8a6a', dn)));
    x.fillStyle = g; x.fillRect(0, 0, W, H_);
    glow(x, W * 0.86, H_ * 0.12, 700, '#7b34c6', 0.34);
    glow(x, W * 0.05, H_ * 1.0, 620, '#2448b4', 0.4 * (1 - dn * 0.6));
    glow(x, W * 0.45, H_ * 0.6, 520, '#4a2a9c', 0.16);
    if (dn > 0) glow(x, W * 0.8, H_ * 1.05, 900, '#ffb36b', 0.55 * dn);
    const S = stars(), sa = 1 - 0.7 * dn;
    const place = (s) => {
      const k = Math.exp(lz * s.d * 0.6);
      let sx = (((s.x - px * s.d) % 1680) + 1680) % 1680 - 200, sy = (((s.y - py * s.d) % 1120) + 1120) % 1120 - 200;
      return [(sx - 640) * k + 640, (sy - 360) * k + 360];
    };
    for (const s of S.a) {
      const [sx, sy] = place(s);
      if (sx < -4 || sx > W + 4 || sy < -4 || sy > H_ + 4) continue;
      x.globalAlpha = (0.55 + 0.45 * Math.sin(t * s.sp + s.ph)) * (0.45 + s.d * 0.55) * sa;
      x.fillStyle = s.c; x.beginPath(); x.arc(sx, sy, s.s * (0.7 + 0.35 * s.d), 0, TAU); x.fill();
    }
    x.globalAlpha = 1;
    for (const s of S.sp) {
      const [sx, sy] = place(s); const tw = 0.6 + 0.4 * Math.sin(t * 1.7 + s.ph);
      glow(x, sx, sy, s.s * 2.2, '#bfa8ff', 0.25 * tw * sa);
      spark(x, sx, sy, s.s * tw, '#ffffff', 0.9 * sa);
    }
  }

  // ---------- planets (ref) ----------
  function ring(x, cx, cy, R, half, a = 1) {
    if (a <= 0) return;
    x.save(); x.translate(cx, cy); x.rotate(R.tilt); x.globalAlpha *= a;
    const m = Math.max(...R.bands.map((b) => b[1])) * 1.05;
    x.beginPath(); if (half === 'back') x.rect(-R.rx * m, -R.ry * m, R.rx * m * 2, R.ry * m); else x.rect(-R.rx * m, 0, R.rx * m * 2, R.ry * m); x.clip();
    for (const [f0, f1, col, al] of R.bands) {
      x.beginPath(); x.ellipse(0, 0, R.rx * f1, R.ry * f1, 0, 0, TAU); x.ellipse(0, 0, R.rx * f0, R.ry * f0, 0, 0, TAU);
      x.fillStyle = H.rgba(col, (al == null ? 1 : al) * (half === 'back' ? 0.75 : 1)); x.fill('evenodd');
    }
    x.restore();
  }
  function bands(x, r, B, tilt) {
    x.save(); x.rotate(tilt || 0);
    for (const [v0, v1, col, a] of B) {
      x.beginPath();
      for (let i = 0; i <= 20; i++) { const u = (i / 20) * 2 - 1; x.lineTo(u * r * 1.1, (v0 + 0.13 * (1 - u * u)) * r); }
      for (let i = 20; i >= 0; i--) { const u = (i / 20) * 2 - 1; x.lineTo(u * r * 1.1, (v1 + 0.13 * (1 - u * u)) * r); }
      x.fillStyle = H.rgba(col, a == null ? 1 : a); x.fill();
    }
    x.restore();
  }
  const PL = {
    magenta: { c: ['#ffa0c4', '#de4b93', '#4e1670'], glow: '#ff5fa8', tilt: -0.18, atmo: [255, 214, 234],
      bands: [[-0.62, -0.48, '#ffc1d8', 0.55], [-0.2, -0.02, '#b5307e', 0.6], [0.06, 0.14, '#ffd0e2', 0.4], [0.36, 0.58, '#9a2775', 0.55]],
      ring: { rx: 1.75, ry: 0.5, tilt: -0.2, bands: [[1.18, 1.32, '#ffd27a', 0.95], [1.34, 1.5, '#ff9f5a', 0.9], [1.53, 1.6, '#ffe7b0', 0.8]] } },
    coral: { c: ['#ffd29a', '#ff7a4a', '#7a1f4f'], glow: '#ff8a50', tilt: 0.1, atmo: [255, 226, 190],
      bands: [[-0.7, -0.5, '#ffe2b8', 0.5], [-0.32, -0.12, '#e8553a', 0.6], [0.05, 0.22, '#ffb27a', 0.5], [0.4, 0.62, '#c43c46', 0.55]] },
    teal: { c: ['#9ff3ff', '#3a9be0', '#1d2f86'], glow: '#4fc9ff', tilt: -0.12, atmo: [190, 245, 255],
      bands: [[-0.5, -0.36, '#c6f8ff', 0.5], [-0.05, 0.1, '#2f74c9', 0.55], [0.32, 0.5, '#7fdcff', 0.4]] },
    moon: { c: ['#e8e6ff', '#a7a2d8', '#4a3f8c'], craters: true },
  };
  function planet(x, cx, cy, r, pal, o = {}) {
    if (r <= 0.5) return;
    const ra = o.ringA == null ? 1 : o.ringA;
    if (pal.glow) glow(x, cx, cy, r * 1.7, pal.glow, o.glowA == null ? 0.32 : o.glowA);
    const R = pal.ring && { rx: pal.ring.rx * r, ry: pal.ring.ry * r, tilt: pal.ring.tilt, bands: pal.ring.bands };
    if (R) ring(x, cx, cy, R, 'back', ra);
    ball(x, cx, cy, r, pal.c, {
      sh: 0.34, sha: 0.55, rima: 0.35,
      inner: () => {
        x.save(); x.translate(cx, cy);
        if (pal.bands) bands(x, r, pal.bands, pal.tilt);
        if (pal.craters) { const q = H.rng(5); for (let i = 0; i < 5; i++) { const a = q.range(0, TAU), d = q.range(0.1, 0.65) * r, cr = q.range(0.1, 0.2) * r, qx = Math.cos(a) * d, qy = Math.sin(a) * d; x.fillStyle = 'rgba(80,66,150,0.38)'; x.beginPath(); x.arc(qx, qy, cr, 0, TAU); x.fill(); crescent(x, qx, qy, cr, -cr * 0.3, -cr * 0.3, 'rgba(255,255,255,0.3)'); } }
        x.restore();
      },
    });
    const atA = o.atmo == null ? 0.7 : o.atmo;
    if (pal.atmo && atA > 0) {
      x.save(); x.lineCap = 'round'; const ga0 = x.globalAlpha;
      const la = -2.25, ag = x.createLinearGradient(cx + Math.cos(la) * r, cy + Math.sin(la) * r, cx - Math.cos(la) * r, cy - Math.sin(la) * r);
      ag.addColorStop(0, H.rgba(pal.atmo, 1)); ag.addColorStop(0.55, H.rgba(pal.atmo, 0.5)); ag.addColorStop(1, H.rgba(pal.atmo, 0.08));
      x.strokeStyle = ag;
      for (const [lw, a] of [[r * 0.05, 0.08], [r * 0.028, 0.16], [r * 0.014, 0.3], [Math.max(2, r * 0.006), 0.6]]) { x.globalAlpha = ga0 * a * atA; x.lineWidth = lw; x.beginPath(); x.arc(cx, cy, r + lw * 0.15, 0, TAU); x.stroke(); }
      x.restore();
    }
    if (R) ring(x, cx, cy, R, 'front', ra);
  }

  // ---------- print finish (ref): animated grain + static mottling, overlay ----------
  let GRAIN = null;
  function grainTex() {
    if (GRAIN) return GRAIN;
    const S = 256, tile = H.layer(S, S), tc = tile.getContext('2d'), img = tc.createImageData(S, S), d = img.data, r = H.rng(4242);
    for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 92; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    tc.putImageData(img, 0, 0);
    const MW = 320, MH = 180, mot = H.layer(MW, MH), mc = mot.getContext('2d'), mi = mc.createImageData(MW, MH), md = mi.data, nz = H.makeNoise(88);
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const v = 128 + nz.fbm2(x * 0.035, y * 0.035, 4) * 70 + nz.n2(x * 0.22, y * 0.22) * 14, k = (y * MW + x) * 4; md[k] = md[k + 1] = md[k + 2] = v; md[k + 3] = 255; }
    mc.putImageData(mi, 0, 0);
    GRAIN = { tile, mot };
    return GRAIN;
  }
  function finish(x, W, H_, t) {
    const G = grainTex(), f = Math.floor(t * 24);
    x.save(); x.globalCompositeOperation = 'overlay';
    x.globalAlpha = 0.12; x.imageSmoothingEnabled = true; x.drawImage(G.mot, 0, 0, W, H_);
    const pat = x.createPattern(G.tile, 'repeat'); pat.setTransform(new DOMMatrix().translateSelf((f * 73) % 256, (f * 151) % 256));
    x.globalAlpha = 0.09; x.fillStyle = pat; x.fillRect(0, 0, W, H_);
    x.restore();
  }

  // ---------- eyes (ref) ----------
  function eye(x, ex, ey, er, o) {
    const look = o.look || [0, 0];
    if ((o.happy || 0) > 0.5) {
      x.save(); x.strokeStyle = '#ffffff'; x.lineWidth = er * 0.42; x.lineCap = 'round';
      if (o.happyCol) x.strokeStyle = o.happyCol;
      x.beginPath(); x.arc(ex, ey + er * 0.35, er * 0.62, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); x.restore(); return;
    }
    const bl = 1 - 0.92 * (o.blink || 0);
    x.save(); x.translate(ex, ey); x.scale(1, bl);
    x.fillStyle = '#ffffff'; x.beginPath(); x.arc(0, 0, er, 0, TAU); x.fill();
    const pr = er * (o.worry ? 0.5 : 0.56);
    const px = look[0] * er * 0.36, py = look[1] * er * 0.36;
    x.fillStyle = '#141638'; x.beginPath(); x.arc(px, py, pr, 0, TAU); x.fill();
    x.fillStyle = '#ffffff'; x.beginPath(); x.arc(px - pr * 0.35, py - pr * 0.4, pr * 0.32, 0, TAU); x.fill();
    x.beginPath(); x.arc(px + pr * 0.35, py + pr * 0.35, pr * 0.13, 0, TAU); x.fill();
    x.restore();
  }
  const blinkAt = (t, ph) => { const u = (t + ph) % 3.3; return u < 0.14 ? Math.sin((u / 0.14) * Math.PI) : 0; };

  function badge(x, cx, cy, r, kind, s) {
    if (s <= 0.01) return;
    x.save(); x.translate(cx, cy); x.scale(s, s);
    const ok = kind === 'ok';
    glow(x, 0, 0, r * 2.4, ok ? C.green : C.red, 0.45);
    ball(x, 0, 0, r, ok ? ['#9fffc8', C.green, '#178a5a'] : ['#ff9aa8', C.red, '#9c1638'], { sha: 0.4 });
    x.strokeStyle = '#ffffff'; x.fillStyle = '#ffffff'; x.lineWidth = r * 0.26; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    if (ok) { x.moveTo(-r * 0.42, 0); x.lineTo(-r * 0.1, r * 0.32); x.lineTo(r * 0.45, -r * 0.3); x.stroke(); }
    else if (kind === 'warn') { x.moveTo(0, -r * 0.48); x.lineTo(0, r * 0.12); x.stroke(); x.beginPath(); x.arc(0, r * 0.45, r * 0.15, 0, TAU); x.fill(); }
    else { x.moveTo(-r * 0.34, -r * 0.34); x.lineTo(r * 0.34, r * 0.34); x.moveTo(r * 0.34, -r * 0.34); x.lineTo(-r * 0.34, r * 0.34); x.stroke(); }
    x.restore();
  }
  function flare(x, cx, cy, k, t) {
    if (k <= 0) return;
    glow(x, cx, cy, 420 * (0.6 + 0.4 * k), '#ffcf5a', 0.55 * k);
    glow(x, cx, cy, 160, '#fff6d0', 0.6 * k);
    x.save(); x.translate(cx, cy); x.rotate(t * 0.25); x.globalAlpha *= 0.32 * k; x.fillStyle = '#ffe28a';
    for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.beginPath(); x.moveTo(0, -12); x.lineTo(330 + 60 * (i % 2), 0); x.lineTo(0, 12); x.fill(); }
    x.restore();
  }
  function burst(x, cx, cy, age, seed, spread, cols) {
    if (age < 0 || age > 1.4) return;
    const r = H.rng(seed);
    for (let i = 0; i < 18; i++) {
      const a = r.range(0, TAU), d = (spread || 300) * r.range(0.45, 1) * eo(cl(age / 0.9)), sz = r.range(7, 16) * (1 - cl(age / 1.4));
      spark(x, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, sz, r.pick(cols || ['#ffffff', '#ffe28a', '#9ff7ff', '#ffb0d0']), 1);
    }
  }

  // ================= NEW PROPS (built from the same ball / crescent / glow recipe) =================
  // hats sit on a round character; drawn in its local space (origin = body centre)
  function hat(x, r, kind, k, o = {}) {
    if (k <= 0.01) return;
    x.save(); x.translate(o.dx || 0, -r * 0.62 + (o.dy || 0)); x.rotate(o.rot || 0); x.scale(k, k);
    if (kind === 'hard') {
      const g = x.createLinearGradient(-r * 0.6, -r * 0.7, r * 0.6, 0); g.addColorStop(0, '#fff09a'); g.addColorStop(0.5, '#ffd23f'); g.addColorStop(1, '#e8961c');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * 0.68, Math.PI, 0); x.closePath(); x.fill();
      x.save(); x.beginPath(); x.rect(-r, -r, 2 * r, r); x.clip(); crescent(x, 0, 0, r * 0.68, -r * 0.2, -r * 0.22, 'rgba(196,104,18,0.38)'); x.restore();
      x.fillStyle = '#ffe680'; rr(x, -r * 0.09, -r * 0.7, r * 0.18, r * 0.68, r * 0.09); x.fill();
      x.fillStyle = '#f0a81f'; rr(x, -r * 0.9, -r * 0.05, r * 1.8, r * 0.17, r * 0.085); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.4)'; rr(x, -r * 0.7, -r * 0.03, r * 0.8, r * 0.05, r * 0.025); x.fill();
    } else {
      const g = x.createLinearGradient(-r * 0.6, -r, r, 0); g.addColorStop(0, '#9fb0ff'); g.addColorStop(0.5, '#5a63e6'); g.addColorStop(1, '#33289a');
      x.fillStyle = g; x.beginPath(); x.moveTo(-r * 0.72, 0);
      x.quadraticCurveTo(-r * 0.5, -r * 1.15, r * 0.3, -r * 1.0); x.quadraticCurveTo(r * 0.85, -r * 0.88, r * 1.05, -r * 0.32);
      x.quadraticCurveTo(r * 0.6, -r * 0.62, r * 0.72, 0); x.closePath(); x.fill();
      x.fillStyle = 'rgba(255,230,128,0.85)'; for (const [dx, dy] of [[-0.3, -0.45], [0.2, -0.7], [0.3, -0.28]]) { x.beginPath(); x.arc(dx * r, dy * r, r * 0.07, 0, TAU); x.fill(); }
      x.fillStyle = '#ffffff'; rr(x, -r * 0.8, -r * 0.1, r * 1.6, r * 0.22, r * 0.11); x.fill();
      ball(x, r * 1.05, -r * 0.3, r * 0.18, ['#ffffff', '#e8e4ff', '#9a8fe0'], { sha: 0.35 });
    }
    x.restore();
  }
  function zzz(x, cx, cy, t, a, sz, rise = 120) {
    if (a <= 0.01) return;
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.45 + i / 3) % 1, px = sz * (0.75 + 0.55 * u);
      text(x, 'Z', cx + u * 80 + Math.sin(u * 6) * 8, cy - u * rise, px, '#d6e6ff', { a: a * Math.sin(u * Math.PI) });
    }
  }
  // the round character: one skin-tone ball with a shirt, big eyes, stubby arms and feet
  function bean(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const t = o.t || 0;
    x.save(); x.translate(cx, cy); x.rotate(o.rot || 0); const sq = o.sq || 0; x.scale(1 + sq, 1 - sq);
    if (!o.noFeet) { x.fillStyle = '#2b2f7a'; for (const sd of [-1, 1]) { x.beginPath(); x.ellipse(sd * r * 0.38, r * 0.95, r * 0.26, r * 0.14, 0, 0, TAU); x.fill(); } }
    for (const sd of [-1, 1]) {
      const up = (o.armUp || 0) * (sd > 0 ? 1 : 0.7), ang = sd * (0.6 + 0.12 * Math.sin(t * 2.2 + sd)) - sd * up * 1.8;
      const sx = sd * r * 0.82, sy = r * 0.18, ex = sx + Math.sin(ang) * r * 0.5, ey = sy + Math.cos(ang) * r * 0.5;
      x.strokeStyle = (o.shirt || ['#45b4ff'])[0]; x.lineWidth = r * 0.2; x.lineCap = 'round'; x.beginPath(); x.moveTo(sx, sy); x.lineTo(ex, ey); x.stroke();
      ball(x, ex, ey, r * 0.15, o.pal || SKIN, { sha: 0.4 });
    }
    ball(x, 0, 0, r, o.pal || SKIN, { sha: 0.42, inner: () => {
      const sc = o.shirt || ['#45b4ff', '#1d4fae'];
      const g = x.createLinearGradient(0, r * 0.3, 0, r); g.addColorStop(0, sc[0]); g.addColorStop(1, sc[1]);
      x.fillStyle = g; x.beginPath(); x.moveTo(-r * 1.1, r * 0.4); x.quadraticCurveTo(0, r * 0.62, r * 1.1, r * 0.4); x.lineTo(r * 1.1, r * 1.1); x.lineTo(-r * 1.1, r * 1.1); x.fill();
    } });
    const ey = -r * 0.1, er = r * 0.22;
    for (const sd of [-1, 1]) {
      const ex = sd * r * 0.33;
      if (o.sleep) { x.strokeStyle = '#5a2a3a'; x.lineWidth = er * 0.32; x.lineCap = 'round'; x.beginPath(); x.arc(ex, ey - er * 0.2, er * 0.68, 0.15 * Math.PI, 0.85 * Math.PI); x.stroke(); }
      else {
        eye(x, ex, ey, er * (o.shock ? 1.15 : 1), { look: o.look, blink: o.blink, happy: o.happy, happyCol: '#5a2a3a' });
        if (o.tired && !o.happy) { x.fillStyle = o.lid || '#f2a274'; x.beginPath(); x.arc(ex, ey, er * 1.06, Math.PI, TAU); x.closePath(); x.fill(); x.strokeStyle = '#b8603c'; x.lineWidth = er * 0.18; x.lineCap = 'round'; x.beginPath(); x.moveTo(ex - er, ey); x.lineTo(ex + er, ey); x.stroke(); }
      }
    }
    x.fillStyle = 'rgba(255,110,140,0.45)'; for (const sd of [-1, 1]) { x.beginPath(); x.arc(sd * r * 0.58, r * 0.16, r * 0.12, 0, TAU); x.fill(); }
    x.save(); x.strokeStyle = '#7a2e2e'; x.fillStyle = '#7a2e2e'; x.lineWidth = r * 0.06; x.lineCap = 'round'; x.beginPath();
    const my = r * 0.28;
    if (o.shock) { x.ellipse(0, my, r * 0.09, r * 0.12, 0, 0, TAU); x.fill(); }
    else if (o.sleep) { x.ellipse(0, my, r * 0.06, r * 0.05, 0, 0, TAU); x.fill(); }
    else if (o.tired) { x.moveTo(-r * 0.12, my); x.quadraticCurveTo(-r * 0.06, my - r * 0.05, 0, my); x.quadraticCurveTo(r * 0.06, my + r * 0.05, r * 0.12, my); x.stroke(); }
    else if (o.happy) { x.arc(0, my - r * 0.06, r * 0.14, 0.1 * Math.PI, 0.9 * Math.PI); x.stroke(); }
    else { x.arc(0, my - r * 0.08, r * 0.1, 0.25 * Math.PI, 0.75 * Math.PI); x.stroke(); }
    x.restore();
    if (o.sweat > 0) {
      const sx = r * 0.8, sy = -r * 0.42 + ((t * 40) % (r * 0.3));
      x.save(); x.globalAlpha *= cl(o.sweat); x.fillStyle = '#7fe6ff';
      x.beginPath(); x.moveTo(sx, sy - r * 0.16); x.quadraticCurveTo(sx + r * 0.09, sy, sx, sy + r * 0.06); x.quadraticCurveTo(sx - r * 0.09, sy, sx, sy - r * 0.16); x.fill(); x.restore();
    }
    if (o.cap) hat(x, r, 'night', o.cap, { rot: -0.05 });
    if (o.hard) hat(x, r, 'hard', o.hard, { dy: -(1 - cl(o.hard)) * r * 0.6 });
    x.restore();
    if (o.zzz) zzz(x, cx + r * 0.75, cy - r * 0.95, t, o.zzz, Math.max(30, r * 0.5), o.zzzRise);
  }
  // gold coin: ball + rim ring + $ (or a face)
  function coin(x, cx, cy, r, o = {}) {
    if (r < 0.5) return;
    const fl = o.flip == null ? 1 : o.flip, t = o.t || 0;
    x.save(); x.translate(cx, cy); x.rotate(o.rot || 0);
    if (o.glowA !== 0) glow(x, 0, 0, r * 1.9, '#ffcf5a', o.glowA == null ? 0.3 : o.glowA);
    if (o.arms) for (const sd of [-1, 1]) {
      const up = (o.armUp || 0), ang = sd * (0.7 + 0.12 * Math.sin(t * 2.4 + sd)) - sd * up * 2.0;
      const sx = sd * r * 0.9, sy = r * 0.1, ex = sx + Math.sin(ang) * r * 0.42, ey = sy + Math.cos(ang) * r * 0.42;
      x.strokeStyle = '#d98d1a'; x.lineWidth = r * 0.12; x.lineCap = 'round'; x.beginPath(); x.moveTo(sx, sy); x.lineTo(ex, ey); x.stroke();
      ball(x, ex, ey, r * 0.12, GOLD, { sha: 0.4 });
    }
    x.save(); x.scale(Math.max(0.06, Math.abs(fl)), 1);
    ball(x, 0, 0, r, GOLD, { sha: 0.42, inner: () => {
      x.strokeStyle = 'rgba(190,105,16,0.5)'; x.lineWidth = r * 0.09; x.beginPath(); x.arc(0, 0, r * 0.76, 0, TAU); x.stroke();
      if (!o.face || fl < 0) { x.font = F(900, r * 1.05); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(176,96,12,0.78)'; x.fillText('$', 0, r * 0.06); }
    } });
    if (o.face && fl > 0) {
      for (const sd of [-1, 1]) eye(x, sd * r * 0.3, -r * 0.08, r * 0.2, { look: o.look, blink: o.blink, happy: o.happy, happyCol: '#8a4a0a' });
      x.fillStyle = 'rgba(255,110,90,0.4)'; for (const sd of [-1, 1]) { x.beginPath(); x.arc(sd * r * 0.52, r * 0.18, r * 0.1, 0, TAU); x.fill(); }
      x.strokeStyle = '#8a4a0a'; x.lineWidth = r * 0.06; x.lineCap = 'round'; x.beginPath(); x.arc(0, r * 0.16, r * 0.14, 0.15 * Math.PI, 0.85 * Math.PI); x.stroke();
    }
    x.restore();
    if (o.hard) hat(x, r, 'hard', o.hard, { dy: -(1 - cl(o.hard)) * r * 0.6 });
    x.restore();
  }
  // crescent moon cradle; returns where a sleeper of radius sr sits
  function moonSeat(cx, cy, r, sr) { return [cx + r * 0.22, cy - r * 0.55 + r * 0.86 - sr * 0.98]; }
  function crescentMoon(x, cx, cy, r) {
    if (r < 1) return;
    glow(x, cx, cy, r * 2.0, '#ffd86a', 0.22);
    x.save(); x.beginPath(); x.rect(cx - r * 3, cy - r * 3, r * 6, r * 6); x.arc(cx + r * 0.22, cy - r * 0.55, r * 0.86, 0, TAU); x.clip('evenodd');
    ball(x, cx, cy, r, MOONP, { sha: 0.42, inner: () => {
      const q = H.rng(9); for (let i = 0; i < 4; i++) { const a = q.range(1.6, 3.4), d = q.range(0.55, 0.8) * r, cr = q.range(0.08, 0.14) * r, qx = cx + Math.cos(a) * d, qy = cy + Math.sin(a) * d; x.fillStyle = 'rgba(201,134,42,0.35)'; x.beginPath(); x.arc(qx, qy, cr, 0, TAU); x.fill(); }
    } });
    x.restore();
  }
  function alarmClock(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const ring = o.ring || 0, t = o.t || 0, hm = Math.sin(t * 90) * ring;
    x.save(); x.translate(cx, cy); x.rotate(Math.sin(t * 62) * 0.12 * ring);
    if (ring > 0) glow(x, 0, 0, r * 2.4, '#ffd23f', 0.35 * ring);
    x.strokeStyle = '#7a1f3f'; x.lineWidth = r * 0.12; x.lineCap = 'round';
    for (const sd of [-1, 1]) { x.beginPath(); x.moveTo(sd * r * 0.5, r * 0.75); x.lineTo(sd * r * 0.72, r * 1.05); x.stroke(); }
    x.strokeStyle = '#c77a12'; x.lineWidth = r * 0.08; x.beginPath(); x.moveTo(0, -r * 0.9); x.lineTo(0, -r * 1.2); x.stroke();
    for (const sd of [-1, 1]) ball(x, sd * r * 0.62 + sd * hm * r * 0.03, -r * 0.84, r * 0.34, GOLD, { sha: 0.4 });
    ball(x, hm * r * 0.28, -r * 1.22, r * 0.1, GOLD);
    ball(x, 0, 0, r, REDB, { sha: 0.45 });
    x.fillStyle = '#fffaf0'; x.beginPath(); x.arc(0, 0, r * 0.74, 0, TAU); x.fill();
    x.fillStyle = C.ink;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; x.beginPath(); x.arc(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * (i % 3 ? 0.035 : 0.06), 0, TAU); x.fill(); }
    const h = o.h == null ? 7 : o.h, ha = ((h % 12) / 12) * TAU - Math.PI / 2, ma = (h % 1) * TAU - Math.PI / 2;
    x.strokeStyle = C.ink; x.lineCap = 'round';
    x.lineWidth = r * 0.11; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(ha) * r * 0.36, Math.sin(ha) * r * 0.36); x.stroke();
    x.lineWidth = r * 0.07; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(ma) * r * 0.54, Math.sin(ma) * r * 0.54); x.stroke();
    x.fillStyle = C.red; x.beginPath(); x.arc(0, 0, r * 0.08, 0, TAU); x.fill();
    x.restore();
  }
  function house(x, bx, by, w) {
    const h = w * 0.6, x0 = bx - w / 2, y0 = by - h;
    x.fillStyle = '#b8384a'; rr(x, bx + w * 0.2, y0 - h * 0.62, w * 0.13, h * 0.55, w * 0.02); x.fill();
    const g = x.createLinearGradient(x0, y0, x0 + w, by); g.addColorStop(0, '#fff4e4'); g.addColorStop(1, '#f2c9a2');
    x.fillStyle = g; rr(x, x0, y0, w, h, w * 0.04); x.fill();
    x.fillStyle = 'rgba(176,96,72,0.22)'; rr(x, bx + w * 0.2, y0, w * 0.3, h, w * 0.04); x.fill();
    const rg = x.createLinearGradient(x0, y0 - h * 0.7, x0 + w, y0); rg.addColorStop(0, '#ff9a72'); rg.addColorStop(1, '#cf3a4e');
    x.fillStyle = rg; x.strokeStyle = rg; x.lineJoin = 'round'; x.lineWidth = w * 0.07;
    x.beginPath(); x.moveTo(x0 - w * 0.08, y0 + w * 0.02); x.lineTo(bx, y0 - h * 0.72); x.lineTo(x0 + w * 1.08, y0 + w * 0.02); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(255,220,200,0.6)'; x.lineWidth = w * 0.025; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0 + w * 0.02, y0 - h * 0.02); x.lineTo(bx - w * 0.05, y0 - h * 0.6); x.stroke();
    x.fillStyle = '#2f5fc0'; rr(x, bx - w * 0.09, by - h * 0.56, w * 0.18, h * 0.56, w * 0.06); x.fill();
    x.fillStyle = C.yellow; x.beginPath(); x.arc(bx + w * 0.05, by - h * 0.26, w * 0.02, 0, TAU); x.fill();
    for (const sd of [-1, 1]) {
      const ws = w * 0.2, wx = bx + sd * w * 0.3 - ws / 2, wy = y0 + h * 0.2;
      glow(x, wx + ws / 2, wy + ws / 2, ws * 1.4, '#ffd86a', 0.45);
      x.fillStyle = '#ffe680'; rr(x, wx, wy, ws, ws, ws * 0.18); x.fill();
      x.strokeStyle = 'rgba(190,120,40,0.7)'; x.lineWidth = w * 0.022; x.beginPath(); x.moveTo(wx + ws / 2, wy); x.lineTo(wx + ws / 2, wy + ws); x.moveTo(wx, wy + ws / 2); x.lineTo(wx + ws, wy + ws / 2); x.stroke();
    }
  }
  function shop(x, bx, by, w) {
    const h = w * 0.62, x0 = bx - w / 2, y0 = by - h;
    const g = x.createLinearGradient(x0, y0, x0 + w, by); g.addColorStop(0, '#f2f6ff'); g.addColorStop(1, '#b7c3f2');
    x.fillStyle = g; rr(x, x0, y0, w, h, w * 0.04); x.fill();
    x.fillStyle = '#5a63e6'; rr(x, x0 - w * 0.04, y0 - h * 0.3, w * 1.08, h * 0.32, w * 0.05); x.fill();
    ball(x, bx, y0 - h * 0.14, h * 0.11, GOLD, { sha: 0.4 });
    const n = 6, aw = (w * 1.08) / n, ay = y0 + h * 0.02, ah = h * 0.16;
    for (let i = 0; i < n; i++) {
      x.fillStyle = i % 2 ? '#ffffff' : C.pink; const ax = x0 - w * 0.04 + i * aw;
      x.fillRect(ax, ay, aw + 0.5, ah); x.beginPath(); x.arc(ax + aw / 2, ay + ah, aw / 2, 0, Math.PI); x.fill();
    }
    x.fillStyle = '#2a3a9c'; rr(x, x0 + w * 0.1, y0 + h * 0.44, w * 0.44, h * 0.4, w * 0.04); x.fill();
    glow(x, x0 + w * 0.32, y0 + h * 0.64, w * 0.3, '#ffd86a', 0.4);
    x.strokeStyle = 'rgba(255,255,255,0.45)'; x.lineWidth = w * 0.03; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0 + w * 0.16, y0 + h * 0.74); x.lineTo(x0 + w * 0.3, y0 + h * 0.52); x.stroke();
    x.fillStyle = '#ff8d3f'; rr(x, bx + w * 0.14, y0 + h * 0.4, w * 0.24, h * 0.6, w * 0.05); x.fill();
  }
  function bars(x, bx, by, w) {
    const bw = w * 0.22, gap = w * 0.08, hs = [0.35, 0.62, 0.95], x0 = bx - (3 * bw + 2 * gap) / 2;
    hs.forEach((hh, i) => {
      const h = w * hh, X = x0 + i * (bw + gap);
      const g = x.createLinearGradient(0, by - h, 0, by); g.addColorStop(0, '#b6ffd6'); g.addColorStop(0.5, C.green); g.addColorStop(1, '#178a5a');
      x.fillStyle = 'rgba(10,8,46,0.35)'; rr(x, X + w * 0.025, by - h + w * 0.03, bw, h, bw * 0.3); x.fill();
      x.fillStyle = g; rr(x, X, by - h, bw, h, bw * 0.3); x.fill();
    });
    const P = [[x0 - w * 0.06, by - w * 0.42], [x0 + bw * 1.2, by - w * 0.72], [x0 + bw * 2 + gap, by - w * 0.6], [x0 + 3 * bw + 2 * gap + w * 0.06, by - w * 1.08]];
    x.save(); x.strokeStyle = '#ffffff'; x.fillStyle = '#ffffff'; x.lineWidth = w * 0.07; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); P.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.stroke();
    const [ex, ey] = P[3], ang = Math.atan2(ey - P[2][1], ex - P[2][0]), hs2 = w * 0.13;
    x.translate(ex, ey); x.rotate(ang); x.beginPath(); x.moveTo(hs2 * 1.1, 0); x.lineTo(-hs2 * 0.7, hs2); x.lineTo(-hs2 * 0.7, -hs2); x.closePath(); x.fill();
    x.restore();
  }
  const ASSET = { estate: { pal: PL.coral, prop: house, w: 1.0 }, stocks: { pal: PL.teal, prop: bars, w: 0.95 }, business: { pal: PL.magenta, prop: shop, w: 1.0 } };
  function assetPlanet(x, cx, cy, r, kind, o = {}) {
    if (r < 1) return;
    const A = ASSET[kind];
    x.save(); x.globalAlpha *= o.a == null ? 1 : o.a;
    planet(x, cx, cy, r, A.pal, { glowA: o.glowA == null ? 0.3 : o.glowA });
    A.prop(x, cx, cy - r * 0.84, r * A.w);
    x.restore();
  }
  function piggy(x, cx, cy, r, o = {}) {
    if (r < 1) return;
    const sq = o.gulp || 0;
    x.save(); x.translate(cx, cy); x.scale(1 + sq * 0.1, 1 - sq * 0.1);
    glow(x, 0, 0, r * 2, '#ff86b0', 0.25);
    x.fillStyle = '#c9447e'; for (const lx of [-0.55, -0.2, 0.25, 0.6]) { rr(x, lx * r - r * 0.12, r * 0.6, r * 0.24, r * 0.42, r * 0.1); x.fill(); }
    x.strokeStyle = '#e0558f'; x.lineWidth = r * 0.08; x.lineCap = 'round'; x.beginPath(); x.moveTo(-r * 1.1, -r * 0.05);
    x.bezierCurveTo(-r * 1.4, -r * 0.3, -r * 1.45, r * 0.1, -r * 1.25, -r * 0.05); x.stroke();
    x.save(); x.scale(1.18, 1); ball(x, 0, 0, r, PINK, { sha: 0.42 }); x.restore();
    x.fillStyle = '#ff6fa0'; x.beginPath(); x.moveTo(r * 0.2, -r * 0.78); x.lineTo(r * 0.45, -r * 1.15); x.lineTo(r * 0.62, -r * 0.66); x.closePath(); x.fill();
    x.fillStyle = '#7a1f4f'; rr(x, -r * 0.35, -r * 0.93, r * 0.5, r * 0.13, r * 0.065); x.fill();
    x.fillStyle = '#ffa6c6'; x.beginPath(); x.ellipse(r * 1.14, r * 0.06, r * 0.2, r * 0.26, 0, 0, TAU); x.fill();
    x.fillStyle = '#b23a6e'; for (const dy of [-0.08, 0.18]) { x.beginPath(); x.ellipse(r * 1.17, r * dy, r * 0.05, r * 0.06, 0, 0, TAU); x.fill(); }
    eye(x, r * 0.62, -r * 0.24, r * 0.16, { blink: o.blink, look: [0.4, 0], happy: o.happy, happyCol: '#7a1f4f' });
    x.fillStyle = 'rgba(255,90,140,0.5)'; x.beginPath(); x.arc(r * 0.72, r * 0.18, r * 0.1, 0, TAU); x.fill();
    x.restore();
  }
  function calendar(x, cx, cy, s, label, flip, a, fs = 0.36) {
    if (s < 1 || a <= 0.01) return;
    const w = s, h = s * 1.05;
    x.save(); x.translate(cx, cy); x.globalAlpha *= a;
    x.fillStyle = 'rgba(10,8,46,0.4)'; rr(x, -w / 2 + 4, -h / 2 + 8, w, h, w * 0.14); x.fill();
    x.save(); rr(x, -w / 2, -h / 2, w, h, w * 0.14); x.clip();
    x.fillStyle = '#ffffff'; x.fillRect(-w / 2, -h / 2, w, h);
    x.fillStyle = C.red; x.fillRect(-w / 2, -h / 2, w, h * 0.3);
    x.fillStyle = 'rgba(255,255,255,0.3)'; x.fillRect(-w / 2, -h / 2 + h * 0.05, w, h * 0.05);
    x.restore();
    x.fillStyle = '#5a1f3f'; for (const sd of [-1, 1]) { rr(x, sd * w * 0.24 - w * 0.05, -h / 2 - h * 0.08, w * 0.1, h * 0.2, w * 0.05); x.fill(); }
    x.save(); x.translate(0, h * 0.15); x.scale(1, Math.max(0.05, flip)); text(x, label, 0, 0, s * fs, C.ink, { shadow: 'rgba(0,0,0,0)' }); x.restore();
    x.restore();
  }
  function asteroid(x, cx, cy, r, dx, dy) {
    for (let i = 6; i >= 1; i--) glow(x, cx - dx * i * r * 0.8, cy - dy * i * r * 0.8, r * (1.9 - i * 0.18), i < 3 ? '#ffb04a' : '#ff3b5c', 0.4);
    glow(x, cx, cy, r * 2.4, '#ff6a3d', 0.5);
    ball(x, cx, cy, r, ['#ead2c2', '#a07c74', '#46283c'], { sha: 0.5, inner: () => {
      const q = H.rng(21); for (let i = 0; i < 4; i++) { const a = q.range(0, TAU), d = q.range(0.1, 0.6) * r, cr = q.range(0.14, 0.24) * r; x.fillStyle = 'rgba(70,40,60,0.4)'; x.beginPath(); x.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, cr, 0, TAU); x.fill(); }
    } });
  }
  // dotted circular "reinvest" loop with an arrowhead
  function loopArrow(x, cx, cy, R, a0, a1, col, lw, alpha) {
    if (alpha <= 0.01) return;
    x.save(); x.globalAlpha *= alpha; x.strokeStyle = col; x.fillStyle = col; x.lineWidth = lw; x.lineCap = 'round';
    x.setLineDash([0.01, lw * 1.9]); x.beginPath(); x.arc(cx, cy, R, a0, a1); x.stroke(); x.setLineDash([]);
    const hx = cx + Math.cos(a1) * R, hy = cy + Math.sin(a1) * R;
    x.translate(hx, hy); x.rotate(a1 + Math.PI / 2); const hs = lw * 1.5; x.beginPath(); x.moveTo(hs * 1.1, 0); x.lineTo(-hs * 0.8, hs); x.lineTo(-hs * 0.8, -hs); x.closePath(); x.fill();
    x.restore();
  }

  function header(x, a) { pill(x, 206, 44, 'Money while you sleep', 28, { a, bg: 'rgba(255,255,255,0.95)' }); }

