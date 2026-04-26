# Runtime Adapters

open-scaffold is the runtime-neutral core. It owns the project contract: mission, plans, amendments, verification, run artifacts, and prompt bundles under `.osc/`.

Adapters are optional engines that translate that contract into runtime-native folders, commands, and handoffs.

## Generic core: [`jeanclaudevibedan/open-scaffold`](https://github.com/jeanclaudevibedan/open-scaffold)

Namespace: `.osc/`
CLI: `osc`

Responsibilities:
- Parse missions, plans, amendments, acceptance criteria, and Execution Strategy sections.
- Generate prompt/artifact bundles with `osc` under `.osc/runs/`.
- Keep all outputs inspectable as files.
- Never spawn autonomous agents directly.

## OMC adapter: [`jeanclaudevibedan/open-scaffold-omc`](https://github.com/jeanclaudevibedan/open-scaffold-omc)

Namespace: `.omc/`
CLI: `osc-omc`
Runtime: [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) / Claude Code

Responsibilities:
- Keep the scaffold workflow in `.omc/plans/` for OMC-native projects.
- Generate OMC handoffs for `/deep-interview`, `/ralplan`, `/team`, and `/ralph`.
- Preserve mission-first planning, immutable plans, amendments, and `verify.sh` checks.
- Perform runtime-native handoff/spawning through OMC, not through generic open-scaffold.

## OMX adapter: [`jeanclaudevibedan/open-scaffold-omx`](https://github.com/jeanclaudevibedan/open-scaffold-omx)

Namespace: `.omx/`
CLI: `osc-omx`
Runtime: [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) / Codex CLI

Responsibilities:
- Keep the scaffold workflow in `.omx/plans/` for OMX-native projects.
- Generate OMX handoffs for `$deep-interview`, `$ralplan`, `$team`, and `$ralph`.
- Respect OMX conventions: `.omx/state`, `AGENTS.md`, tmux-backed team runtime, Codex hooks/`.codex/hooks.json`, and the rule not to simulate real OMX workflows.
- Perform runtime-native handoff/spawning through OMX/Codex, not through generic open-scaffold.

## Rule of thumb

`.osc` is the chassis. `.omc` and `.omx` are adapter-owned engine bays.

Do not put runtime-specific hook logic into generic open-scaffold. Put it in the adapter repo that owns that runtime.
