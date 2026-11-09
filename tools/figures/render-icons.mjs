// 图标卡片风格渲染器（彩色版）
import fs from 'node:fs';

const CJK = /[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]/;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(label, size, maxW) {
  const parts = String(label).split(/<br\s*\/?>/i);
  const out = [];
  for (const part of parts) {
    let line = '', w = 0;
    for (const ch of part) {
      const cw = CJK.test(ch) ? size : size * 0.56;
      if (w + cw > maxW && line) {
        if (/^[，。、；：）」』】！？]/.test(ch)) { line += ch; out.push(line); line = ''; w = 0; }
        else { out.push(line); line = ch; w = cw; }
      } else { line += ch; w += cw; }
    }
    if (line) out.push(line);
  }
  return out.length ? out : [''];
}

// 线性图标（24x24 viewBox），stroke 风格
export const ICONS = {
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22"/>',
  route: '<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H15a3 3 0 0 1 0 6h-6a3 3 0 0 0 0 6h6.6"/>',
  database: '<ellipse cx="12" cy="6" rx="7.6" ry="2.8"/><path d="M4.4 6v6c0 1.6 3.4 2.8 7.6 2.8s7.6-1.2 7.6-2.8V6"/><path d="M4.4 12v6c0 1.6 3.4 2.8 7.6 2.8s7.6-1.2 7.6-2.8v-6"/>',
  shield: '<path d="M12 3.2 19.2 6v5.4c0 4.6-3 7.6-7.2 9-4.2-1.4-7.2-4.4-7.2-9V6z"/><path d="M9 12.2l2 2 4-4.2"/>',
  users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M16 5.8a2.7 2.7 0 0 1 0 5.4"/><path d="M17.2 14.4c2 .6 3.3 2.3 3.3 4.6"/>',
  cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><rect x="9.8" y="9.8" width="4.4" height="4.4" rx="1"/><path d="M12 2.6v3.9M12 17.5v3.9M2.6 12h3.9M17.5 12h3.9M5.6 4.6l1.6 1.6M18.4 19.4l-1.6-1.6M18.4 4.6l-1.6 1.6M5.6 19.4l1.6-1.6"/>',
  workflow: '<rect x="3.2" y="4" width="6.4" height="5.2" rx="1.4"/><rect x="14.4" y="14.8" width="6.4" height="5.2" rx="1.4"/><path d="M9.6 6.6h4.2a2.4 2.4 0 0 1 2.4 2.4v5.8"/><path d="M6.4 9.2v5.4a2.4 2.4 0 0 0 2.4 2.4h5.6"/>',
  tool: '<path d="M14.2 6.4a3.6 3.6 0 0 0 4.6 4.6l-8.6 8.6a2.3 2.3 0 0 1-3.2-3.2z"/><path d="M17.6 4.4l2 2"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.4V10h-5.4"/>',
  file: '<path d="M14 3.4H7.2a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V8z"/><path d="M14 3.4V8h4.8"/><path d="M8.8 12.6h6.4M8.8 16h4.4"/>',
  lock: '<rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.2"/><path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/><path d="M12 14.4v2"/>',
  check: '<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12.3l2.5 2.5 4.7-5"/>',
  alert: '<path d="M12 4.2 21 19.6H3z"/><path d="M12 9.6v4.4M12 16.8v.6"/>',
  bolt: '<path d="M13 2.8 5.6 13.4h5.2L10.6 21l7.6-10.8h-5.2z"/>',
  coin: '<ellipse cx="12" cy="7" rx="7.4" ry="3"/><path d="M4.6 7v10c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V7"/><path d="M9 14.4h6"/>',
  layers: '<path d="M12 3.6 21 8.2l-9 4.6-9-4.6z"/><path d="M3.6 12.4 12 16.7l8.4-4.3"/><path d="M3.6 16.4 12 20.7l8.4-4.3"/>',
  chat: '<path d="M4.2 5.4h9.6a2.4 2.4 0 0 1 2.4 2.4v3.6a2.4 2.4 0 0 1-2.4 2.4H8.4l-3.6 2.8v-2.8H4.2A2.4 2.4 0 0 1 1.8 11.4V7.8a2.4 2.4 0 0 1 2.4-2.4z"/><path d="M19.2 10.2h.6a2.4 2.4 0 0 1 2.4 2.4v3.6a2.4 2.4 0 0 1-2.4 2.4h-1v2.6l-3.4-2.6h-3.2"/>',
  robot: '<rect x="4.6" y="8.4" width="14.8" height="10.8" rx="3"/><path d="M12 4.6v3.8"/><circle cx="12" cy="3.6" r="1.3"/><circle cx="9.2" cy="13.4" r="1.3"/><circle cx="14.8" cy="13.4" r="1.3"/><path d="M9.6 16.4h4.8"/>',
  tools: '<path d="M14.2 6.4a3.6 3.6 0 0 0 4.6 4.6l-8.6 8.6a2.3 2.3 0 0 1-3.2-3.2z"/><path d="M17.6 4.4l2 2"/>',
  chip: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><rect x="9.8" y="9.8" width="4.4" height="4.4" rx="1"/><path d="M12 2.6v3.9M12 17.5v3.9M2.6 12h3.9M17.5 12h3.9"/>',
};

