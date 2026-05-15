import { describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, normalize, resolve } from 'node:path';
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
  it('consumes a run packet and writes a documented dispatch receipt without launching a runtime', () => {
    const { root, path } = tempRunPacket();
    const receiptPath = join(root, '.osc/runs/demo/dispatch-receipt.json');

    const output = execFileSync('node', [adapter, path, '--out', receiptPath], { encoding: 'utf8' });
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));

    expect(output).toContain('Fake/local adapter conformance complete');
    expect(receipt).toMatchObject({
      schema_version: 'open-scaffold.dispatch-receipt.v1',
      run_id: 'demo-run',
      task_id: 'task:demo',
      adapter_id: 'fake-local',
      runtime_backend: 'none',
      invoked_by: 'fake-local-adapter',
      invoked_at: '1970-01-01T00:00:00.000Z',
      working_directory: root,
      worktree_path: root,
      branch: 'main',
      prompt_or_package_path: null,
      spawned: false,
      spawn_command_redacted: null,
      runtime_handle: null,
      logs: [],
      artifacts: ['.osc/runs/demo/evidence.md'],
      status: 'dry_run',
      failure: { code: null, message: null },
      fixture: { kind: 'conformance-fixture', lane: 'plain-agent', evidence_path: '.osc/runs/demo/evidence.md' },
    });
    expect(typeof receipt.receipt_id).toBe('string');
    expect(normalize(receipt.run_packet_path)).toBe(normalize('.osc/runs/demo/run.json'));
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

  it('allows evidence files directly under the repository root', () => {
    const { root, path } = tempRunPacket({ artifacts: { evidence: ['evidence.md'] } });
    const receiptPath = join(root, '.osc/runs/demo/dispatch-receipt.json');

    execFileSync('node', [adapter, path, '--out', receiptPath], { encoding: 'utf8' });
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));

    expect(receipt.artifacts).toEqual(['evidence.md']);
    expect(existsSync(join(root, 'evidence.md'))).toBe(true);
  });

  it('refuses evidence paths that escape the repository root through symlinked directories', () => {
    const { root, path } = tempRunPacket({ artifacts: { evidence: ['.osc/runs/link/evidence.md'] } });
    const outside = mkdtempSync(join(tmpdir(), 'osc-conformance-outside-'));
    symlinkSync(outside, join(root, '.osc/runs/link'), 'dir');

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('artifact path must stay under runtime.repoPath');
    }
    expect(existsSync(join(outside, 'evidence.md'))).toBe(false);
  });

  it('does not create nested directories through a symlinked artifact parent', () => {
    const { root, path } = tempRunPacket({ artifacts: { evidence: ['.osc/runs/link/nested/evidence.md'] } });
    const outside = mkdtempSync(join(tmpdir(), 'osc-conformance-outside-'));
    symlinkSync(outside, join(root, '.osc/runs/link'), 'dir');

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('artifact path must stay under runtime.repoPath');
    }
    expect(existsSync(join(outside, 'nested'))).toBe(false);
  });

  it('refuses evidence paths that escape the repository root through symlinked files', () => {
    const { root, path } = tempRunPacket({ artifacts: { evidence: ['.osc/runs/demo/evidence.md'] } });
    const outside = mkdtempSync(join(tmpdir(), 'osc-conformance-outside-'));
    const outsideEvidence = join(outside, 'evidence.md');
    writeFileSync(outsideEvidence, 'do not overwrite');
    symlinkSync(outsideEvidence, join(root, '.osc/runs/demo/evidence.md'), 'file');

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('artifact path must stay under runtime.repoPath');
    }
    expect(readFileSync(outsideEvidence, 'utf8')).toBe('do not overwrite');
  });

  it('refuses unsupported executor lanes', () => {
    const { path } = tempRunPacket({ executor: { lane: 'weird-lane', harnessSkill: null, spawning: false } });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('unsupported executor.lane weird-lane');
    }
  });

  it('refuses runtime lanes that omit their required harness skill', () => {
    const { path } = tempRunPacket({ executor: { lane: 'omx-codex', harnessSkill: null, spawning: false } });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('executor.harnessSkill is required for lane omx-codex');
    }
  });

  it('refuses packets that omit the commit policy required by the receipt contract', () => {
    const { path } = tempRunPacket({ commitPolicy: undefined });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('commitPolicy must be a non-empty string');
    }
  });

  it('refuses run packets outside the declared repository path', () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'osc-conformance-repo-'));
    const runRoot = mkdtempSync(join(tmpdir(), 'osc-conformance-run-'));
    mkdirSync(join(runRoot, '.osc/runs/demo'), { recursive: true });
    const manifest = {
      schemaVersion: 'open-scaffold.run.v1',
      runId: 'demo-run',
      taskId: 'task:demo',
      plan: { path: '.osc/plans/active/001-demo.md', goal: 'Prove adapter conformance.' },
      packageQuality: { executable: true, blockers: [] },
      executor: { lane: 'plain-agent', harnessSkill: null, spawning: false },
      runtime: { repoPath: repoRoot, worktreePath: repoRoot, branch: 'main' },
      artifacts: { evidence: ['.osc/runs/demo/evidence.md'] },
      commitPolicy: 'adapter fixture may write receipt only; no commit/push',
    };
    const path = join(runRoot, '.osc/runs/demo/run.json');
    writeFileSync(path, JSON.stringify(manifest, null, 2));

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('run packet path must stay under runtime.repoPath');
    }
  });

  it('refuses packets that still contain blocking open questions', () => {
    const { path } = tempRunPacket({
      plan: {
        path: '.osc/plans/active/001-demo.md',
        goal: 'Prove adapter conformance.',
        openQuestions: ['BLOCKING: pick an execution lane first'],
      },
    });

    try {
      execFileSync('node', [adapter, path], { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected fake adapter to fail');
    } catch (error: any) {
      expect(error.status).toBe(1);
      expect(String(error.stderr ?? '')).toContain('plan.openQuestions must not contain blocking questions before dispatch');
    }
  });
});
