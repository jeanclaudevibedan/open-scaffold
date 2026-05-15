# Comparison: Open Scaffold vs spec-kit, BMAD, Agent OS

This page is an **orientation guide**, not an exhaustive competitive analysis. The other projects listed evolve quickly and their feature surfaces will change after this page is written. For up-to-date capabilities, read each project's own README and recent releases.

The goal is to help you decide whether Open Scaffold or another approach fits the work in front of you. None of these projects are strictly mutually exclusive — most are layers you could combine.

> **Scope of this page.** Descriptions of external projects are deliberately high-level. If exact behavior matters, verify it on the project's own site. Claims that depend on a moving upstream feature surface are marked `[verify upstream]`.

---

## At a glance

All four projects address some version of the same pain: AI-assisted coding sessions that lose context, drift from intent, and produce unverifiable work. They take different shapes.

| Project | Shape | Primary lock-in | Tends to fit |
| --- | --- | --- | --- |
| Open Scaffold | Repo protocol (files, folders, helper scripts, verification check) | None — runtime-neutral by design | Durable, traceable AI work across sessions, agents, and PRs |
| spec-kit `[verify upstream]` | Spec-first CLI + commands for AI-assisted development | Toolchain conventions | Greenfield features where a spec → plan → implement loop is wanted |
| BMAD `[verify upstream]` | Role-based AI agent methodology with planning + execution phases | Methodology + persona ecosystem | Teams that want explicit AI roles (analyst, PM, architect, dev, QA) |
| Agent OS `[verify upstream]` | Standards / specs / missions context layer for AI coding agents | Methodology adoption | Solo developers and small teams wanting AI context as a system |

---

## Open Scaffold

**What it is.** A runtime-neutral, repo-native protocol: mission, roadmap, immutable plans, amendments, run packets, decisions, evidence, and a mechanical verification check (`./verify.sh`) — all as git-tracked files. Any agent or orchestrator can read and write it. See [`MISSION.md`](../MISSION.md), [`docs/OPEN_SCAFFOLD_SYSTEM.md`](OPEN_SCAFFOLD_SYSTEM.md), and [`docs/decisions/README.md`](decisions/README.md).

**Differentiator.** Open Scaffold is a source-of-truth-first protocol layer for human-in-the-loop AI work: plans are immutable once committed, scope evolution happens through a numbered amendment protocol, verification is mechanical rather than conversational, and no runtime is canonical.

**Use this when:**

- AI-assisted work needs to survive context loss across sessions, agents, or PRs.
- You want repo-level evidence ("what was asked, decided, verified, approved") that outlives chat history.
- You want to keep agent choice (Claude Code, Codex, Cursor, OMC, OMX, Aider, a human terminal) flexible without rewriting your methodology.

**Do not use this when:**

- The work is a one-off script, disposable prototype, or single-session task — the overhead is not earned.
- You want an opinionated end-to-end runtime that spawns agents, manages tasks, and ships PRs for you. Open Scaffold core deliberately does not do that; see [`docs/SPAWNING_BOUNDARY.md`](SPAWNING_BOUNDARY.md).
- You need an enterprise compliance program (SOC 2, ISO 27001, HIPAA, GDPR) out of the box — Open Scaffold is evidence substrate, not a controls framework.

---

## spec-kit `[verify upstream]`

**What it is (orientation).** Spec-driven development tooling associated with GitHub, oriented around writing explicit specifications that AI agents then plan and implement against. The current command surface, supported agent integrations, and recommended workflow should be verified in the project's own documentation.

**Use this when:**

- You are starting a greenfield feature and want a spec-first loop the agent can follow directly.
- You are comfortable adopting the project's CLI conventions and want a single recommended path from spec to implementation.

**Do not use this when:**

- You are retrofitting AI discipline onto an existing repository with established structure you do not want to reshape.
- Runtime or agent neutrality is a hard requirement — verify upstream what the toolchain assumes about which agents and platforms it talks to before committing.

---

## BMAD `[verify upstream]`

**What it is (orientation).** A community methodology framework that organizes AI work into explicit agent roles (such as analyst, product manager, architect, developer, QA) across planning and execution phases. Verify role definitions, tooling, and any required agent stack against the project's own materials before adoption.

**Use this when:**

- You want explicit role separation between AI personas across planning and implementation.
- You are doing greenfield product work where a structured multi-phase methodology pays for itself.

**Do not use this when:**

- The work is small enough that role-based ceremony adds more overhead than it removes.
- You are skeptical of methodology adoption cost and want a thinner protocol that lives in your repo rather than in a separate framework.

---

## Agent OS `[verify upstream]`

**What it is (orientation).** A system that gives AI coding agents standards, specs, product missions, and context so they can behave more like senior engineers. The current file layout, integration surface, and assumptions about which agents it supports should be verified upstream.

**Use this when:**

- You want a standards / specs / mission context layer your AI agent reads before every task.
- You are a solo developer or small team and want documented agent context as a system rather than scattered prompt files.

**Do not use this when:**

- You specifically want immutable plans with a numbered amendment protocol and a mechanical verification check — that is not the shape Agent OS targets.
- You need a runtime-neutral protocol you can hand to any orchestrator with no methodology adoption — verify upstream what Agent OS assumes about your agent stack.

---

## Picking between them

The honest framing:

- **Open Scaffold** is a substrate other tools can sit on top of. Its candidate differentiator is structural discipline (immutable plans, mechanical verification, runtime neutrality), not feature breadth.
- **spec-kit, BMAD, Agent OS** are methodology-plus-tooling stacks. They tend to be more prescriptive about *how* the AI works.

You can combine them. Nothing about Open Scaffold prevents you from using spec-kit, BMAD-style roles, or Agent OS conventions inside your repo — the scaffold just records what was decided and verified. Where the projects compete is in opinionation: Open Scaffold is intentionally less opinionated about runtime; the others ship more opinions you adopt.

---

## What this page is not

- Not a feature checklist. Feature lists rot fast and become misleading.
- Not a benchmark. None of the productivity, cost, or quality claims here are measured.
- Not a final word. If a description has gone stale, file an issue against `docs/COMPARISON.md` and link the upstream source so a future amendment can correct it.
