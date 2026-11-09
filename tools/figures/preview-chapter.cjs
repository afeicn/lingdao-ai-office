const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(process.argv[2]);
const outPath = process.argv[3] || 'C:/Users/asus/AppData/Local/Temp/opencode/chapter.html';
const dir = path.dirname(mdPath);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let text = fs.readFileSync(mdPath, 'utf8');
const lines = text.split(/\r?\n/);
const html = [];
let inList = false;
for (const raw of lines) {
  const line = raw.trim();
  if (!line) { if (inList) { html.push('</ul>'); inList = false; } continue; }
  const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (img) {
    const src = path.resolve(dir, img[2]);
    html.push(`<figure><img src="file:///${src.replace(/\\/g, '/')}" alt="${esc(img[1])}"></figure>`);
    continue;
  }
  if (line.startsWith('#')) {
    if (inList) { html.push('</ul>'); inList = false; }
    const level = line.match(/^#+/)[0].length;
    html.push(`<h${level}>${esc(line.replace(/^#+\s*/, ''))}</h${level}>`);
    continue;
  }
  if (line.startsWith('> ')) {
    html.push(`<blockquote>${esc(line.slice(2))}</blockquote>`);
    continue;
  }
  if (/^[-*]\s+/.test(line)) {
    if (!inList) { html.push('<ul>'); inList = true; }
    html.push(`<li>${esc(line.replace(/^[-*]\s+/, ''))}</li>`);
    continue;
  }
  if (inList) { html.push('</ul>'); inList = false; }
  const cap = line.match(/^\*([^*].*)\*$/);
  if (cap) { html.push(`<p class="cap">${esc(cap[1])}</p>`); continue; }
  let safe = esc(line)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html.push(`<p>${safe}</p>`);
}
if (inList) html.push('</ul>');

fs.writeFileSync(outPath, `<!doctype html><html lang="zh"><head><meta charset="utf-8"><style>
body{margin:0;padding:40px 0;background:#efece7;font-family:"Microsoft YaHei","PingFang SC",serif;color:#1b1b1b}
.paper{max-width:720px;margin:0 auto;background:#fff;padding:52px 60px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
h1{font-size:26px;line-height:1.4;margin:0 0 18px}
h2{font-size:19px;margin:34px 0 12px;padding-top:8px}
p{font-size:15px;line-height:1.95;text-indent:2em;margin:0 0 14px;color:#222}
p.cap{text-indent:0;text-align:center;font-size:12.5px;color:#555;margin:-6px 0 22px}
figure{margin:26px 0 8px;text-align:center}
figure img{width:100%;max-width:600px;height:auto}
blockquote{margin:16px 0;padding:8px 16px;border-left:3px solid #cfd6e4;color:#444;font-size:14.5px;background:#fafbfd}
ul{margin:0 0 14px 0;padding-left:26px}li{font-size:15px;line-height:1.9;margin:4px 0}
a{color:#2f5d8a}
</style></head><body><div class="paper">
${html.join('\n')}
</div></body></html>`, 'utf8');
console.log(outPath);
