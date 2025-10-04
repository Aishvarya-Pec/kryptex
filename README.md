# KRPtex — 3D Website Maker

KRPtex is a 3D website authoring tool that generates interactive landing pages from natural language prompts and assets. It outputs a structured Scene Graph JSON that can be exported to modern web frameworks (e.g., Next.js + React Three Fiber).

## Project Structure
- `prompts/scene-generator.md`: System prompt for the Scene Generator, including two JSON few-shot examples following the schema.

## Usage (initial)
- Use the system prompt in `prompts/scene-generator.md` to guide an LLM that converts user descriptions and assets into a Scene Graph JSON.
- Future steps will include the runtime that renders the scene graph with Three.js/R3F and exports to production.

## Next Steps
- Implement the Scene Graph renderer (R3F/Three.js).
- Add asset optimizer and LOD generation pipeline.
- Build UI for prompt input and interactive editing.