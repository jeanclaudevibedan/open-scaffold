import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateScaffold } from '../src/validation.js';

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), 'osc-validation-'));
  mkdirSync(join(root, '.osc/plans/active'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/backlog'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/blocked'), { recursive: true });
  mkdirSync(join(root, '.osc/plans/done'), { recursive: true });
  mkdirSync(join(root, '.osc/releases'), { recursive: true });
  writeFileSync(join(root, 'MISSION.md'), '# Mission\n\nBuild the thing.\n');
  writeFileSync(join(root, '.osc/releases/README.md'), '# Releases\n');
  return root;
}

const plan = `# Plan: sample

## Status

active

## Context

Need a thing.

## Goal

Ship a thing.

## Constraints / Out of scope

- No spawning agents.

## Files to touch

- \`README.md\` — docs

## Acceptance criteria

- [ ] It works.

## Verification steps

1. Run tests.

## Open questions

- None.
`;

describe('scaffold validation', () => {
  it('passes a repo with mission, plans, and releases directory', () => {
    const root = tempRepo();
    writeFileSync(join(root, '.osc/plans/active/001-sample.md'), plan);

    const result = validateScaffold(root);

    expect(result.ok).toBe(true);
    expect(result.failures).toEqual([]);
  });

  it('warns when a release note cites a run id without a PR reference', () => {
    const root = tempRepo();
    writeFileSync(join(root, '.osc/plans/done/001-sample.md'), plan.replace('active', 'done'));
    writeFileSync(join(root, '.osc/releases/2026-05-12-demo.md'), `# Release / Evidence Note: demo

## Summary

Demo.

## Traceability

run_id 20260512T120000Z-demo-run

## Verification

Passed.

## Outcome

Done.
`);

    const result = validateScaffold(root);

    expect(result.ok).toBe(true);
    expect(result.warnings.map((w) => w.code)).toContain('release_note.run_without_pr');
  });

  it('fails when official releases directory is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'osc-validation-missing-'));
    mkdirSync(join(root, '.osc/plans/active'), { recursive: true });
    writeFileSync(join(root, 'MISSION.md'), '# Mission\n\nBuild the thing.\n');
    writeFileSync(join(root, '.osc/plans/active/001-sample.md'), plan);

    const result = validateScaffold(root);

    expect(result.ok).toBe(false);
    expect(result.failures.map((f) => f.code)).toContain('releases.dir_missing');
  });
});
