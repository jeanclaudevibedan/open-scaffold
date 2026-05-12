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

Status: v1 complete; product mission, roadmap, ontology, and self-dogfood baseline are established.

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

Status: v1 complete; README/root docs explain Open Scaffold as a runtime-neutral product rather than only a template.

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

Status: v1 complete in PR #5 via `docs/SLICE_CLOSE_PROTOCOL.md`; future CLI validation is an optional backlog follow-up, not required for the v1 milestone to count as done.

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

Status: v1 complete in PR #6 via `docs/GLASS_COCKPIT_PROTOCOL.md`; implementation examples are optional follow-up slices, not required for the protocol milestone to count as done.

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

Status: v1 complete via PR #3, PR #4, and the Milestone 6 proof in PR #9: task/run identity, GitHub issue/PR templates, run binding options, runtime dispatch pattern, and public issue -> task/run -> PR -> release-note chain exist.

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

Status: v1 complete in PR #7 via `docs/RUNTIME_BINDING_CONTRACT.md`; executable OMC/OMX launchers and JSON-schema enforcement remain adapter/backlog work, not core spawning work.

Goal: support specific harnesses without making them the core system.

Deliverables:

- OMC binding guidance for Claude Code workflows: `/deep-interview`, `/ralplan`, `/team`, `/ralph`, `/ultrawork` where applicable. First public contract shape: `docs/RUNTIME_BINDING_CONTRACT.md`.
- OMX binding guidance for Codex workflows: `$deep-interview`, `$ralplan`, `$team`, `$ralph`, `$ultrawork`, `$ultragoal`. First public contract shape: `docs/RUNTIME_BINDING_CONTRACT.md`.
- Generic handoff packet schema for any future harness. First public contract shape: runtime binding lifecycle, package validation gate, and evidence return contract in `docs/RUNTIME_BINDING_CONTRACT.md`.
- Failure-state taxonomy: prompt not accepted, session blocked, artifact missing, verification failed, human input needed.

Acceptance criteria:

- Open Scaffold core remains runtime-neutral.
- Runtime-specific docs describe OMC/OMX as execution/orchestration lanes, not universal orchestrators.
- OMX is documented as an explicitly selected Codex lane, not the automatic runtime engine for Hermes or OMC.
- A plan can be handed to a harness and return evidence without mutating canonical repo truth incorrectly.

## Milestone 6 — Self-dogfood release loop

Status: v1 complete in PR #9 via GitHub issue #8, `.osc/plans/done/005-self-dogfood-release-loop.md`, run ID `20260512T135850Z-005-self-dogfood-release-loop-run`, Codex clean review, and `.osc/releases/2026-05-12-self-dogfood-release-loop.md`.

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

## V2 roadmap — harden the protocol into a usable product

The v1 baseline proves the model. V2 should make it harder for agents to drift, easier for humans to adopt, and cleaner for runtime harnesses to bind without contaminating core.

### Milestone 7 — CLI validation upgrades

Status: backlog via `.osc/plans/backlog/007-cli-validation-upgrades.md`.

Goal: make stale-state and evidence drift mechanically visible.

Deliverables:

- Validate slice-close evidence and approval status.
- Validate `.osc/releases/` notes for issue/task, plan, run ID, PR, verification, outcome, and follow-up fields.
- Detect stale active plans and active plans with completed/merged evidence.
- Detect cited run IDs with no durable public evidence summary.

### Milestone 8 — User-facing examples

Status: backlog via `.osc/plans/backlog/008-user-facing-examples.md`.

Goal: make Open Scaffold adoptable by people who have never seen Daniel's Command Center.

Deliverables:

- Solo developer example.
- Team control-room example.
- GitHub-only workflow example.
- Runtime harness handoff example.

### Milestone 9 — Runtime harness adapter refresh

Status: backlog via `.osc/plans/backlog/009-runtime-harness-adapter-refresh.md`.

Goal: align OMC/OMX bindings with the public runtime binding contract while keeping runtime launch mechanics outside core.

Deliverables:

- Refresh `open-scaffold-omc` against current core contracts.
- Refresh `open-scaffold-omx` against current core contracts.
- Ensure adapter evidence returns to `.osc` run/release conventions.

