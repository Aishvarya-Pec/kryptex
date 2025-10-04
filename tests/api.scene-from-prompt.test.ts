import { describe, it, expect } from 'vitest';
import { validateSceneJSON } from '@/src/lib/schema-validator';

// Simulate localGenerate via importing route? Export a helper function in a separate module would be ideal.
// For now, validate example scenes shipped in repo.
import floating from '@/example-scenes/floating-text.json';
import cube from '@/example-scenes/rotating-cube.json';
import product from '@/example-scenes/product-model.json';

describe('Scene JSON examples validate', () => {
  it('floating text should validate', () => {
    const res = validateSceneJSON(floating);
    expect(res.valid).toBe(true);
  });
  it('rotating cube should validate', () => {
    const res = validateSceneJSON(cube);
    expect(res.valid).toBe(true);
  });
  it('product model should validate', () => {
    const res = validateSceneJSON(product);
    expect(res.valid).toBe(true);
  });
});