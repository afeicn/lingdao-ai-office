// 生成 02-认知卷 全部插图（m 系列：药丸分支；i 系列：图标卡片；图表；时间轴）
import fs from 'node:fs';
import path from 'node:path';
import { renderMap } from './render-map.mjs';
import { renderIconFigure } from './render-icons.mjs';
import { renderBar, renderTimeline } from './render-chart.mjs';

const SPOTS = 'C:/Users/asus/AppData/Local/Temp/opencode/spots/small';
const OUT = process.argv[2] || 'C:/Users/asus/Desktop/教材仓库和截图/02-认知卷/figures';
fs.mkdirSync(OUT, { recursive: true });

// ---------- 通用：竖向链 ----------
const col = (items, { x = 270, w = 340, y0 = 56, gap = 26, h = 64 } = {}) =>
  items.map((it, i) => ({ ...it, x, w, h: it.h || h, y: y0 + i * (h + gap) }));

const mapOf = (arr) => new Map(arr.map((c) => [c.id, c]));
const bottom = (c) => c.y + c.h;
const mid = (c) => c.y + c.h / 2;
const right = (c) => c.x + c.w;

// 左侧回环
const loopL = (a, b, x = 226) => ({ from: a.id, to: b.id, fromPort: 'left', toPort: 'left', via: [[x, mid(a)], [x, mid(b)]] });
const loopR = (a, b, x = 654) => ({ from: a.id, to: b.id, fromPort: 'right', toPort: 'right', via: [[x, mid(a)], [x, mid(b)]] });

// ---------- m 系列 ----------
const spots = (name) => `${SPOTS}/${name}.png`;

const mFigures = [];

