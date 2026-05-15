# Roach Pi Inspiration Boundary

`tmdgusya/roach-pi` is a useful reference point for disciplined agent runtimes, but open-scaffold does not copy its code or become a Pi extension.

## What we like conceptually

- Workspace memory: agents should stop forgetting important project lessons.
- Strict engineering prompts: implementation agents should read first, scope tightly, verify, and avoid opportunistic refactors.
- Autonomous follow-through: runtime adapters should be able to spawn agents and continue from plan to verification without the user constantly asking "what now?".
- Reviewer fleets: independent reviewer perspectives can catch bugs, risks, dependency conflicts, and value gaps.
- Prompt/artifact observability: orchestration should leave readable files behind.

## What generic open-scaffold adopts

- Runtime-neutral prompt bundles under `.osc/runs/`.
- Strict plan/acceptance-criteria discipline.
- Execution Strategy sections that can be consumed by humans, OMC, OMX, or future runtimes.
- Future room for file-backed project knowledge, not hidden generic runtime memory.

## What generic open-scaffold does not adopt

- Pi-specific APIs such as `pi.registerCommand`, `pi.registerTool`, `pi.on`, or `ctx.ui`.
- Pi subprocess spawning.
- Runtime HUDs or TUI surfaces.
- Hidden workspace memory injection in the generic core.
- Autonomous GitHub issue processing in the generic core.

## Where autonomy belongs

Autonomous spawning belongs in adapter repos:

- [`open-scaffold-omc`](https://github.com/jeanclaudevibedan/open-scaffold-omc) for Claude Code + OMC (`.omc`/`osc-omc`) — **historical/unmigrated repository** reference under the older namespace.
- [`open-scaffold-omx`](https://github.com/jeanclaudevibedan/open-scaffold-omx) for Codex CLI + OMX (`.omx`/`osc-omx`) — **historical/unmigrated repository** reference under the older namespace.

The generic repo produces the contract and artifacts. Adapters decide how to execute them.
