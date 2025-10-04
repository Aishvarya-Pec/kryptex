3 — Step-by-step runbook (what your app does, and exact prompts for each action)

Step A — User describes idea + attaches assets

UI action: Show user the User Prompt Template as a form. Allow drag-drop for assets. When user uploads, assign asset://<project>_<slug>, return asset metadata (size, mime) and display.

Why: structured inputs + asset IDs make conversion deterministic.

Validation: ensure asset IDs and types are listed in the user's prompt.


Step B — Generate Scene Graph JSON (call LLM with system + user prompt)

Exactly: call the LLM with the System Prompt (from #1) and the filled User Prompt (from #2).

LLM settings: temperature 0.0–0.15, max_tokens high enough (~1200–3000 depending on complexity).

What to expect: a single JSON object conforming to the schema.

Validation: run JSON Schema validator. If invalid, use this follow-up prompt:

"Validate last JSON output. If invalid, return only { \"error\": { \"message\": \"schema mismatch\", \"expected\": \"<field>\", \"fix\": \"<patch suggestion>\" } }"

If successful: save Scene JSON to project store as scene_v1.json.


Step C — Preview in Studio (canvas)

Action: load scene_v1.json into ScenePlayer (R3F component).

Goal: show live 3D preview with camera controls and an editable right-panel bound to the JSON.

If assets missing: automatically replace with placeholders and show a visual warning listing missing asset:// IDs and a one-click “Replace” action.


Step D — User tweaks (natural language / property edits)

Allow two modes:

1. Properties panel — WYSIWYG edits update Scene JSON.

2. Natural language edits — User types e.g., “Make hero text larger, slow float, change theme to 'warm sunset' and reduce motion.” Send this follow-up prompt to the LLM:

"Edit the following Scene JSON to apply: <user instruction>. Return ONLY the updated JSON. Keep IDs stable. If an object can't be found, add it."

Validate new JSON and apply.


Step E — Generate runnable code (Scene JSON → Next.js + R3F)

Prompt to code generator LLM / local transformer:

"Take this Scene JSON (attached). Generate a Next.js 14 TypeScript project scaffold that exports components/ScenePlayer.tsx and pages/preview which imports Scene JSON and mounts the scene. Include package.json with react-three-fiber, @react-three/drei, drei loaders, zustand, and scripts. Use dynamic imports for glTF assets referenced by asset.src. Return the file map as a JSON object: { 'path': 'file contents' }. No extra commentary."

Validate: package builds (npm run build) in CI or locally.


Step F — Export & Deploy

Options:

ZIP: bundle project files and assets.

Push to GitHub: generate repo, commit pseudo-files, create PR.

1-click Vercel: generate vercel.json and instructions.

Prompt:

"Package the generated project for export. Create a README with deployment steps and preview link instructions. Also include 'performance.md' with LOD and optimization suggestions for the assets used."