import { describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const adapter = resolve('docs/examples/runtime-binding-conformance/fake-local-adapter.mjs');

function tempRunPacket(overrides: Record<string, unknown> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'osc-conformance-'));
  mkdirSync(join(root, '.osc/runs/demo'), { recursive: true });
  const manifest = {
    schemaVersion: 'open-scaffold.run.v1',
    runId: 'demo-run',
    taskId: 'task:demo',
    plan: { path: '.osc/plans/active/001-demo.md', goal: 'Prove adapter conformance.' },
    packageQuality: { executable: true, blockers: [] },
    executor: { lane: 'plain-agent', harnessSkill: null, spawning: false },
    runtime: { repoPath: root, worktreePath: root, branch: 'main' },
    bindings: { operatorSurface: 'cli' },
    artifacts: { evidence: ['.osc/runs/demo/evidence.md'] },
    commitPolicy: 'adapter fixture may write receipt only; no commit/push',
    ...overrides,
  };
  const path = join(root, '.osc/runs/demo/run.json');
  writeFileSync(path, JSON.stringify(manifest, null, 2));
  return { root, path };
}

describe('fake/local adapter conformance fixture', () => {
  it('consumes a run packet and writes a deterministic dispatch receipt without launching a runtime', () => {
    const { root, path } = tempRunPacket();
    const receiptPath = join(root, '.osc/runs/demo/dispatch-receipt.json');

    const output = execFileSync('node', [adapter, path, '--out', receiptPath], { encoding: 'utf8' });
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));

    expect(output).toContain('Fake/local adapter conformance complete');
    expect(receipt).toMatchObject({
      schemaVersion: 'open-scaffold.dispatch-receipt.v1',
      adapter: { id: 'fake-local', kind: 'conformance-fixture' },
      run: { runId: 'demo-run', taskId: 'task:demo', lane: 'plain-agent' },
      boundary: { coreSpawnedRuntime: false, networkRequired: false, credentialsRequired: false },
      result: { status: 'completed', evidencePath: '.osc/runs/demo/evidence.md' },
    });
    expect(typeof receipt.receiptId).toBe('string');
    expect(existsSync(join(root, '.osc/runs/demo/evidence.md'))).toBe(true);
  });

  it('refuses packets that ask Open Scaffold core to spawn a runtime', () => {
    const { path } = tempRunPacket({ executor: { lane: 'plain-agent', harnessSkill: null, spawning: true } });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('executor.spawning must be false');
    }
  });

  it('refuses evidence paths that escape the repository root', () => {
    const { path } = tempRunPacket({ artifacts: { evidence: ['../outside.md'] } });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('artifact path must stay under runtime.repoPath');
    }
  });
});
