# Open Scaffold Roadmap

Open Scaffold is developed with Open Scaffold. This roadmap is both a product plan and a dogfood artifact: roadmap items should become issues, plans, run packets, evidence, and release notes through the same discipline the project recommends to others.

## Product thesis

Open Scaffold is a runtime-neutral, repo-native operating system for agent-orchestrated development. It gives humans and agents a durable shared substrate for mission, roadmap, plans, amendments, evidence, handoffs, verification, GitHub traceability, and operator-room reporting.

The core promise:

> Any capable agent or orchestrator can enter a repository, understand what matters, pick up bounded work, prove what changed, and hand the project back without relying on vanished chat context.

## System ontology

- **Open Scaffold core** owns the repo protocol and documentation discipline.
- **Orchestrators/agents** such as Hermes, Claw/OpenClaw, Claude Code, Codex, Gemini, or custom scripts operate on that protocol.
- **Runtime harnesses** such as OMC and OMX provide workflow modes for specific base agents:
  - OMC = Claude Code workflow/orchestration harness.
  - OMX = Codex workflow/execution harness.
- **Task/state bridges** such as Hermes Kanban or GitHub Issues coordinate live work state, dependencies, assignments, and review gates.
- **Operator surfaces** such as Discord, Slack, Telegram, CLI, or GitHub comments expose status, blockers, approvals, and build-in-public streams.
- **GitHub** owns public/versioned work artifacts: issues, branches, PRs, releases, and CI results.

## Canonical identity chain

A mature Open Scaffold work item should be traceable through a chain like:

```text
ROADMAP item
  -> GitHub issue or private task
  -> scaffold plan / amendment
  -> task_id / run_id binding
  -> run packet / evidence
  -> branch / PR
  -> verification gate
  -> release note / roadmap update
```

Not every small task needs every link, but meaningful work should make the chain explicit.

## Milestone 0 — Product contract and dogfood baseline

Goal: make the product identity and ontology precise enough that agents stop making wrong boundary assumptions.

Deliverables:

- Replace unset template mission with Open Scaffold's product mission.
- Add this `ROADMAP.md`.
- Add a system-ontology document explaining orchestrators, harnesses, task bridges, operator surfaces, and GitHub.
- Amend the active plan to capture the ontology change.
- Run methodology verification and record expected gaps.

Acceptance criteria:

- `MISSION.md` has no `mission:unset` marker.
- Public docs do not frame OMC/OMX as orchestrators equivalent to Hermes/OpenClaw.
- `ROADMAP.md` names the self-dogfood loop.
- `./verify.sh --quick --quiet` passes, or any failure is explicit and actionable.

## Milestone 1 — Core documentation hardening

Goal: make Open Scaffold understandable as a product, not only as a template.

Deliverables:

- Rewrite README positioning around repo-native agent-orchestrated development.
- Add concise diagrams or examples for the identity chain.
- Update `docs/WORKFLOW.md` to separate generic phases from runtime/harness choices.
- Update `docs/ADAPTERS.md` or replace it with an integrations/harnesses guide.
- Align `AGENTS.md` and `CLAUDE.md` paired views.

Acceptance criteria:

- A fresh agent can state the ontology correctly after reading root docs.
- A human can understand when to use Open Scaffold core versus Hermes, Claw, OMC, OMX, GitHub, or Discord.
- Documentation includes at least one worked example from roadmap item to PR/evidence.

## Milestone 2 — Evolutionary closed-loop protocol

Status: first public protocol shipped in PR #5 via `docs/SLICE_CLOSE_PROTOCOL.md`; future CLI validation remains optional follow-up.

Goal: productize the “slice → feedback → correction → approval → next slice” learning loop.

Deliverables:

- Define feedback-capture format. First public shape: evidence receipt in `docs/SLICE_CLOSE_PROTOCOL.md`.
- Define slice close criteria. First public shape: postflight checklist and approval taxonomy in `docs/SLICE_CLOSE_PROTOCOL.md`.
- Define how corrections become amendments, evidence, roadmap changes, or next-slice inheritance.
- Add validation checks for stale state, fake evidence, or weak approvals. First public shape: manual checklist and anti-patterns; CLI validation remains a future implementation option.

Acceptance criteria:

- A slice cannot be called closed without explicit evidence and acceptance-gate status.
- Weak-positive / procedural approvals can be marked differently from strong product approval.
- The next slice can inherit corrections without relying on chat memory.

## Milestone 3 — Glass cockpit MVP

