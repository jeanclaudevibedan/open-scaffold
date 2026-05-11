import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ParsedPlan } from './scaffold.js';

export type ArtifactMode = 'delegate' | 'run' | 'review' | 'ultrareview';
export type ExecutorLane = 'omc-claude' | 'omx-codex' | 'plain-agent' | 'human' | 'custom';
export type OperatorSurface = 'discord' | 'slack' | 'telegram' | 'github' | 'cli' | 'none' | 'custom';

export interface RunArtifactOptions {
  taskId?: string;
  sourceRef?: string[];
  executor?: ExecutorLane;
  harnessSkill?: string;
  repo?: string;
  worktree?: string;
  branch?: string;
  operatorSurface?: OperatorSurface;
  operatorThread?: string;
  issue?: string;
  pr?: string;
  commitPolicy?: string;
}

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

function isNoOpenQuestions(value: string): boolean {
  return /^(none|n\/a|no open questions|no blocking questions)\.?$/i.test(value.trim());
}

function isBlockingOpenQuestion(value: string): boolean {
  const normalized = value.trim();
  if (isNoOpenQuestions(normalized)) return false;
  return /^\[?blocking\]?[:\s-]/i.test(normalized) || /^blocking[:\s-]/i.test(normalized);
}

function blockingOpenQuestions(plan: ParsedPlan): string[] {
  return plan.openQuestions.filter(isBlockingOpenQuestion);
}

function contextQuality(plan: ParsedPlan): { executable: boolean; blockers: string[]; requiredAction: string | null } {
  const blockers: string[] = [];
  if (!plan.goal.trim()) blockers.push('missing goal');
  if (plan.acceptanceCriteria.length === 0) blockers.push('missing acceptance criteria');
  if (plan.verificationSteps.length === 0) blockers.push('missing verification steps');
  const openQuestions = blockingOpenQuestions(plan);
  if (openQuestions.length) blockers.push('blocking open questions present');
  return {
    executable: blockers.length === 0,
    blockers,
    requiredAction: blockers.length ? 'clarify-or-deep-interview-before-dispatch' : null,
  };
}

function promptForGroup(plan: ParsedPlan, groupName: string, tasks: string, runId: string, options: RunArtifactOptions): string {
  const ac = plan.acceptanceCriteria.map((item) => `- ${item}`).join('\n') || '- No acceptance criteria listed.';
  const verification = plan.verificationSteps.map((item, index) => `${index + 1}. ${item}`).join('\n') || '1. No verification steps listed.';
  const openQuestions = blockingOpenQuestions(plan).map((item) => `- ${item}`).join('\n') || '- None blocking.';
  return [
    `# Open Scaffold Prompt: ${groupName}`,
    '',
    `Run ID: ${runId}`,
    `Task ID: ${options.taskId ?? '(none supplied)'}`,
    `Plan: ${plan.slug}`,
    `Goal: ${plan.goal || '(not specified)'}`,
    '',
    '## Assignment',
    tasks,
    '',
    '## Execution lane',
    `- Executor: ${options.executor ?? 'unspecified'}`,
    `- Harness skill: ${options.harnessSkill ?? 'none'}`,
    `- Repository: ${options.repo ?? 'current repository'}`,
    `- Operator surface: ${options.operatorSurface ?? 'none'}`,
    '',
    '## Rules',
    '- Follow the plan and its amendments; do not silently expand scope.',
    '- If scope changes, propose an amendment instead of editing the original plan.',
    '- Produce evidence tied to acceptance criteria, not vibes.',
    '- This generic prompt does not spawn agents; paste it into your selected runtime.',
    '- Treat chat threads as operator-surface bindings, not canonical task/run identity.',
    '- If blocking open questions exist, stop and clarify before implementation.',
    '',
    '## Acceptance criteria',
    ac,
    '',
    '## Verification steps',
    verification,
    '',
    '## Blocking open questions',
    openQuestions,
    '',
  ].join('\n');
}

export function createRunArtifacts(root: string, plan: ParsedPlan, mode: ArtifactMode = 'run', options: RunArtifactOptions = {}): RunArtifacts {
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
    writeFileSync(file, promptForGroup(plan, group.name, group.tasks, runId, options), 'utf8');
    promptPaths.push(file);
  }

  const quality = contextQuality(plan);
  const createdAt = new Date().toISOString();
  const relativeOrNull = (value?: string) => value ?? null;
  const sourceRefs = [
    ...(options.sourceRef ?? []),
    options.taskId ? `task:${options.taskId}` : null,
    options.issue ? `issue:${options.issue}` : null,
    options.operatorThread ? `operator-thread:${options.operatorThread}` : null,
  ].filter((value): value is string => Boolean(value));

  const manifestPath = join(runDir, 'run.json');
  writeFileSync(manifestPath, JSON.stringify({
    schemaVersion: 'open-scaffold.run.v1',
    runId,
    taskId: options.taskId ?? null,
    mode,
    status: 'created',
    lifecycleStates: ['created', 'packaged', 'dispatched', 'running', 'waiting_on_operator', 'completed', 'failed', 'blocked', 'cancelled', 'postflighted'],
    createdAt,
    updatedAt: createdAt,
    namespace: '.osc',
    sourceRefs,
    plan: {
      slug: plan.slug,
      path: relative(root, plan.path),
      goal: plan.goal,
      acceptanceCriteria: plan.acceptanceCriteria,
      verificationSteps: plan.verificationSteps,
      openQuestions: plan.openQuestions,
    },
    packageQuality: quality,
    executor: {
      lane: options.executor ?? null,
      harnessSkill: options.harnessSkill ?? null,
      spawning: false,
      note: 'Generic open-scaffold creates prompt/artifact bundles only. Coordinators or runtime adapters perform autonomous spawning.',
    },
    runtime: {
      repoPath: relativeOrNull(options.repo),
      worktreePath: relativeOrNull(options.worktree),
      branch: relativeOrNull(options.branch),
      tmuxSession: null,
      processId: null,
    },
    bindings: {
      operatorSurface: options.operatorSurface ?? 'none',
      operatorThreadId: options.operatorThread ?? null,
      githubIssue: options.issue ?? null,
      githubPr: options.pr ?? null,
    },
    artifacts: {
      runDir: relative(root, runDir),
      manifest: relative(root, manifestPath),
      prompts: promptPaths.map((p) => relative(root, p)),
      logs: [],
      outputs: [],
      evidence: [],
    },
    questions: [],
    commitPolicy: options.commitPolicy ?? 'no commit/push unless explicitly approved by the operator',
    note: 'Canonical lifecycle belongs to the task/run record. Chat threads mirror/control via bindings; they are not canonical task identity.',
  }, null, 2) + '\n', 'utf8');

  return { runId, runDir, manifestPath, promptPaths };
}
