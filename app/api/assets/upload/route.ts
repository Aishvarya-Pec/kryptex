import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const relativeUploadDir = '/uploads';
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, file.name), buffer);
    const fileUrl = join(relativeUploadDir, file.name).replace(/\\/g, '/');
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) });
  }
}