// 图14-1 GET 模型
mFigures.push({
  kind: 'map', id: 'f14-1', W: 900, H: 690,
  images: { root: spots('root'), growth: spots('growth'), eff: spots('eff'), trans: spots('trans') },
  nodes: [
    { id: 'V', x: 30, y: 326, w: 292, h: 64, label: 'AI项目的业务价值', fontSize: 26, look: { fill: '#F7F4FF', stroke: '#7C5CE0', text: '#3B2B7A' }, strokeWidth: 2 },
    { id: 'G', x: 550, y: 110, w: 300, h: 58, label: 'G · 增长', fontSize: 23, look: { fill: '#F1FAF4', stroke: '#4CAF7D', text: '#1F5B3C' }, sub: '拓展服务、产品或业务机会' },
    { id: 'E', x: 550, y: 330, w: 300, h: 58, label: 'E · 效率', fontSize: 23, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' }, sub: '减少耗时、成本或差错' },
    { id: 'T', x: 550, y: 550, w: 300, h: 58, label: 'T · 转型', fontSize: 23, look: { fill: '#FFF9EF', stroke: '#E0A03E', text: '#8A5A12' }, sub: '重组流程、岗位或资源配置' },
  ],
  branches: [{ from: 'V', to: 'G', color: '#4CAF7D' }, { from: 'V', to: 'E', color: '#3E7BE0' }, { from: 'V', to: 'T', color: '#E0A03E' }],
  illustrations: [{ img: 'root', x: 106, y: 172, w: 140 }, { img: 'growth', x: 652, y: 2, w: 96 }, { img: 'eff', x: 652, y: 212, w: 96 }, { img: 'trans', x: 652, y: 432, w: 96 }],
});

// 图15-1 五项条件 → AI进入日常工作 → 持续运行
mFigures.push({
  kind: 'map', id: 'f15-1', W: 1080, H: 620,
  images: { a: spots('target'), b: spots('route'), c: spots('db'), d: spots('shield'), e: spots('people') },
  nodes: [
    { id: 'A', x: 110, y: 50, w: 300, h: 54, label: '战略目标清楚', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'B', x: 110, y: 150, w: 300, h: 54, label: '业务场景与流程明确', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'C', x: 110, y: 250, w: 300, h: 54, label: '数据和技术系统可用', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'D', x: 110, y: 350, w: 300, h: 54, label: '治理与责任衔接', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'E', x: 110, y: 450, w: 300, h: 54, label: '干部员工具备协作能力', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'Z', x: 500, y: 190, w: 340, h: 64, label: 'AI进入日常工作', fontSize: 24, look: { fill: '#EFF7F1', stroke: '#4CAF7D', text: '#1F5B3C' }, strokeWidth: 2 },
    { id: 'F', x: 500, y: 330, w: 340, h: 58, label: '持续运行、评估与改进', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
  ],
  links: [
    { from: 'A', to: 'Z', color: '#3E63DD' }, { from: 'B', to: 'Z', color: '#3E63DD' }, { from: 'C', to: 'Z', color: '#3E63DD' },
    { from: 'D', to: 'Z', color: '#3E63DD' }, { from: 'E', to: 'Z', color: '#3E63DD' },
  ],
  arrows: [{ points: [[670, 254], [670, 330]], color: '#3E63DD' }],
  illustrations: [
    { img: 'a', x: 36, y: 45, w: 64 }, { img: 'b', x: 36, y: 145, w: 64 }, { img: 'c', x: 36, y: 245, w: 64 },
    { img: 'd', x: 36, y: 345, w: 64 }, { img: 'e', x: 36, y: 445, w: 64 },
  ],
});

// 图17-1 岗位拆解 → 自动化/协作/新增 → 重新组合
mFigures.push({
  kind: 'map', id: 'f17-1', W: 1000, H: 560,
  images: { root: spots('people'), auto: spots('robot'), collab: spots('chat'), newwork: spots('tools') },
  nodes: [
    { id: 'A', x: 20, y: 218, w: 290, h: 64, label: '岗位拆解为具体任务', fontSize: 24, look: { fill: '#F7F4FF', stroke: '#7C5CE0', text: '#3B2B7A' }, strokeWidth: 2 },
    { id: 'B', x: 380, y: 70, w: 310, h: 58, label: '自动化', fontSize: 22, sub: '系统办理规则明确的步骤', look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'C', x: 380, y: 240, w: 310, h: 58, label: '协作', fontSize: 22, sub: '员工审阅AI建议并作判断', look: { fill: '#F1FAF4', stroke: '#4CAF7D', text: '#1F5B3C' } },
    { id: 'D', x: 380, y: 410, w: 310, h: 58, label: '新增', fontSize: 22, sub: '数据、模型、权限和流程维护', look: { fill: '#FFF9EF', stroke: '#E0A03E', text: '#8A5A12' } },
    { id: 'E', x: 760, y: 222, w: 225, h: 64, label: '重新组合岗位职责', fontSize: 20, look: { fill: '#EFF7F1', stroke: '#4CAF7D', text: '#1F5B3C' } },
  ],
  links: [
    { from: 'A', to: 'B', color: '#3E7BE0' }, { from: 'A', to: 'C', color: '#4CAF7D' }, { from: 'A', to: 'D', color: '#E0A03E' },
    { from: 'B', to: 'E', color: '#8FA6C9' }, { from: 'C', to: 'E', color: '#8FA6C9' }, { from: 'D', to: 'E', color: '#8FA6C9' },
  ],
  illustrations: [
    { img: 'root', x: 110, y: 60, w: 110 },
    { img: 'auto', x: 505, y: 2, w: 60 },
    { img: 'collab', x: 505, y: 172, w: 60 },
    { img: 'newwork', x: 505, y: 342, w: 60 },
  ],
});

// 图17-2 三个数字的链条
mFigures.push({
  kind: 'map', id: 'f17-2', W: 1000, H: 340,
  images: { ppl: spots('people'), risk: spots('alert') },
  nodes: [
    { id: 'A', x: 30, y: 130, w: 240, h: 58, label: '全球就业人口', fontSize: 22, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' }, strokeWidth: 2 },
    { id: 'B', x: 350, y: 126, w: 320, h: 64, label: '约四分之一', fontSize: 22, sub: '所处职业含有一定AI暴露', look: { fill: '#FFF9EF', stroke: '#E0A03E', text: '#8A5A12' } },
    { id: 'C', x: 740, y: 126, w: 230, h: 64, label: '其中3.3%', fontSize: 22, sub: '处于最高暴露梯度', look: { fill: '#FDECEC', stroke: '#DFA0A0', text: '#B4262A' } },
  ],
  links: [{ from: 'A', to: 'B', color: '#E0A03E' }, { from: 'B', to: 'C', color: '#DFA0A0' }],
  illustrations: [{ img: 'ppl', x: 100, y: 30, w: 90 }, { img: 'risk', x: 815, y: 20, w: 70 }],
});

// 图18-1 五项能力 → 承担复杂工作 → 转化为可用结果
mFigures.push({
  kind: 'map', id: 'f18-1', W: 1080, H: 620,
  images: { a: spots('book'), b: spots('puzzle'), c: spots('search'), d: spots('chat'), e: spots('loop') },
  nodes: [
    { id: 'A', x: 110, y: 50, w: 300, h: 54, label: '专业知识', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'B', x: 110, y: 150, w: 300, h: 54, label: '任务拆解与流程理解', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'C', x: 110, y: 250, w: 300, h: 54, label: '证据核验与风险判断', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'D', x: 110, y: 350, w: 300, h: 54, label: '人机协作与跨岗沟通', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'E', x: 110, y: 450, w: 300, h: 54, label: '持续学习与复盘', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
    { id: 'F', x: 500, y: 190, w: 350, h: 64, label: '能在变化中承担复杂工作', fontSize: 23, look: { fill: '#EFF7F1', stroke: '#4CAF7D', text: '#1F5B3C' }, strokeWidth: 2 },
    { id: 'G', x: 500, y: 330, w: 350, h: 58, label: '把AI输出转化为可用结果', fontSize: 21, look: { fill: '#F1F6FE', stroke: '#3E7BE0', text: '#1E4C97' } },
  ],
  links: [
    { from: 'A', to: 'F', color: '#4CAF7D' }, { from: 'B', to: 'F', color: '#4CAF7D' }, { from: 'C', to: 'F', color: '#4CAF7D' },
    { from: 'D', to: 'F', color: '#4CAF7D' }, { from: 'E', to: 'F', color: '#4CAF7D' },
  ],
  arrows: [{ points: [[675, 254], [675, 330]], color: '#3E63DD' }],
  illustrations: [
    { img: 'a', x: 36, y: 45, w: 64 }, { img: 'b', x: 36, y: 145, w: 64 }, { img: 'c', x: 36, y: 245, w: 64 },
    { img: 'd', x: 36, y: 345, w: 64 }, { img: 'e', x: 36, y: 445, w: 64 },
  ],
});

// ---------- i 系列（图标卡片） ----------
const main = (items, opts = {}) => col(items, { x: 270, w: 340, ...opts });
const iFigures = (() => {
  const out = [];

  // 图1-1
  {
    const c = main([
      { id: 'A', label: '交代目标与边界', icon: 'chat' },
      { id: 'B', label: '理解任务与缺项', icon: 'search' },
      { id: 'C', label: '制定执行步骤', icon: 'route' },
      { id: 'D', label: '调用资料与工具', icon: 'tools' },
      { id: 'E', label: '结果是否满足要求', icon: 'check', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' },
    ], { y0: 40, gap: 26 });
    const m = mapOf(c);
    const F = { id: 'F', x: 40, y: 520, w: 260, h: 64, label: '等待人工确认', icon: 'alert', tint: '#FDF3E3', border: '#DBA96B', iconBg: '#FBEBD5', iconColor: '#A9702A' };
    const G = { id: 'G', x: 610, y: 514, w: 270, h: 74, label: '交付文件与待确认事项', icon: 'doc', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    out.push({
      id: 'f1-1', W: 900, H: 620,
      cards: [...c, F, G],
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'C', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top' },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top', via: [[440, 500], [170, 500], [170, 520]], label: '需要授权', labelX: 300, labelY: 494 },
        { from: 'E', to: 'G', fromPort: 'bottom', toPort: 'top', via: [[440, 500], [745, 500], [745, 520]], label: '完成', labelX: 600, labelY: 494 },
        { from: 'E', to: 'C', fromPort: 'right', toPort: 'right', via: [[680, 456], [680, 272]], label: '继续处理', labelX: 690, labelY: 360 },
        { from: 'F', to: 'D', fromPort: 'left', toPort: 'left', via: [[20, 552], [20, 372]], label: '', dashed: true },
      ],
    });
  }

  // 图2-1
  {
    const c = main([
      { id: 'A', label: '人提出研究问题与评价标准', icon: 'target' },
      { id: 'B', label: 'AI编写代码、运行实验', icon: 'robot' },
      { id: 'C', label: '测试结果与错误记录', icon: 'doc' },
      { id: 'D', label: '研究人员复核并确定方向', icon: 'search' },
    ], { y0: 40 });
    const m = mapOf(c);
    const E = { id: 'E', x: 270, y: 410, w: 340, h: 64, label: 'AI承担更长的研发任务', icon: 'robot' };
    const F = { id: 'F', x: 270, y: 514, w: 340, h: 64, label: 'AI参与设计和训练后继系统', icon: 'chip' };
    out.push({
      id: 'f2-1', W: 900, H: 620,
      cards: [...c, E, F],
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'C', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'D', to: 'B', fromPort: 'right', toPort: 'right', via: [[660, 372], [660, 210]], label: '复核后继续', labelX: 600, labelY: 300 },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top', dashed: true, label: '能力与工具改善后', labelX: 420, labelY: 392 },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top', dashed: true, label: '未来可能形成', labelX: 420, labelY: 494 },
      ],
    });
  }

  // 图3-1
  {
    const c = main([
      { id: 'A', label: '收到业务请求', icon: 'chat' },
      { id: 'B', label: '理解任务与岗位规则', icon: 'doc' },
      { id: 'C', label: '检索知识和业务数据', icon: 'search' },
      { id: 'D', label: '生成建议或执行低风险步骤', icon: 'robot' },
      { id: 'E', label: '规则明确且结果可核吗', icon: 'alert', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' },
    ], { y0: 40 });
    const F = { id: 'F', x: 60, y: 500, w: 280, h: 64, label: '记录并继续办理', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const G = { id: 'G', x: 500, y: 500, w: 280, h: 64, label: '转交工作人员', icon: 'people', tint: '#FDF3E3', border: '#DBA96B', iconBg: '#FBEBD5', iconColor: '#A9702A' };
    const H = { id: 'H', x: 270, y: 600, w: 340, h: 64, label: '业务人员抽查与反馈', icon: 'search' };
    out.push({
      id: 'f3-1', W: 900, H: 700,
      cards: [...c, F, G, H],
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'C', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top' },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top', via: [[440, 486], [200, 486], [200, 500]], label: '是', labelX: 330, labelY: 480 },
        { from: 'E', to: 'G', fromPort: 'bottom', toPort: 'top', via: [[440, 486], [640, 486], [640, 500]], label: '否', labelX: 560, labelY: 480 },
        { from: 'F', to: 'H', fromPort: 'bottom', toPort: 'top', via: [[200, 590], [400, 590], [400, 600]] },
        { from: 'G', to: 'H', fromPort: 'bottom', toPort: 'top', via: [[640, 590], [480, 590], [480, 600]] },
      ],
    });
  }

  // 图4-2
  {
    const c = main([
      { id: 'A', label: '明确业务目标', icon: 'target' },
      { id: 'B', label: '拆解岗位任务', icon: 'route' },
      { id: 'C', label: '重排人员与Agent的分工', icon: 'people' },
      { id: 'D', label: '调整流程、系统和数据权限', icon: 'db' },
      { id: 'E', label: '安排人才培养与运行责任', icon: 'shield' },
      { id: 'F', label: '按业务结果持续评估', icon: 'loop' },
    ], { y0: 34, gap: 22 });
    out.push({
      id: 'f4-2', W: 900, H: 640,
      cards: c,
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'C', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top' },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top' },
        { from: 'F', to: 'A', fromPort: 'left', toPort: 'left', via: [[210, 570], [210, 66]], label: '发现新问题', labelX: 200, labelY: 320 },
      ],
    });
  }


  // 图6-1 学习范式
  {
    const A = { id: 'A', x: 300, y: 40, w: 340, h: 64, label: '训练问题', icon: 'target' };
    const B = { id: 'B', x: 300, y: 132, w: 340, h: 76, label: '学习信号来自哪里', icon: 'alert', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' };
    const C = { id: 'C', x: 300, y: 250, w: 340, h: 64, label: '监督学习<br/>样本带有答案', icon: 'search' };
    const D = { id: 'D', x: 300, y: 340, w: 340, h: 64, label: '自监督或无监督学习<br/>数据内部结构', icon: 'db' };
    const E = { id: 'E', x: 300, y: 430, w: 340, h: 64, label: '强化学习<br/>行动后的奖励或惩罚', icon: 'target' };
    const F = { id: 'F', x: 300, y: 530, w: 340, h: 76, label: '学习方法与模型共同形成能力', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const G = { id: 'G', x: 20, y: 250, w: 250, h: 244, label: '深度学习<br/>多层神经网络方法', icon: 'chip', tint: '#F7F9FC', border: '#E4E9F2', fontSize: 19 };
    out.push({
      id: 'f6-1', W: 740, H: 650,
      cards: [A, B, C, D, E, F, G],
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'C', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top' },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top' },
        { from: 'G', to: 'C', fromPort: 'right', toPort: 'left', dashed: true },
        { from: 'G', to: 'D', fromPort: 'right', toPort: 'left', dashed: true },
        { from: 'G', to: 'E', fromPort: 'right', toPort: 'left', dashed: true },
      ],
    });
  }

  // 图7-2
  {
    const A = { id: 'A', x: 40, y: 60, w: 250, h: 64, label: '算法：怎样学习与推理', icon: 'chip' };
    const B = { id: 'B', x: 315, y: 60, w: 250, h: 64, label: '数据：提供什么样本与依据', icon: 'db' };
    const C = { id: 'C', x: 590, y: 60, w: 250, h: 64, label: '算力：训练和运行投入', icon: 'bolt' };
    const D = { id: 'D', x: 315, y: 200, w: 250, h: 72, label: '模型能力与运行效果', icon: 'robot' };
    const E = { id: 'E', x: 315, y: 320, w: 250, h: 64, label: '业务任务中的表现', icon: 'check' };
    const F = { id: 'F', x: 315, y: 430, w: 250, h: 64, label: '评测、反馈与资源调整', icon: 'loop' };
    out.push({
      id: 'f7-2', W: 880, H: 560,
      cards: [A, B, C, D, E, F],
      edges: [
        { from: 'A', to: 'D', fromPort: 'bottom', toPort: 'top', via: [[165, 160], [440, 160], [440, 200]] },
        { from: 'B', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top', via: [[715, 160], [440, 160], [440, 200]] },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top' },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top' },
        { from: 'F', to: 'A', fromPort: 'left', toPort: 'left', via: [[14, 462], [14, 92]] },
      ],
    });
  }

  // 图8-1 Agent 架构
  {
    const U = { id: 'U', x: 24, y: 210, w: 210, h: 72, label: '用户目标、背景与边界', icon: 'target' };
    const O = { id: 'O', x: 300, y: 120, w: 330, h: 64, label: '编排程序：拆分任务、维护状态', icon: 'route' };
    const L = { id: 'L', x: 300, y: 220, w: 330, h: 64, label: '大模型：理解任务、判断下一步', icon: 'chip' };
    const M = { id: 'M', x: 300, y: 320, w: 330, h: 64, label: '记忆与检索：偏好、任务状态、外部知识', icon: 'db' };
    const T = { id: 'T', x: 300, y: 420, w: 330, h: 64, label: '工具：网页、文件、业务系统', icon: 'tools' };
    const R = { id: 'R', x: 300, y: 520, w: 330, h: 64, label: '工具返回的实际结果', icon: 'search' };
    const H = { id: 'H', x: 690, y: 220, w: 190, h: 76, label: '需人工授权或任务已完成', icon: 'alert', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' };
    const D = { id: 'D', x: 690, y: 340, w: 190, h: 64, label: '文件、答复或操作记录', icon: 'doc', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const G = { id: 'G', x: 300, y: 626, w: 330, h: 56, label: '权限、日志、异常处理', icon: 'shield', tint: '#F7F9FC', border: '#E4E9F2', fontSize: 19 };
    out.push({
      id: 'f8-1', W: 900, H: 710,
      zones: [
        { x: 12, y: 180, w: 234, h: 130, label: '用户', tint: '#F7F9FC', border: '#E4E9F2' },
        { x: 268, y: 84, w: 394, h: 580, label: 'Agent 运行过程', tint: '#F7F9FC', border: '#E4E9F2' },
        { x: 676, y: 180, w: 218, h: 240, label: '决策与交付', tint: '#FDFBF6', border: '#F0E6D4', labelColor: '#A9702A' },
      ],
      cards: [U, O, L, M, T, R, H, D, G],
      edges: [
        { from: 'U', to: 'O', fromPort: 'right', toPort: 'left' },
        { from: 'O', to: 'L', fromPort: 'bottom', toPort: 'top' },
        { from: 'L', to: 'M', fromPort: 'bottom', toPort: 'top' },
        { from: 'L', to: 'H', fromPort: 'right', toPort: 'left' },
        { from: 'M', to: 'T', fromPort: 'bottom', toPort: 'top' },
        { from: 'T', to: 'R', fromPort: 'bottom', toPort: 'top' },
        { from: 'R', to: 'O', fromPort: 'left', toPort: 'left', via: [[244, 552], [244, 152]] },
        { from: 'H', to: 'D', fromPort: 'bottom', toPort: 'top', label: '交付', labelX: 800, labelY: 322 },
        { from: 'H', to: 'L', fromPort: 'left', toPort: 'right', via: [[650, 258], [650, 252]], dashed: true, label: '继续处理', labelX: 655, labelY: 240 },
      ],
    });
  }

  // 图9-1 微短剧
  {
    const c = main([
      { id: 'A', label: '选题与剧本', icon: 'doc' },
      { id: 'B', label: '人物、场景与道具设定', icon: 'people' },
      { id: 'C', label: '分镜和动态预演', icon: 'route' },
      { id: 'D', label: '生成镜头或实景拍摄', icon: 'camera' },
      { id: 'E', label: '剪辑、配音与字幕', icon: 'tools' },
      { id: 'F', label: '版权、肖像、声音与标识复核', icon: 'shield', tint: '#FDF3E3', border: '#DBA96B', iconBg: '#FBEBD5', iconColor: '#A9702A' },
      { id: 'G', label: '发布与观众反馈', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' },
    ], { y0: 30, gap: 20, h: 60 });
    out.push({
      id: 'f9-1', W: 900, H: 660,
      cards: c,
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'G', to: 'A', fromPort: 'right', toPort: 'right', via: [[680, 600], [680, 60]], label: '下一轮', labelX: 690, labelY: 330 },
      ],
    });
  }

  // 图10-1 多Agent
  {
    const c = main([
      { id: 'A', label: '产品Agent：需求与验收条件', icon: 'doc' },
      { id: 'B', label: '设计Agent：页面与交互方案', icon: 'route' },
      { id: 'C', label: '开发Agent：编写和修改代码', icon: 'chip' },
      { id: 'D', label: '测试Agent：运行测试并报告问题', icon: 'search' },
      { id: 'E', label: '开发者审阅差异与边界情况', icon: 'people' },
      { id: 'F', label: '发布负责人确认部署与回滚', icon: 'shield' },
      { id: 'G', label: '监控运行并收集反馈', icon: 'loop', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' },
    ], { y0: 30, gap: 20, h: 60 });
    out.push({
      id: 'f10-1', W: 900, H: 660,
      cards: c,
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'D', to: 'C', fromPort: 'right', toPort: 'right', via: [[660, 380], [660, 300]], label: '发现问题', labelX: 668, labelY: 336 },
      ],
    });
  }

  // 图11-1 具身智能
  {
    const c = main([
      { id: 'A', label: '摄像头、触觉和关节传感器', icon: 'camera' },
      { id: 'B', label: '感知：识别物体与环境', icon: 'search' },
      { id: 'C', label: '任务规划：分解目标', icon: 'route' },
      { id: 'D', label: '运动规划与控制', icon: 'chip' },
      { id: 'E', label: '机械臂、手爪或移动底盘执行', icon: 'robot' },
      { id: 'F', label: '传感器读取动作结果', icon: 'camera' },
    ], { x: 200, y0: 34, gap: 22 });
    const G = { id: 'G', x: 560, y: 288, w: 260, h: 72, label: '安全控制与紧急停止', icon: 'shield', tint: '#FDF3E3', border: '#DBA96B', iconBg: '#FBEBD5', iconColor: '#A9702A' };
    out.push({
      id: 'f11-1', W: 900, H: 600,
      cards: [...c, G],
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'F', to: 'B', fromPort: 'left', toPort: 'left', via: [[150, 496], [150, 152]], label: '持续校正', labelX: 100, labelY: 324 },
        { from: 'D', to: 'G', fromPort: 'right', toPort: 'left' },
      ],
    });
  }

  // 图12-2 科研证据循环
  {
    const c = main([
      { id: 'A', label: '提出科学问题', icon: 'target' },
      { id: 'B', label: '整理文献、数据与实验条件', icon: 'db' },
      { id: 'C', label: 'AI检索、分析并提出候选假设', icon: 'robot' },
      { id: 'D', label: '仿真筛选与实验设计', icon: 'route' },
      { id: 'E', label: '实验或独立观测', icon: 'camera' },
      { id: 'F', label: '研究人员解释、复核与记录', icon: 'search' },
    ], { y0: 34, gap: 22 });
    out.push({
      id: 'f12-2', W: 900, H: 600,
      cards: c,
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'F', to: 'A', fromPort: 'left', toPort: 'left', via: [[206, 552], [206, 60]], label: '支持或修正假设', labelX: 196, labelY: 320 },
      ],
    });
  }

  // 图13-1 公共服务与央国企
  {
    const A = { id: 'A', x: 30, y: 40, w: 380, h: 78, label: '公共服务：群众咨询与办事需求', icon: 'people' };
    const C = { id: 'C', x: 490, y: 40, w: 380, h: 78, label: '央国企：生产、设备与供应链任务', icon: 'tools' };
    const B = { id: 'B', x: 30, y: 158, w: 380, h: 78, label: '政策知识、事项指南与服务系统', icon: 'db' };
    const D = { id: 'D', x: 490, y: 158, w: 380, h: 78, label: '专业数据、行业工具与生产系统', icon: 'chip' };
    const E = { id: 'E', x: 270, y: 290, w: 360, h: 64, label: 'Agent检索、分析或推进步骤', icon: 'robot' };
    const F = { id: 'F', x: 240, y: 396, w: 420, h: 180, shape: 'diamond', label: '影响范围与风险', fontSize: 22, tint: '#FCF3D7', border: '#D8B65A' };
    const G = { id: 'G', x: 50, y: 630, w: 340, h: 66, label: '按授权处理并留痕', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const H = { id: 'H', x: 510, y: 630, w: 340, h: 66, label: '专业人员复核或接管', icon: 'people', tint: '#FDF3E3', border: '#DBA96B', iconBg: '#FBEBD5', iconColor: '#A9702A' };
    const I = { id: 'I', x: 270, y: 760, w: 360, h: 64, label: '业务结果与运行反馈', icon: 'loop' };
    out.push({
      id: 'f13-1', W: 900, H: 870,
      cards: [A, B, C, D, E, F, G, H, I],
      edges: [
        { from: 'A', to: 'B', fromPort: 'bottom', toPort: 'top' },
        { from: 'C', to: 'D', fromPort: 'bottom', toPort: 'top' },
        { from: 'B', to: 'E', fromPort: 'bottom', toPort: 'top', via: [[220, 262], [450, 262]] },
        { from: 'D', to: 'E', fromPort: 'bottom', toPort: 'top', via: [[680, 262], [450, 262]] },
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top' },
        { from: 'F', to: 'G', fromPort: 'bottom', toPort: 'top', via: [[450, 600], [220, 600]], label: '低风险、可核验', labelX: 330, labelY: 588 },
        { from: 'F', to: 'H', fromPort: 'bottom', toPort: 'top', via: [[450, 600], [680, 600]], label: '复杂、高影响', labelX: 570, labelY: 588 },
        { from: 'G', to: 'I', fromPort: 'bottom', toPort: 'top', via: [[220, 726], [450, 726]] },
        { from: 'H', to: 'I', fromPort: 'bottom', toPort: 'top', via: [[680, 726], [450, 726]] },
      ],
    });
  }

  // 图16-1 试点决策
  {
    const c = main([
      { id: 'A', label: '画清现有流程', icon: 'route' },
      { id: 'B', label: '提出可验证假设', icon: 'target' },
      { id: 'C', label: '准备数据、系统与环境', icon: 'db' },
      { id: 'D', label: '安排人机分工与接管', icon: 'people' },
      { id: 'E', label: '比较新旧流程的成本和质量', icon: 'search' },
      { id: 'F', label: '依据结果作决定', icon: 'alert', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' },
    ], { y0: 30, gap: 20, h: 60 });
    const G = { id: 'G', x: 560, y: 540, w: 300, h: 64, label: '逐步扩围并持续维护', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const H = { id: 'H', x: 40, y: 540, w: 280, h: 64, label: '恢复原流程并记录经验', icon: 'loop', tint: '#FDECEC', border: '#DFA0A0', iconBg: '#FBE4E4', iconColor: '#B4262A' };
    out.push({
      id: 'f16-1', W: 900, H: 660,
      cards: [...c, G, H],
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'F', to: 'G', fromPort: 'bottom', toPort: 'top', via: [[440, 520], [710, 520], [710, 540]], label: '继续', labelX: 580, labelY: 512 },
        { from: 'F', to: 'H', fromPort: 'bottom', toPort: 'top', via: [[440, 520], [180, 520], [180, 540]], label: '停止', labelX: 320, labelY: 512 },
        { from: 'F', to: 'B', fromPort: 'right', toPort: 'right', via: [[660, 440], [660, 182]], label: '调整', labelX: 668, labelY: 320 },
      ],
    });
  }

  // 图19-1 个人尝试
  {
    const c = main([
      { id: 'A', label: '选择低风险、边界清楚的任务', icon: 'target' },
      { id: 'B', label: '记录原流程与目标', icon: 'doc' },
      { id: 'C', label: '让AI承担一个步骤', icon: 'robot' },
      { id: 'D', label: '核对事实、质量和耗时', icon: 'search' },
      { id: 'E', label: '结果稳定且风险可控吗', icon: 'alert', tint: '#FCF3D7', border: '#D8B65A', iconBg: '#FBF0D2', iconColor: '#9A7B22' },
    ], { y0: 34, gap: 22 });
    const F = { id: 'F', x: 560, y: 490, w: 300, h: 64, label: '整理成团队可复用的方法', icon: 'check', tint: '#EFF7F1', border: '#CBE3D3', iconBg: '#E2F1E8', iconColor: '#2F8A5B' };
    const G = { id: 'G', x: 560, y: 582, w: 300, h: 64, label: '评估是否扩展到更多步骤', icon: 'route' };
    out.push({
      id: 'f19-1', W: 900, H: 690,
      cards: [...c, F, G],
      edges: [
        ...c.slice(1).map((n, i) => ({ from: c[i].id, to: n.id, fromPort: 'bottom', toPort: 'top' })),
        { from: 'E', to: 'F', fromPort: 'bottom', toPort: 'top', via: [[440, 470], [710, 470], [710, 490]], label: '是', labelX: 580, labelY: 464 },
        { from: 'E', to: 'C', fromPort: 'left', toPort: 'left', via: [[206, 430], [206, 286]], label: '继续观察', labelX: 196, labelY: 360 },
        { from: 'F', to: 'G', fromPort: 'bottom', toPort: 'top' },
      ],
    });
  }


  // 图5-1 方法转向（时间线）
  {
    const years = [
      ['1950', '图灵提出模仿游戏', 'target'],
      ['1955—1956', '达特茅斯研究计划与研讨会', 'chat'],
      ['1970年代', '早期系统受算力与任务规模限制，研究进入低潮', 'alert'],
      ['1980年代', '专家系统进入部分商业流程', 'tools'],
      ['2012', 'AlexNet推动深度学习在图像识别中突破', 'chip'],
      ['2016—2017', 'AlphaGo与Transformer带来新进展', 'robot'],
      ['2022', 'ChatGPT让生成式AI进入公众产品', 'chat'],
      ['2025—2026', 'Agent开始调用工具并推进连续任务', 'robot'],
    ];
    const cards = [];
    const edges = [];
    years.forEach(([y, text, icon], i) => {
      const top = 50 + i * 78;
      const yid = 'Y' + i, eid = 'E' + i;
      cards.push({ id: yid, x: 40, y: top + 6, w: 180, h: 48, label: y, fontSize: 19, tint: '#F1F6FE', border: '#CFE0F6' });
      cards.push({ id: eid, x: 270, y: top, w: 570, h: 60, label: text, icon });
      edges.push({ from: yid, to: eid, fromPort: 'right', toPort: 'left' });
    });
    out.push({ id: 'f5-1', W: 880, H: 700, cards, edges });
  }

  return out;
})();

