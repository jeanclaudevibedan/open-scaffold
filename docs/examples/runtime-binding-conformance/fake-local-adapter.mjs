#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

const SUPPORTED_LANES = new Map([
  ['human', { harnessSkills: [null] }],
  ['plain-agent', { harnessSkills: [null] }],
  ['omx-codex', { harnessSkills: ['$deep-interview', '$ralplan', '$team', '$ralph', '$ultrawork', '$ultragoal'] }],
]);

function fail(message) {
  console.error(`Fake/local adapter refused package: ${message}`);
  process.exit(1);
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${label} must be a non-empty string`);
  }
  return value;
}

function loadRunPacket(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`could not read or parse ${path}: ${error.message}`);
  }
}

function parseArgs(argv) {
  if (argv.length !== 1 && argv.length !== 3) {
    console.error('Usage: node docs/examples/runtime-binding-conformance/fake-local-adapter.mjs <path-to-run.json> [--out <dispatch-receipt.json>]');
    process.exit(2);
  }
  if (argv.length === 3 && argv[1] !== '--out') {
    fail(`unsupported argument ${argv[1]}`);
  }
  return { runPacketPath: argv[0], outPath: argv[2] ?? null };
}

function relativeFromRepo(repoPath, path) {
  const rel = relative(resolve(repoPath), resolve(path));
  return rel === '' ? '.' : rel;
}

function safeArtifactPath(repoPath, artifactPath) {
  const raw = requireString(artifactPath, 'artifacts.evidence[0]');
  if (isAbsolute(raw)) {
    fail('artifact path must stay under runtime.repoPath');
  }
  const repoRoot = resolve(repoPath);
  const absolutePath = resolve(repoRoot, raw);
  const rel = relative(repoRoot, absolutePath);
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    fail('artifact path must stay under runtime.repoPath');
  }
  return { raw, absolutePath };
}

function normalizeLane(lane) {
  return lane === 'manual' ? 'human' : lane;
}

function harnessSkill(manifest) {
  return manifest?.executor?.harnessSkill ?? manifest?.executor?.harness_skill ?? null;
}

function validateLaneAndHarness(manifest) {
  const lane = normalizeLane(requireString(manifest?.executor?.lane, 'executor.lane'));
  const laneContract = SUPPORTED_LANES.get(lane);
  if (!laneContract) {
    fail(`unsupported executor.lane ${lane}`);
  }

  const skill = harnessSkill(manifest);
  if (!laneContract.harnessSkills.includes(skill)) {
    if (skill === null) {
      fail(`executor.harnessSkill is required for lane ${lane}`);
    }
    fail(`executor.harnessSkill ${skill} is not allowed for lane ${lane}`);
  }

  return { lane, skill };
}

const { runPacketPath, outPath } = parseArgs(process.argv.slice(2));
const manifest = loadRunPacket(runPacketPath);

if (manifest.schemaVersion !== 'open-scaffold.run.v1') {
  fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
}

const runId = requireString(manifest.runId, 'runId');
const planPath = requireString(manifest?.plan?.path, 'plan.path');
const repoPath = requireString(manifest?.runtime?.repoPath, 'runtime.repoPath');
const commitPolicy = requireString(manifest.commitPolicy, 'commitPolicy');
const worktreePath = manifest?.runtime?.worktreePath ?? null;
const branch = manifest?.runtime?.branch ?? null;
const { lane, skill } = validateLaneAndHarness(manifest);

if (manifest?.packageQuality?.executable !== true) {
  fail('packageQuality.executable must be true before dispatch');
}
if (!Array.isArray(manifest?.packageQuality?.blockers) || manifest.packageQuality.blockers.length > 0) {
  fail('packageQuality.blockers must be an empty array before dispatch');
}
if (manifest?.executor?.spawning !== false) {
  fail('executor.spawning must be false; Open Scaffold core packages work while adapters own launch behavior');
}

const receiptPath = outPath ?? resolve(dirname(runPacketPath), 'dispatch-receipt.json');
const fallbackEvidencePath = `.osc/runs/${runId}/fake-local-evidence.md`;
const { raw: evidencePath, absolutePath: evidenceAbsolutePath } = safeArtifactPath(
  repoPath,
  manifest?.artifacts?.evidence?.[0] ?? fallbackEvidencePath,
);
mkdirSync(dirname(receiptPath), { recursive: true });
mkdirSync(dirname(evidenceAbsolutePath), { recursive: true });

const evidence = `# Fake/local adapter evidence\n\nRun ID: ${runId}\nTask ID: ${manifest.taskId ?? '(none)'}\nPlan: ${planPath}\nExecutor lane: ${lane}\nHarness skill: ${skill ?? '(none)'}\n\nThis evidence was written by the fake/local adapter conformance fixture.\nNo runtime was launched. No network access or credentials were required.\n`;
writeFileSync(evidenceAbsolutePath, evidence);

const receipt = {
  schema_version: 'open-scaffold.dispatch-receipt.v1',
  receipt_id: `fake-local:${runId}`,
  run_id: runId,
  task_id: manifest.taskId ?? null,
  adapter_id: 'fake-local',
  runtime_backend: 'none',
  invoked_by: 'fake-local-adapter',
  invoked_at: '1970-01-01T00:00:00.000Z',
  working_directory: repoPath,
  worktree_path: worktreePath,
  branch,
  run_packet_path: relativeFromRepo(repoPath, runPacketPath),
  prompt_or_package_path: null,
  authority: {
    sandbox_policy: ['write_artifacts_only', 'commit_forbidden', 'push_forbidden', 'merge_forbidden', 'human_approval_required'],
    commit_policy: commitPolicy,
    approval_policy: 'human_approval_required',
  },
  spawned: false,
  spawn_command_redacted: null,
  runtime_handle: null,
  logs: [],
  artifacts: [evidencePath],
  status: 'dry_run',
  failure: {
    code: null,
    message: null,
  },
  fixture: {
    kind: 'conformance-fixture',
    lane,
    harness_skill: skill,
    plan_path: planPath,
    evidence_path: evidencePath,
    adapter_spawned_runtime: false,
    network_required: false,
    credentials_required: false,
  },
};

writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

console.log('Fake/local adapter conformance complete');
console.log(`Run ID: ${runId}`);
console.log(`Receipt: ${receiptPath}`);
console.log(`Evidence: ${evidencePath}`);
console.log('No runtime was launched. No credentials were read. No network was required.');
