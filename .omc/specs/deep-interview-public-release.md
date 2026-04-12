# Deep Interview Spec: Evolve open-scaffold for Public Release

## Metadata
- Interview ID: public-release-2026-04-12
- Rounds: 7
- Final Ambiguity Score: 18%
- Type: brownfield
- Generated: 2026-04-12
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 0.35 | 0.315 |
| Constraint Clarity | 0.80 | 0.25 | 0.200 |
| Success Criteria | 0.80 | 0.25 | 0.200 |
| Context Clarity | 0.70 | 0.15 | 0.105 |
| **Total Clarity** | | | **0.820** |
| **Ambiguity** | | | **0.180** |

## Goal

Evolve open-scaffold from an internal-facing template into a publicly releasable, methodology-first GitHub template that teaches AI-native builders how to maintain development discipline across multi-agent sessions. The scaffold has a layered architecture: a portable methodology core that works without any specific framework, and an OMC/OMX-enhanced layer that demonstrates the recommended runtime. The deeper purpose is combating the human tendency to lose structure, forget handover discipline, and scope-creep when working with AI agents over time.

## Constraints

- **Target audience:** AI-native builders — developers already using Claude Code, Codex, Cursor, or similar tools daily. They're productive but undisciplined. They may or may not have used orchestration frameworks before.
- **Layered architecture:** The core methodology (folder discipline, immutable plans, amendment protocol, ADRs, session handover) must be framework-agnostic. OMC/OMX is the recommended runtime but not a gate.
- **OMC/OMX explanation scope:** The scaffold must explain what OMC and OMX ARE (linking to GitHub repos), WHY discipline matters (human nature problem), WHEN to use which tool/agent, HOW to produce session deliverables and facilitate handover, and HOW to manage parallel vs. sequential execution.
- **Release prerequisites:** LICENSE file (required for legal use/forking), .gitignore (table stakes), simplified WORKFLOW.md (plain English first, OMC commands as optional callouts).
- **15-minute budget:** A stranger must go from clone to their first productive artifact within 15 minutes (pre-committed in ADR 0002).
- **Stack-agnostic:** No language-specific tooling, no CI/CD, no build system. Plain text + plain bash.
- **Clear differentiation from OMC/OMX:** The scaffold must articulate what "scaffolding" IS vs. what orchestration runtimes ARE. Without this, the value proposition is blurry — strangers will ask "why do I need this if I already have OMC?" The scaffold is the project-specific structure (plans, handoffs, discipline); OMC/OMX is the engine that runs inside that structure.
- **Existing file structure:** 9 core files already exist. Prefer enhancing existing files over adding new ones where possible.

## Non-Goals

- **Not an OMC/OMX tutorial:** Don't teach every OMC skill or reproduce OMC documentation. Link to the source repos for deep dives.
- **Not a replacement for OMC/OMX:** The scaffold depends on these frameworks for the enhanced experience but provides standalone value via methodology alone.
- **Not language-specific:** No opinions about programming languages, frameworks, or tech stacks.
- **Not CI/CD scaffold:** No GitHub Actions, no deployment pipelines.
- **Not a sample application:** The scaffold IS the product — no demo app or sample code included.

## Acceptance Criteria