// ---------- 图表 ----------
const charts = [
  { kind: 'bar', id: 'f2-2', title: '评测中模型可完成任务对应的人类专家用时', unit: '分钟', max: 720, ticks: 4, W: 820, H: 470,
    data: [{ name: '2024年3月', value: 4, label: '4' }, { name: '2025年3月', value: 90, label: '90' }, { name: '2026年3月', value: 720, label: '720' }] },
  { kind: 'bar', id: 'f3-2', title: '企业AI采用情况（2025年受访组织）', unit: '%', max: 100, ticks: 4, W: 820, H: 470,
    data: [{ name: '至少一个职能使用AI', value: 88, label: '88%' }, { name: '定期使用生成式AI', value: 79, label: '79%' }] },
  { kind: 'bar', id: 'f4-1', title: '国家提出的智能终端与智能体应用普及率目标', unit: '%', max: 100, ticks: 4, W: 820, H: 470,
    data: [{ name: '2027年', value: 70, label: '70%' }, { name: '2030年', value: 90, label: '90%' }] },
  { kind: 'bar', id: 'f7-1', title: '公开研究样本中训练资源的平均翻倍间隔估算', unit: '月', max: 12, ticks: 4, W: 820, H: 470,
    data: [{ name: '训练计算量', value: 5, label: '5' }, { name: '训练数据集规模', value: 8, label: '8' }, { name: '训练功耗', value: 12, label: '12' }] },
  { kind: 'bar', id: 'f12-1', title: 'PaperArena 科学任务评测得分', unit: '%', max: 100, ticks: 4, W: 820, H: 470,
    data: [{ name: '领先科学Agent', value: 38.8, label: '38.8' }, { name: '博士研究人员基准', value: 83.5, label: '83.5' }] },
  { kind: 'bar', id: 'f14-2', title: 'OECD成员经济体企业AI采用情况（2025年）', unit: '%', max: 60, ticks: 4, W: 820, H: 470,
    data: [{ name: '10人及以上企业', value: 20, label: '20%' }, { name: '大型企业', value: 52, label: '52%' }] },
  { kind: 'bar', id: 'f18-2', title: 'OECD成员经济体个人使用生成式AI比例（2025年）', unit: '%', max: 80, ticks: 4, W: 820, H: 470,
    data: [{ name: '16—24岁', value: 68, label: '68%' }, { name: '全体个人', value: 37, label: '37%' }, { name: '55—74岁', value: 14, label: '14%' }] },
];

