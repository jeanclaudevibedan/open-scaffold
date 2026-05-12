import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { inspectScaffold, PLAN_STAGES } from './scaffold.js';

export type ValidationLevel = 'fail' | 'warn';

export interface ValidationIssue {
  level: ValidationLevel;
  code: string;
  message: string;
  path?: string;
}

export interface ValidationOptions {
  staleDays?: number;
}

export interface ValidationResult {
  ok: boolean;
  failures: ValidationIssue[];
  warnings: ValidationIssue[];
}

const DEFAULT_STALE_DAYS = 30;

function markdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => join(dir, file))
    .filter((path) => statSync(path).isFile());
}

function isSupportPlanFile(path: string): boolean {
  return /(?:README|WORKFLOW|handoff-template)\.md$/.test(path);
}

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

function hasHeading(text: string, heading: string): boolean {
  return new RegExp(`^##\\s+${heading}\\b`, 'im').test(text);
}

function releaseNotes(root: string): string[] {
  return markdownFiles(join(root, '.osc', 'releases')).filter((path) => !path.endsWith('/README.md'));
}

export function validateScaffold(root = process.cwd(), options: ValidationOptions = {}): ValidationResult {
  const state = inspectScaffold(root);
  const failures: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const staleDays = options.staleDays ?? DEFAULT_STALE_DAYS;

  if (!state.mission.defined) {
    failures.push({ level: 'fail', code: 'mission.undefined', message: state.mission.reason ?? 'MISSION.md is not defined', path: relative(root, state.mission.path) });
  }

  const planCount = Object.values(state.plans).flat().length;
  if (planCount === 0) {
    failures.push({ level: 'fail', code: 'plans.missing', message: 'No plan files found under .osc/plans/' });
  }

  const releasesDir = join(root, '.osc', 'releases');
  const releasesReadme = join(releasesDir, 'README.md');
  if (!existsSync(releasesDir)) {
    failures.push({ level: 'fail', code: 'releases.dir_missing', message: '.osc/releases/ directory is missing' });
  } else if (!existsSync(releasesReadme)) {
    warnings.push({ level: 'warn', code: 'releases.readme_missing', message: '.osc/releases/README.md is missing', path: relative(root, releasesReadme) });
  }

  const now = Date.now();
  for (const plan of state.plans.active) {
    const full = join(root, plan.path);
    if (!existsSync(full) || isSupportPlanFile(full)) continue;
    const text = read(full);
    const ageDays = Math.floor((now - statSync(full).mtimeMs) / 86_400_000);
    if (ageDays > staleDays) {
      warnings.push({ level: 'warn', code: 'active_plan.stale', message: `Active plan ${plan.slug} has not changed for ${ageDays} days (threshold ${staleDays})`, path: plan.path });
    }
    if (/PR\s+#\d+\s+(?:merged|closed)|merged\s+PR\s+#\d+|issue\s+#\d+\s+closed/i.test(text)) {
      warnings.push({ level: 'warn', code: 'active_plan.completed_evidence', message: `Active plan ${plan.slug} appears to mention merged/closed evidence; consider moving it to done/ or backlog`, path: plan.path });
    }
  }

  for (const notePath of releaseNotes(root)) {
    const text = read(notePath);
    const rel = relative(root, notePath);
    for (const heading of ['Summary', 'Traceability', 'Verification', 'Outcome']) {
      if (!hasHeading(text, heading)) {
        warnings.push({ level: 'warn', code: 'release_note.missing_section', message: `Release note is missing ## ${heading}`, path: rel });
      }
    }
    if (/pending/i.test(text) && /(?:PR\s+#\d+\s+merged|issue\s+#\d+\s+closed|Tag:\s+v\d|GitHub Release:\s+https?:\/\/)/i.test(text)) {
      warnings.push({ level: 'warn', code: 'release_note.pending_after_close', message: 'Release note still says pending while also citing merged/closed/released evidence', path: rel });
    }
    const runIds = text.match(/\b\d{8}T\d{6}Z-[a-z0-9-]+\b/g) ?? [];
    if (runIds.length > 0 && !/(PR\s+#\d+|Pull Request|https:\/\/github\.com\/.*\/pull\/\d+)/i.test(text)) {
      warnings.push({ level: 'warn', code: 'release_note.run_without_pr', message: 'Release note cites run ID but no PR reference', path: rel });
    }
  }

  // Local best-effort: if a run id is cited in roadmap/plans but not summarized in any release note, warn.
  const publicFiles: string[] = [];
  for (const file of ['ROADMAP.md', 'MISSION.md']) {
    const path = join(root, file);
    if (existsSync(path)) publicFiles.push(path);
  }
  for (const stage of PLAN_STAGES) {
    for (const file of markdownFiles(join(root, '.osc', 'plans', stage))) {
      if (!isSupportPlanFile(file)) publicFiles.push(file);
    }
  }
  const releaseTexts = releaseNotes(root).map(read).join('\n');
  const seen = new Set<string>();
  for (const file of publicFiles) {
    const text = read(file);
    for (const runId of text.match(/\b\d{8}T\d{6}Z-[a-z0-9-]+\b/g) ?? []) {
      if (!seen.has(runId) && !releaseTexts.includes(runId)) {
        seen.add(runId);
        warnings.push({ level: 'warn', code: 'run_id.no_release_summary', message: `Run ID ${runId} is cited but not summarized in .osc/releases/`, path: relative(root, file) });
      }
    }
  }

  return { ok: failures.length === 0, failures, warnings };
}
