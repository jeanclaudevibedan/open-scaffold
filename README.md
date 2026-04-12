# open-scaffold

A methodology template for disciplined AI development. open-scaffold gives your project a pre-built structure — mission definitions, immutable plans, amendment protocols, decision records, and session handover practices — so you spend time building, not reinventing how to stay organized across multi-agent sessions.

## Table of contents

- [The problem](#the-problem)
- [Scaffold vs. runtime](#scaffold-vs-runtime)
- [Your first 15 minutes](#your-first-15-minutes)
- [What's inside](#whats-inside)
- [Recommended runtimes](#recommended-runtimes)
- [Glossary](#glossary)
- [License](#license)

---

**Want to understand why this exists?** Read [The Problem](#the-problem).
**Want to start building now?** Jump to [Your First 15 Minutes](#your-first-15-minutes).

---

## The problem

You start a project with an AI coding agent. The first session goes great — clean code, clear goals. By the third session, you've forgotten what you decided in the first one. By the fifth, your folder structure has grown organically into something no one can navigate. Plans exist only in conversation history that's long gone. Scope has crept in every direction.

This is not a tooling problem. It's a human nature problem. Multi-agent development amplifies it because each session starts fresh — the agent doesn't remember your prior decisions, your folder conventions, or the constraints you set last Tuesday. Without a persistent structure that carries context across sessions, every session is a blank slate invitation to drift.

open-scaffold is a set of practices encoded as files:

- **A mission file** that forces you to define scope, goals, and non-goals before writing code
- **Immutable plan files** that prevent silent scope creep — once committed, a plan is a record, not a draft
- **An amendment protocol** that channels legitimate "I got smarter" moments into traceable changes instead of invisible drift
- **Architecture decision records** that explain *why*, not just *what*, so future sessions have the context they need
- **Session handover discipline** built into the workflow, so nothing lives only in conversation history

The methodology works whether you use it with AI agents, with a team, or solo. The structure is the value.

## Scaffold vs. runtime

If you already use an orchestration tool — [oh-my-claudecode](https://github.com/jeanclaudevibedan/oh-my-claudecode), [oh-my-codex](https://github.com/jeanclaudevibedan/oh-my-codex), or something else — you might wonder: *why do I need this too?*

**A scaffold is the WHAT.** It's the project-specific structure that defines how plans, decisions, amendments, and handoffs are organized in *your* repo. It's the folder layout, the plan schema, the mission file, the amendment protocol. The scaffold persists across every session and every tool you use.

**A runtime is the HOW.** It's the engine that executes tasks within that structure — planning skills, parallel agents, verification commands, consensus loops. A runtime operates inside a scaffold; it doesn't replace the need for one.

Think of it this way: a runtime without a scaffold is a powerful engine with no chassis. You can drive fast, but you'll lose parts along the way. A scaffold without a runtime still works — you follow the methodology manually. But a scaffold *with* a runtime is where things click: the runtime reads your plan files, traces verification to acceptance criteria, and enforces the amendment protocol automatically.

open-scaffold provides the chassis. Your runtime of choice provides the engine.

## Your first 15 minutes

### 1. Create your project from the template

```bash
gh repo create <your-project> --template jeanclaudevibedan/open-scaffold --clone
cd <your-project>
```

### 2. Run bootstrap

```bash
./bootstrap.sh
```

Bootstrap will ask you three questions:
- **What is this project?** — one sentence that defines your mission
- **What should it achieve?** — your goals (comma-separated)
- **What is it NOT?** — your non-goals (comma-separated)

Your answers are written into `MISSION.md`, replacing the placeholder content. This is the methodology's starting point: define scope before writing code.

### 3. Skim the workflow

```bash
cat docs/WORKFLOW.md
```

This is your phase-to-tool cheat-sheet. It tells you which phase you're in (Clarify, Plan, Execute, Verify, Amend) and what to reach for at each one.

### 4. Write your first plan

```bash
cp .omc/plans/handoff-template.md .omc/plans/<your-first-task>.md
$EDITOR .omc/plans/<your-first-task>.md
```

Fill in the 7 sections: Context, Goal, Constraints, Files to touch, Acceptance criteria, Verification steps, Open questions. Then start building.

You now have a project with a defined mission, a documented plan, and a workflow to follow. Every future session — human or agent — starts by reading these files.

## What's inside

open-scaffold ships as a GitHub template with these core files:

| File | Purpose |
| ---- | ------- |
| `MISSION.md` | Source of truth for *what* the project is. Ships with a `<!-- mission:unset -->` marker. |
| `CLAUDE.md` | Claude Code's entry point — agents read this first to understand the project structure. |
| `AGENTS.md` | Entry point for Codex, Gemini, and other agents (paired view of CLAUDE.md). |
| `.omc/plans/handoff-template.md` | The 7-section schema every plan file follows. |
| `.omc/plans/README.md` | Amendment protocol in under 200 words: plans are immutable; amendments layer on top. |
| `docs/decisions/README.md` | Architecture Decision Record (ADR) index and inline template. Ships with 2 examples. |
| `docs/WORKFLOW.md` | Phase-to-tool reference: Clarify, Plan, Execute, Verify, Amend. |
| `bootstrap.sh` | Idempotent day-one setup: creates directories, guides you through MISSION.md fill-in. |
| `README.md` | This file. |

Two ADRs ship in `docs/decisions/` as worked examples: `0001-paired-views-are-duplicated-manually.md` (why CLAUDE.md and AGENTS.md are hand-duplicated instead of auto-synced) and `0002-fifteen-minute-budget-evidence.md` (the measurement protocol for validating onboarding speed).

This README itself was added on day zero via the template's own scope-evolution protocol — dogfooding the amendment mechanism on its own specification before any user sees it.

## Recommended runtimes

open-scaffold's methodology works standalone — you can follow it manually with any text editor. But it's designed to pair with orchestration runtimes that read the structure and automate the workflow.

**[oh-my-claudecode (OMC)](https://github.com/jeanclaudevibedan/oh-my-claudecode)** — A multi-agent orchestration layer for Claude Code. OMC provides planning skills, autonomous execution, parallel agent coordination, and verification that traces back to your plan files' acceptance criteria. When OMC is installed, the workflow phases in `docs/WORKFLOW.md` map to specific OMC skills.

**[oh-my-codex (OMX)](https://github.com/jeanclaudevibedan/oh-my-codex)** — The same orchestration philosophy for Codex CLI. OMX is the fast-typing cockpit — boilerplate, single-file edits, and straightforward scaffolding where throughput matters more than deep judgment.

Neither runtime is required. If you use a different tool (Cursor, Windsurf, Aider, or plain CLI agents), the scaffold still works — the plan files, amendment protocol, and session handover practices are just markdown and bash.

## Glossary

New to agent-orchestrated development? Here are the key terms used throughout this template:

**AC (Acceptance Criterion)** — A specific, testable statement that defines when a task is "done." Instead of vague goals like "the feature should work," an AC gives you a concrete yes/no check — for example: *"MISSION.md contains the marker `<!-- mission:unset -->`"* is verifiable with a single `grep` command. Every plan file in `.omc/plans/` includes an acceptance criteria section. If the ACs pass, the work is done. If not, it isn't.

**ADR (Architecture Decision Record)** — A short document that records a significant decision and *why* it was made. Not code — a note to future-you (or future-agents) explaining: what problem were we solving, what did we decide, and what trade-offs did we accept? ADRs live in `docs/decisions/` and follow a lightweight format (Title, Status, Context, Decision, Consequences). This template ships with two worked examples.

**Amendment Protocol** — The rule that plan files are immutable once committed. When new information changes what you should build (the "I got smarter" case), you write an amendment file (`<slug>-amendment-<n>.md`) instead of editing the plan in place. This creates a traceable history of scope evolution. The full protocol is in `.omc/plans/README.md`.

**Bootstrap (`bootstrap.sh`)** — A script you run once on day one. It creates working directories (`.omc/research/`, `.omc/state/`), walks you through defining your mission in `MISSION.md`, and stamps the changelog. Idempotent (safe to run twice) and optional (the project works without it).

**OMC (oh-my-claudecode)** — A multi-agent orchestration layer for Claude Code that provides planning, execution, and verification skills. The recommended runtime for this scaffold, but not required. See [Recommended Runtimes](#recommended-runtimes).

**OMX (oh-my-codex)** — The same orchestration philosophy for Codex CLI. Fast boilerplate and single-file edits. See [Recommended Runtimes](#recommended-runtimes).

**Plan Immutability** — Once a plan file in `.omc/plans/` is committed to version control, it is never edited. Changes are captured as amendment files that layer on top. This prevents silent scope creep and creates a traceable history of decisions.

**Scaffold** — The project-specific structure that organizes plans, decisions, amendments, and handoffs in your repo. A scaffold defines the *what* (how your project stays organized); a runtime defines the *how* (the engine that executes within that structure). open-scaffold is a scaffold. OMC/OMX are runtimes.

**Session Handover** — The practice of producing explicit deliverables at the end of each work session so the next session (human or agent) can pick up without re-explanation. Handover artifacts include: updated plan files, amendment files for scope changes, and changelog entries in MISSION.md. See `docs/WORKFLOW.md` for the full handover protocol.

## License

[MIT](LICENSE)
