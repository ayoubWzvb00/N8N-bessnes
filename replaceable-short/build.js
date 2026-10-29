// Inlines the shared source files into the self-contained HTML pages.
const fs = require('fs'), path = require('path');
const rd = (...p) => fs.readFileSync(path.join(__dirname, ...p), 'utf8');
const lib = (f) => rd('..', 'passive-income-explainer', 'src', f);
const fill = (tpl) => rd('src', tpl).replace('/*HARNESS*/', () => lib('harness.js')).replace('/*SOUND*/', () => lib('sound.js'))
  .replace('/*BASE*/', () => rd('src', 'base.js')).replace('/*SCENES*/', () => rd('src', 'scenes.js'))
  .replace('/*VOICE*/', () => (fs.existsSync(path.join(__dirname, 'voice.mp3')) ? 'data:audio/mpeg;base64,' + fs.readFileSync(path.join(__dirname, 'voice.mp3')).toString('base64') : ''));
for (const [tpl, out] of [['storyboard.template.html', 'storyboard.html'], ['short.template.html', 'short.html']]) {
  if (fs.existsSync(path.join(__dirname, 'src', tpl))) { fs.writeFileSync(path.join(__dirname, out), fill(tpl)); console.log('wrote', out); }
}
