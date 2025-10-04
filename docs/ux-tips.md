8 — Quick tips for UX in Trae

Preview toggles: Desktop / Mobile / LowPerf
- Provide a toggle group in the Studio toolbar: `Desktop | Mobile | LowPerf`.
- When toggled, update ScenePlayer mode and load the correct variant:
  - `Desktop` → load primary scene: use `viewport.desktopVariant` and base `objects`.
  - `Mobile` → load mobile variant: use `viewport.mobileVariant` and `variants.mobileLowPerf` if defined; otherwise adapt camera and density.
  - `LowPerf` → load simplified variant: map to `performance.fallback` and `variants.mobileLowPerf` or `simplified` object substitutions (e.g., posters).
- Persist the selected preview mode in session state so re-renders stay consistent.

Missing asset warnings + auto placeholder
- On scene load, validate `assets[*].src` against asset store.
- If missing, show a non-blocking inline banner listing missing `asset://` IDs.
- Offer an “Auto-generate placeholders” button:
  - Replace missing entries with `asset://generated/<desc>` and add `generationHints`.
  - Insert `ui.fallbacks` entries for affected objects (e.g., `poster` or `domText`).
  - Log a diagnostics panel entry with what changed.
- Provide one-click “Replace” per missing asset row to select/upload a new file.

Export scene JSON → regenerate code (one-click)
- Add a primary CTA: “Export & Regenerate Code”.
- Action pipeline:
  1) Save current Scene JSON as `scene_v1.json`.
  2) Call code generator with Step E prompt from `docs/runbook.md`, attaching current Scene JSON.
  3) Show progress status (queued → generating → validating build).
  4) On success, present options:
     - `Preview locally` (open preview page).
     - `Download ZIP`.
     - `Push to GitHub`.
     - `Deploy to Vercel`.
- Include a short “previewInstructions” text block in the output for quick mounting.
- If build validation fails, surface logs and offer “Retry” and “Open diagnostics” with schema/asset validation re-run.

Keyboard & accessibility touches
- Ensure all toolbar buttons and menus are focusable (`tabIndex`), with visible focus ring.
- Add `ariaLabel` to interactive 3D objects; mirror interactions in `ui.overlays`.
- Provide a `prefers-reduced-motion` toggle in settings that halves animation speeds and disables autoplay carousels.

State & determinism
- Keep IDs stable when editing; never regenerate `objects[].id`.
- Track change history with undo/redo for JSON edits and property panel changes.
- Use temperature 0.0–0.15 for generation calls to keep outputs deterministic.