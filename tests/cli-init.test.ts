import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const tsx = join(repoRoot, 'node_modules/.bin/tsx');
const cli = join(repoRoot, 'src/cli.ts');

function tempTarget() {
  return mkdtempSync(join(tmpdir(), 'osc-cli-init-'));
}

describe('osc init CLI', () => {
  it('creates the requested tier in the target directory and prints a summary', () => {
    const target = tempTarget();

    const output = execFileSync(tsx, [cli, 'init', '--tier', 'min', '--target', target], { encoding: 'utf8' });

    expect(output).toContain('Generated min Open Scaffold');
    expect(output).toContain('Next: edit MISSION.md');
    expect(existsSync(join(target, 'MISSION.md'))).toBe(true);
    expect(existsSync(join(target, '.osc/plans/active/.gitkeep'))).toBe(true);
  });

  it('supports clean tier aliases', () => {
    const target = tempTarget();

    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });

    expect(existsSync(join(target, 'README.md'))).toBe(true);
    expect(existsSync(join(target, 'docs/SLICE_CLOSE_PROTOCOL.md'))).toBe(true);
  });

  it('exits non-zero rather than overwriting an existing file', () => {
    const target = tempTarget();
    writeFileSync(join(target, 'MISSION.md'), 'keep me');

    expect(() => execFileSync(tsx, [cli, 'init', '--tier', 'min', '--target', target], { encoding: 'utf8', stdio: 'pipe' })).toThrow(/Refusing to overwrite/);
  });
});
