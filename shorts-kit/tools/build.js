// Builds a short's two self-contained pages from the kit + the project folder.
// usage: node shorts-kit/tools/build.js shorts/<slug>
//   -> shorts/<slug>/storyboard.html  (still key frames + notes, from beats.js)
//   -> shorts/<slug>/short.html       (the player: animation + voice + effects)
const fs = require('fs'), path = require('path');
const KIT = path.join(__dirname, '..'), P = path.resolve(process.argv[2] || '.');
const rd = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const cfg = JSON.parse(rd(P, 'project.json'));
const voice = path.join(P, 'voice.mp3');
const fill = (tpl) => rd(KIT, 'templates', tpl)
  .replace(/\/\*TITLE\*\//g, () => cfg.title)
  .replace('/*HARNESS*/', () => rd(KIT, 'lib', 'harness.js')).replace('/*SOUND*/', () => rd(KIT, 'lib', 'sound.js'))
  .replace('/*BASE*/', () => rd(KIT, 'lib', 'base.js')).replace('/*VERTICAL*/', () => rd(KIT, 'lib', 'vertical.js'))
  .replace('/*SCENES*/', () => rd(P, 'scenes.js'))
  .replace('/*BEATS*/', () => (fs.existsSync(path.join(P, 'beats.js')) ? rd(P, 'beats.js') : 'window.BEATS = []; window.SB = { headline: "", notes: [] };'))
  .replace('/*VOICE*/', () => (fs.existsSync(voice) ? 'data:audio/mpeg;base64,' + fs.readFileSync(voice).toString('base64') : ''));
for (const [tpl, out] of [['storyboard.template.html', 'storyboard.html'], ['short.template.html', 'short.html']]) {
  fs.writeFileSync(path.join(P, out), fill(tpl)); console.log('wrote', path.join(P, out));
}
