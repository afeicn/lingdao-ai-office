const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = 'C:/Users/asus/Desktop/教材仓库和截图/02-认知卷';
const OUT_HTML = 'C:/Users/asus/AppData/Local/Temp/opencode/print/cog.html';
const OUT_PDF = 'C:/Users/asus/AppData/Local/Temp/opencode/print/认知卷_A4_黑白.pdf';
const EDGE = fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
  ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  : 'C:/Program Files/Microsoft/Edge/Application/msedge.exe';

fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });

const NUM = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
const partIndex = (name) => { const m = name.match(/^第(.)部/); return m ? (NUM[m[1]] || 99) : 99; };
const parts = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^第.部/.test(d.name))
  .map((d) => d.name)
  .sort((a, b) => partIndex(a) - partIndex(b));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s)
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

function mdToHtml(md, baseDir) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  let listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) { closeList(); i++; continue; }

    // 表格
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      closeList();
      const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) { rows.push(cells(lines[i])); i++; }
      out.push(`<table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }

    // 图片
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      closeList();
      const src = path.resolve(baseDir, img[2]);
      out.push(`<figure><img src="file:///${src.replace(/\\/g, '/')}" alt="${esc(img[1])}"></figure>`);
      i++; continue;
    }

    // 标题
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      i++; continue;
    }

    // 图注
    const cap = line.match(/^\*([^*].*)\*$/);
    if (cap) { closeList(); out.push(`<p class="cap">${inline(cap[1])}</p>`); i++; continue; }

    // 引用
    if (line.startsWith('>')) { closeList(); out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); i++; continue; }

    // 列表
    const li = line.match(/^([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      const type = /\d/.test(li[1]) ? 'ol' : 'ul';
      if (listType !== type) { closeList(); out.push(`<${type}>`); listType = type; }
      out.push(`<li>${inline(li[2])}</li>`);
      i++; continue;
    }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  closeList();
  return out.join('\n');
}

const sections = [];

let chapterCount = 0;

for (const part of parts) {
  const dir = path.join(ROOT, part);
  const chapters = fs.readdirSync(dir)
    .filter((f) => /^\d{2}-.*\.md$/.test(f))
    .sort();
  const partTitle = part.replace(/^第(.+)部-/, '第$1部　');

  for (const ch of chapters) {
    const md = fs.readFileSync(path.join(dir, ch), 'utf8');
    const html = mdToHtml(md, dir);
    const titleLine = md.split(/\r?\n/).find((l) => l.startsWith('# ')) || ch;
    const title = titleLine.replace(/^#\s*/, '');
    chapterCount++;
    sections.push(`<section class="chapter">${html}</section>`);
  }
}

const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8"><title>认知卷 A4</title>
<style>
@page { size: A4; margin: 20mm 18mm 18mm 18mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; }
body { margin: 0; font-family: "SimSun","宋体",serif; font-size: 10.5pt; line-height: 1.75; color: #000; }
.cover { height: 240mm; display: flex; flex-direction: column; justify-content: center; align-items: center; page-break-after: always; }
.cover-kicker { font-family: "SimHei","黑体",sans-serif; font-size: 12pt; letter-spacing: 3pt; color: #333; margin-bottom: 18mm; }
.cover-title { font-family: "SimHei","黑体",sans-serif; font-size: 40pt; letter-spacing: 8pt; margin: 0 0 10mm; }
.cover-sub { font-size: 11pt; color: #444; margin-bottom: 6mm; }
.cover-meta { font-size: 10pt; color: #666; }
.toc { page-break-after: always; }
.toc h1 { font-family: "SimHei","黑体",sans-serif; font-size: 18pt; margin: 0 0 8mm; }
.toc ul { list-style: none; padding-left: 0; margin: 0 0 4mm; }
.toc li { font-size: 10.5pt; margin: 1.2mm 0; }
.toc .toc-part { font-family: "SimHei","黑体",sans-serif; font-size: 12pt; margin: 5mm 0 2mm; }
.toc .toc-part ul { padding-left: 6mm; }
.part { page-break-before: always; height: 240mm; display: flex; align-items: center; justify-content: center; }
.part h1 { font-family: "SimHei","黑体",sans-serif; font-size: 26pt; letter-spacing: 4pt; text-align: center; }
.chapter { page-break-before: always; }
h1 { font-family: "SimHei","黑体",sans-serif; font-size: 17pt; line-height: 1.45; margin: 0 0 6mm; }
h2 { font-family: "SimHei","黑体",sans-serif; font-size: 12.5pt; margin: 7mm 0 2.5mm; }
h3 { font-family: "SimHei","黑体",sans-serif; font-size: 11pt; margin: 5mm 0 2mm; }
p { margin: 0 0 2.6mm; text-indent: 2em; text-align: justify; }
p.cap { text-indent: 0; text-align: center; font-size: 9pt; color: #222; margin: -1mm 0 5mm; }
figure { margin: 5mm 0 2mm; text-align: center; page-break-inside: avoid; }
figure img { width: 100%; max-height: 118mm; object-fit: contain; filter: grayscale(100%); }
blockquote { margin: 3mm 0; padding: 2mm 4mm; border-left: 1.2pt solid #999; color: #222; page-break-inside: avoid; }
blockquote p { text-indent: 0; margin: 0; }
ul, ol { margin: 0 0 2.6mm 0; padding-left: 7mm; }
li { margin: 0.8mm 0; }
table { width: 100%; border-collapse: collapse; margin: 3mm 0 4mm; font-size: 9.5pt; page-break-inside: avoid; }
th, td { border: 0.6pt solid #666; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
th { background: #f0f0f0; font-family: "SimHei","黑体",sans-serif; }
a { color: #000; text-decoration: none; }
code { font-family: Consolas, monospace; font-size: 9pt; }
strong { font-weight: 700; }
</style></head><body>
${sections.join('\n')}
</body></html>`;

fs.writeFileSync(OUT_HTML, html, 'utf8');
console.log('chapters', chapterCount, 'parts', parts.length);

execFileSync(EDGE, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
  '--print-to-pdf-no-header',
  `--print-to-pdf=${OUT_PDF}`,
  `file:///${OUT_HTML.replace(/\\/g, '/')}`,
], { stdio: 'ignore' });

const size = fs.statSync(OUT_PDF).size;
console.log('pdf', OUT_PDF, (size / 1024 / 1024).toFixed(1) + 'MB');
