import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRunArtifacts } from '../src/artifacts.js';

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'osc-artifacts-'));
  mkdirSync(join(root, '.osc/plans/active'), { recursive: true });
  writeFileSync(join(root, 'MISSION.md'), '# Mission\n\nBuild the thing.\n');
  return root;
}

const plan = {
  path: '.osc/plans/active/001-demo.md',
  slug: '001-demo',
  status: 'active',
  goal: 'Demo artifacts.',
  sections: new Map<string, string>(),
  filesToTouch: [],
  acceptanceCriteria: ['Run manifest exists.'],
  verificationSteps: ['Run npm test.'],
  openQuestions: [],
  executionStrategy: {
    groups: [
      { name: 'Group A', rationale: 'foundation', tasks: 'T1 — parse first', dependsOnPrevious: false },
    ],
    dependencies: ['T1 has no dependencies.'],
    delegationNotes: ['Use prompt executor.'],
  },
};

describe('run artifact generation', () => {
  it('creates a run directory with manifest and prompt files without spawning agents', () => {
    const root = tempRepo();

    const run = createRunArtifacts(root, plan as any, 'delegate');

    expect(run.runDir).toContain(join(root, '.osc/runs/'));
    expect(existsSync(join(run.runDir, 'run.json'))).toBe(true);
    expect(existsSync(join(run.runDir, 'prompts/group-a.md'))).toBe(true);
    expect(readdirSync(join(run.runDir, 'prompts'))).toEqual(['group-a.md']);
  });
});
