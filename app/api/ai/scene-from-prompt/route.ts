import { NextRequest } from 'next/server';
import { validateSceneJSON } from '@/src/lib/schema-validator';

const systemPrompt = `You are an AI Scene Generator. Output ONLY valid JSON matching the Scene Graph schema: { metadata{version,author}, camera{type,position{x,y,z},fov,controls?}, objects[] }. objects entries: { id, type(mesh|text|model|light|particle|group), transform{position,rotation,scale}, material{preset|color|roughness|metalness}, animation{preset|params}, interaction{onClick{action,payload}}, responsive{mobileScale}, children[] }. No extra commentary.`;

function localGenerate(prompt: string) {
  // Very basic deterministic stub to allow tests without an API key
  if (prompt.toLowerCase().includes('portfolio')) {
    return {
      metadata: { version: '1.0.0', author: 'user' },
      camera: { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 },
      objects: [
        { id: 'obj_heroText_01', type: 'text', transform: { position: { x: 0, y: 1.2, z: 0 } }, material: { color: '#ffffff' } },
        { id: 'obj_cube_01', type: 'mesh', transform: { position: { x: -1.5, y: -0.2, z: 0 } }, material: { color: '#9f5cff' } }
      ]
    };
  }
  // product landing default
  return {
    metadata: { version: '1.0.0', author: 'user' },
    camera: { type: 'orbit', position: { x: 0, y: 1.2, z: 7 }, fov: 48 },
    objects: [
      { id: 'obj_product_01', type: 'model', transform: { position: { x: 0, y: 0.4, z: 0 } }, material: { color: '#ffffff' }, interaction: { onClick: { action: 'openModal', payload: { modalId: 'buy' } } } }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body ?? {};
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: { message: 'Missing prompt', diagnostics: ['Provide { prompt: string }'] } }), { status: 400 });
    }

    // TODO: Plug real LLM via env config; for now use deterministic stub
    const json = localGenerate(prompt);
    const result = validateSceneJSON(json);
    if (!result.valid) {
      return new Response(
        JSON.stringify({ error: { message: 'schema mismatch', diagnostics: result.errors } }),
        { status: 422 }
      );
    }
    return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: { message: 'internal error', diagnostics: [String(err?.message ?? err)] } }), { status: 500 });
  }
}