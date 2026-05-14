import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync, chmodSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const scaffoldTiers = ['min', 'standard', 'max'] as const;
export type ScaffoldTier = (typeof scaffoldTiers)[number];

const minFiles = [
  'MISSION.md',
  '.osc/RULES.md',
  '.osc/plans/WORKFLOW.md',
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
    mkdirSync(dirname(destination), { recursive: true });

    const source = sourcePathFor(file);
    if (source === null) {
      writeFileSync(destination, file === 'MISSION.md' ? missionTemplate() : '');
    } else if (file === '.osc/RULES.md' && options.tier === 'min') {
      writeFileSync(destination, minRulesTemplate());
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