- [ ] **LICENSE file exists** at repo root (MIT or similar permissive license)
- [ ] **.gitignore exists** at repo root with sensible defaults (OS files, editor files, .omc/state/, .omc/research/)
- [ ] **README.md explains open-scaffold's purpose** for a stranger who has never heard of it: what it is, what problem it solves (human discipline decay in multi-agent development), and who it's for
- [ ] **README.md explains what OMC and OMX are** with links to their GitHub repos, positioned as the recommended runtime (not a hard requirement)
- [ ] **README.md addresses the "human nature" problem** — why AI-native builders lose discipline over time and how the scaffold combats this
- [ ] **README.md contains a "Your First 15 Minutes" or equivalent** guided walkthrough that starts with MISSION.md fill-in
- [ ] **bootstrap.sh enhanced** to guide the stranger through MISSION.md fill-in (interactive prompts for mission, goals, non-goals, constraints) instead of just creating directories
- [ ] **docs/WORKFLOW.md simplified** to plain-English phase descriptions first, with OMC/OMX commands as clearly-marked optional callouts (not the primary framing)
- [ ] **docs/WORKFLOW.md includes session handover guidance** — what to produce as a deliverable, how to hand off between sessions, when to use parallel execution
- [ ] **CLAUDE.md and AGENTS.md explain OMC/OMX context** for agents (not just humans), noting the layered architecture
- [ ] **Glossary expanded** in README to cover key methodology terms (Session Handover, Amendment Protocol, Plan Immutability, etc.) and OMC/OMX terms for newcomers
- [ ] **Clear value proposition vs. OMC/OMX/get-shit-done** — README must explain what "scaffolding" IS (the project-specific layer that gives structure to your sessions, plans, and handoffs) vs. what OMC/OMX ARE (the orchestration runtime). The scaffold is the WHAT (folder structure, methodology, discipline) while OMC/OMX are the HOW (the engine that executes it). Without this distinction, strangers will ask "why do I need this if I already have OMC?"
- [ ] **No existing functionality broken** — amendment protocol, ADR system, plan handoff template all still work
- [ ] **15-minute budget test:** A fresh clone → bootstrap → first plan file creation is achievable within 15 minutes by someone unfamiliar with the project

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| OMC is a hard dependency | What if strangers don't have OMC? Would coupling limit reach? (Contrarian, Round 4) | Layered: methodology core is portable, OMC is recommended runtime. The scaffold works (degraded) without OMC. |
| The scaffold is a folder template | What's the deeper problem it solves? (Round 1) | It combats human discipline decay in multi-agent development — scope creep, lost context, forgotten documentation. |
| README is sufficient onboarding | How does "teaches by doing" work? (Round 5) | Guided MISSION.md fill-in via enhanced bootstrap.sh. Methodology starts at "what are you building?" |
| "Explain OMC" means installation docs | How much explanation should live inside the scaffold? (Round 7) | Not just "what is OMC" — must address human nature problem, session discipline, when to use which tool, handover practices. A methodology manual, not a setup guide. |
| Target audience is anyone | Who specifically is the stranger? (Round 3) | AI-native builders: already using AI tools daily, productive but messy. Not AI-curious beginners, not OMC experts. |

## Technical Context

### Current Codebase State (9 files)
- **README.md** — GitHub landing page; needs significant expansion for strangers
- **MISSION.md** — Mission source of truth; working as intended
- **CLAUDE.md** — Claude Code agent entry point; needs OMC/OMX context note
- **AGENTS.md** — Codex/Gemini entry point; paired with CLAUDE.md, same updates needed
- **bootstrap.sh** — Day-one setup; needs interactive MISSION.md guidance
- **docs/WORKFLOW.md** — Phase-to-tool cheat-sheet; needs simplification + layering
- **docs/decisions/README.md** — ADR index; working as intended
- **docs/decisions/0001-*.md** — ADR on paired views; working as intended
- **docs/decisions/0002-*.md** — ADR on 15-min budget; working as intended (proposed, needs first run)
- **.omc/plans/handoff-template.md** — Plan schema; working as intended
- **.omc/plans/README.md** — Amendment protocol; working as intended

### Files to Add
- **LICENSE** — MIT license at repo root
- **.gitignore** — OS/editor/OMC-state exclusions

### Files to Modify
- **README.md** — Major rewrite: purpose for strangers, OMC/OMX explanation, human nature problem, guided walkthrough, expanded glossary
- **bootstrap.sh** — Enhance with interactive MISSION.md fill-in prompts
- **docs/WORKFLOW.md** — Simplify to plain English first, OMC commands as optional callouts, add session handover guidance
- **CLAUDE.md** — Add layered architecture note for agents
- **AGENTS.md** — Mirror CLAUDE.md changes (per ADR 0001)

