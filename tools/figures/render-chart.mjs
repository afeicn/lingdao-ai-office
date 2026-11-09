// 数据图（柱状图 / 时间轴）
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const CJK = /[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]/;
const wrap = (label, size, maxW) => {
  const out = []; let line = '', w = 0;
  for (const ch of String(label)) {
    const cw = CJK.test(ch) ? size : size * 0.56;
    if (w + cw > maxW && line) { out.push(line); line = ch; w = cw; } else { line += ch; w += cw; }
  }
  if (line) out.push(line);
  return out;
};

export function renderBar(spec) {
  const W = spec.W || 820, H = spec.H || 470;
  const M = { l: 84, r: 44, t: 96, b: 96 };
  const plotW = W - M.l - M.r, plotH = H - M.t - M.b;
  const maxV = spec.max;
  const n = spec.data.length;
  const step = plotW / n;
  const barW = Math.min(120, step * 0.44);
  const parts = [];

  parts.push(`<text x="${M.l}" y="42" font-size="22" font-weight="600" fill="#1F2937">${esc(spec.title)}</text>`);
  if (spec.unit) parts.push(`<text x="${M.l}" y="70" font-size="15" fill="#5B6472">单位：${esc(spec.unit)}</text>`);

  const ticks = spec.ticks || 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (maxV / ticks) * i;
    const y = M.t + plotH - (plotH * i) / ticks;
    parts.push(`<line x1="${M.l}" y1="${y}" x2="${W - M.r}" y2="${y}" stroke="#E6EAF2" stroke-width="1"${i ? ' stroke-dasharray="4 4"' : ''}/>`);
    parts.push(`<text x="${M.l - 12}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="15" fill="#78808E">${Math.round(v)}</text>`);
  }

  spec.data.forEach((d, i) => {
    const cx = M.l + step * i + step / 2;
    const h = (d.value / maxV) * plotH;
    const y = M.t + plotH - h;
    parts.push(`<rect x="${cx - barW / 2}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${d.color || '#CFE0F6'}" stroke="${d.stroke || '#8FB3D1'}" stroke-width="1.2"/>`);
    parts.push(`<text x="${cx}" y="${y - 14}" text-anchor="middle" font-size="20" font-weight="600" fill="#1F2937">${esc(d.label || d.value)}</text>`);
    const lines = wrap(d.name, 17, step - 16);
    lines.forEach((ln, k) => {
      parts.push(`<text x="${cx}" y="${M.t + plotH + 30 + k * 24}" text-anchor="middle" font-size="17" fill="#3F4756">${esc(ln)}</text>`);
    });
  });

  parts.push(`<line x1="${M.l}" y1="${M.t + plotH}" x2="${W - M.r}" y2="${M.t + plotH}" stroke="#9AA3B2" stroke-width="1.4"/>`);
  parts.push(`<line x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${M.t + plotH}" stroke="#9AA3B2" stroke-width="1.4"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif">
${parts.join('\n')}
</svg>`;
}

export function renderTimeline(spec) {
  const W = spec.W || 820;
  const rowH = 66;
  const H = 70 + spec.items.length * rowH;
  const lineX = 168, textX = 196;
  const parts = [];

  parts.push(`<text x="56" y="40" font-size="22" font-weight="600" fill="#1F2937">${esc(spec.title)}</text>`);
  const top = 70, bottom = 70 + (spec.items.length - 1) * rowH;
  parts.push(`<line x1="${lineX}" y1="${top}" x2="${lineX}" y2="${bottom}" stroke="#B9CFE8" stroke-width="2"/>`);

  spec.items.forEach((it, i) => {
    const y = top + i * rowH;
    parts.push(`<circle cx="${lineX}" cy="${y}" r="6" fill="#fff" stroke="#4A6BF5" stroke-width="2.4"/>`);
    parts.push(`<text x="${lineX - 22}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="18" font-weight="600" fill="#2F4C7A">${esc(it.year)}</text>`);
    const lines = wrap(it.text, 18, W - textX - 40);
    const startY = y - (lines.length - 1) * 12;
    lines.forEach((ln, k) => {
      parts.push(`<text x="${textX}" y="${startY + k * 24}" dominant-baseline="middle" font-size="18" fill="#1F2937">${esc(ln)}</text>`);
    });
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif">
${parts.join('\n')}
</svg>`;
}
