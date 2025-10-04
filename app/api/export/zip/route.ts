import { NextRequest } from 'next/server';
import { generateFromScene } from '@/src/lib/generateFromScene';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  try {
    const { scene } = await req.json();
    if (!scene) {
      return new Response(JSON.stringify({ error: 'Missing scene' }), { status: 400 });
    }

    const { files } = generateFromScene(scene);

    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="kryptex-export.zip"',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}