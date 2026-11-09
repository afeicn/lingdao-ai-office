const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FIG = path.resolve('C:/Users/asus/Desktop/教材仓库和截图/02-认知卷/figures');
const TMP = 'C:/Users/asus/AppData/Local/Temp/opencode/rast';
const EDGE = fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
  ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  : 'C:/Program Files/Microsoft/Edge/Application/msedge.exe';

fs.mkdirSync(TMP, { recursive: true });
const SCALE = 2;

for (const f of fs.readdirSync(FIG).filter((x) => x.endsWith('.svg'))) {
  const id = f.replace('.svg', '');
  const svg = fs.readFileSync(path.join(FIG, f), 'utf8');
  const m = svg.match(/width="(\d+)" height="(\d+)"/);
  if (!m) { console.log('skip', f); continue; }
  const W = +m[1], H = +m[2];
  const w2 = W * SCALE, h2 = H * SCALE;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}img{display:block;width:${w2}px;height:${h2}px}</style></head><body><img src="file:///${path.join(FIG, f).replace(/\\/g, '/')}"></body></html>`;
  const hp = path.join(TMP, `${id}.html`);
  fs.writeFileSync(hp, html, 'utf8');
  const out = path.join(FIG, `${id}.png`);
  execFileSync(EDGE, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${w2},${h2}`, `--screenshot=${out}`, `file:///${hp.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });
  const size = fs.statSync(out).size;
  console.log(id, `${w2}x${h2}`, (size / 1024).toFixed(0) + 'KB');
}
