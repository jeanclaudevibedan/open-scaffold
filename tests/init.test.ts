import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { initializeScaffold, tierFiles } from '../src/init.js';

function tempTarget() {
  return mkdtempSync(join(tmpdir(), 'osc-init-'));
}

describe('tiered scaffold initialization', () => {
  it('generates the minimum viable scaffold file set', () => {
    const target = tempTarget();

    const result = initializeScaffold({ tier: 'min', target });

    expect(result.tier).toBe('min');
    expect(result.filesCreated.sort()).toEqual([...tierFiles.min].sort());
    expect(readFileSync(join(target, 'MISSION.md'), 'utf8')).toContain('<!-- mission:unset -->');
    expect(readFileSync(join(target, '.osc/plans/WORKFLOW.md'), 'utf8')).toContain('Plan Workflow');
    expect(readFileSync(join(target, 'verify.sh'), 'utf8')).toContain('open-scaffold compliance checker');
    expect(result.summary).toContain('Generated min Open Scaffold');
    expect(result.summary).toContain('Next: edit MISSION.md');
  });

  it('generates the standard scaffold as a superset of min', () => {
    const target = tempTarget();

    const result = initializeScaffold({ tier: 'standard', target });

    expect(result.filesCreated.sort()).toEqual([...tierFiles.standard].sort());
    for (const file of tierFiles.min) expect(result.filesCreated).toContain(file);
    expect(readFileSync(join(target, 'README.md'), 'utf8')).toContain('Open Scaffold');
    expect(readFileSync(join(target, 'docs/MINIMUM_VIABLE_SCAFFOLD.md'), 'utf8')).toContain('minimum viable scaffold');
  });

  it('generates the max scaffold as a superset of standard', () => {
    const target = tempTarget();

    const result = initializeScaffold({ tier: 'max', target });

    expect(result.filesCreated.sort()).toEqual([...tierFiles.max].sort());
    for (const file of tierFiles.standard) expect(result.filesCreated).toContain(file);
    expect(readFileSync(join(target, 'docs/OPEN_SCAFFOLD_SYSTEM.md'), 'utf8')).toContain('Open Scaffold');
    expect(readFileSync(join(target, '.osc/runs/.gitkeep'), 'utf8')).toBe('');
  });

  it('refuses to overwrite existing files by default', () => {
    const target = tempTarget();
    writeFileSync(join(target, 'MISSION.md'), 'keep me');

    expect(() => initializeScaffold({ tier: 'min', target })).toThrow(/Refusing to overwrite existing files: MISSION\.md/);
    expect(readFileSync(join(target, 'MISSION.md'), 'utf8')).toBe('keep me');
  });
});
