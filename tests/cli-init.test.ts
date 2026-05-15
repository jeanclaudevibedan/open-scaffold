import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const tsx = join(repoRoot, 'node_modules/.bin/tsx');
const cli = join(repoRoot, 'src/cli.ts');

function tempTarget() {
  return mkdtempSync(join(tmpdir(), 'osc-cli-init-'));
}

function writeRuntimeSelectionPlan(target: string, goal = 'Demo runtime selection.') {
  const planPath = join(target, '.osc/plans/active/001-demo.md');
  writeFileSync(planPath, `# Plan: 001-demo

## Status

active

## Context

Demo.

## Goal

${goal}

## Constraints / Out of scope

- Do not spawn.

## Files to touch

- README.md

## Acceptance criteria

- [ ] Packet records runtime selection.

## Verification steps

1. Inspect run packet.

## Open questions

None.
`);
  return planPath;
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

  it('reports invalid tier values as argument errors without a stack trace', () => {
    const target = tempTarget();

    const result = spawnSync(tsx, [cli, 'init', '--tier', 'foo', '--target', target], { encoding: 'utf8' });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Invalid value for --tier: foo');
    expect(result.stderr).not.toContain('Error: Invalid tier');
    expect(result.stderr).not.toContain('at parseTier');
  });

  it('keeps min-tier bootstrap output pointed at an existing workflow guide', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--tier', 'min', '--target', target], { encoding: 'utf8' });

    const output = execFileSync(join(target, 'bootstrap.sh'), { cwd: target, encoding: 'utf8' });

    expect(existsSync(join(target, 'docs/WORKFLOW.md'))).toBe(false);
    expect(output).toContain(join(target, '.osc/plans/WORKFLOW.md'));
    expect(output).not.toContain(join(target, 'docs/WORKFLOW.md'));
  });

  it('maps runtime and workflow presets into a run packet without spawning', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target);

    execFileSync(tsx, [cli, 'run', planPath, '--runtime', 'omx', '--workflow', 'plan', '--repo', target], { cwd: target, encoding: 'utf8' });
    const runsDir = join(target, '.osc/runs');
    const runId = readdirSync(runsDir).sort().at(-1);
    expect(runId).toBeTruthy();
    const manifest = JSON.parse(readFileSync(join(runsDir, runId!, 'run.json'), 'utf8'));

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'omx', workflow: 'plan' });
    expect(manifest.executor).toMatchObject({ lane: 'omx-codex', harnessSkill: '$ralplan', spawning: false });
  }, 15_000);


  it('defaults OMC/OMX runtime presets to plan workflow so packets are dispatchable', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo runtime default workflow.');

    execFileSync(tsx, [cli, 'run', planPath, '--runtime', 'omx', '--repo', target], { cwd: target, encoding: 'utf8' });
    const runsDir = join(target, '.osc/runs');
    const runId = readdirSync(runsDir).sort().at(-1);
    expect(runId).toBeTruthy();
    const manifest = JSON.parse(readFileSync(join(runsDir, runId!, 'run.json'), 'utf8'));

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'omx', workflow: 'plan' });
    expect(manifest.executor).toMatchObject({ lane: 'omx-codex', harnessSkill: '$ralplan', spawning: false });
  }, 15_000);


  it('rejects mismatched workflow and harness skill for runtime presets', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo runtime mismatch rejection.');

    const result = spawnSync(tsx, [cli, 'run', planPath, '--runtime', 'omx', '--workflow', 'plan', '--harness-skill', '$team', '--repo', target], {
      cwd: target,
      encoding: 'utf8',
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('--runtime omx with --workflow plan requires --harness-skill $ralplan');
  }, 15_000);

});
