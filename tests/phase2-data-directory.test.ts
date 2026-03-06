import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

describe('Phase 2.1 — Data directory structure', () => {
  const requiredDirs = [
    'data',
    'data/components',
    'data/components/shadcn',
    'data/components/aceternity',
    'data/components/magic-ui',
    'data/components/21st-dev',
    'data/templates',
    'data/patterns',
  ];

  for (const dir of requiredDirs) {
    it(`${dir}/ exists`, () => {
      expect(existsSync(join(ROOT, dir))).toBe(true);
    });
  }

  it('all component library subdirectories have .gitkeep', () => {
    const libs = ['shadcn', 'aceternity', 'magic-ui', '21st-dev'];
    for (const lib of libs) {
      expect(existsSync(join(ROOT, 'data/components', lib, '.gitkeep'))).toBe(true);
    }
  });

  it('templates directory has .gitkeep', () => {
    expect(existsSync(join(ROOT, 'data/templates/.gitkeep'))).toBe(true);
  });

  it('patterns directory has .gitkeep', () => {
    expect(existsSync(join(ROOT, 'data/patterns/.gitkeep'))).toBe(true);
  });
});
