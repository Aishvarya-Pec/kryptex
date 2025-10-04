import { NextRequest } from 'next/server';
import { validateSceneJSON } from '@/src/lib/schema-validator';
import fs from 'fs/promises';
import path from 'path';

async function getSystemPrompt() {
  const filePath = path.join(process.cwd(), 'prompts', 'scene-generator.md');
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading system prompt:', error);
    return 'You are an AI Scene Generator. Output ONLY valid JSON matching the Scene Graph schema.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body ?? {};
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: { message: 'Missing prompt' } }), { status: 400 });
    }

    const systemPrompt = await getSystemPrompt();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3.1:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: { message: 'Failed to fetch from OpenRouter', diagnostics: [errorText] } }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const jsonContent = JSON.parse(data.choices[0].message.content);

    const result = validateSceneJSON(jsonContent);
    if (!result.valid) {
      return new Response(
        JSON.stringify({ error: { message: 'Schema mismatch from generated JSON', diagnostics: result.errors } }),
        { status: 422 }
      );
    }

    return new Response(JSON.stringify(jsonContent), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error', diagnostics: [String(err?.message ?? err)] } }),
      { status: 500 }
    );
  }
}