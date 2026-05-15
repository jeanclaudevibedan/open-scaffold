# Agentic runtime selection

Open Scaffold should let a user choose an agentic runtime lane without turning Open Scaffold core into that runtime.

This page is the corrected scope for plan `009-runtime-harness-adapter-refresh`: not ownership cleanup for old adapter repositories, but a runtime-selection surface for OMC / oh-my-claudecode and OMX / oh-my-codex style execution.

## Product intent

A user should be able to say, in Open Scaffold terms:

```bash
npm run osc -- run .osc/plans/active/001-demo.md \
  --runtime omx \
  --workflow plan \
  --repo /path/to/repo \
  --branch feat/demo
```

and get a concrete `.osc/runs/<run_id>/run.json` package that records:

- selected runtime preset;
- selected workflow;
- executor lane;
- harness skill;
- repo/worktree/branch binding;
- package quality;
- evidence/approval expectations;
- `executor.spawning: false` until an external adapter/coordinator launches it.

The selected runtime is dispatchable by an adapter, but Open Scaffold core still does not launch Claude Code, Codex, OMC, OMX, tmux, or any provider process by itself.

## Runtime presets

| Runtime preset | Executor lane | Default backend | Purpose |
|---|---|---|---|
| `omc` | `omc-claude` | Claude Code + OMC / oh-my-claudecode | Claude Code-oriented planning/execution workflows. |
| `omx` | `omx-codex` | Codex + OMX / oh-my-codex | Codex-oriented planning/execution workflows. |
| `plain` | `plain-agent` | Any capable agent or human-operated CLI | Runtime-neutral prompt package. |
| `human` | `human` | Human/manual | Manual execution while preserving evidence gates. |
| `custom` | `custom` | Adapter-defined | Future/private runtime adapter. |

## Workflow presets

| Workflow | OMC harness skill | OMX harness skill | Meaning |
|---|---|---|---|
| `interview` | `/deep-interview` | `$deep-interview` | Clarify fuzzy requirements before execution. |
| `plan` | `/ralplan` | `$ralplan` | Critique/refine/approve a plan. |
| `team` | `/team` | `$team` | Parallel fan-out when plan groups are independent. |
| `loop` | `/ralph` | `$ralph` | Persistent completion loop against approved scope. |
| `execute` | `/ultrawork` | `$ultrawork` | Larger bounded implementation pass. |
| `goal` | `/ultrawork` | `$ultragoal` | Goal-maintenance / next-slice inheritance. |

For `omc` and `omx`, `--workflow` defaults to `plan` so `--runtime omx` and `--runtime omc` produce dispatchable run packets without requiring the user to remember the matching `$ralplan` or `/ralplan` spelling. For `plain`, `human`, or `custom`, workflow is recorded but no harness skill is inferred unless the user provides `--harness-skill` explicitly.

## Boundary

```text
Open Scaffold core = select + package + prove
Runtime adapter     = translate + launch + return receipt/evidence
Runtime harness     = execute while alive
Operator            = approve merge/publish gates
```

Open Scaffold core owns the run-packet contract. Runtime-specific adapters own process launch, authentication, tmux/session lifecycle, hooks, and runtime logs. Runtime state is forensic until promoted into `.osc/runs`, tracked evidence docs, PRs, issues, or release notes.

## Adapter checklist

A runtime adapter that consumes Open Scaffold packages should:

- read `schemaVersion: open-scaffold.run.v1` from `.osc/runs/<run_id>/run.json`;
- respect `runtimeSelection.runtime` and `runtimeSelection.workflow`;
- validate `executor.lane` and `executor.harnessSkill`;
- reject packages where `packageQuality.executable !== true` or blockers are present;
- preserve `commitPolicy` and human approval gates;
- keep receipts, artifacts, and evidence repo-local;
- write an `open-scaffold.dispatch-receipt.v1` dispatch receipt;
- return completion, blocker, verification, and review evidence into the Open Scaffold/GitHub chain;
- never claim completion from runtime-local state alone.

## Non-goals in core

This slice does not:

- delete, migrate, or bless historical adapter repositories;
- install or authenticate OMC/OMX/Claude/Codex;
- spawn a runtime process from Open Scaffold core;
- add provider-specific hooks to core;
- grant commit/push/merge/publish authority by default;
- make model/orchestration-lab claims.

The practical next step after this core selection surface is a separate runtime adapter package or coordinator integration that reads the package and performs the launch outside core.

For schema-backed runtime profiles, built-in profile ids, and project-local custom profiles, see [`RUNTIME_PROFILES.md`](RUNTIME_PROFILES.md). Runtime profiles are data-only in v0: they let users select and document an adapter lane, but they do not install or spawn the runtime from core.
