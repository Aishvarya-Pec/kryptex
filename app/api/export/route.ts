import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { validateSceneJSON } from '@/src/lib/schema-validator';
import { generateFromScene } from '@/src/lib/generateFromScene';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scene } = body ?? {};
    if (!scene) {
      return new Response(JSON.stringify({ error: { message: 'Missing scene' } }), { status: 400 });
    }
    const valid = validateSceneJSON(scene);
    if (!valid.valid) {
      return new Response(JSON.stringify({ error: { message: 'schema mismatch', diagnostics: valid.errors } }), { status: 422 });
    }

    const { files } = generateFromScene(scene);
    const cwd = process.cwd();
    for (const [rel, content] of Object.entries(files)) {
      const filePath = path.join(cwd, rel);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
    }
    return new Response(JSON.stringify({ ok: true, files: Object.keys(files) }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: { message: String(err?.message ?? err) } }), { status: 500 });
  }
}