const timeline = {
  kind: 'timeline', id: 'f5-1', W: 820, title: '人工智能研究的几次方法转向',
  items: [
    { year: '1950', text: '图灵提出模仿游戏' },
    { year: '1955—1956', text: '达特茅斯研究计划与研讨会' },
    { year: '1970年代', text: '早期系统受算力与任务规模限制，研究进入低潮' },
    { year: '1980年代', text: '专家系统进入部分商业流程' },
    { year: '2012', text: 'AlexNet推动深度学习在图像识别中突破' },
    { year: '2016—2017', text: 'AlphaGo与Transformer带来新进展' },
    { year: '2022', text: 'ChatGPT让生成式AI进入公众产品' },
    { year: '2025—2026', text: 'Agent开始调用工具并推进连续任务' },
  ],
};

// ---------- 渲染 ----------
const manifest = [];
const write = (id, svg) => {
  fs.writeFileSync(path.join(OUT, `${id}.svg`), svg, 'utf8');
  manifest.push({ id, file: `${id}.svg`, bytes: Buffer.byteLength(svg) });
};

for (const f of mFigures) write(f.id, renderMap(f));
for (const f of iFigures) write(f.id, renderIconFigure(f));
for (const c of charts) write(c.id, renderBar(c));
// f5-1 由 i 系列时间线卡片生成

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');
console.log('figures:', manifest.length);
console.log(manifest.map((m) => `${m.id} ${(m.bytes / 1024).toFixed(0)}KB`).join('\n'));
