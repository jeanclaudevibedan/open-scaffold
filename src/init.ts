import { chmodSync, copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const scaffoldTiers = ['min', 'standard', 'max'] as const;
export type ScaffoldTier = (typeof scaffoldTiers)[number];

const minFiles = [
  'MISSION.md',
  '.osc/RULES.md',
  '.osc/plans/WORKFLOW.md',
  '.osc/plans/README.md',
  '.osc/plans/handoff-template.md',
  '.osc/plans/active/.gitkeep',
  '.osc/plans/backlog/.gitkeep',
  '.osc/plans/done/.gitkeep',
  '.osc/plans/blocked/.gitkeep',
  '.osc/releases/README.md',
  'verify.sh',
  'close.sh',
  'bootstrap.sh',
] as const;

const standardOnlyFiles = [
  'README.md',
  'ROADMAP.md',
  'AGENTS.md',
  'CLAUDE.md',
  'amend.sh',
  'docs/WORKFLOW.md',
  'docs/MINIMUM_VIABLE_SCAFFOLD.md',
  'docs/SLICE_CLOSE_PROTOCOL.md',
] as const;

const maxOnlyFiles = [
  'docs/GITHUB_WORKFLOW.md',
  'docs/GLASS_COCKPIT_PROTOCOL.md',
  'docs/RUNTIME_BINDING_CONTRACT.md',
  'docs/TASK_RUN_MODEL.md',
  'docs/OPEN_SCAFFOLD_SYSTEM.md',
  'delegate.sh',
  '.osc/runs/.gitkeep',
  '.osc/research/.gitkeep',
  '.osc/specs/.gitkeep',
] as const;

export const tierFiles: Record<ScaffoldTier, readonly string[]> = {
  min: minFiles,
  standard: [...minFiles, ...standardOnlyFiles],
  max: [...minFiles, ...standardOnlyFiles, ...maxOnlyFiles],
};

export interface InitializeScaffoldOptions {
  tier: ScaffoldTier;
  target: string;
  force?: boolean;
}

export interface InitializeScaffoldResult {
  tier: ScaffoldTier;
  target: string;
  filesCreated: string[];
  summary: string;
}

function packageRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..');
}

function isExecutableTemplate(file: string): boolean {
  return file.endsWith('.sh');
}

function sourcePathFor(file: string): string | null {
  if (file === 'MISSION.md') return null;
  if (file.endsWith('/.gitkeep')) return null;
  return join(packageRoot(), file);
}

function missionTemplate(): string {
  return `# Mission\n\n<!-- mission:unset -->\n\nTODO: define mission.\n\nDescribe what this repository is trying to accomplish, the non-goals, and the owner-visible definition of done before starting substantial work.\n`;
}

function minRulesTemplate(): string {
  return `# Open Scaffold — Rules (Minimum Tier)

Re-read this file before any major action on project structure.

## Non-Negotiables

1. **Mission first.** Read \`MISSION.md\` before doing anything. If \`<!-- mission:unset -->\` is present, stop and define the mission.
2. **Plans are immutable.** Never edit a plan file after creation. New information should become a follow-up plan or an upgrade to the standard scaffold tier.
3. **Folder = status.** Plans live in \`active/\`, \`backlog/\`, \`done/\`, or \`blocked/\`. Move files, don't rename them. See \`.osc/plans/WORKFLOW.md\`.
4. **Verify before claiming done.** Run \`./verify.sh\` against acceptance criteria. Use \`./close.sh\` to move plans to \`done/\`.
5. **Check active/ first.** Before starting new work, check \`.osc/plans/active/\`. Continue in-flight work unless told otherwise.
6. **One focus at a time.** Keep \`active/\` small (2–3 plans max). Finish or park before pulling from \`backlog/\`.

## File Conventions

- Plan files: \`NNN-slug.md\` (number is permanent ID, never changes)
- All plans follow the 7-section schema in \`.osc/plans/handoff-template.md\`
- This minimum tier intentionally omits advanced amendment/docs helpers; use the standard tier when mechanical amendment workflow is needed.

## When In Doubt

- Structure and stage questions → re-read this file and \`.osc/plans/WORKFLOW.md\`
- Design rationale → capture a small plan or evidence note before expanding scope
`;
}

function minPlansReadmeTemplate(): string {
  return `# Plans — Minimum Tier Amendments

Plans in this directory and its stage subfolders (\`active/\`, \`backlog/\`, \`done/\`, \`blocked/\`) are **immutable** once committed. When new information changes a plan's goal, constraints, or acceptance criteria, do NOT edit the plan file in place.

The minimum scaffold tier intentionally ships without the mechanical amendment helper. Use this lightweight fallback:

1. Create a follow-up plan in the appropriate stage folder, or create \`<plan-slug>-amendment-<n>.md\` by hand beside the parent plan.
2. Capture what changed, the new direction, and the impact on acceptance criteria.
3. Add a one-line entry to \`MISSION.md\`'s changelog if the change is a real scope pivot.
4. Run \`./verify.sh\` before claiming the work is complete.

Use \`./close.sh <plan-slug>\` to move a completed plan to \`done/\`. See \`.osc/plans/WORKFLOW.md\` for the full stage-folder workflow.

Upgrade to the standard scaffold tier when you want the mechanical amendment helper and richer workflow docs.
`;
}

