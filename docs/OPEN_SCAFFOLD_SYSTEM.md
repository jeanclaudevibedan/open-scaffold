# Open Scaffold System Ontology

Open Scaffold is not an agent runtime. It is the repo-native operating system that lets different humans, agents, orchestrators, runtime harnesses, task systems, and operator surfaces cooperate without losing the thread.

## One-sentence definition

Open Scaffold is a runtime-neutral repository protocol for agent-orchestrated development: mission, roadmap, plans, amendments, evidence, handoffs, verification gates, and publication traces as durable files.

## Layers

### 1. Open Scaffold core

Open Scaffold core owns the portable project substrate:

- `MISSION.md` — product/project intent, goals, non-goals, changelog.
- `ROADMAP.md` — directional backlog and milestone story.
- `.osc/plans/` — immutable plans, amendments, stage-folder status.
- `.osc/specs/` — durable specs and context packs.
- `.osc/runs/` — generated run packets, prompt bundles, execution evidence.
- `docs/` — decisions, workflow standards, examples, operator guidance.
- `verify.sh` / `osc verify` — methodology compliance checks.

Core does **not** spawn agents. It defines the contract that agents and tools can use.

### 2. Orchestrators and agents

Orchestrators/agents decide what to do next or perform work against the Open Scaffold substrate.

Examples:

- Hermes
- Claw / OpenClaw
- Claude Code
- Codex
- Gemini / Antigravity
- Custom scripts or CI bots

These tools may read roadmap items, create plans, execute work, ask for approval, open PRs, or update evidence — but they should preserve Open Scaffold’s source-of-truth boundaries.

### 3. Runtime harnesses

Runtime harnesses extend a base agent with workflow modes, teams, persistence, planning, or verification.

They are not the same class as orchestrators like Hermes or Claw/OpenClaw.

#### OMC

OMC / oh-my-claudecode is a Claude Code workflow/orchestration harness.

It can provide Claude Code-native capabilities such as:

- `/deep-interview`
- `/ralplan`
- `/team`
- `/ralph`
- `/ultrawork`
- hooks, agents, skills, HUD, notifications, and team workflows

Use OMC when the execution lane is Claude Code plus OMC-specific workflows.

#### OMX

OMX / oh-my-codex is a Codex workflow/execution harness.

It can provide Codex-native capabilities such as:

- `$deep-interview`
- `$ralplan`
- `$team`
- `$ralph`
- `$ultrawork`
- `$ultragoal`
- goal modes, tmux teams, state surfaces, and verification workflows

Use OMX when the execution lane is Codex plus OMX-specific planning/execution workflows.

### 4. Task and state bridges

Task systems hold live operational state: what is ready, running, blocked, under review, or done.

Examples:

- Hermes Kanban
- GitHub Issues
- Linear
- Jira
- a local SQLite task queue
- a custom orchestrator board

Open Scaffold should define how roadmap items and plans link to these systems, but it should not assume one board is universal.

### 5. Operator surfaces / glass cockpits

Operator surfaces let humans and teams see, steer, approve, or unblock work.

Examples:

- Discord
- Slack
- Telegram
- CLI dashboards
- GitHub issue/PR comments
- web dashboards

The glass cockpit can run in several modes:

- **Private cockpit:** solo dev / personal agent room.
- **Team control room:** internal engineering room.
- **Build-in-public room:** public or semi-public devlog channel.
- **Stakeholder room:** curated client/product updates.

Operator surfaces are **not canonical truth**. They should link back to roadmap items, task IDs, run packets, evidence, issues, branches, and PRs.

### 6. GitHub/public versioning layer

GitHub owns public/versioned implementation state:

- issues
- branches
- PRs
- reviews
- CI results
- releases

A mature Open Scaffold workflow should make GitHub artifacts traceable to roadmap items, plans, evidence, and verification gates.

## Correct boundary statements

Use these statements in product docs and agent prompts:

```text
Open Scaffold is the repo protocol, not the agent runtime.
Hermes and Claw/OpenClaw are orchestrators/agents that can operate Open Scaffold.
Claude Code, Codex, and Gemini can operate Open Scaffold directly or through harnesses.
OMC is a Claude Code workflow harness.
OMX is a Codex workflow/execution harness.
Discord is a glass cockpit, not canonical state.
GitHub is public/versioned work truth.
```

## Anti-patterns

Avoid these claims:

```text
OMX is an Open Scaffold adapter in the same sense Hermes is.
OMC is the Open Scaffold orchestrator.
Discord is the task database.
Runtime session logs are durable project truth.
A chat transcript is enough evidence for done.
Open Scaffold requires one preferred agent runtime.
```

## Self-dogfood loop

Open Scaffold should be developed with Open Scaffold:

```text
ROADMAP.md
  -> GitHub issue or live task
  -> .osc plan / amendment
  -> runtime/harness handoff when needed
  -> .osc run packet / evidence
  -> verification gate
  -> PR / release note
  -> roadmap update
```

This is the product proof. The framework earns trust by using its own protocol to evolve.
