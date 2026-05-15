#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

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

const { runPacketPath, outPath } = parseArgs(process.argv.slice(2));
const manifest = loadRunPacket(runPacketPath);

if (manifest.schemaVersion !== 'open-scaffold.run.v1') {
  fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
}

const runId = requireString(manifest.runId, 'runId');
const planPath = requireString(manifest?.plan?.path, 'plan.path');
const lane = requireString(manifest?.executor?.lane, 'executor.lane') === 'manual' ? 'human' : manifest.executor.lane;
const repoPath = requireString(manifest?.runtime?.repoPath, 'runtime.repoPath');
const worktreePath = manifest?.runtime?.worktreePath ?? repoPath;

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
const evidencePath = manifest?.artifacts?.evidence?.[0] ?? `.osc/runs/${runId}/fake-local-evidence.md`;
const evidenceAbsolutePath = resolve(repoPath, evidencePath);
mkdirSync(dirname(receiptPath), { recursive: true });
mkdirSync(dirname(evidenceAbsolutePath), { recursive: true });

const evidence = `# Fake/local adapter evidence\n\nRun ID: ${runId}\nTask ID: ${manifest.taskId ?? '(none)'}\nPlan: ${planPath}\nExecutor lane: ${lane}\n\nThis evidence was written by the fake/local adapter conformance fixture.\nNo runtime was launched. No network access or credentials were required.\n`;
writeFileSync(evidenceAbsolutePath, evidence);

const receipt = {
  schemaVersion: 'open-scaffold.dispatch-receipt.v1',
  receiptId: `fake-local:${runId}`,
  adapter: {
    id: 'fake-local',
    kind: 'conformance-fixture',
    runtimeBackend: 'none',
  },
  run: {
    runId,
    taskId: manifest.taskId ?? null,
    lane,
    planPath,
    runPacketPath: relativeFromRepo(repoPath, runPacketPath),
  },
  authority: {
    sandboxPolicy: ['write_artifacts_only', 'commit_forbidden', 'push_forbidden', 'merge_forbidden', 'human_approval_required'],
    commitPolicy: manifest.commitPolicy,
    approvalPolicy: 'human_approval_required',
  },
  boundary: {
    coreSpawnedRuntime: false,
    adapterSpawnedRuntime: false,
    networkRequired: false,
    credentialsRequired: false,
  },
  result: {
    status: 'completed',
    evidencePath,
    logs: [],
    artifacts: [evidencePath],
  },
};

writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

console.log('Fake/local adapter conformance complete');
console.log(`Run ID: ${runId}`);
console.log(`Receipt: ${receiptPath}`);
console.log(`Evidence: ${evidencePath}`);
console.log('No runtime was launched. No credentials were read. No network was required.');
