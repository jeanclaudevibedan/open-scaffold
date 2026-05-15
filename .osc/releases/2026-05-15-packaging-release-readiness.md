# Release / Evidence Note: packaging and release readiness checklist

Date: 2026-05-15

## Summary

This note inventories Open Scaffold's product packaging and release-readiness state without publishing a new release. It pins what is already shipped, what is verifiable today, and what remains open for the next adoption signal. Treat the checklists as evidence, not as a forward-looking commitment.

## Traceability

- Roadmap item: `ROADMAP.md` — Milestone 10 (Product packaging and releases).
- Parent plan: `.osc/plans/done/010-product-packaging-release.md`.
- Adjacent shipped slice: `.osc/plans/done/015-cli-packaging-ux.md` (tiered scaffold initialization).
- Existing baseline release evidence: `.osc/releases/2026-05-12-v0.3.0-runtime-neutral-baseline.md`.
- New explanatory doc: `docs/WHY_OPEN_SCAFFOLD.md` (why-this-exists diagram set).
- Publication: pending owner review in the public trust/readiness bundle PR; no new version is cut by this note.

## Current packaging surface

The packaging surface today is the published v0.3.0 baseline plus the local tiered initializer. No new version is cut by this note.

```text
package.json            -> name: open-scaffold, version: 0.3.0, license: MIT, type: module
bin                     -> { "osc": "dist/cli.js" }
engines.node            -> ^20.19.0 || ^22.12.0 || >=24.0.0
files allow-list        -> dist, .osc/RULES.md, .osc/plans, .osc/releases,
                            .osc/specs, docs, AGENTS.md, CLAUDE.md,
                            MISSION.md, ROADMAP.md, README.md, LICENSE, *.sh
scripts                 -> build, prepack, test, smoke:e2e, osc
prepack                 -> npm run build (TypeScript -> dist/)
```

## What is already true (verifiable today)

- [x] `v0.3.0 — Runtime-neutral semi-autonomous protocol baseline` exists as a published GitHub tag/release. Evidence: `.osc/releases/2026-05-12-v0.3.0-runtime-neutral-baseline.md` (records tag `v0.3.0` and Release URL).
- [x] `osc init` ships with `--tier min | standard | max` for clean downstream-repo setup. Evidence: `.osc/releases/2026-05-14-tiered-scaffold-init.md` and `docs/MINIMUM_VIABLE_SCAFFOLD.md`.
- [x] Initializer is local-only and offline after the package is present: no network calls, no GitHub or agent service required, refuses to overwrite unless `--force`. Evidence: `README.md` Quickstart and `src/init.ts` behavior.
- [x] Package metadata is publish-shaped: `bin` entry, narrowed `files` allow-list, `engines.node`, MIT license, `type: module`, `prepack` build hook. Evidence: `package.json` (this repo).
- [x] Verification gates exist for the package: `./verify.sh --standard` and `--strict`, `npm run osc -- verify`, `npm test`, `npm run build`, `npm pack --dry-run`. Evidence: `.osc/releases/2026-05-14-tiered-scaffold-init.md` recorded all five passing for the tiered-init slice.
- [x] Landing narrative explains what the scaffold is and is not, and points to a 60-second viewer demo. Evidence: `README.md`, `docs/EXAMPLES.md`.
- [x] "Why this exists" diagram story is now a standalone reference: `docs/WHY_OPEN_SCAFFOLD.md` (problem → loop → boundary → fit).

## What is open (not claimed as done)

- [ ] `npm publish` to the public npm registry. No evidence of an npm-registry publication exists in `.osc/releases/`. The `prepack` build hook and `files` allow-list are in place, but the actual `npm publish` call has not been made and is parked until the next adoption signal.
- [ ] First-class GitHub Action that runs `verify.sh --standard` + `npm test` + `npm run build` on PRs to enforce the protocol gate. Currently the gate is run locally and recorded in release evidence notes; CI-side enforcement is deferred (related: Milestone 14 deliverable about GitHub Action checks).
- [ ] Template-repo polish on `graphanov/open-scaffold` (template description, topics, social card). The repo is already a GitHub Template per the README badge, but no evidence note captures a template-repo polish slice.
- [ ] Versioning policy doc (`SemVer`, what counts as a breaking protocol change, how amendments map to minor vs. major). Today the convention is implicit.
- [ ] Changelog convention beyond `.osc/releases/`. The release/evidence notes serve as the changelog; a CHANGELOG.md style file is not currently shipped and is deferred unless an adoption signal asks for it.

## Packaging readiness checklist (snapshot)

Use this as a copy-paste checklist when the next release slice is opened.

```text
Metadata
  [x] name, version, license, type set in package.json
  [x] bin entry resolves to built artefact
  [x] engines.node pins supported Node majors
  [x] files allow-list keeps publish surface tight
  [x] prepack runs the TypeScript build

Public artefacts
  [x] README.md landing narrative present
  [x] MISSION.md / ROADMAP.md present
  [x] AGENTS.md / CLAUDE.md present for agent entry points
  [x] LICENSE present (MIT)
  [x] docs/ shipped (system, task/run, workflow, examples, why)
  [x] .osc/ shipped (RULES, plans templates, releases dir)

Verification gates
  [x] ./verify.sh --quick exits 0 on a clean tree
  [x] ./verify.sh --standard exits 0
  [x] ./verify.sh --strict exits 0
  [x] npm run osc -- verify exits 0
  [x] npm test exits 0
  [x] npm run build exits 0
  [x] npm pack --dry-run lists only intended files

Publish path
- [x] Local tarball reproducible via `npm pack --dry-run`; current dry run lists 134 files and excludes `.osc/runs` / `.osc/research`.
  [x] GitHub tag + Release for v0.3.0 published
  [ ] npm registry publish executed
  [ ] CI enforcement of verification gate
  [ ] Template-repo polish slice closed
  [ ] Versioning policy doc shipped

Runtime neutrality
  [x] No runtime-specific spawner in core
  [x] No required private Command Center / Hermes / OMC / OMX dependency
  [x] No secrets, credentials, or model-ranking logic in core
  [x] Adapter/binding contract documented (docs/RUNTIME_BINDING_CONTRACT.md)
```

## Verification

Verification commands for the artifacts touched by this note:

```text
git diff --check              -> passed
./verify.sh --strict          -> 10 pass, 0 fail, 0 warn
npm run osc -- verify         -> PASS, mission defined, 37 plan files, 0 warnings
npm test                      -> 8 files passed, 49 tests passed
npm run build                 -> passed
npm pack --dry-run            -> passed; 134 files; no .osc/runs or .osc/research paths
```

## Outcome

```text
No new version is cut. v0.3.0 remains the published baseline. The packaging
readiness checklist is now a portable, repo-native artefact that the next
release slice can copy/paste from, and the "why this exists" diagram story
has its own scannable doc instead of living only in README prose.
```

## Follow-up

- When an adoption signal asks for an npm-registry publish, open a fresh plan that cites this note and the missing checklist items.
- Pair any CI enforcement work with `docs/GITHUB_WORKFLOW.md` so the gate matches the documented protocol.
- Keep `docs/WHY_OPEN_SCAFFOLD.md` linked from README and docs/EXAMPLES.md so the diagram story stays discoverable.