const T = {
  accent: '#3E63DD',
  accentSoft: '#EEF3FE',
  line: '#4A6BF5',
  ink: '#1F2937',
  sub: '#5B6472',
  cardBg: '#FFFFFF',
  cardBorder: '#E6EAF2',
};

function iconMarkup(name, cx, cy, size, color) {
  const p = ICONS[name] || ICONS.file;
  const s = size / 24;
  return `<g transform="translate(${cx - size / 2},${cy - size / 2}) scale(${s})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">${p}</g>`;
}

function roundPath(pts, r = 10) {
  if (pts.length < 3) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const d1 = Math.hypot(x1 - x0, y1 - y0), d2 = Math.hypot(x2 - x1, y2 - y1);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const ax = x1 - ((x1 - x0) / d1) * rr, ay = y1 - ((y1 - y0) / d1) * rr;
    const bx = x1 + ((x2 - x1) / d2) * rr, by = y1 + ((y2 - y1) / d2) * rr;
    d += ` L${ax},${ay} Q${x1},${y1} ${bx},${by}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return d;
}

function anchor(c, port) {
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  if (port === 'left') return [c.x, cy];
  if (port === 'right') return [c.x + c.w, cy];
  if (port === 'top') return [cx, c.y];
  return [cx, c.y + c.h];
}

export function renderIconFigure(spec) {
  const cards = new Map(spec.cards.map((c) => [c.id, c]));
  const parts = [];
  const defs = `<defs>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="2" stdDeviation="3.2" flood-color="#1B2A5B" flood-opacity="0.08"/>
    </filter>
    <marker id="ia" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${T.line}"/></marker>
  </defs>`;

  // 分区
  for (const z of spec.zones || []) {
    parts.push(`<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="10" fill="${z.tint || '#F6F8FC'}" stroke="${z.border || '#E4E9F2'}" stroke-width="1"/>`);
    if (z.label) {
      parts.push(`<text x="${z.x + 2}" y="${z.y - 9}" font-size="15" fill="${z.labelColor || T.accent}" font-weight="600">${esc(z.label)}</text>`);
    }
  }

  // 蓝色标题条
  for (const b of spec.banners || []) {
    parts.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="26" rx="4" fill="#4A6BF5"/>`);
    parts.push(`<text x="${b.x + b.w / 2}" y="${b.y + 13.5}" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#FFFFFF" font-weight="600">${esc(b.text)}</text>`);
  }

  // 卡片
  for (const c of spec.cards) {
    const fill = c.tint || T.cardBg;
    const stroke = c.border || T.cardBorder;
    if (c.shape === 'diamond') {
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      parts.push(`<polygon points="${cx},${c.y} ${c.x + c.w},${cy} ${cx},${c.y + c.h} ${c.x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" filter="url(#cardShadow)"/>`);
      const size = c.fontSize || 20;
      const lines = wrap(c.label, size, c.w * 0.55);
      const startY = cy - (lines.length - 1) * 12;
      lines.forEach((ln, i) => {
        parts.push(`<text x="${cx}" y="${startY + i * 26}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="${c.textColor || T.ink}">${esc(ln)}</text>`);
      });
      continue;
    }
    parts.push(`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1" filter="url(#cardShadow)"/>`);
    const cy = c.y + c.h / 2;
    const iconSize = c.iconSize || 24;
    const hasIcon = c.icon;
    const textLeft = hasIcon ? c.x + 58 : c.x + 18;
    if (hasIcon) {
      parts.push(`<circle cx="${c.x + 30}" cy="${cy}" r="19" fill="${c.iconBg || T.accentSoft}"/>`);
      parts.push(iconMarkup(c.icon, c.x + 30, cy, iconSize, c.iconColor || T.accent));
    }
    const size = c.fontSize || 20;
    const maxW = c.w - (textLeft - c.x) - 14;
    const lines = wrap(c.label, size, maxW);
    const startY = cy - (lines.length - 1) * 11;
    lines.forEach((ln, i) => {
      parts.push(`<text x="${textLeft}" y="${startY + i * 22}" dominant-baseline="middle" font-size="${size}" fill="${c.textColor || T.ink}">${esc(ln)}</text>`);
    });
  }

  // 连线
  for (const e of spec.edges || []) {
    const a = cards.get(e.from), b = cards.get(e.to);
    if (!a || !b) continue;
    const p0 = anchor(a, e.fromPort || 'right');
    const p1 = anchor(b, e.toPort || 'left');
    const pts = [p0, ...(e.via || []), p1];
    parts.push(`<path d="${roundPath(pts, e.radius ?? 10)}" fill="none" stroke="${e.color || T.line}" stroke-width="1.6"${e.dashed ? ' stroke-dasharray="6 4"' : ''} marker-end="url(#ia)"/>`);
    if (e.label) {
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      parts.push(`<text x="${e.labelX ?? mx}" y="${e.labelY ?? my - 6}" text-anchor="middle" font-size="17" fill="${T.sub}" stroke="#fff" stroke-width="5" paint-order="stroke">${esc(e.label)}</text>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.W} ${spec.H}" width="${spec.W}" height="${spec.H}" font-family="Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif">
${defs}
${parts.join('\n')}
</svg>`;
}
