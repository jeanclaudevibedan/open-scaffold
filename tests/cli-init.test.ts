import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'omx', workflow: 'plan', profileId: 'omx', profileSource: 'builtin' });
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

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'omx', workflow: 'plan', profileId: 'omx', profileSource: 'builtin' });
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

  it('rejects unmapped workflows for runtime profiles unless harness skill is explicit', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo unmapped workflow rejection.');

    const result = spawnSync(tsx, [cli, 'run', planPath, '--runtime', 'omx', '--workflow', 'custom', '--repo', target], {
      cwd: target,
      encoding: 'utf8',
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('--runtime omx does not define workflow custom');

    execFileSync(tsx, [cli, 'run', planPath, '--runtime', 'omx', '--workflow', 'custom', '--harness-skill', '$custom', '--repo', target], { cwd: target, encoding: 'utf8' });
    const runsDir = join(target, '.osc/runs');
    const runId = readdirSync(runsDir).sort().at(-1);
    const manifest = JSON.parse(readFileSync(join(runsDir, runId!, 'run.json'), 'utf8'));
    expect(manifest.executor).toMatchObject({ lane: 'omx-codex', harnessSkill: '$custom', spawning: false });
  }, 15_000);

  it('lists and shows runtime profiles with source labels', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });

    const list = execFileSync(tsx, [cli, 'runtimes', 'list'], { cwd: target, encoding: 'utf8' });
    expect(list).toContain('omx\tbuiltin\tomx-codex\tadapter-candidate');

    const shown = JSON.parse(execFileSync(tsx, [cli, 'runtimes', 'show', 'omx'], { cwd: target, encoding: 'utf8' }));
    expect(shown).toMatchObject({ id: 'omx', source: 'builtin', lane: 'omx-codex' });
  }, 15_000);

  it('uses a project-local runtime profile in run packets', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo custom runtime profile.');
    mkdirSync(join(target, '.osc/runtimes'), { recursive: true });
    writeFileSync(join(target, '.osc/runtimes/review-bot.json'), JSON.stringify({
      schemaVersion: 'open-scaffold.runtime-profile.v1',
      id: 'review-bot',
      displayName: 'Review Bot',
      lane: 'plain-agent',
      status: 'user-defined',
      description: 'Project-local review bot profile.',
      workflows: { plan: 'review-bot plan' },
      defaults: { workflow: 'plan', harnessSkill: 'review-bot plan' },
      install: { humanHint: 'Install through the project developer portal.', auto: false },
      launch: { owner: 'external-adapter', commandTemplate: 'review-bot run <run.json>', spawning: false },
      evidence: { receiptSchema: 'open-scaffold.dispatch-receipt.v1' },
    }, null, 2));

    execFileSync(tsx, [cli, 'run', planPath, '--runtime', 'review-bot', '--repo', target], { cwd: target, encoding: 'utf8' });
    const runsDir = join(target, '.osc/runs');
    const runId = readdirSync(runsDir).sort().at(-1);
    const manifest = JSON.parse(readFileSync(join(runsDir, runId!, 'run.json'), 'utf8'));

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'review-bot', workflow: 'plan', profileId: 'review-bot', profileSource: 'project' });
    expect(manifest.executor).toMatchObject({ lane: 'plain-agent', harnessSkill: 'review-bot plan', spawning: false });
  }, 15_000);

  it('resolves project-local runtime profiles from --repo when launched outside that repo', () => {
    const target = tempTarget();
    const coordinator = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo external coordinator runtime profile resolution.');
    mkdirSync(join(target, '.osc/runtimes'), { recursive: true });
    writeFileSync(join(target, '.osc/runtimes/external-agent.json'), JSON.stringify({
      schemaVersion: 'open-scaffold.runtime-profile.v1',
      id: 'external-agent',
      displayName: 'External Agent',
      lane: 'plain-agent',
      status: 'user-defined',
      description: 'Project-local profile resolved through --repo.',
      workflows: { plan: 'external-agent plan' },
      defaults: { workflow: 'plan', harnessSkill: 'external-agent plan' },
      launch: { owner: 'external-adapter', commandTemplate: 'external-agent run <run.json>', spawning: false },
    }, null, 2));

    execFileSync(tsx, [cli, 'run', planPath, '--runtime', 'external-agent', '--repo', target], { cwd: coordinator, encoding: 'utf8' });
    const runsDir = join(coordinator, '.osc/runs');
    const runId = readdirSync(runsDir).sort().at(-1);
    const manifest = JSON.parse(readFileSync(join(runsDir, runId!, 'run.json'), 'utf8'));

    expect(manifest.runtimeSelection).toMatchObject({ runtime: 'external-agent', workflow: 'plan', profileId: 'external-agent', profileSource: 'project' });
    expect(manifest.executor).toMatchObject({ lane: 'plain-agent', harnessSkill: 'external-agent plan', spawning: false });
  }, 15_000);

  it('rejects project profiles that override reserved built-in ids', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    mkdirSync(join(target, '.osc/runtimes'), { recursive: true });
    writeFileSync(join(target, '.osc/runtimes/omx.json'), JSON.stringify({
      schemaVersion: 'open-scaffold.runtime-profile.v1',
      id: 'omx',
      displayName: 'Fake OMX',
      lane: 'custom',
      status: 'user-defined',
      description: 'Should not override built-in OMX.',
      launch: { spawning: false },
    }, null, 2));

    const result = spawnSync(tsx, [cli, 'runtimes', 'list'], { cwd: target, encoding: 'utf8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('uses reserved built-in id: omx');
  }, 15_000);

  it('rejects duplicate project runtime profile ids', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    mkdirSync(join(target, '.osc/runtimes'), { recursive: true });
    const profile = {
      schemaVersion: 'open-scaffold.runtime-profile.v1',
      id: 'dupe-agent',
      displayName: 'Dupe Agent',
      lane: 'plain-agent',
      status: 'user-defined',
      description: 'Duplicate id fixture.',
      launch: { spawning: false },
    };
    writeFileSync(join(target, '.osc/runtimes/a.json'), JSON.stringify(profile, null, 2));
    writeFileSync(join(target, '.osc/runtimes/b.json'), JSON.stringify(profile, null, 2));

    const result = spawnSync(tsx, [cli, 'runtimes', 'list'], { cwd: target, encoding: 'utf8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Duplicate project runtime profile id: dupe-agent');
  }, 15_000);

  it('rejects runtime profiles that try to enable spawning or installer execution', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    mkdirSync(join(target, '.osc/runtimes'), { recursive: true });
    writeFileSync(join(target, '.osc/runtimes/spawner.json'), JSON.stringify({
      schemaVersion: 'open-scaffold.runtime-profile.v1',
      id: 'spawner',
      displayName: 'Spawner',
      lane: 'custom',
      status: 'user-defined',
      description: 'Unsafe profile.',
      install: { auto: true },
      launch: { spawning: true },
    }, null, 2));

    const result = spawnSync(tsx, [cli, 'runtimes', 'show', 'spawner'], { cwd: target, encoding: 'utf8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('install.auto must be false');
    expect(result.stderr).toContain('launch.spawning must be false');
  }, 15_000);

  it('rejects unknown runtime ids', () => {
    const target = tempTarget();
    execFileSync(tsx, [cli, 'init', '--standard', '--target', target], { encoding: 'utf8' });
    const planPath = writeRuntimeSelectionPlan(target, 'Demo unknown runtime rejection.');

    const result = spawnSync(tsx, [cli, 'run', planPath, '--runtime', 'missing-runtime', '--repo', target], { cwd: target, encoding: 'utf8' });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Unknown runtime profile: missing-runtime');
  }, 15_000);

});
