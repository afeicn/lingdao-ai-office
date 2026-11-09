import fs from 'node:fs';

const BASE = 'http://172.16.0.63:8189';
const OUT = 'C:/Users/asus/AppData/Local/Temp/opencode/spots';
fs.mkdirSync(OUT, { recursive: true });

const STYLE = 'Flat vector spot illustration, soft pastel palette, clean minimal geometric shapes, subtle soft shading, white background, one centered subject, generous empty margin, no text, no letters, no border, no frame, no shadow box.';

const ITEMS = [
  ['target', 'A target board with an arrow hitting the bullseye, symbolizing clear goals. Pastel blue and violet.'],
  ['route',  'A folded map with a dashed winding path and two location pins, symbolizing a clear process. Pastel blue and green.'],
  ['db',     'A stack of three database cylinders, symbolizing available data. Pastel blue and mint.'],
  ['shield', 'A shield with a check mark in the middle, symbolizing governance and accountability. Pastel blue and green.'],
  ['people', 'Three simple people figures standing side by side, symbolizing a capable team. Pastel blue and warm gray.'],
  ['check',  'A large circle with a check mark inside and a few small sparkles, symbolizing success. Pastel green and blue.'],
  ['loop',   'Two circular arrows forming a continuous loop, symbolizing continuous improvement. Pastel blue and teal.'],
  ['robot',  'A friendly small robot head with a rounded antenna, symbolizing an AI assistant. Pastel blue and violet.'],
  ['doc',    'A document sheet with text lines and a folded corner, symbolizing a deliverable. Pastel blue and warm gray.'],
  ['search', 'A magnifying glass over a small document, symbolizing review and verification. Pastel blue and amber.'],
  ['chip',   'A computer chip with a small brain outline on top, symbolizing a large model. Pastel violet and blue.'],
  ['tools',  'A wrench and a screwdriver crossed together, symbolizing tools. Pastel blue and amber.'],
  ['camera', 'A simple camera with a round lens, symbolizing sensors and perception. Pastel blue and mint.'],
  ['chat',   'Two overlapping speech bubbles, symbolizing communication. Pastel blue and pink.'],
];

const graph = (text, prefix) => ({
  prompt: {
    1: { class_type: 'UnetLoaderGGUF', inputs: { unet_name: 'qwen-image-2.1-Q4_K_M.gguf' } },
    2: { class_type: 'ModelSamplingAuraFlow', inputs: { model: ['1', 0], shift: 3.1 } },
    3: { class_type: 'CLIPLoader', inputs: { clip_name: 'qwen3vl_8b_int8_convrot.safetensors', type: 'qwen_image' } },
    4: { class_type: 'CLIPTextEncode', inputs: { clip: ['3', 0], text } },
    5: { class_type: 'CLIPTextEncode', inputs: { clip: ['3', 0], text: '' } },
    6: { class_type: 'EmptyLatentImage', inputs: { width: 704, height: 704, batch_size: 1 } },
    7: { class_type: 'KSampler', inputs: { model: ['2', 0], seed: 11, steps: 20, cfg: 1.0, sampler_name: 'euler', scheduler: 'simple', positive: ['4', 0], negative: ['5', 0], latent_image: ['6', 0], denoise: 1.0 } },
    8: { class_type: 'VAELoader', inputs: { vae_name: 'qwen_image_2.1_vae_bf16.safetensors' } },
    9: { class_type: 'VAEDecode', inputs: { samples: ['7', 0], vae: ['8', 0] } },
    10: { class_type: 'SaveImage', inputs: { images: ['9', 0], filename_prefix: `lib/${prefix}` } },
  },
  client_id: 'lib',
});

async function submit(spec) {
  const r = await fetch(`${BASE}/prompt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(spec) });
  if (!r.ok) throw new Error('submit ' + r.status + ' ' + (await r.text()));
  return (await r.json()).prompt_id;
}
async function wait(id) {
  for (let i = 0; i < 150; i++) {
    const h = await (await fetch(`${BASE}/history/${id}`)).json();
    if (h[id]) {
      const imgs = Object.values(h[id].outputs || {}).flatMap((o) => o.images || []);
      if (imgs.length) return imgs[0];
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error('timeout ' + id);
}

for (const [id, body] of ITEMS) {
  if (fs.existsSync(`${OUT}/${id}.png`)) { console.log('skip', id); continue; }
  const pid = await submit(graph(`${STYLE} ${body}`, id));
  const img = await wait(pid);
  const url = `${BASE}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder || '')}&type=${img.type}`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(`${OUT}/${id}.png`, buf);
  console.log('ok', id, buf.length);
}
