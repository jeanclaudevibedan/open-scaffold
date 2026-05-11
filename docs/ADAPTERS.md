# Integrations, Orchestrators, and Runtime Harnesses

Open Scaffold is the runtime-neutral core. It owns the project contract: mission, roadmap, plans, amendments, verification, evidence, and run artifacts under `.osc/`.

This page uses precise language:

- **Coordinators/orchestrators** decide what should happen next and may maintain or bridge package/task state.
- **Agents** perform work directly when bounded by the Open Scaffold contract.
- **Runtime harnesses** extend a base agent with workflow modes such as teams, planning, persistence, and verification.
- **Task/state bridges** track live operational state.
- **Operator surfaces** expose status and human interaction.

For the full taxonomy, see [`docs/OPEN_SCAFFOLD_SYSTEM.md`](OPEN_SCAFFOLD_SYSTEM.md).

## Generic core: `jeanclaudevibedan/open-scaffold`

Namespace: `.osc/`
CLI: `osc`

Responsibilities:

- Define the repo-native methodology and source-of-truth boundaries.
- Parse missions, roadmap items, plans, amendments, acceptance criteria, and Execution Strategy sections.
- Generate prompt/artifact bundles with `osc` under `.osc/runs/`.
- Keep all outputs inspectable as files.
- Never spawn autonomous agents directly.
- Remain useful to any orchestrator or agent runtime.

## Coordinators, orchestrators, and agents

Open Scaffold should be usable by any capable coordinator, orchestrator, or agent, including:

- Hermes as a coordinator / stateful product-workflow surface.
- Hermes Kanban/Nudge as coordination/control and live task lifecycle.
- Claw / OpenClaw as autonomous coding or orchestration agents.
- Claude Code, Codex, Gemini / Antigravity as base agent runtimes.
- GitHub Issues as public task/intent state.
- custom scripts, CI jobs, or future agent runtimes.

These tools may read and act on Open Scaffold state. They are not required dependencies of the core. When they invoke a runtime harness, they should dispatch a bounded package and receive result artifacts/status back into the source-of-truth chain.

## Runtime harness: OMC / oh-my-claudecode

Base agent: Claude Code
Harness family: OMC / oh-my-claudecode

OMC is a Claude Code execution/orchestration lane. It is useful when Claude Code is the execution environment. It is not an Open Scaffold adapter in the same class as Hermes or Claw/OpenClaw.

Responsibilities when used with Open Scaffold:

- Execute Claude Code-native workflows against a bounded Open Scaffold plan or run packet.
- Use workflows such as `/deep-interview`, `/ralplan`, `/team`, `/ralph`, and `/ultrawork` where appropriate.
- Keep OMC runtime state forensic unless promoted into `.osc/runs/`, docs, issues, or PRs.
- Return evidence and status back to the Open Scaffold source-of-truth chain.

Use OMC when the chosen execution lane is Claude Code plus OMC workflow skills.

## Runtime harness: OMX / oh-my-codex

Base agent: Codex
Harness family: OMX / oh-my-codex

OMX is a Codex execution/orchestration lane. It is useful when Codex is the executor, reviewer, or planner lane. It is not automatically the runtime for Hermes or OMC; a coordinator must explicitly dispatch a bounded package into an OMX/Codex session.

Responsibilities when used with Open Scaffold:

- Execute Codex-native planning, team, persistence, and verification workflows against a bounded Open Scaffold plan or run packet.
- Use workflows such as `$deep-interview`, `$ralplan`, `$team`, `$ralph`, `$ultrawork`, and `$ultragoal` where appropriate.
- Keep OMX runtime state forensic unless promoted into `.osc/runs/`, docs, issues, or PRs.
- Return evidence and status back to the Open Scaffold source-of-truth chain.

Use OMX when the chosen execution lane is Codex plus OMX workflow skills.

## Task/state bridges

Task/state bridges track live work state: queued, ready, running, blocked, review, done.

Examples:

- Hermes Kanban
- GitHub Issues
- Linear/Jira
- local task queues
- custom orchestrator state

Open Scaffold should link to these systems without turning any one of them into a hard dependency.

## Event/session routing glue

Routing glue moves events between runtimes, sessions, and operator surfaces. clawhip-style tooling belongs here.

It may:

- forward active-session and completion events
- route blockers/questions to Discord or another cockpit
- attach session/log/status metadata to a task or run packet

It should not:

- decide the plan
- execute the task
- become the task database
- replace Open Scaffold/GitHub/task-system evidence

## Operator surfaces / glass cockpits

Operator surfaces display and route human interaction:

- Discord
- Slack
- Telegram
- CLI dashboards
- GitHub comments
- web dashboards

A glass cockpit may show:

- roadmap nudges
- active sessions
- blockers and questions
- worker reports
- approval requests
- GitHub issue/PR links
- evidence receipts

Rule:

```text
The glass cockpit is the window and steering wheel.
The repo/task/GitHub chain remains the durable truth.
```

## Rule of thumb

```text
Open Scaffold = repo protocol and methodology.
Coordinators = choose what should happen next and manage/bridge task state.
Agents = perform bounded work.
OMC = Claude Code execution/orchestration lane.
OMX = Codex execution/orchestration lane.
Event routers = session/status transport.
Task bridges = live operational state.
Operator surfaces = glass cockpit.
GitHub = public/versioned implementation layer.
```

Do not put runtime-specific hook logic into generic Open Scaffold core. Put harness-specific behavior in the runtime integration that owns that behavior.
