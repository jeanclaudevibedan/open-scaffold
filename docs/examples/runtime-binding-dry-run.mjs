#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const supportedLanes = new Set(['omc-claude', 'omx-codex', 'plain-agent', 'human', 'custom']);
const harnessRequired = new Set(['omc-claude', 'omx-codex']);

function fail(message) {
  console.error(`Refusing runtime handoff: ${message}`);
  process.exit(1);
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${label} must be a non-empty string`);
  }
  return value;
}

function loadManifest(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`could not read or parse ${path}: ${error.message}`);
  }
}

if (process.argv.length !== 3) {
  console.error('Usage: node docs/examples/runtime-binding-dry-run.mjs <path-to-run.json>');
  process.exit(2);
}

const manifestPath = process.argv[2];
const manifest = loadManifest(manifestPath);

requireString(manifest.schemaVersion, 'schemaVersion');
requireString(manifest.runId, 'runId');
requireString(manifest?.plan?.path, 'plan.path');
requireString(manifest.commitPolicy, 'commitPolicy');

if (manifest.schemaVersion !== 'open-scaffold.run.v1') {
  fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
}

if (manifest?.packageQuality?.executable !== true) {
  fail('packageQuality.executable must be true before dispatch');
}

const blockers = manifest?.packageQuality?.blockers;
if (!Array.isArray(blockers)) {
  fail('packageQuality.blockers must be an array');
}
if (blockers.length > 0) {
  fail(`packageQuality.blockers must be empty before dispatch (${blockers.join('; ')})`);
}

const rawLane = requireString(manifest?.executor?.lane, 'executor.lane');
const lane = rawLane === 'manual' ? 'human' : rawLane;
if (!supportedLanes.has(lane)) {
  fail(`unsupported executor.lane ${rawLane}`);
}

if (manifest?.executor?.spawning !== false) {
  fail('executor.spawning must be false; Open Scaffold core packages, external bindings launch');
}

const harnessSkill = manifest?.executor?.harnessSkill ?? null;
if (harnessRequired.has(lane) && (typeof harnessSkill !== 'string' || harnessSkill.trim() === '')) {
  fail(`${lane} packages must record executor.harnessSkill so the external binding knows what to launch`);
}

console.log('Open Scaffold runtime binding dry-run');
console.log('========================================');
console.log(`Manifest: ${manifestPath}`);
console.log(`Run ID: ${manifest.runId}`);
console.log(`Task ID: ${manifest.taskId ?? '(none)'}`);
console.log(`Plan: ${manifest.plan.path}`);
console.log(`Goal: ${manifest.plan.goal ?? '(not recorded)'}`);
console.log(`Executor lane: ${lane}`);
console.log(`Harness skill: ${harnessSkill ?? '(none)'}`);
console.log(`Operator surface: ${manifest?.bindings?.operatorSurface ?? '(none)'}`);
console.log(`Repository: ${manifest?.runtime?.repoPath ?? '(not recorded)'}`);
console.log(`Worktree: ${manifest?.runtime?.worktreePath ?? '(not recorded)'}`);
console.log(`Branch: ${manifest?.runtime?.branch ?? '(not recorded)'}`);
console.log(`Commit policy: ${manifest.commitPolicy}`);
console.log('');
console.log('Dry-run verdict: this package is dispatchable to an external binding.');
console.log('No runtime was launched. No credentials were read. No global config was mutated.');
console.log('A coordinator or adapter may now translate this run packet into a concrete human/agent/harness handoff outside Open Scaffold core.');