### Files Unchanged
- MISSION.md, docs/decisions/*, .omc/plans/*

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| open-scaffold | core domain | template, 9+ core files, layered architecture | depends on OMC/OMX (optional); consumed by AI-native builder |
| OMC/OMX | external system | skills, workflows, orchestration, GitHub repos | recommended runtime for open-scaffold; installed by builder |
| Workflow/Methodology | core domain | folder discipline, phase progression, handover, parallel execution | encoded in open-scaffold; the core product |
| AI-native builder | core domain | uses AI tools daily, productive but undisciplined, loses focus over sessions | clones scaffold; completes First Task; target user |
| Scope creep | problem domain | folder bloat, lost context, missing docs, human nature | prevented by Methodology; the core problem being solved |
| First Task | core domain | guided MISSION.md fill-in, interactive bootstrap | teaches builder the Methodology from session zero |
| Amendment Protocol | core domain | immutable plans, amendment files, changelog stamps | part of Methodology; taught via First Task |
| Session Handover | core domain | deliverables, context transfer, cross-session discipline | part of Methodology; key to sustained discipline |
| Methodology Manual | core domain | philosophy, practical guidance, when-to-use-what | documentation layer; README + WORKFLOW.md |
| Core Layer | supporting | framework-agnostic methodology, works without OMC | portable base of open-scaffold |
| OMC Layer | supporting | OMC/OMX-enhanced experience, skill callouts | optional overlay on Core Layer |
| Promotional Funnel | supporting | demonstrate OMC value through best experience | OMC promoted by being the recommended runtime |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 5 | 5 | - | - | N/A |
| 2 | 7 | 2 | 0 | 5 | 71% |
| 3 | 8 | 1 | 2 | 5 | 88% |
| 4 | 10 | 2 | 4 | 4 | 80% |
| 5 | 10 | 0 | 1 | 9 | 100% |
| 6 | 10 | 0 | 0 | 10 | 100% |
| 7 | 12 | 2 | 4 | 6 | 83% |

Ontology was highly stable from rounds 5-6 (100%), then expanded in round 7 when the user revealed the deeper "human nature" and "session handover" concepts. These aren't instability — they're genuine new insights surfaced by the interview's depth.

## Interview Transcript

<details>
<summary>Full Q&A (7 rounds)</summary>

### Round 1
**Q:** When you say 'publicly releasable', which of these best describes your goal? [OMC-agnostic | OMC showcase | Layered | Not sure]
**A:** Strangers would need to understand what OMC and OMX is and this helps them to leverage those frameworks by providing a scaffold around them and a workflow of thought and procedural task execution. The scaffold should be inviting people to re-think the way they approach multi-agent orchestration, so that they one day will be able to build their own scaffolds independently. Right now the problem is that people just get lost and end up bloating their folders or forgetting proper documentation.
**Ambiguity:** 66% (Goal: 0.55, Constraints: 0.15, Criteria: 0.10, Context: 0.55)

### Round 2
**Q:** Imagine someone finds open-scaffold on GitHub tomorrow. They clone it, run bootstrap.sh, and start building. What specific experience would make you say 'yes, the public release worked'?
**A:** Teaches by doing + Community traction + 15-min productive (multi-select)
**Ambiguity:** 52% (Goal: 0.60, Constraints: 0.20, Criteria: 0.55, Context: 0.55)

### Round 3
**Q:** Who is the stranger you're designing for? What can you assume they already know or have installed?
**A:** AI-native builders who might have used other frameworks but weren't satisfied, or no frameworks at all. This scaffold should also serve as a promotional funnel for OMC and OMX because they work well in general.
**Ambiguity:** 42% (Goal: 0.70, Constraints: 0.45, Criteria: 0.55, Context: 0.55)

### Round 4 [CONTRARIAN MODE]
**Q:** Is OMC the product you're promoting, or is the METHODOLOGY the product and OMC just happens to be the best runtime for it?
**A:** Both, layered.
**Ambiguity:** 34% (Goal: 0.80, Constraints: 0.60, Criteria: 0.55, Context: 0.60)

### Round 5
**Q:** What should the stranger's first guided experience be after cloning?
**A:** Guided MISSION.md fill-in.
**Ambiguity:** 28% (Goal: 0.85, Constraints: 0.60, Criteria: 0.70, Context: 0.65)

### Round 6 [SIMPLIFIER MODE]
**Q:** Which of these gaps would actually block a stranger from succeeding? [Explain OMC | LICENSE + .gitignore | Simplify WORKFLOW.md | All]
**A:** All of the above.
**Ambiguity:** 22% (Goal: 0.85, Constraints: 0.80, Criteria: 0.70, Context: 0.70)

### Round 7
**Q:** How much OMC explanation should live INSIDE the scaffold vs. linking out?
**A:** People get lost because they forget the discipline and methodology while using OMC and OMX. The scaffold should not only explain what they are (referencing GitHub repos) but also explain the problem of human nature and getting lost, the importance of clear folder structure that is self-sustaining between sessions, handover of items, so the human operator doesn't get confused about which command to use when, what to ask of each session as a deliverable, and how to facilitate handover or parallel execution of tasks.
**Ambiguity:** 18% (Goal: 0.90, Constraints: 0.80, Criteria: 0.80, Context: 0.70)

</details>
