import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ParsedPlan } from './scaffold.js';

export interface RunArtifacts {
  runId: string;
  runDir: string;
  manifestPath: string;
  promptPaths: string[];
}

function timestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'prompt';
}

function promptForGroup(plan: ParsedPlan, groupName: string, tasks: string): string {
  const ac = plan.acceptanceCriteria.map((item) => `- ${item}`).join('\n') || '- No acceptance criteria listed.';
  const verification = plan.verificationSteps.map((item, index) => `${index + 1}. ${item}`).join('\n') || '1. No verification steps listed.';
  return [
    `# Open Scaffold Prompt: ${groupName}`,
    '',
    `Plan: ${plan.slug}`,
    `Goal: ${plan.goal || '(not specified)'}`,
    '',
    '## Assignment',
    tasks,
    '',
    '## Rules',
    '- Follow the plan and its amendments; do not silently expand scope.',
    '- If scope changes, propose an amendment instead of editing the original plan.',
    '- Produce evidence tied to acceptance criteria, not vibes.',
    '- This generic prompt does not spawn agents; paste it into your selected runtime.',
    '',
    '## Acceptance criteria',
    ac,
    '',
    '## Verification steps',
    verification,
    '',
  ].join('\n');
}

export function createRunArtifacts(root: string, plan: ParsedPlan, mode: 'delegate' | 'run' | 'review' | 'ultrareview' = 'run'): RunArtifacts {
  const runId = `${timestamp()}-${slugify(plan.slug)}-${mode}`;
  const runDir = join(root, '.osc', 'runs', runId);
  const promptDir = join(runDir, 'prompts');
  mkdirSync(promptDir, { recursive: true });

  const groups = plan.executionStrategy?.groups?.length
    ? plan.executionStrategy.groups.map((g) => ({ name: g.name, tasks: g.tasks }))
    : [{ name: 'Single Session', tasks: `Execute plan ${plan.slug}.` }];

  const promptPaths: string[] = [];
  for (const group of groups) {
    const file = join(promptDir, `${slugify(group.name)}.md`);
    writeFileSync(file, promptForGroup(plan, group.name, group.tasks), 'utf8');
    promptPaths.push(file);
  }

  const manifestPath = join(runDir, 'run.json');
  writeFileSync(manifestPath, JSON.stringify({
    runId,
    mode,
    createdAt: new Date().toISOString(),
    namespace: '.osc',
    plan: {
      slug: plan.slug,
      path: relative(root, plan.path),
      goal: plan.goal,
      acceptanceCriteria: plan.acceptanceCriteria,
      verificationSteps: plan.verificationSteps,
    },
    prompts: promptPaths.map((p) => relative(root, p)),
    spawning: false,
    note: 'Generic open-scaffold creates prompt/artifact bundles only. Runtime adapters perform autonomous spawning.',
  }, null, 2) + '\n', 'utf8');

  return { runId, runDir, manifestPath, promptPaths };
}
