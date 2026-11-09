import fs from 'node:fs';
const BASE = 'http://172.16.0.63:8189';
const OUT = 'C:/Users/asus/AppData/Local/Temp/opencode/spots';
const STYLE = 'Flat vector spot illustration, soft pastel palette, clean minimal geometric shapes, subtle soft shading, white background, one centered subject, generous empty margin, no text, no letters, no border, no frame, no shadow box.';
const ITEMS = [
  ['book', 'A closed book with a bookmark and a small open book behind it, symbolizing professional knowledge. Pastel blue and violet.'],
  ['puzzle', 'Two jigsaw puzzle pieces fitting together, symbolizing breaking a task into parts. Pastel blue and green.'],
  ['alert', 'A rounded warning triangle with an exclamation mark, symbolizing risk. Pastel amber and soft red.'],
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
const submit = async (spec) => {
  const r = await fetch(`${BASE}/prompt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(spec) });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).prompt_id;
};
const wait = async (id) => {
  for (let i = 0; i < 150; i++) {
    const h = await (await fetch(`${BASE}/history/${id}`)).json();
    if (h[id]) {
      const imgs = Object.values(h[id].outputs || {}).flatMap((o) => o.images || []);
      if (imgs.length) return imgs[0];
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error('timeout');
};
for (const [id, body] of ITEMS) {
  const pid = await submit(graph(`${STYLE} ${body}`, id));
  const img = await wait(pid);
  const url = `${BASE}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder || '')}&type=${img.type}`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(`${OUT}/${id}.png`, buf);
  console.log('ok', id, buf.length);
}