function minHandoffTemplate(): string {
  return `# Plan: <slug>

<!--
Copy this template to \`.osc/plans/<slug>.md\` for each task or feature slice.
Fill every section. Keep each section tight — a reader with no prior context
should be able to act on the plan after reading it once.

Plans are IMMUTABLE once committed. If new information changes the plan,
capture a follow-up plan or upgrade to the standard scaffold tier for the
mechanical amendment workflow. Do not hand-edit completed plan files.
-->

## Status

<!-- One of: active | complete | superseded -->
active

## Context

<1-3 sentences: why this plan exists. What happened that made us write it now? What prior plan or decision does it follow from, if any?>

## Goal

<One crisp sentence describing the outcome that defines "done" for this plan. Not a feature list — the single observable change in the world when this is complete.>

## Constraints / Out of scope

- <what this plan will NOT do>
- <non-goals specific to this slice>
- <boundaries on stack, time, or surface area>

## Files to touch

- \`path/to/file.ext\` — <one-line reason>
- \`path/to/other.ext\` — <one-line reason>

## Execution strategy

<Include this section when a plan involves 3+ tasks that can be organized into independent parallel batches. Omit for simple single-agent plans.>

### Task decomposition

| ID | Task | Dependencies | Parallel group |
|----|------|-------------|----------------|
| T1 | <task description> | None | A |
| T2 | <task description> | T1 | B |
| T3 | <task description> | None | A |

### Parallel groups

- **Group A** (<rationale>): T1, T3 — <why these are independent>
- **Group B** (depends on Group A): T2 — <why this must wait>

### Dependencies

- T2 depends on T1 (<specific reason — e.g., "needs the API schema T1 produces">)

### Delegation notes

- <which groups are suitable for parallel agents or separate terminal sessions>
- <which groups must wait for earlier groups to complete>

## Acceptance criteria

- [ ] <testable bullet — something a verifier can check mechanically or with a clear yes/no>
- [ ] <testable bullet>
- [ ] <testable bullet>

## Verification steps

1. <command or manual check>
2. <expected output or observable>
3. <pass criterion: exactly what makes this step green>

## Open questions

- <unresolved decision, tag with owner if known>
- <assumption that needs validation before or during execution>
`;
}

function ensureKnownTier(tier: string): asserts tier is ScaffoldTier {
  if (!scaffoldTiers.includes(tier as ScaffoldTier)) {
    throw new Error(`Invalid tier: ${tier}. Expected one of: ${scaffoldTiers.join(', ')}`);
  }
}

function assertTemplateExists(file: string, source: string): void {
  if (!existsSync(source) || !statSync(source).isFile()) {
    throw new Error(`Template source missing for ${file}: ${source}`);
  }
}

function formatSummary(tier: ScaffoldTier, target: string, files: string[]): string {
  return [
    `Generated ${tier} Open Scaffold in ${target}`,
    `Files created (${files.length}):`,
    ...files.map((file) => `  - ${file}`),
    '',
    'Next: edit MISSION.md, add one current plan under .osc/plans/active/, then run ./verify.sh --standard',
  ].join('\n');
}

function rejectSymlinkedDestination(target: string, destination: string): void {
  const relative = destination.slice(target.length + 1);
  const parts = relative.split('/').filter(Boolean);
  let current = target;

  if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
    throw new Error('Refusing to write through symlinked path: .');
  }

  for (const part of parts) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      const symlinkRelative = current.slice(target.length + 1) || '.';
      throw new Error(`Refusing to write through symlinked path: ${symlinkRelative}`);
    }
  }
}

export function initializeScaffold(options: InitializeScaffoldOptions): InitializeScaffoldResult {
  ensureKnownTier(options.tier);
  const target = resolve(options.target);
  const files = [...tierFiles[options.tier]];
  const existing = files.filter((file) => existsSync(join(target, file)));

  if (existing.length > 0 && !options.force) {
    throw new Error(`Refusing to overwrite existing files: ${existing.join(', ')}. Re-run with --force only if you intend to replace them.`);
  }

  mkdirSync(target, { recursive: true });

  for (const file of files) {
    const destination = join(target, file);
    rejectSymlinkedDestination(target, destination);
    mkdirSync(dirname(destination), { recursive: true });

    const source = sourcePathFor(file);
    if (source === null) {
      writeFileSync(destination, file === 'MISSION.md' ? missionTemplate() : '');
    } else if (file === '.osc/RULES.md' && options.tier === 'min') {
      writeFileSync(destination, minRulesTemplate());
    } else if (file === '.osc/plans/README.md' && options.tier === 'min') {
      writeFileSync(destination, minPlansReadmeTemplate());
    } else if (file === '.osc/plans/handoff-template.md' && options.tier === 'min') {
      writeFileSync(destination, minHandoffTemplate());
    } else {
      assertTemplateExists(file, source);
      copyFileSync(source, destination);
    }

    if (isExecutableTemplate(file)) chmodSync(destination, 0o755);
  }

  return {
    tier: options.tier,
    target,
    filesCreated: files,
    summary: formatSummary(options.tier, target, files),
  };
}

export function parseTier(value: string): ScaffoldTier {
  ensureKnownTier(value);
  return value;
}

export function listTargetFiles(root: string): string[] {
  const files: string[] = [];
  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const relative = full.slice(root.length + 1);
      if (statSync(full).isDirectory()) walk(full);
      else files.push(relative);
    }
  }
  walk(root);
  return files.sort();
}
