import fs from 'node:fs';

const BASE = 'http://172.16.0.63:8189';
const OUT = 'C:/Users/asus/AppData/Local/Temp/opencode/spots';
fs.mkdirSync(OUT, { recursive: true });

const STYLE = 'Flat vector spot illustration, soft pastel palette, clean minimal geometric shapes, subtle soft shading, white background, one centered subject, generous empty margin, no text, no letters, no border, no frame, no shadow box.';

const ITEMS = [
  { id: 'root',  prompt: `${STYLE} A simple briefcase with a small rising bar chart floating above it, symbolizing business value. Pastel blue and violet.` },
  { id: 'growth', prompt: `${STYLE} A young plant with two leaves sprouting from a small mound of soil, a short upward arrow above it, symbolizing growth. Pastel green and soft blue.` },
  { id: 'eff',    prompt: `${STYLE} A stopwatch next to two small gear wheels, symbolizing efficiency and saved time. Pastel blue and mint.` },
  { id: 'trans',  prompt: `${STYLE} Three simple building blocks rearranged in a circle with two curved arrows between them, symbolizing transformation. Pastel amber and violet.` },
];

const graph = (text) => ({
  prompt: {
    1: { class_type: 'UnetLoaderGGUF', inputs: { unet_name: 'qwen-image-2.1-Q4_K_M.gguf' } },
    2: { class_type: 'ModelSamplingAuraFlow', inputs: { model: ['1', 0], shift: 3.1 } },
    3: { class_type: 'CLIPLoader', inputs: { clip_name: 'qwen3vl_8b_int8_convrot.safetensors', type: 'qwen_image' } },
    4: { class_type: 'CLIPTextEncode', inputs: { clip: ['3', 0], text } },
    5: { class_type: 'CLIPTextEncode', inputs: { clip: ['3', 0], text: '' } },
    6: { class_type: 'EmptyLatentImage', inputs: { width: 768, height: 768, batch_size: 1 } },
    7: { class_type: 'KSampler', inputs: { model: ['2', 0], seed: 7, steps: 20, cfg: 1.0, sampler_name: 'euler', scheduler: 'simple', positive: ['4', 0], negative: ['5', 0], latent_image: ['6', 0], denoise: 1.0 } },
    8: { class_type: 'VAELoader', inputs: { vae_name: 'qwen_image_2.1_vae_bf16.safetensors' } },
    9: { class_type: 'VAEDecode', inputs: { samples: ['7', 0], vae: ['8', 0] } },
    10: { class_type: 'SaveImage', inputs: { images: ['9', 0], filename_prefix: `spots/${text.includes('plant') ? 'growth' : text.includes('stopwatch') ? 'eff' : text.includes('blocks') ? 'trans' : 'root'}` } },
  },
  client_id: 'spots',
});

async function submit(spec) {
  const r = await fetch(`${BASE}/prompt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(spec) });
  if (!r.ok) throw new Error('submit ' + r.status + ' ' + (await r.text()));
  return (await r.json()).prompt_id;
}

async function wait(id) {
  for (let i = 0; i < 120; i++) {
    const r = await fetch(`${BASE}/history/${id}`);
    const h = await r.json();
    if (h[id]) {
      const st = h[id].status;
      if (!st.completed) throw new Error('not completed: ' + JSON.stringify(st));
      const imgs = Object.values(h[id].outputs || {}).flatMap((o) => o.images || []);
      if (!imgs.length) throw new Error('no image');
      return imgs[0];
    }
    await new Promise((res) => setTimeout(res, 2500));
  }
  throw new Error('timeout');
}

for (const item of ITEMS) {
  const id = await submit(graph(item.prompt));
  const img = await wait(id);
  const url = `${BASE}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder || '')}&type=${img.type}`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(`${OUT}/${item.id}.png`, buf);
  console.log(item.id, img.filename, buf.length);
}
