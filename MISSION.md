# Mission

Open Scaffold is a runtime-neutral, repo-native operating system for agent-orchestrated development: a portable methodology and repository protocol that lets humans, AI agents, and orchestrators plan, execute, verify, publish, and evolve software work without losing context or ownership.

## Goals

- Provide a durable project substrate: mission, roadmap, plans, amendments, evidence, run packets, decisions, and handoffs as git-tracked files.
- Support any capable orchestrator or agent runtime — Hermes, Claw/OpenClaw, Claude Code, Codex, Gemini, or future tools — without making any one runtime the canonical brain.
- Define clear integration boundaries between orchestrators, runtime harnesses, operator surfaces, repository truth, and GitHub issue/PR workflows.
- Productize the closed evolutionary loop: slice work, capture feedback, amend plans, verify against acceptance criteria, and feed learnings into the next slice.
- Ship a Discord glass-cockpit pattern for private control rooms, team control rooms, and build-in-public workflows while keeping durable truth in the repo/GitHub/task system.
- Dogfood Open Scaffold on Open Scaffold itself: use the framework to grow the framework.

## Non-Goals

Explicit things this project is NOT trying to do. Legitimate scope discipline starts here. When new information arrives that would change what belongs in this list, follow the amendment protocol in `.osc/plans/README.md` — do not silently edit the list.

- Open Scaffold core does not own autonomous agent spawning or long-running execution loops.
- Open Scaffold core does not make Discord, Slack, Telegram, or any chat surface the source of truth.
- Open Scaffold core does not require Hermes, Claw/OpenClaw, Claude Code, Codex, Gemini, OMC, OMX, or any other specific runtime.
- Open Scaffold core does not treat OMC/OMX as equivalent to orchestrator agents: OMC is a Claude Code workflow harness; OMX is a Codex workflow/execution harness.
- Open Scaffold core does not store secrets, private Command Center state, raw runtime sessions, or uncurated agent logs as public product truth.
- Open Scaffold core does not replace GitHub Issues/branches/PRs for public/versioned implementation work.

## Changelog

One-line dated entries for every scope pivot. Format: `YYYY-MM-DD: <one-line pivot description + link to amendment file if applicable>`. Append entries in chronological order. Never rewrite history here.

<!-- append YYYY-MM-DD entries below this line -->
- 2026-05-12: closed 003-glass-cockpit-event-protocol — shipped docs/GLASS_COCKPIT_PROTOCOL.md in PR #6 with Codex feedback addressed
- 2026-05-12: closed 002-slice-close-evidence-loop — shipped docs/SLICE_CLOSE_PROTOCOL.md in PR #5 with Codex review clean
2026-05-11: Defined Open Scaffold as a runtime-neutral repo-native operating system for agent-orchestrated development, with explicit orchestrator/harness/glass-cockpit boundaries.
2026-05-11: Reframed Open Scaffold ontology and roadmap via `.osc/plans/active/001-generic-osc-core-amendment-1.md`.
2026-05-11: Adopted external OMC/OMX/Hermes/clawhip boundary correction via `.osc/plans/active/001-generic-osc-core-amendment-2.md`.
2026-05-11: Documented task/run/operator-surface model and added v1 run binding schema via `.osc/plans/active/001-generic-osc-core-amendment-3.md`.
2026-05-12: Document runtime harness dispatch bridge pattern for Open Scaffold core — see `.osc/plans/active/001-generic-osc-core-amendment-4.md`.
