import { NextRequest } from 'next/server';

const REFINE_SYSTEM_PROMPT = `You are an AI assistant that edits a Scene Graph JSON. You will be given a JSON object representing a 3D scene and a user instruction. Your task is to modify the JSON to reflect the user's instruction and return ONLY the updated, valid JSON object. Do not change any object 'id' fields.`;

export async function POST(req: NextRequest) {
  try {
    const { scene, prompt } = await req.json();

    if (!scene || !prompt) {
      return new Response(JSON.stringify({ error: 'Missing scene or prompt' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3.1:free',
        messages: [
          { role: 'system', content: REFINE_SYSTEM_PROMPT },
          { role: 'user', content: `Here is the current scene JSON:\n\n${JSON.stringify(scene, null, 2)}\n\nNow, apply this instruction: "${prompt}"` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API failed with status: ${response.status}`);
    }

    const data = await response.json();
    const refinedJson = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(refinedJson), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}