### Milestone 10 — Product packaging and releases

Status: backlog via `.osc/plans/backlog/010-product-packaging-release.md`; `v0.3.0` baseline release evidence exists at `.osc/releases/2026-05-12-v0.3.0-runtime-neutral-baseline.md`.

Goal: package the v1 protocol baseline as a public product release.

Deliverables:

- Publish `v0.3.0 — Runtime-neutral semi-autonomous protocol baseline`.
- Add a sharper “why this exists” product diagram/story.
- Evaluate npm/template packaging readiness.

## Independent review addendum — make the useful parts undeniable

A 2026-05-12 independent two-lane review found the core thesis valid and the mechanics working, but also named the adoption gap clearly: Open Scaffold is strongest as repo-native discipline and core tooling, while examples, adapter proof, packaging, and docs compression must catch up.

The review direction is now part of the public roadmap. The priority is not to turn Open Scaffold core into an agent runtime; it is to make the scaffold easier to trust, easier to try, and harder to misunderstand.

### Milestone 11 — Independent review hardening

Status: complete via `.osc/plans/done/012-independent-review-hardening.md` and `.osc/releases/2026-05-12-independent-review-hardening.md`.

Goal: convert external review findings into source-grounded fixes and a small trust-building hardening release.

Deliverables:

- Confirm every report-flagged hardening issue against current source before patching.
- Resolve confirmed `verify.sh`, stale-state, immutability, dependency-audit, or runtime-state hygiene issues.
- Add regression tests or shell fixtures for confirmed validation behavior where practical.
- Record release/evidence notes for what was confirmed, fixed, deferred, or rejected.

### Milestone 12 — Minimal runtime binding example

Status: backlog via `.osc/plans/backlog/013-binding-example.md`.

Goal: prove that `.osc/runs/<run_id>/run.json` can be consumed by an external adapter without making Open Scaffold core the spawner.

Deliverables:

- Add one tiny public binding example or dry-run adapter.
- Show the command path from plan to generated run packet to external runtime handoff.
- Document the safety boundary: core packages work; adapters/harnesses execute it.
- Keep the example credential-free and runnable by a fresh user.

### Milestone 13 — Non-scaffold downstream example

Status: backlog via `.osc/plans/backlog/014-downstream-example-project.md`.

Goal: demonstrate Open Scaffold on one tiny project that is not Open Scaffold itself.

Deliverables:

- Add a public-safe example that demonstrates mission → plan → run packet → evidence → close.
- Make the example small enough to understand in one sitting.
- Use it to show when Open Scaffold is valuable and when it is overkill.

### Milestone 14 — CLI and packaging UX

Status: backlog via `.osc/plans/backlog/015-cli-packaging-ux.md`.

Goal: reduce day-one friction with first-class `osc` commands and an install path that does not require users to reason about shell helpers first.

Deliverables:

- Evaluate and implement the first high-value CLI commands: `osc init`, `osc plan new`, `osc amend`, `osc close`, `osc evidence`.
- Keep existing shell scripts as compatibility wrappers until CLI replacements are proven.
- Evaluate `npx open-scaffold init`, npm packaging, and GitHub Action checks.

### Milestone 15 — Docs compression and public positioning

Status: backlog via `.osc/plans/backlog/016-docs-positioning-compression.md`.

Goal: make the first-read path shorter while surfacing the strongest use cases: multi-session AI development, consulting/client delivery, compliance/audit traceability, and multi-agent handoff.

Deliverables:

- Compress overlapping protocol explanations into a clearer reader path.
- Add or improve the roadmap → issue/task → plan → run → PR → evidence diagram.
- Remove or generalize private/Daniel-specific context in public docs.
- State honestly what exists today versus what is adapter/backlog work.

## Parking lot

- MCP bridge for structured harness dispatch/status/artifact retrieval.
- Repository-local task database option for users without Hermes Kanban/GitHub Issues.
- Visual dashboard beyond Discord posts.
- Templates for stakeholder/client-facing cockpit modes.
- Metrics: cycle time, stale tasks, evidence freshness, approval latency.
