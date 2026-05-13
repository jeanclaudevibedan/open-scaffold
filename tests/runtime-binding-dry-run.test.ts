import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const script = resolve('docs/examples/runtime-binding-dry-run.mjs');

function tempManifest(overrides: Record<string, unknown> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'osc-dry-run-'));
  mkdirSync(join(root, '.osc/runs/demo'), { recursive: true });
  const manifest = {
    schemaVersion: 'open-scaffold.run.v1',
    runId: 'demo-run',
    taskId: 'task:demo',
    plan: { path: '.osc/plans/active/001-demo.md', goal: 'Demo dry-run.' },
    packageQuality: { executable: true, blockers: [] },
    executor: { lane: 'plain-agent', harnessSkill: null, spawning: false },
    runtime: { repoPath: root, worktreePath: root, branch: 'main' },
    bindings: { operatorSurface: 'cli' },
    commitPolicy: 'dry-run only; no launch',
    ...overrides,
  };
  const path = join(root, '.osc/runs/demo/run.json');
  writeFileSync(path, JSON.stringify(manifest, null, 2));
  return path;
}

describe('runtime binding dry-run example', () => {
  it('prints a handoff summary without launching a runtime for an executable package', () => {
    const output = execFileSync('node', [script, tempManifest()], { encoding: 'utf8' });

    expect(output).toContain('Open Scaffold runtime binding dry-run');
    expect(output).toContain('Run ID: demo-run');
    expect(output).toContain('Executor lane: plain-agent');
    expect(output).toContain('No runtime was launched');
  });

  it('normalizes the documented manual lane to the human lane', () => {
    const output = execFileSync('node', [script, tempManifest({ executor: { lane: 'manual', harnessSkill: null, spawning: false } })], {
      encoding: 'utf8',
    });

    expect(output).toContain('Executor lane: human');
    expect(output).toContain('No runtime was launched');
  });

  it('refuses packages with blockers before dispatch', () => {
    const manifestPath = tempManifest({ packageQuality: { executable: true, blockers: ['missing verification steps'] } });

    try {
      execFileSync('node', [script, manifestPath], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected dry-run script to fail');
    } catch (error: any) {
      const stderr = String(error.stderr ?? '');
      expect(error.status).toBe(1);
      expect(stderr).toContain('packageQuality.blockers must be empty');
    }
  });

  it('refuses runtime-specific lanes without a harness skill', () => {
    const manifestPath = tempManifest({ executor: { lane: 'omx-codex', harnessSkill: null, spawning: false } });

    try {
      execFileSync('node', [script, manifestPath], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected dry-run script to fail');
    } catch (error: any) {
      const stderr = String(error.stderr ?? '');
      expect(error.status).toBe(1);
      expect(stderr).toContain('must record executor.harnessSkill');
    }
  });
});
