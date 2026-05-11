# Amendment 1: 001-generic-osc-core

## Parent

001-generic-osc-core

## Date

2026-05-11

## Learning

Open Scaffold must not be framed as only a generic `.osc` template with OMC/OMX adapter repos. The system/product target is broader: Open Scaffold is the runtime-neutral repo-native operating system for agent-orchestrated development. It owns the portable methodology and repository protocol: mission, roadmap, plans, amendments, evidence/run packets, evolutionary feedback loops, documentation discipline, GitHub traceability, and optional glass-cockpit reporting.

Daniel clarified the ontology:

- Hermes, Claw/OpenClaw, Claude Code, Codex, Gemini, and future tools are orchestrators/agents that can operate on Open Scaffold.
- OMC is not an Open Scaffold adapter in the same class as Hermes/OpenClaw; it is a Claude Code workflow/orchestration harness.
- OMX is not an Open Scaffold adapter in the same class as Hermes/OpenClaw; it is a Codex workflow/execution harness with modes such as `$ralplan`, `$ralph`, `$ultrawork`, `$team`, and goal modes.
- Discord is a glass-cockpit/operator surface for private rooms, team rooms, and build-in-public streams; it must not become canonical task truth.
- GitHub Issues/branches/PRs remain the public/versioned development layer.

## New direction

Keep the generic `.osc` core, but expand the public product framing and roadmap so Open Scaffold becomes the system substrate rather than only a template. Replace misleading “OMC/OMX adapters” language with a more precise taxonomy:

- **Open Scaffold core:** runtime-neutral repo protocol and methodology.
- **Orchestrators/agents:** Hermes, Claw/OpenClaw, Claude Code, Codex, Gemini, or custom tools that read and act on Open Scaffold state.
- **Runtime harnesses:** OMC for Claude Code workflows; OMX for Codex workflows.
- **Task/state bridges:** Kanban, GitHub Issues, local queues, or other task systems that may mirror or operate from roadmap/plan state.
- **Operator surfaces:** Discord/Slack/Telegram/CLI/GitHub comments as glass cockpits for nudges, status, blockers, approvals, and public/private devlogs.

Dogfood rule: Open Scaffold should be developed with Open Scaffold. Its own roadmap, issues, plans, amendments, evidence, and glass-cockpit reports should demonstrate the loop before the system claims it as a product capability.

## Impact on acceptance criteria

- AC7 changes from “Documentation explains that OMC uses `.omc/` and OMX uses `.omx/` in separate adapter repos” to “Documentation explains the correct ontology: Open Scaffold core, orchestrators/agents, runtime harnesses, task/state bridges, operator surfaces, and GitHub traceability.”
- Add AC9: `MISSION.md` defines Open Scaffold’s product mission without the `mission:unset` marker.
- Add AC10: `ROADMAP.md` captures the first product milestones, including evolutionary loop, glass cockpit, GitHub issue/PR loop, and harness-bound execution boundaries.
- Add AC11: Public docs avoid saying OMC/OMX are equivalent to Hermes/OpenClaw-style orchestrators; they are runtime harnesses for Claude Code and Codex respectively.
- Add AC12: The repository documents the self-dogfood loop: Open Scaffold is used to develop Open Scaffold.
