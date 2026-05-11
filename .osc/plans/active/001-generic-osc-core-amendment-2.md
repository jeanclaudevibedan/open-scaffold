# Amendment 2: 001-generic-osc-core

## Parent

001-generic-osc-core

## Date

2026-05-11

## Learning

External validation from the Ultraworkers Discord / OmC-OmX bot confirmed the direction but sharpened the boundaries.

The answer validated that Hermes Kanban/Nudge is conceptually a coordination/control layer, while OMC and OMX are runtime-specific execution/workflow layers. It also corrected one important overreach: OMX is not automatically the runtime engine for Hermes or OMC. OMX becomes an execution lane only when a coordinator explicitly dispatches a bounded package into an OMX/Codex session.

The answer also clarified clawhip’s role: clawhip-style tooling is event/session notification and routing glue. It is not the planner, executor, durable task database, or canonical truth layer.

## New direction

Open Scaffold’s ontology should distinguish five roles more explicitly:

- **Coordinator/stateful product-workflow surface:** decides what should happen next, maintains or bridges task/package state, nudges lifecycle, and interacts with the operator. Hermes + Kanban/Nudge is the concrete dogfood example.
- **Execution/orchestration lane:** performs bounded work in a specific base-agent environment. OMC is the Claude Code lane. OMX is the Codex lane.
- **Event/session routing glue:** transports status, session events, blockers, and completion notifications between runtimes and operator surfaces. clawhip-style tooling belongs here.
- **Glass cockpit:** Discord/Slack/Telegram/GitHub comments/CLI dashboards expose state and operator interaction, but do not own truth.
- **Durable truth chain:** Open Scaffold files, task systems, GitHub issues/branches/PRs, and promoted evidence reconstruct what happened.

The canonical integration pattern should be:

```text
Hermes package/card or Open Scaffold roadmap/plan
  -> choose executor lane: OMC, OMX, plain agent, or manual
  -> dispatch bounded prompt/artifact/run packet
  -> executor produces result artifact, PR, status, or blocker
  -> coordinator updates task state / asks operator / nudges next step
  -> evidence is promoted back into Open Scaffold/GitHub
```

Open Scaffold docs must warn against letting Hermes, OMC, OMX, Discord, and GitHub all mutate the same worktree or truth state at the same time. Coordination state and runtime execution state must stay separate.

## Impact on acceptance criteria

- AC11 is strengthened: docs must say OMC is a Claude Code execution/orchestration lane and OMX is a Codex execution/orchestration lane, not universal orchestrators and not automatically selected runtimes.
- AC12 is strengthened: the self-dogfood loop must include explicit coordinator-to-executor dispatch and evidence promotion back into Open Scaffold/GitHub.
- Add AC13: docs must define clawhip-style event/session routing as transport glue, not planner, executor, or canonical task state.
- Add AC14: docs must include the bounded-package integration pattern and the “do not mutate the same worktree/truth state from multiple systems at once” warning.
