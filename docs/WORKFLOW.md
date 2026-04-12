# Workflow

Dan's personal phase-to-tool cheat-sheet for agent-orchestrated development. This file is the operational reference; `README.md` is the pitch page. When in doubt about which tool to reach for, start here.

## Phase → tool → command

| Phase | Tool | Command | Notes |
|-------|------|---------|-------|
| Deep research / ambiguity gathering | Claude Code + OMC | `/oh-my-claudecode:deep-interview` | Socratic Q&A until ambiguity ≤ 20%. Use when the goal is fuzzy. Produces a spec at `.omc/specs/`. |
| Planning | Claude Code + OMC | `/oh-my-claudecode:plan` or `/ralplan` | Consensus mode (Planner → Architect → Critic) for risky or multi-file work. |
| Execution (autonomous) | Claude Code + OMC | `/oh-my-claudecode:autopilot` or `/ralph` | Autopilot runs the full idea → code → verify loop. Ralph is the persistence-until-green loop. |
| Parallel execution | Claude Code + OMC | `/oh-my-claudecode:ultrawork` or `/team` | When tasks are independent and can fan out across multiple agents. |
| Quick synthesis / second opinion | Claude Code + OMC | `/ccg` | Tri-model escape hatch (Claude + Codex + Gemini); Claude synthesizes. Use when you're stuck or want triangulation. |
| Codex-native work | Codex CLI + OMX | `codex` | Fast boilerplate, single-file edits, straightforward scaffolding. |
| IDE-native work | Antigravity + Gemini agent | In-IDE agent pane | UI tweaks, inline refactors, staying in the editor. |
| Verification | Claude Code + OMC | `/oh-my-claudecode:verify` | Before claiming done. Traces back to acceptance criteria in the plan file. |
| Amendment capture | Manual | Create `.omc/plans/<slug>-amendment-<n>.md` + add a one-line entry to `MISSION.md`'s `## Changelog` section | When you "get smarter" and the plan needs to evolve. |

## When to use what (the three-model split)

Claude Code + OMC is the *thinking and shipping* cockpit — planning, execution, verification, deep debugging. Codex + OMX is the *typing* cockpit — fast boilerplate, single-file edits where judgment matters less than throughput. Antigravity's Gemini agent is the *IDE-native* cockpit — staying in the editor for UI tweaks and quick inline work. There is no automatic router between the three; you, the human, switch panes based on which tool fits the task.

## Scope evolution protocol

When new information legitimately changes what we're building (the "I got smarter" case):

1. Do not edit plan files or MISSION.md in place beyond the explicit `## Changelog` section.
2. Write an amendment file in `.omc/plans/<slug>-amendment-<n>.md` following the schema in `.omc/plans/README.md`.
3. Add a one-line dated entry to `MISSION.md`'s `## Changelog` section.
4. Agents will read the original plan file plus all amendments in numeric order on next task.

This is the difference between legitimate scope evolution (captured, traceable) and bad scope creep (silent, invisible).

## Verification marker convention

`MISSION.md` in this project ships with a machine-detectable empty-mission marker: the HTML comment `<!-- mission:unset -->` plus the literal `TODO: define mission`. Verification tooling (OMC `/verify`, custom scripts, code reviewers) should treat the presence of either as **"mission not yet defined"** — a blocker for any scope-expanding work. open-scaffold defines the marker; consuming tools decide how to honor it. Remove both markers only when the real mission has been written and committed.
