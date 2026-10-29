// Renders a short to MP4: 1080x1920, 30 fps, voice on top, effects ducked under it, -14 LUFS.
// usage: node shorts-kit/tools/render.js shorts/<slug>            (video + soundtrack)
//        node shorts-kit/tools/render.js shorts/<slug> --audio    (re-mix the soundtrack only, video stream copied)
// Run build.js first. Output: shorts/<slug>/<slug>.mp4
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const P = path.resolve(process.argv[2] || '.'), AUDIO_ONLY = process.argv.includes('--audio');
const cfg = JSON.parse(fs.readFileSync(path.join(P, 'project.json'), 'utf8'));
const out = path.join(P, cfg.slug + '.mp4'), FPS = 30;
const FX_VOL = process.env.FX_VOL || '3.0'; // effects stem gain before ducking; 3.0 puts them ~16 dB under the voice
const wav = (file, b64) => {
  const pcm = Buffer.from(b64, 'base64'), h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(48000, 24); h.writeUInt32LE(48000 * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, pcm]));
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.join(P, 'short.html')); await p.evaluate(() => window.ready);
  await p.evaluate(() => { window.removeEventListener('resize', fit); const c = document.getElementById('cv'); c.width = 1080; c.height = 1920; });
  const D = await p.evaluate(() => window.DURATION);
  // effects stem (voiceover mode)
  const fxb64 = await p.evaluate(async (D) => {
    const r = await SOUND.renderOffline(window.scoreSound, D, 48000, { voiceover: true, master: 0.55 });
    const u8 = new Uint8Array(r.inter.buffer); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s);
  }, D);
  const fx = out + '.fx.wav'; wav(fx, fxb64);
  const silent = out + '.video.mp4';
  if (AUDIO_ONLY) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-map', '0:v', '-c', 'copy', silent]);
  else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-preset', 'slow', '-r', String(FPS), '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(D * FPS); let worst = 0;
    for (let i = 0; i < N; i++) {
      const r = await p.evaluate((t) => { const t0 = performance.now(); seek(t); const ms = performance.now() - t0; return [document.getElementById('cv').toDataURL('image/jpeg', 0.95).split(',')[1], ms]; }, i / FPS);
      if (i) worst = Math.max(worst, r[1]);
      if (!ff.stdin.write(Buffer.from(r[0], 'base64'))) await new Promise((res) => ff.stdin.once('drain', res));
      if (i % 300 === 0) console.log('frame', i, '/', N);
    }
    ff.stdin.end(); await new Promise((res) => ff.on('close', res));
    console.log('worst frame ms', worst.toFixed(1));
  }
  await b.close();
  // mix: voice on top; effects through a sidechain compressor keyed by the voice; loudness-normalised for TikTok
  const fc = '[1:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[v][k];' +
    `[2:a]volume=${FX_VOL}[fx];[fx][k]sidechaincompress=threshold=0.02:ratio=8:attack=8:release=300:makeup=1[dfx];` +
    `[v][dfx]amix=inputs=2:duration=longest:normalize=0,apad=whole_dur=${D},loudnorm=I=-14:TP=-1.0:LRA=9,aresample=48000[a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', silent, '-i', path.join(P, 'voice.mp3'), '-i', fx, '-filter_complex', fc,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(D), '-movflags', '+faststart', out]);
  fs.unlinkSync(fx); fs.unlinkSync(silent);
  console.log('->', out);
})();
