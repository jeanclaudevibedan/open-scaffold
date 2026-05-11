# Amendment 3: 001-generic-osc-core

## Parent

001-generic-osc-core

## Date

2026-05-11

## Learning

External architecture feedback clarified that chat-in-the-loop agent systems should not make the chat thread the canonical task/run. The durable model needs a separate task/run record that owns identity, lifecycle, bindings, and recovery, while Discord/Slack/Telegram/GitHub comments act as operator surfaces for status, questions, and approvals.

The same feedback clarified that a single monolithic `ROADMAP.md` should not be the executable truth for every feature. The roadmap gives direction and invariants; executable truth should live in bounded issue/card/spec/plan/package artifacts. If the package is ambiguous, execution frameworks such as OMC/OMX should trigger clarification or deep-interview before implementation.

## New direction

Open Scaffold should define and generate a runtime-neutral task/run/operator-surface schema:

- `task_id` = durable work item or product slice in a task system such as Hermes Kanban, GitHub Issues, Linear/Jira, or a local queue.
- `run_id` = one concrete execution attempt against that task/plan.
- `question_id` = one blocking clarification/approval inside a run.
- chat/thread/comment IDs = optional operator-surface bindings, not canonical task identity.
- tmux/session/worktree/branch/PR/log/evidence paths = runtime/publication bindings attached to a run.

The generic `osc` CLI may create `.osc/runs/<run_id>/run.json` packages with these bindings and package-quality checks, but it must still not spawn runtimes. Coordinators/adapters consume the package and dispatch OMC, OMX, plain agents, or humans. GitHub then acts as the public/versioned publication layer: issue templates capture bounded work, PR templates carry task/run traceability, CI and Codex connector review gate changes, and release/evidence notes close the loop.

## Impact on acceptance criteria

- Strengthens AC12/AC14 from Amendment 2: the bounded-package integration pattern now has concrete task/run IDs, operator-surface bindings, package-quality checks, and lifecycle states.
- Adds AC15: docs must explicitly state that Discord/chat threads are bindings, not canonical task/run state, and reply routing should use `question_id -> run_id` correlation rather than latest-message heuristics.
- Adds AC16: the `osc` CLI must be able to generate a v1 run record containing task ID, executor lane, harness skill, source refs, runtime bindings, operator-surface bindings, package-quality status, artifact paths, and commit policy without spawning an agent.
- Adds AC17: if goal, acceptance criteria, verification, or blocking open questions make a package non-executable, the generated run record must flag clarification/deep-interview before dispatch.
- Adds AC18: docs must describe the GitHub issue/PR/Codex-review loop as the publication and review layer for semi-autonomous work.
- Adds AC19: `.github` templates must capture task/run traceability, verification, evidence, Codex review, and human approval gates.
- Adds AC20: docs must clarify shell scripts as the zero-dependency floor and `osc` as the richer tested package/run implementation path.
