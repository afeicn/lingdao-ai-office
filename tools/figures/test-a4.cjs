const fs = require('fs');
const { execFileSync } = require('child_process');
const OUT_HTML = 'C:/Users/asus/AppData/Local/Temp/opencode/print/a4test.html';
const OUT_PDF = 'C:/Users/asus/AppData/Local/Temp/opencode/print/A4_测试页.pdf';
const EDGE = fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
  ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  : 'C:/Program Files/Microsoft/Edge/Application/msedge.exe';

const page = (label, note, extra) => `<div class="page"><div class="frame">
  <div>
    <h1>${label}</h1>
    <div class="big">${note}</div>
  </div>
  <div>
    <div class="row">纸张：A4（210 × 297 mm）</div>
    <div class="row">边框内沿距纸边 10 mm</div>
    <div class="ruler"></div>
    <div class="small">黑条长 100 mm；用尺量，明显短于 100 mm 说明被缩放了。</div>
  </div>
  <div class="row">${extra}</div>
</div></div>`;

const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><style>
@page { size: A4; margin: 0; }
html,body{margin:0;padding:0}
.page{width:210mm;height:297mm;box-sizing:border-box;padding:10mm;font-family:"SimHei","黑体",sans-serif;page-break-after:always}
.page:last-child{page-break-after:auto}
.frame{width:100%;height:100%;border:0.8mm solid #000;box-sizing:border-box;padding:12mm;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:46pt;margin:0;letter-spacing:3mm}
.big{font-size:20pt;margin:6mm 0 0;line-height:1.6}
.row{font-size:13pt;line-height:2}
.ruler{width:100mm;height:8mm;background:#000;margin:4mm 0}
.small{font-size:10pt;color:#333}
</style></head><body>
${page('A4 测试 · 正面', '这是一张双面测试：如果背面印着「反面」，双面就对了', '打印设置：A4 · 黑白 · 双面长边')}
${page('A4 测试 · 反面', '你看到这一页，说明双面打印生效了', '请核对：纸张 A4、内容未缩小、正反面方向一致')}
</body></html>`;

fs.writeFileSync(OUT_HTML, html, 'utf8');
execFileSync(EDGE, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf-no-header',
  `--print-to-pdf=${OUT_PDF}`, `file:///${OUT_HTML.replace(/\\/g, '/')}`,
], { stdio: 'ignore' });

const buf = fs.readFileSync(OUT_PDF).toString('latin1');
const m = buf.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
const w = ((+m[3] - +m[1]) / 72 * 25.4).toFixed(1);
const h = ((+m[4] - +m[2]) / 72 * 25.4).toFixed(1);
const pages = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log('pages', pages, 'size mm', w, 'x', h);
