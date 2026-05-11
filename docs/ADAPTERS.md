# Integrations, Orchestrators, and Runtime Harnesses

Open Scaffold is the runtime-neutral core. It owns the project contract: mission, roadmap, plans, amendments, verification, evidence, and run artifacts under `.osc/`.

This page uses precise language:

- **Orchestrators/agents** decide or perform work against the Open Scaffold contract.
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

## Orchestrators and agents

Open Scaffold should be usable by any capable orchestrator or agent, including:

- Hermes
- Claw / OpenClaw
- Claude Code
- Codex
- Gemini / Antigravity
- custom scripts, CI jobs, or future agent runtimes

These tools may read and act on Open Scaffold state. They are not required dependencies of the core.

## Runtime harness: OMC / oh-my-claudecode

Base agent: Claude Code
Harness family: OMC / oh-my-claudecode

OMC is a Claude Code workflow/orchestration harness. It is not an Open Scaffold adapter in the same class as Hermes or Claw/OpenClaw.

Responsibilities when used with Open Scaffold:

- Execute Claude Code-native workflows against a bounded Open Scaffold plan or run packet.
- Use workflows such as `/deep-interview`, `/ralplan`, `/team`, `/ralph`, and `/ultrawork` where appropriate.
- Keep OMC runtime state forensic unless promoted into `.osc/runs/`, docs, issues, or PRs.
- Return evidence and status back to the Open Scaffold source-of-truth chain.

Use OMC when the chosen execution lane is Claude Code plus OMC workflow skills.

## Runtime harness: OMX / oh-my-codex

Base agent: Codex
Harness family: OMX / oh-my-codex

OMX is a Codex workflow/execution harness. It is not an Open Scaffold adapter in the same class as Hermes or Claw/OpenClaw.

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
Orchestrators/agents = choose and perform work.
OMC/OMX = runtime harnesses for Claude Code/Codex.
Task bridges = live operational state.
Operator surfaces = glass cockpit.
GitHub = public/versioned implementation layer.
```

Do not put runtime-specific hook logic into generic Open Scaffold core. Put harness-specific behavior in the runtime integration that owns that behavior.
