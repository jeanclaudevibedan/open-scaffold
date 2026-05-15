<div align="center">

# 🧱 open-scaffold

**A repo-native source of truth for AI-assisted software work.**

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Template](https://img.shields.io/badge/GitHub-Template-blue.svg)](https://github.com/graphanov/open-scaffold/generate)
[![Works with](https://img.shields.io/badge/Works%20with-Any%20agent-green.svg)](#runtime-neutral-by-design)

</div>

Open Scaffold gives solo developers and small teams a lightweight way to keep AI coding work traceable. It stores mission, roadmap, plans, run packets (execution packages), evidence, decisions, and handoff notes in the repo so humans and agents can see what was asked, changed, verified, and approved.

Use it when AI work spans sessions, PRs, agents, or review gates — especially when you need proof without a documentation swamp.

> **What it is:** a repo-native protocol (files, folders, helper scripts, a verification check) that any agent or orchestrator can operate on.
>
> **What it is not:** an agent runtime, a Discord bot, a daemon, a task database, a model ranker, or a code reviewer. Those live in tools you choose; the scaffold is what they read and write.

---

## The problem

AI agents can write useful code, but the workflow often disappears into chat logs and terminal sessions:

```text
Idea -> chat thread -> agent session -> PR -> "looks done?"
```

Weeks later nobody can reconstruct intent, acceptance criteria, verification evidence, or human approval.

Open Scaffold fixes that by making the repository the shared memory. Chat, Discord, terminals, GitHub comments, and agent transcripts can help operate the work, but durable truth lives in files and PRs.

---

## 60-second demo

Want the loop before the theory? Read [`docs/EXAMPLES.md`](docs/EXAMPLES.md#60-second-viewer-demo). It shows the four artifacts that matter:

```text
Mission -> plan -> verification -> evidence/status
```

For a non-recursive version of the same loop, read the [downstream walkthrough](docs/examples/downstream-walkthrough.md): a tiny shell CLI carried through mission, plan, run packet, evidence, and close. For broader usage shapes — solo developer, team control-room, GitHub-only workflow, and runtime harness handoff — see the [examples index](docs/examples/README.md).

---

## What you get

- **Mission and roadmap** — `MISSION.md` and `ROADMAP.md` keep direction visible.
- **Plans** — `.osc/plans/` holds small specs with context, goal, constraints, acceptance criteria, verification, and open questions.
- **Amendments** — scope changes become add-on records instead of silent rewrites.
- **Run packets** — `.osc/runs/<run_id>/run.json` can bind a plan to a task, branch, lane, surface, and evidence path.
- **Evidence and releases** — `.osc/releases/` records what shipped, how it was verified, and what follows.
- **Verification** — `./verify.sh` and `osc` catch missing mission, stale plans, broken amendments, and release/evidence drift.
- **Agent entry points** — `AGENTS.md` and `CLAUDE.md` tell coding agents how to operate without fresh explanations.

Short version:

```text
Roadmap or issue
  -> plan
  -> run packet / task id
  -> branch / PR
  -> verification evidence
  -> approval / amendment / next slice
```

---

## Quickstart

### 1. Initialize the scaffold tier you need

Use the CLI when Node is available:

```bash
npx open-scaffold init --tier min --target <your-project>
cd <your-project>
```

Tiers:

- `min` — mission, rules, plan workflow/template, release evidence folder, and shell helpers.
- `standard` — `min` plus README/roadmap, agent instructions, amendment helper, and core docs.
- `max` — `standard` plus GitHub/glass-cockpit/runtime docs, delegation helper, and advanced `.osc/` folders.

The initializer is local-only: it does not require network access after the package is present, does not call GitHub or agent services, and refuses to overwrite existing files unless `--force` is supplied.

If you prefer GitHub's template flow:

```bash
gh repo create <your-project> --template graphanov/open-scaffold --clone
cd <your-project>
```

Or use GitHub's **Use this template** button.

### 2. Bootstrap the mission

```bash
./bootstrap.sh
```

Bootstrap asks what the project is, what it should achieve, and what it should not do. That mission gates later plans.

### 3. Write the first plan

If the goal is clear, tell your agent:

```text
Write a plan in .osc/plans/active/ for <task> using .osc/plans/handoff-template.md.
```

If the goal is fuzzy, ask the agent to interview you first, then write the plan. Or copy the template manually:

```bash
cp .osc/plans/handoff-template.md .osc/plans/active/my-first-task.md
```

### 4. Verify the scaffold

```bash
./verify.sh
```

Use `./verify.sh --standard` before calling a meaningful slice done.

### 5. Create a run packet when a harness should execute it

Open Scaffold core does not spawn agents. It packages work so a coordinator, adapter, or human can dispatch it:

```bash
npm run osc -- run .osc/plans/active/my-first-task.md \
  --task-id TASK-001 \
  --executor plain-agent \
  --operator-surface github \
  --repo "$PWD"
```

See [`docs/RUNTIME_BINDING_CONTRACT.md`](docs/RUNTIME_BINDING_CONTRACT.md) and [`docs/examples/runtime-binding-dry-run.mjs`](docs/examples/runtime-binding-dry-run.mjs).

---

## Runtime-neutral by design

Open Scaffold is not an agent runtime, Discord bot, PR reviewer, or task database. It is the repo protocol those tools can share.

- **Coordinators / task state:** GitHub Issues, Linear/Jira, custom bots, or private deployment examples such as Hermes Kanban decide what should happen next.
- **Runtime lanes:** Claude Code, Codex, Cursor, Gemini, OMC, OMX, Aider, or a human terminal can execute bounded work outside Open Scaffold core.
- **Operator surfaces:** Discord, Slack, Telegram, GitHub comments, or CLI dashboards can show status and collect approvals.
- **Core truth:** mission, plans, amendments, run packets, evidence, decisions, and release notes stay in the repo.

Full map: [`docs/OPEN_SCAFFOLD_SYSTEM.md`](docs/OPEN_SCAFFOLD_SYSTEM.md), [`docs/TASK_RUN_MODEL.md`](docs/TASK_RUN_MODEL.md), [`docs/GITHUB_WORKFLOW.md`](docs/GITHUB_WORKFLOW.md), and [`docs/REFERENCE_TRUTH.md`](docs/REFERENCE_TRUTH.md).

---

## When it helps

Open Scaffold is useful when work needs to survive context loss:

- multi-session AI-assisted development;
- consulting and client delivery, where "what was asked, decided, and verified" must be reviewable later;
- compliance or audit-sensitive work that wants lightweight, file-level evidence instead of a heavier governance stack;
- multi-agent handoffs where chat history is not enough;
- projects where "done" needs acceptance criteria and verification, not vibes.

It is overkill for one-off scripts, disposable prototypes, or tasks that fit in a single clean session. The scaffold is the substrate; it does not replace SOC 2, ISO, or formal audit tooling — it gives those processes durable repo artifacts to point at.

---

## Where the roadmap is going

The current focus comes from an independent two-lane review (2026-05-12) which found the core thesis valid but the adoption gap real. Public roadmap priorities are: undeniable examples, adapter proof, packaging, and docs compression — not turning Open Scaffold core into an agent runtime. See the [review addendum](ROADMAP.md#independent-review-addendum--make-the-useful-parts-undeniable) for the milestone list.

---

## Key docs

- [`MISSION.md`](MISSION.md) — product goals, non-goals, and scope changelog.
- [`ROADMAP.md`](ROADMAP.md) — product direction and milestones.
- [`.osc/RULES.md`](.osc/RULES.md) — compact operating rules.
- [`.osc/plans/WORKFLOW.md`](.osc/plans/WORKFLOW.md) — how plans move through backlog, active, done, and blocked.
- [`docs/WORKFLOW.md`](docs/WORKFLOW.md) — phase-to-tool guide.
- [`docs/SLICE_CLOSE_PROTOCOL.md`](docs/SLICE_CLOSE_PROTOCOL.md) — evidence-backed slice closure.
- [`docs/GLASS_COCKPIT_PROTOCOL.md`](docs/GLASS_COCKPIT_PROTOCOL.md) — chat/control-room surfaces.
- [`docs/FAQ.md`](docs/FAQ.md) — deeper explanations.
- [`docs/REFERENCE_TRUTH.md`](docs/REFERENCE_TRUTH.md) — labels for public, private, future, and adapter tool references.

---

## Dogfooded

Open Scaffold is built with Open Scaffold. The repo contains its own roadmap, plans, evidence notes, decisions, and PR history so the method can be inspected instead of merely claimed.
