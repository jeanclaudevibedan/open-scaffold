import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

export const OSC_NAMESPACE = '.osc';
export const PLAN_STAGES = ['active', 'backlog', 'blocked', 'done'] as const;
export type PlanStage = typeof PLAN_STAGES[number];

export interface MissionState {
  path: string;
  defined: boolean;
  reason?: string;
}

export interface PlanSummary {
  slug: string;
  path: string;
  stage: PlanStage;
}

export interface ScaffoldState {
  root: string;
  namespace: '.osc';
  mission: MissionState;
  plans: Record<PlanStage, PlanSummary[]>;
}

export interface ExecutionGroup {
  name: string;
  rationale: string;
  tasks: string;
  dependsOnPrevious: boolean;
}

export interface ExecutionStrategy {
  groups: ExecutionGroup[];
  dependencies: string[];
  delegationNotes: string[];
}

export interface ParsedPlan {
  path: string;
  slug: string;
  status: string;
  goal: string;
  sections: Map<string, string>;
  filesToTouch: string[];
  acceptanceCriteria: string[];
  verificationSteps: string[];
  openQuestions: string[];
  executionStrategy?: ExecutionStrategy;
}

function readText(path: string): string {
  return readFileSync(path, 'utf8');
}

export function inspectMission(root: string): MissionState {
  const path = join(root, 'MISSION.md');
  if (!existsSync(path)) return { path, defined: false, reason: 'MISSION.md not found' };
  const text = readText(path);
  if (text.includes('mission:unset') || text.includes('TODO: define mission')) {
    return { path, defined: false, reason: 'mission unset marker present' };
  }
  return { path, defined: true };
}

export function inspectScaffold(root = process.cwd()): ScaffoldState {
  const plans: Record<PlanStage, PlanSummary[]> = {
    active: [],
    backlog: [],
    blocked: [],
    done: [],
  };
  for (const stage of PLAN_STAGES) {
    const dir = join(root, OSC_NAMESPACE, 'plans', stage);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith('.md')) continue;
      if (file === 'README.md' || file === 'WORKFLOW.md' || file === 'handoff-template.md') continue;
      const full = join(dir, file);
      if (!statSync(full).isFile()) continue;
      plans[stage].push({ slug: basename(file, '.md'), path: relative(root, full), stage });
    }
  }
  return { root, namespace: OSC_NAMESPACE, mission: inspectMission(root), plans };
}

function normalizeHeading(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export function splitSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = markdown.split(/\r?\n/);
  let current: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    if (current) sections.set(current, buffer.join('\n').trim());
    buffer = [];
  };
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      flush();
      current = normalizeHeading(match[1]);
    } else if (current) {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

function firstParagraph(text: string): string {
  return text.split(/\n\s*\n/).map((s) => s.trim()).find(Boolean) ?? '';
}

function bulletItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/^\[[ xX]\]\s*/, '').trim())
    .filter(Boolean);
}

function numberedItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean);
}

function parseExecutionStrategy(text: string): ExecutionStrategy | undefined {
  if (!text.trim()) return undefined;
  const groups: ExecutionGroup[] = [];
  const dependencies: string[] = [];
  const delegationNotes: string[] = [];
  let subsection = '';
  for (const line of text.split(/\r?\n/)) {
    const sub = line.match(/^###\s+(.+)$/);
    if (sub) {
      subsection = normalizeHeading(sub[1]).toLowerCase();
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (subsection === 'parallel groups' && trimmed.startsWith('- **Group')) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*(?:\((.*?)\))?:\s*(.+)$/);
      if (match) {
        const rationale = match[2] ?? '';
        groups.push({
          name: match[1].trim(),
          rationale: rationale.trim(),
          tasks: match[3].trim(),
          dependsOnPrevious: /depends on/i.test(trimmed),
        });
      }
    } else if (subsection === 'dependencies' && /^[-*]\s+/.test(trimmed)) {
      dependencies.push(trimmed.replace(/^[-*]\s+/, '').trim());
    } else if (subsection === 'delegation notes' && /^[-*]\s+/.test(trimmed)) {
      delegationNotes.push(trimmed.replace(/^[-*]\s+/, '').trim());
    }
  }
  return { groups, dependencies, delegationNotes };
}

export function parsePlanFile(path: string): ParsedPlan {
  const text = readText(path);
  const sections = splitSections(text);
  return {
    path,
    slug: basename(path, '.md'),
    status: firstParagraph(sections.get('Status') ?? ''),
    goal: firstParagraph(sections.get('Goal') ?? ''),
    sections,
    filesToTouch: bulletItems(sections.get('Files to touch') ?? ''),
    acceptanceCriteria: bulletItems(sections.get('Acceptance criteria') ?? ''),
    verificationSteps: numberedItems(sections.get('Verification steps') ?? ''),
    openQuestions: bulletItems(sections.get('Open questions') ?? ''),
    executionStrategy: parseExecutionStrategy(sections.get('Execution strategy') ?? ''),
  };
}

export function planToJson(plan: ParsedPlan): unknown {
  return {
    ...plan,
    sections: Object.fromEntries(plan.sections.entries()),
  };
}
