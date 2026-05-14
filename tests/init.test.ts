import { describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
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
    expect(readFileSync(join(target, '.osc/plans/README.md'), 'utf8')).toContain('Amendments');
    expect(readFileSync(join(target, '.osc/plans/README.md'), 'utf8')).not.toContain('amend.sh');
    expect(readFileSync(join(target, '.osc/plans/README.md'), 'utf8')).toContain('lightweight fallback');
    expect(readFileSync(join(target, '.osc/RULES.md'), 'utf8')).not.toContain('amend.sh');
    expect(readFileSync(join(target, '.osc/RULES.md'), 'utf8')).not.toContain('docs/WORKFLOW.md');
    expect(readFileSync(join(target, '.osc/RULES.md'), 'utf8')).toContain('.osc/plans/WORKFLOW.md');
    expect(readFileSync(join(target, '.osc/plans/handoff-template.md'), 'utf8')).not.toContain('amend.sh');
    expect(readFileSync(join(target, '.osc/plans/handoff-template.md'), 'utf8')).toContain('upgrade to the standard scaffold tier');
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

  it('refuses to write through symlinked target paths', () => {
    const target = tempTarget();
    const outside = tempTarget();
    mkdirSync(join(outside, '.osc'), { recursive: true });
    symlinkSync(join(outside, '.osc'), join(target, '.osc'));

    expect(() => initializeScaffold({ tier: 'min', target })).toThrow(/Refusing to write through symlinked path: \.osc/);
    expect(existsSync(join(target, 'MISSION.md'))).toBe(false);
    expect(existsSync(join(outside, '.osc/RULES.md'))).toBe(false);
  });

  it('refuses symlinked target ancestors before creating directories', () => {
    const parent = tempTarget();
    const outside = tempTarget();
    const link = join(parent, 'link');
    symlinkSync(outside, link);

    expect(() => initializeScaffold({ tier: 'min', target: join(link, 'project') })).toThrow(/Refusing to write through symlinked path:/);
    expect(existsSync(join(outside, 'project'))).toBe(false);
  });

  it('refuses to overwrite symlinked files even with force', () => {
    const target = tempTarget();
    const outside = tempTarget();
    writeFileSync(join(outside, 'README.md'), 'outside');
    symlinkSync(join(outside, 'README.md'), join(target, 'README.md'));

    expect(() => initializeScaffold({ tier: 'standard', target, force: true })).toThrow(/Refusing to write through symlinked path: README\.md/);
    expect(readFileSync(join(outside, 'README.md'), 'utf8')).toBe('outside');
  });
});
