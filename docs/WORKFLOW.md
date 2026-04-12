# Workflow

A phase-to-tool reference for agent-orchestrated development. This file is the operational reference; `README.md` is the landing page. When in doubt about which tool to reach for, start here.

## Development phases

Every task moves through a natural progression. You do not need to use every phase — small fixes skip straight to Execute. The phases exist so you know where you are and what to reach for.

### 1. Clarify (when the goal is fuzzy)

Ask structured questions until the goal, constraints, and acceptance criteria are concrete. Don't start building until you can state in one sentence what "done" looks like.

> **With OMC/OMX:** `/oh-my-claudecode:deep-interview` runs Socratic Q&A until ambiguity drops below 20%, producing a spec at `.omc/specs/`.

### 2. Plan (when the task is non-trivial)

Write a plan file in `.omc/plans/` using the 7-section schema in `.omc/plans/handoff-template.md`. The plan must include acceptance criteria — testable bullets that define success. For risky or multi-file work, get the plan reviewed before executing.

> **With OMC/OMX:** `/oh-my-claudecode:plan` or `/ralplan` runs a Planner → Architect → Critic consensus loop.

### 3. Execute (build it)

Implement what the plan says. Independent tasks can run in parallel. Every change must trace back to a plan file or amendment.

> **With OMC:** `/oh-my-claudecode:autopilot` or `/ralph` for autonomous execution. `/oh-my-claudecode:ultrawork` or `/team` for parallel fan-out across multiple agents.
>
> **With OMX:** `codex` for fast boilerplate and single-file edits.
>
> **IDE-native:** Antigravity + Gemini agent pane for inline refactors and UI tweaks.

### 4. Verify (before claiming done)

Check the plan's acceptance criteria one by one. Run tests. Read the diff. Verification traces to criteria, not vibes.

Run `./verify.sh` for a methodology compliance report (mission defined, plans exist, amendments sequential, changelog coverage). Use `./verify.sh --strict` for full checks including plan schema validation and paired-view drift detection.

> **With OMC:** `/oh-my-claudecode:verify` traces back to acceptance criteria in the plan file. Agents also run `./verify.sh --quick` automatically before non-trivial code changes.

### 5. Capture amendments (when you "get smarter")

New information legitimately changes what you're building? That's fine — but capture it, don't silently drift.

1. Do not edit plan files or MISSION.md in place (beyond the `## Changelog` section).
2. Write an amendment file in `.omc/plans/<slug>-amendment-<n>.md` following the schema in `.omc/plans/README.md`.
3. Add a one-line dated entry to MISSION.md's `## Changelog` section.
4. Agents read the original plan plus all amendments in numeric order.

This is the difference between legitimate scope evolution (captured, traceable) and bad scope creep (silent, invisible).

> **With OMC:** `/ccg` (tri-model: Claude + Codex + Gemini) is useful when you're stuck or want a second opinion before amending.

## When to use what

There is no automatic router between tools. You, the human, decide based on the task:

| Task shape | Reach for | Why |
|------------|-----------|-----|
| Fuzzy goal, many unknowns | Clarify phase | Building on assumptions wastes cycles |
| Non-trivial, multi-file | Plan → Execute | A plan prevents scope creep mid-implementation |
| Simple, single-file fix | Execute directly | Overhead of planning exceeds the fix itself |
| Independent parallel tasks | Parallel execution | Fan out across agents for throughput |
| Stuck or uncertain | Second opinion | A different model's perspective breaks deadlocks |

> **With OMC + OMX:** Claude Code + OMC is the *thinking and shipping* cockpit — planning, execution, verification, deep debugging. Codex + OMX is the *typing* cockpit — fast boilerplate where judgment matters less than throughput. Antigravity's Gemini agent is the *IDE-native* cockpit — staying in the editor for UI tweaks and quick inline work.

### Delegation decision tree

When your plan has multiple tasks, use this decision tree to decide how to execute them:

1. **Do any tasks depend on another task's output?** (Data flows, API schemas, generated files)
   - **Yes →** Those tasks must run sequentially. Group the rest for potential parallelism.
   - **No →** Continue to step 2.

2. **Do the candidate parallel tasks touch the same files?**
   - **Yes →** Do NOT parallelize those tasks. Shared files cause merge conflicts and race conditions.
   - **No →** Safe to parallelize. Continue to step 3.

3. **Do you have a capable agent?** (Can it read plan files and use tools?)
   - **Yes, with OMC →** The agent reads the plan's Execution Strategy section and proposes `/team` or `/ultrawork` for parallel groups automatically. You approve or adjust.
   - **Yes, plain Claude Code or similar →** The agent reads the Execution Strategy section and describes the parallelism opportunity. You decide how to act on it.
   - **No agent, or local LLM →** Run `./delegate.sh <plan-path>` to generate actionable prompts you can paste into separate terminal sessions.

### Provider-tier capabilities

What works at each level of tooling:

| Tier | Agent reads Execution Strategy? | Auto-proposes delegation? | Fallback |
|------|--------------------------------|--------------------------|----------|
| **OMC** (oh-my-claudecode) | Yes | Yes — proposes `/team`, `/ultrawork` with specific groups | Full automation |
| **Plain Claude Code** (or similar capable agent) | Yes, if instructed via CLAUDE.md | Describes the opportunity; human decides | Agent-assisted |
| **Local LLM / no agent** | No | No | Run `./delegate.sh <plan-path>` for terminal prompts |

## Session handover

Multi-agent development spans sessions. Without discipline, context is lost between sessions and you start each one from scratch. Here's how to maintain continuity:

### What to produce at the end of each session

- **A completed or updated plan file** — If you finished a task, its plan should have all ACs checked off. If work remains, the plan documents what's done and what's left.
- **Amendments for any scope changes** — Anything you learned that changes the plan goes in an amendment file, not in your head.
- **A changelog entry in MISSION.md** — One line per pivot so the next session (or agent) knows what shifted and why.

### How to hand off between sessions

1. Before ending: review the latest plan + amendments. Is everything captured, or are decisions only in the conversation?
2. Write down unfinished work as open questions in the plan file (Section 7).
3. The next session starts by reading MISSION.md → latest plan → amendments in order. This is the full context handoff — no re-explanation needed.

### When to parallelize

Run tasks in parallel when they are **independent** — they don't share files, don't depend on each other's output, and can be verified separately. If tasks touch the same files or one's output feeds another's input, run them sequentially.

Signs you should parallelize: multiple plan files for independent features, test suites that can run concurrently, documentation updates alongside code changes.

Signs you should NOT parallelize: database migration + code that uses the new schema, API endpoint + its tests (test needs the endpoint first), paired views (CLAUDE.md + AGENTS.md — update one, then mirror).

## Verification marker convention

MISSION.md in this template ships with a machine-detectable empty-mission marker: the HTML comment `<!-- mission:unset -->` plus the literal `TODO: define mission`. Verification tooling should treat the presence of either as **"mission not yet defined"** — a blocker for any scope-expanding work. open-scaffold defines the marker; consuming tools decide how to honor it. Remove both markers only when the real mission has been written and committed.