Status: in progress via `.osc/plans/active/003-glass-cockpit-event-protocol.md` and `docs/GLASS_COCKPIT_PROTOCOL.md`.

Goal: make build-in-public / private control-room operation a first-class Open Scaffold capability.

Deliverables:

- Define glass-cockpit event types: nudge, active session, blocker, question, answer, approval request, completion report, evidence receipt, PR link. First public shape: `docs/GLASS_COCKPIT_PROTOCOL.md`.
- Define event/session transport separately from the cockpit: clawhip-style routers, webhooks, gateway adapters, and session hooks carry events but do not plan or execute.
- Define public/team/private modes. First public shape: private, team, build-in-public, and stakeholder modes in `docs/GLASS_COCKPIT_PROTOCOL.md`.
- Provide Discord-first examples while keeping the protocol surface generic enough for Slack/Telegram/CLI/GitHub comments.
- Specify that chat is a surface, not canonical truth.

Acceptance criteria:

- A team can run a Discord build-in-public channel from Open Scaffold state.
- A solo dev can run a private cockpit with the same event types.
- Status posts link back to canonical repo/task/issue/evidence IDs.
- Event routers are documented as transport glue, not as source-of-truth databases or executor agents.

## Milestone 4 — ROADMAP / GitHub / task bridge

Goal: connect roadmap intent to live work without duplicating truth.

Deliverables:

- Define when a roadmap item becomes a GitHub issue.
- Define when an issue becomes a live task in an orchestrator/task system.
- Define task metadata needed for harness execution: repo, run mode, allowed paths, acceptance criteria, evidence path, approval gates.
- Define the task/run identity split: `task_id` for durable work item, `run_id` for one execution attempt, `question_id` for blocking operator prompts, and chat/thread ids as optional bindings.
- Define the coordinator-to-executor pattern: task/card/package chooses OMC, OMX, plain agent, or manual lane; execution returns artifact/status/blocker; coordinator updates state.
- Add templates for issue bodies and task handoff packets.
- Ship `osc` run binding options that create v1 `.osc/runs/<run_id>/run.json` records without spawning runtimes.

Acceptance criteria:

- One roadmap item can be converted into GitHub issues and live tasks with stable IDs.
- The repo can answer “what is the source of truth for this work?” at each stage.
- No Discord thread or runtime transcript is required to reconstruct task state.
- A generated run record can bind a task/card/issue to an executor lane, operator surface, worktree/branch, and evidence paths.
- GitHub issue and PR templates capture task/run traceability and review gates.

## Milestone 5 — Runtime harness bindings

Goal: support specific harnesses without making them the core system.

Deliverables:

- OMC binding guidance for Claude Code workflows: `/deep-interview`, `/ralplan`, `/team`, `/ralph`, `/ultrawork` where applicable.
- OMX binding guidance for Codex workflows: `$deep-interview`, `$ralplan`, `$team`, `$ralph`, `$ultrawork`, `$ultragoal`.
- Generic handoff packet schema for any future harness.
- Failure-state taxonomy: prompt not accepted, session blocked, artifact missing, verification failed, human input needed.

Acceptance criteria:

- Open Scaffold core remains runtime-neutral.
- Runtime-specific docs describe OMC/OMX as execution/orchestration lanes, not universal orchestrators.
- OMX is documented as an explicitly selected Codex lane, not the automatic runtime engine for Hermes or OMC.
- A plan can be handed to a harness and return evidence without mutating canonical repo truth incorrectly.

## Milestone 6 — Self-dogfood release loop

Goal: ship Open Scaffold improvements through Open Scaffold itself.

Deliverables:

- Convert this roadmap into issues.
- Use plans/amendments for meaningful work.
- Record run packets/evidence for agent-assisted changes.
- Open PRs that link roadmap item, issue, task_id, run_id, plan, verification, Codex review, and evidence.
- Publish release notes that cite the loop.

Acceptance criteria:

- At least one public PR demonstrates the full chain.
- The PR can be understood without private Daniel Command Center context.
- Codex connector review is triggered or explicitly skipped with rationale.
- The release notes explain what was learned from dogfooding.

## Parking lot

- MCP bridge for structured harness dispatch/status/artifact retrieval.
- Repository-local task database option for users without Hermes Kanban/GitHub Issues.
- Visual dashboard beyond Discord posts.
- Templates for stakeholder/client-facing cockpit modes.
- Metrics: cycle time, stale tasks, evidence freshness, approval latency.
