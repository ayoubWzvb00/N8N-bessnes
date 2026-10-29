// Inlines the shared source files into the self-contained HTML pages.
const fs = require('fs'), path = require('path');
const src = (f) => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const fill = (tpl) => src(tpl).replace('/*HARNESS*/', () => src('harness.js')).replace('/*SOUND*/', () => src('sound.js')).replace('/*STYLE*/', () => src('style.js'));
for (const [tpl, out] of [['storyboard.template.html', 'storyboard.html'], ['explainer.template.html', 'explainer.html']]) {
  if (fs.existsSync(path.join(__dirname, 'src', tpl))) { fs.writeFileSync(path.join(__dirname, out), fill(tpl)); console.log('wrote', out); }
}
