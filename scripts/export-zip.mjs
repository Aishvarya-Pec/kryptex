import fs from 'node:fs';
import path from 'node:path';

// Minimal stub: create a timestamped copy of example scenes as an export artifact
const outDir = path.join(process.cwd(), 'export');
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dest = path.join(outDir, `scene-export-${stamp}`);
fs.mkdirSync(dest, { recursive: true });

// Copy example scenes
for (const f of ['floating-text.json', 'rotating-cube.json', 'product-model.json']) {
  fs.copyFileSync(path.join(process.cwd(), 'example-scenes', f), path.join(dest, f));
}

console.log('Exported scenes to', dest);