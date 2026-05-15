# Lifecycle E2E Smoke Strategy

Named integrations in this strategy are staged examples. Use [`docs/REFERENCE_TRUTH.md`](REFERENCE_TRUTH.md) to distinguish public examples, private deployment examples, runtime lanes, adapter candidates, and operator surfaces.

Open Scaffold needs one reproducible smoke test that proves the core lifecycle works before it claims success across Discord, Hermes, OMC, OMX, Codex, or any other integration surface.

This page promotes the 2026-05-14 four-lane Claude Code review into a public implementation contract. The raw lane reports remain forensic run evidence under ignored `.osc/runs/`; this document captures the durable product decision.

## What the first smoke must prove

The first E2E smoke should prove that a fresh downstream project can move through the Open Scaffold lifecycle without private infrastructure:

```text
fresh temp/downstream project
  -> mission defined
  -> active plan created
  -> tiny implementation or fixture change verified
  -> evidence/release note written
  -> plan closed
  -> final scaffold verification passes
```

Minimum proof points:

- mission is project-specific, not Open Scaffold maintainer state;
- an active plan exists before close and has the required seven sections;
- a real verification command runs and passes;
- a release/evidence note records what happened;
- `close.sh` moves the plan to `done/` and stamps `MISSION.md`;
- `active/` is empty except `.gitkeep` after close;
- `./verify.sh --standard` passes at the end.

## What it must not prove yet

This first smoke is core-protocol proof only. It should not require or claim coverage for:

- a real Discord server;
- a fresh Hermes installation;
- Hermes Kanban dispatch;
- OMC or OMX execution;
- Codex connector review;
- GitHub PR creation/merge;
- external credentials or network access;
- hosted dashboards or operator rooms.

Those are integration smokes that should build on the core lifecycle smoke after it is green.

## Fresh downstream-state risk

The four-lane review found a high-value adoption risk: a new user can confuse the Open Scaffold product repo's maintainer state with the state a blank downstream project should have.

A good smoke must therefore guard against template leakage. A downstream fixture should not inherit Open Scaffold's own mission, closed plans, private `.osc-dev/` context, or release history as if those belonged to the user's new project.

This matters because a smoke that only verifies the maintainer repo can pass while failing the real adoption question: can a new project use the scaffold from a clean start?

## Recommended implementation shape

Prefer a deterministic test integrated with the existing Node/Vitest suite, backed by a temp project fixture.

Suggested deliverables for the implementation PR:

- `tests/e2e/lifecycle.test.ts` — drives the lifecycle and asserts artifacts;
- `examples/lifecycle-e2e-smoke/` — public-safe tiny downstream project fixture;
- `npm run smoke:e2e` — runs the lifecycle smoke;
- `docs/E2E_SMOKE.md` updates with command examples;
- `docs/EXAMPLES.md` link to the smoke;
- `.osc/releases/<date>-lifecycle-e2e-smoke.md` evidence note;
- a closed plan via `./close.sh` if the smoke ships.

A shell wrapper can be added later for zero-dependency users. The first implementation uses Vitest because the repo already has Node-based tests and Vitest gives stronger assertions.

Run it from the repo root:

```bash
npm run smoke:e2e
```

The smoke copies `examples/lifecycle-e2e-smoke/` into a fresh temp directory, copies `verify.sh` and `close.sh` into that temp project, runs the tiny project's verification, writes an evidence note, closes the plan, and verifies the final scaffold state.

## Tiny fixture guidance

The fixture should be intentionally boring. Good candidates:

- tiny notes CLI;
- tiny todo text file workflow;
- one-page static site content change;
- minimal script with a test file.

The fixture exists to prove the lifecycle, not to demonstrate app ambition.

## Pass / weak-pass / fail

### Pass

- All lifecycle artifacts are generated during the smoke run.
- Final `./verify.sh --standard` passes in the temp project.
- Project-specific verification passes.
- Plan starts in `active/` and ends in `done/`.
- Evidence note references plan and verification.
- No private owner, Hermes, or Discord deployment state is required.

### Weak-pass

- The lifecycle completes, but one or more artifacts are manual-only, stale, copied from the maintainer repo, or not mechanically asserted.
- The smoke documents success but does not prove freshness or artifact linkage.

### Fail

- The smoke requires private infrastructure.
- The mission remains Open Scaffold's maintainer mission.
- The plan never moves from `active/` to `done/`.
- Evidence is missing or decoupled from verification.
- Verification passes only because it checks existing maintainer state.

## Anti-cheat and stale-state checks

The implementation should include at least these checks:

1. The temp project is created fresh for each run.
2. Generated lifecycle artifacts are newer than the smoke start marker.
3. The downstream mission does not equal Open Scaffold's maintainer mission.
4. `.osc-dev/` and private owner-specific paths are absent from the fixture.
5. Active plan exists before close and is absent after close.
6. Done plan exists after close.
7. Evidence/release note mentions the plan and verification command.
8. `MISSION.md` changelog is stamped by `close.sh`.
9. Final `./verify.sh --standard` exits 0.
10. The smoke does not delete files outside its temp directory.

Harder checks such as network-off enforcement, JSON schema validation, negative broken-template tests, and run-id timestamp sanity are valuable follow-ups, not mandatory for the first implementation PR.

## Integration smoke ladder

Build smokes in this order:

1. **Core lifecycle smoke** — local temp/downstream project; no network or private tools.
2. **GitHub workflow smoke** — branch, PR body, review gates, merge, and branch cleanup; network/auth gated.
3. **Simulated operator-surface smoke** — `events.jsonl` proves task/run/question/thread bindings without real Discord or Hermes.
4. **Real Hermes/Discord smoke** — fresh server/install path only after the simulated operator boundary is proven.
5. **Runtime harness smoke** — OMC/OMX/Codex/Claude lanes consume run packets and return evidence.

This ordering keeps Open Scaffold core runtime-neutral while still giving integrations a path to real validation.

## Next PR after this strategy

Recommended next implementation PR:

```text
Title: Add lifecycle E2E smoke fixture
Branch: test/lifecycle-e2e-smoke
Primary plan: .osc/plans/backlog/023-worked-downstream-example.md
```

The implementation PR should not reopen strategy debate. It should implement the smallest deterministic smoke that satisfies this contract.
