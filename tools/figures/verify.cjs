const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/asus/Desktop/教材仓库和截图/02-认知卷';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'figures') walk(p); continue; }
    if (e.name.endsWith('.md')) files.push(p);
  }
})(ROOT);

let ok = 0, bad = 0, mermaid = 0;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  mermaid += (t.match(/^```mermaid/gm) || []).length;
  for (const m of t.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const p = path.resolve(path.dirname(f), m[1]);
    if (fs.existsSync(p)) ok++; else { bad++; console.log('MISSING', path.basename(f), m[1]); }
  }
}
console.log({ files: files.length, imagesOk: ok, missing: bad, mermaidLeft: mermaid });
