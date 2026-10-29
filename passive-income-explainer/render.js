// Renders explainer.html to MP4: window.seek(i/30) per frame -> ffmpeg, plus the offline-rendered sound mix.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2] || path.join(__dirname, 'money-while-you-sleep.mp4'), tmp = out + '.wav', FPS = 30;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'explainer.html')); await p.evaluate(() => window.ready);
  await p.evaluate(() => { window.removeEventListener('resize', fit); const c = document.getElementById('cv'); c.width = 1280; c.height = 720; });
  const D = await p.evaluate(() => window.DURATION);
  // audio
  const a = await p.evaluate(async (D) => {
    const r = await SOUND.renderOffline(window.scoreSound, D, 48000, { voiceover: false });
    const u8 = new Uint8Array(r.inter.buffer); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(s), peak: r.peak, frames: r.frames };
  }, D);
  const pcm = Buffer.from(a.b64, 'base64'), hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(3, 20); hdr.writeUInt16LE(2, 22);
  hdr.writeUInt32LE(48000, 24); hdr.writeUInt32LE(48000 * 8, 28); hdr.writeUInt16LE(8, 32); hdr.writeUInt16LE(32, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(tmp, Buffer.concat([hdr, pcm])); console.log('audio peak', a.peak.toFixed(3));
  // video
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-i', tmp,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(D * FPS); let worst = 0;
  for (let i = 0; i < N; i++) {
    const r = await p.evaluate((t) => { const t0 = performance.now(); seek(t); const ms = performance.now() - t0; return [document.getElementById('cv').toDataURL('image/png').split(',')[1], ms]; }, i / FPS);
    worst = Math.max(worst, i ? r[1] : 0);
    if (!ff.stdin.write(Buffer.from(r[0], 'base64'))) await new Promise((res) => ff.stdin.once('drain', res));
    if (i % 150 === 0) console.log('frame', i, '/', N);
  }
  ff.stdin.end(); await new Promise((res) => ff.on('close', res)); fs.unlinkSync(tmp);
  console.log('worst frame ms', worst.toFixed(1), '->', out); await b.close();
})();
