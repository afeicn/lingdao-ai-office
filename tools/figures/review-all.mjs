import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2] || 'C:/Users/asus/AppData/Local/Temp/opencode/all';
const OUT = process.argv[3] || 'C:/Users/asus/AppData/Local/Temp/opencode/review';
const PER = +(process.argv[4] || 4);
fs.mkdirSync(OUT, { recursive: true });

const CAPS = {
  'f1-1': '图1-1　个人Agent从接收任务到交付结果',
  'f2-1': '图2-1　AI参与研发后形成的反馈回路',
  'f2-2': '图2-2　任务跨度变化',
  'f3-1': '图3-1　数字员工在组织流程中的基本工作链',
  'f3-2': '图3-2　企业AI采用情况',
  'f4-1': '图4-1　智能终端与智能体应用普及率目标',
  'f4-2': '图4-2　组织迎接Agent时代的调整关系',
  'f5-1': '图5-1　人工智能研究的几次方法转向',
  'f6-1': '图6-1　学习范式与深度学习的关系',
  'f7-1': '图7-1　训练资源的平均翻倍间隔估算',
  'f7-2': '图7-2　算法、数据和算力共同影响模型能力',
  'f8-1': '图8-1　Agent 架构',
  'f9-1': '图9-1　生成式AI进入微短剧制作后的主要环节',
  'f10-1': '图10-1　多Agent软件开发的接力关系',
  'f11-1': '图11-1　具身智能把语言目标转化为身体动作',
  'f12-1': '图12-1　PaperArena 科学任务评测得分',
  'f12-2': '图12-2　AI参与科研后形成的证据循环',
  'f13-1': '图13-1　公共服务与产业流程使用Agent时的共同治理环节',
  'f14-1': '图14-1　GET 模型',
  'f14-2': '图14-2　OECD 企业AI采用情况',
  'f15-1': '图15-1　五项条件共同支撑AI进入日常工作',
  'f16-1': '图16-1　从试点走向持续应用的决策路径',
  'f17-1': '图17-1　AI对岗位的影响落在任务层面',
  'f17-2': '图17-2　全球就业人口的AI暴露情况',
  'f18-1': '图18-1　个人能力的五个支撑',
  'f18-2': '图18-2　OECD 个人使用生成式AI比例',
  'f19-1': '图19-1　个人从一次尝试到可复用方法',
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.svg')).sort((a, b) => {
  const num = (s) => s.replace('f', '').replace('.svg', '').split('-').map(Number);
  const [a1, a2] = num(a), [b1, b2] = num(b);
  return a1 - b1 || a2 - b2;
});

const cards = files.map((f) => {
  const id = f.replace('.svg', '');
  const svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  return `<figure><figcaption>${CAPS[id] || id}　<code>${id}</code></figcaption><div class="box">${svg}</div></figure>`;
});

const page = (body, n) => `<!doctype html><html lang="zh"><head><meta charset="utf-8"><style>
body{margin:0;padding:24px 30px 50px;background:#f2f0ec;font:13px/1.6 "Microsoft YaHei","PingFang SC",sans-serif;color:#1b1b1b}
h1{font-size:18px;margin:0 0 16px}
figure{margin:0 0 24px;background:#fff;padding:12px 14px 8px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
figcaption{font-size:12px;color:#555;margin-bottom:8px}
.box svg{width:100%;height:auto;display:block}
</style></head><body><h1>02-认知卷 插图 ${n}/${Math.ceil(cards.length)}页</h1>
${body}</body></html>`;

let n = 0;
for (let i = 0; i < cards.length; i += PER) {
  n++;
  fs.writeFileSync(path.join(OUT, `p${n}.html`), page(cards.slice(i, i + PER).join('\n'), n), 'utf8');
}
console.log('pages', n);
