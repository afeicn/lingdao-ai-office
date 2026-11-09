// 思维导图式插图（药丸节点 + 曲线分支 + 小插画）
import fs from 'node:fs';

const CJK = /[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]/;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (label, size, maxW) => {
  const out = []; let line = '', w = 0;
  for (const ch of String(label)) {
    const cw = CJK.test(ch) ? size : size * 0.56;
    if (w + cw > maxW && line) { out.push(line); line = ch; w = cw; } else { line += ch; w += cw; }
  }
  if (line) out.push(line);
  return out;
};

export function renderMap(spec) {
  const parts = [];
  const imgs = spec.images || {};
  const defs = `<defs><marker id="ma" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#3E63DD"/></marker>${Object.entries(imgs).map(([k, f]) => {
    const b64 = fs.readFileSync(f).toString('base64');
    return `<symbol id="im-${k}" viewBox="0 0 240 240"><image width="240" height="240" href="data:image/png;base64,${b64}"/></symbol>`;
  }).join('')}</defs>`;

  const byId = new Map(spec.nodes.map((n) => [n.id, n]));

  // 分支曲线
  for (const b of spec.branches || []) {
    const a = byId.get(b.from), t = byId.get(b.to);
    if (!a || !t) continue;
    const x0 = a.x + a.w, y0 = a.y + a.h / 2;
    const x1 = t.x, y1 = t.y + t.h / 2;
    const c1 = x0 + (x1 - x0) * 0.45, c2 = x0 + (x1 - x0) * 0.55;
    parts.push(`<path d="M${x0},${y0} C${c1},${y0} ${c2},${y1} ${x1},${y1}" fill="none" stroke="${b.color}" stroke-width="2" stroke-linecap="round"/>`);
  }

  // 任意两点连线（右侧到左侧的曲线）
  for (const b of spec.links || []) {
    const a2 = byId.get(b.from), t2 = byId.get(b.to);
    if (!a2 || !t2) continue;
    const x0 = a2.x + a2.w, y0 = a2.y + a2.h / 2;
    const x1 = t2.x, y1 = t2.y + t2.h / 2;
    const c1 = x0 + (x1 - x0) * 0.45, c2 = x0 + (x1 - x0) * 0.55;
    parts.push(`<path d="M${x0},${y0} C${c1},${y0} ${c2},${y1} ${x1},${y1}" fill="none" stroke="${b.color || '#3E63DD'}" stroke-width="${b.width || 1.8}" marker-end="url(#ma)"/>`);
  }

  // 折线箭头
  for (const arow of spec.arrows || []) {
    const pts = arow.points;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
    parts.push(`<path d="${d}" fill="none" stroke="${arow.color || '#3E63DD'}" stroke-width="${arow.width || 1.8}" marker-end="url(#ma)"/>`);
  }

  // 细支线（文字在末端）
  for (const s of spec.stems || []) {
    const a = byId.get(s.from);
    if (!a) continue;
    const sx = a.x + a.w, sy = a.y + a.h / 2;
    parts.push(`<path d="M${sx},${sy} C${sx + 30},${sy} ${s.x - 26},${s.y} ${s.x - 8},${s.y}" fill="none" stroke="${s.color || '#B9BFCB'}" stroke-width="1.1"/>`);
    parts.push(`<text x="${s.x}" y="${s.y}" dominant-baseline="middle" font-size="${s.size || 12}" fill="${s.textColor || '#3F4756'}">${esc(s.text)}</text>`);
  }

  // 插画
  for (const il of spec.illustrations || []) {
    parts.push(`<use href="#im-${il.img}" x="${il.x}" y="${il.y}" width="${il.w}" height="${il.w}"/>`);
  }

  // 节点（药丸）
  for (const n of spec.nodes) {
    const look = n.look || {};
    const fill = look.fill || '#FFFFFF';
    const stroke = look.stroke || '#8C93A3';
    const textColor = look.text || '#1F2937';
    const fs_ = n.fontSize || 15;
    const bold = n.bold === false ? '' : ' font-weight="600"';
    parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${n.strokeWidth || 1.6}"/>`);
    const lines = wrap(n.label, fs_, n.w - 28);
    const cy = n.y + n.h / 2 - (lines.length - 1) * 9;
    lines.forEach((ln, i) => {
      parts.push(`<text x="${n.x + n.w / 2}" y="${cy + i * 18}" text-anchor="middle" dominant-baseline="middle" font-size="${fs_}" fill="${textColor}"${bold}>${esc(ln)}</text>`);
    });
    if (n.sub) {
      parts.push(`<text x="${n.x + n.w / 2}" y="${n.y + n.h + 30}" text-anchor="middle" font-size="20" fill="#3F4756">${esc(n.sub)}</text>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.W} ${spec.H}" width="${spec.W}" height="${spec.H}" font-family="Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif">
${defs}
${parts.join('\n')}
</svg>`;
}
