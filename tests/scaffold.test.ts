import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspectScaffold, parsePlanFile } from '../src/scaffold.js';

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'osc-test-'));
  mkdirSync(join(root, '.osc/plans/active'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/backlog'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/blocked'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/done'), { recursive: true });
  writeFileSync(join(root, 'MISSION.md'), '# Mission\n\nBuild the thing.\n');
  return root;
}

const samplePlan = `# Plan: sample

## Status

active

## Context

Need a thing.

## Goal

Ship a thing.

## Constraints / Out of scope

- No spawning agents.

## Files to touch

- \`src/index.ts\` — CLI entrypoint

## Execution strategy

### Task decomposition

| ID | Task | Dependencies | Parallel group |
|----|------|--------------|----------------|
| T1 | Parse plans | None | A |
| T2 | Generate prompts | T1 | B |

### Parallel groups

- **Group A** (foundation): T1 — parse first
- **Group B** (depends on Group A): T2 — generate after parse

### Dependencies

- T2 depends on T1.

### Delegation notes

- Use separate sessions only after T1 completes.

## Acceptance criteria

- [ ] Parser extracts sections.
- [ ] Delegation prompts are generated.

## Verification steps

1. Run \`npm test\`.
2. Expected: pass.

## Open questions

- None.
`;

describe('open-scaffold parser', () => {
  it('inspects .osc stage folders and mission state', () => {
    const root = tempRepo();
    writeFileSync(join(root, '.osc/plans/active/001-sample.md'), samplePlan);

    const state = inspectScaffold(root);

    expect(state.namespace).toBe('.osc');
    expect(state.mission.defined).toBe(true);
    expect(state.plans.active).toHaveLength(1);
    expect(state.plans.active[0].slug).toBe('001-sample');
  });

  it('parses plan sections, acceptance criteria, and execution groups', () => {
    const root = tempRepo();
    const path = join(root, '.osc/plans/active/001-sample.md');
    writeFileSync(path, samplePlan);

    const plan = parsePlanFile(path);

    expect(plan.slug).toBe('001-sample');
    expect(plan.goal).toBe('Ship a thing.');
    expect(plan.acceptanceCriteria).toEqual([
      'Parser extracts sections.',
      'Delegation prompts are generated.',
    ]);
    expect(plan.executionStrategy?.groups.map((g) => g.name)).toEqual(['Group A', 'Group B']);
  });
});
