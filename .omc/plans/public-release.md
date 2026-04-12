# Plan: Evolve open-scaffold for Public Release

## 1. Context

open-scaffold is a 9-file, documentation-only GitHub template that front-loads project context for AI coding agents. It currently targets internal use and assumes familiarity with OMC/OMX. A 7-round deep interview (18% ambiguity, spec at `.omc/specs/deep-interview-public-release.md`) crystallized the need to make it publicly releasable for AI-native builders who are productive but undisciplined — developers who lose structure, forget handover discipline, and scope-creep across multi-agent sessions.

**Key insight from the interview:** The scaffold's core value is the *methodology* (folder discipline, immutable plans, amendment protocol, session handover), not the tooling. OMC/OMX is the recommended runtime but not a gate. The biggest risk is that strangers won't understand WHY this exists if the value proposition is blurry — "why do I need this if I already have OMC?"

**Architect review insight (iteration 1):** The scaffold is a *methodology template* — the value is a pre-thought-out discipline system packaged as a GitHub template so you don't have to invent it yourself. The README must not overstate what it does; it is a "starter kit for disciplined AI development," not Rails scaffolding that generates code. The word "scaffold" is fine as a name, but the pitch must be honest about the product shape.

## 2. Goal

Make open-scaffold publicly releasable by: (a) clearly articulating its value proposition as a methodology-first discipline system distinct from OMC/OMX runtime, (b) making all documentation stranger-accessible with a forked reading path (philosophy vs. action), (c) adding a guided onboarding experience via interactive bootstrap, and (d) including release prerequisites (LICENSE, .gitignore).

## 3. Constraints / Out of scope

**Constraints:**
- 15-minute budget: stranger → first productive artifact in ≤15 min
- Layered architecture: core methodology works without OMC; OMC enhances but doesn't gate
- Stack-agnostic: no language opinions, no CI/CD, no build system
- Prefer enhancing existing files over adding new ones
- CLAUDE.md and AGENTS.md must stay in sync (ADR 0001)
- README must have a forked reading path: philosophy sections are opt-in, walkthrough is the fast path (resolves README-length vs. 15-minute-budget tension)

**Out of scope:**
- OMC/OMX installation automation (link to their repos)
- Sample applications or demo code
- CI/CD pipelines or GitHub Actions
- Language-specific scaffolding
- Reproducing OMC documentation
- Explicit comparison to get-shit-done or other specific tools — the scaffold-vs-runtime framing covers all orchestration tools generically; naming competitors risks becoming stale

## 4. Files to touch

### New files (2)
| File | Action | Purpose |
|------|--------|---------|
| `LICENSE` | Create | MIT license — legal requirement for public use/forking |
| `.gitignore` | Create | OS files, editor files, `.omc/state/`, `.omc/research/` |

### Modified files (6)
| File | Action | Scope of change |
|------|--------|-----------------|
| `README.md` | Major rewrite | 8 sections including TOC (see structure below) |
| `MISSION.md` | Reset to template state | Restore `<!-- mission:unset -->` marker, placeholder goals/non-goals, empty changelog. Current file has a defined mission from development; template must ship blank for consumers. |
| `bootstrap.sh` | Enhance | Add interactive MISSION.md fill-in prompts (mission, goals, non-goals) |
| `docs/WORKFLOW.md` | Simplify + extend | Remove "Dan's personal" framing (line 3). Plain-English-first rewrite: keep scope-evolution protocol + verification-marker sections, rewrite phase table with plain-English descriptions first and OMC commands as optional callouts. Add session handover section. |
| `CLAUDE.md` | Minor edit | Add layered architecture note + OMC/OMX context |
| `AGENTS.md` | Minor edit | Mirror CLAUDE.md changes per ADR 0001 |

### Unchanged files (5)
- `docs/decisions/README.md` — ADR index, working as intended
- `docs/decisions/0001-*.md` — paired views ADR, working as intended
- `docs/decisions/0002-*.md` — 15-min budget ADR, working as intended
- `.omc/plans/handoff-template.md` — plan schema, working as intended
- `.omc/plans/README.md` — amendment protocol, working as intended

### README.md section structure (8 sections)

1. **Opening paragraph** — What open-scaffold IS, what problem it solves (one paragraph, no jargon)
2. **Table of Contents** — Navigable links to all sections; enables skipping
3. **Reading fork** — "Want to understand why? Read [The Problem](#the-problem). Want to start building? Jump to [Your First 15 Minutes](#your-first-15-minutes)."
4. **The Problem (Why This Exists)** — Human nature in multi-agent development: discipline decay, scope creep, lost context across sessions. Why a methodology template solves this.
5. **Scaffold vs. Runtime** — What "scaffolding" means (the project-specific discipline structure: plans, handoffs, ADRs, amendments) vs. what orchestration runtimes do (OMC/OMX execute within that structure). Answers "why do I need this if I already have OMC?" Generic framing that covers any runtime, not specific tool comparisons.
6. **Your First 15 Minutes** — Step-by-step: clone → `./bootstrap.sh` → fill in MISSION.md → write first plan → read WORKFLOW.md. This is the fast path.
7. **What's Inside (Core Files)** — Existing file table, reframed for strangers. Includes brief explanation of OMC/OMX with links to repos, positioned as "recommended runtime" not required.
8. **Glossary** — Expanded: AC, ADR, Bootstrap, Amendment Protocol, Plan Immutability, Session Handover, OMC, OMX, Scaffold. Existing glossary entries (AC, ADR, Bootstrap) are preserved and may be lightly edited for consistency but not removed.

**Existing README sections to handle during rewrite:**
- "Why 9 files and not 8?" — Fold into the "What's Inside" section as a brief aside or callout. The narrative is valuable (dogfooding the amendment protocol) but shouldn't be its own section in the public README.
- "License: TBD — set by the consuming project" (line 49) — Remove. Replaced by the LICENSE file (AC-01) and a standard "## License" footer linking to it.
- "Quickstart" — Superseded by the "Your First 15 Minutes" section. Remove as separate section.

**AGENTS.md mirroring note:** Per ADR 0001, AGENTS.md is a hand-authored duplicate with its own structure ("Project facts" vs. "Where things live", "Operating rules" section). Mirror the layered-architecture content *semantically* into AGENTS.md's existing structure — do not restructure AGENTS.md to match CLAUDE.md.

### bootstrap.sh interactive flow (resolved)

The interactive bootstrap prompts for three fields:
1. **Mission** — one sentence: "What is this project?" (required)
2. **Goals** — comma-separated: "What should it achieve?" (optional, defaults to placeholder)
3. **Non-goals** — comma-separated: "What is it NOT?" (optional, defaults to placeholder)

**Non-interactive fallback:** If stdin is not a terminal (`! [ -t 0 ]`), skip interactive prompts entirely — run only the original directory-creation and changelog-stamp logic. The `<!-- mission:unset -->` marker is preserved so the user can fill it manually later.

**Idempotency guard:** If `<!-- mission:unset -->` is NOT present in MISSION.md, skip the interactive fill-in (mission already defined). Only prompt when the marker is found.

**Spec deviation note (constraints):** The spec at `.omc/specs/deep-interview-public-release.md:53` says "interactive prompts for mission, goals, non-goals, constraints." Constraints are intentionally omitted from the interactive flow because constraints are hard to define on day one — they emerge from the first planning session, not from a shell prompt. Prompting for constraints in bootstrap would either produce vague answers ("fast," "simple") or stall the 15-minute budget. Users define constraints naturally when they write their first plan file using the handoff template.

**Bash 3.2 compatibility:** Use only `read -p` for prompts, `printf` for output, basic string substitution. No arrays, no associative arrays, no process substitution.

## 5. Acceptance criteria

- [ ] AC-01: `LICENSE` exists at repo root with MIT license text
- [ ] AC-02: `.gitignore` exists at repo root; excludes OS files (`.DS_Store`, `Thumbs.db`), editor files (`.vscode/`, `.idea/`), and OMC ephemeral state (`.omc/state/`, `.omc/research/`)
- [ ] AC-03: README.md opens with a one-paragraph explanation of what open-scaffold IS and what problem it solves, understandable by someone who has never heard of it
- [ ] AC-04: README.md contains a "Scaffold vs. Runtime" section that clearly differentiates the scaffold (project-specific discipline structure) from orchestration runtimes (OMC/OMX and similar). A reader can answer "why do I need this if I already have OMC?" after reading it. Framing is generic (not naming specific competitors).
- [ ] AC-05: README.md explains what OMC and OMX are in 2-3 sentences each, with links to their GitHub repos, positioned as recommended (not required)
- [ ] AC-06: README.md addresses the "human nature" problem — why builders lose discipline across sessions — in a way that resonates with the target audience
- [ ] AC-07: README.md contains a "Your First 15 Minutes" guided walkthrough starting with `./bootstrap.sh` and ending with a completed MISSION.md
- [ ] AC-08: `bootstrap.sh` interactively prompts for mission, goals, and non-goals, then writes them into MISSION.md (replacing the `<!-- mission:unset -->` marker). Falls back to non-interactive if stdin is not a terminal — in non-interactive mode, it only creates directories and stamps the changelog, preserving the `<!-- mission:unset -->` marker.
- [ ] AC-09: `docs/WORKFLOW.md` leads with plain-English phase descriptions. OMC/OMX commands appear as clearly-labeled optional callouts (e.g., blockquotes or admonitions), not as the primary framing
- [ ] AC-10: `docs/WORKFLOW.md` includes a "Session Handover" section: what to produce as a deliverable, how to hand off context between sessions, when to use parallel execution
- [ ] AC-11: `CLAUDE.md` and `AGENTS.md` include a note about the layered architecture (core methodology + OMC-enhanced layer) so agents understand the dual context
- [ ] AC-12: README.md glossary expanded to include: Session Handover, Amendment Protocol, Plan Immutability, OMC, OMX, Scaffold (vs. runtime)
- [ ] AC-13: No existing functionality broken — amendment protocol, ADR system, plan handoff template, `<!-- mission:unset -->` marker convention all still work as documented
- [ ] AC-14: `bootstrap.sh` remains idempotent — running it twice doesn't corrupt MISSION.md or create duplicate content. Second run skips interactive prompts (marker already removed).
- [ ] AC-15: `bootstrap.sh` remains portable — works on macOS system bash (3.2+), no GNU-only flags
- [ ] AC-16: `MISSION.md` ships in template state — contains `<!-- mission:unset -->` marker, placeholder goals/non-goals, empty changelog section
- [ ] AC-17: README.md includes a table of contents with navigable links
- [ ] AC-18: README.md includes a forked reading path near the top — philosophy sections are opt-in; walkthrough is the fast path

## 6. Verification steps

1. **LICENSE check:** `test -f LICENSE && head -1 LICENSE` shows MIT
2. **gitignore check:** `test -f .gitignore && grep -q '.DS_Store' .gitignore`
3. **MISSION.md template state:** `grep -q 'mission:unset' MISSION.md` confirms the marker is present
4. **README stranger test:** Read README.md from top; first paragraph must answer "what is this?" and "what problem does it solve?" without prior context
5. **README TOC:** README.md contains a table of contents section with `](#` anchor links
6. **README reading fork:** README.md contains a clear "want to understand why? / want to start building?" fork within the first 30 lines
7. **Value prop test:** Search README for "scaffold" vs "runtime" differentiation; must clearly answer "why not just use OMC?" without naming specific competitors
8. **OMC/OMX links:** `grep -c 'github.com' README.md` shows OMC and OMX repo links
9. **15-min walkthrough:** README contains a "Your First 15 Minutes" section with stepwise instructions starting from `git clone`
10. **Interactive bootstrap:** Run `./bootstrap.sh` in a fresh clone with the `<!-- mission:unset -->` marker present; should prompt for mission/goals/non-goals interactively
11. **Bootstrap idempotency:** Run `./bootstrap.sh` twice; second run should detect mission already defined and skip interactive prompts. `diff` shows no changes on second run.
12. **Bootstrap non-interactive:** `echo "" | ./bootstrap.sh` (piped stdin) should complete successfully, create directories, stamp changelog, but skip MISSION.md fill-in prompts — `<!-- mission:unset -->` marker preserved.
13. **WORKFLOW.md plain-English:** First content after the title is plain-English descriptions, not slash commands
14. **Session handover:** `grep -q 'Session Handover\|session handover' docs/WORKFLOW.md`
15. **Paired views sync:** Diff key sections of CLAUDE.md and AGENTS.md for semantic parity
16. **Glossary:** `grep -c '^\*\*' README.md` shows expanded glossary terms (≥9 terms)
17. **Marker convention still works:** CLAUDE.md and AGENTS.md both reference `<!-- mission:unset -->` as the expected template state

## 7. Open questions

1. **OMC/OMX GitHub URLs:** What are the canonical repo URLs for OMC and OMX? The plan assumes `github.com/yeachan-heo/oh-my-claudecode` and `github.com/Yeachan-Heo/oh-my-codex` but these need confirmation. If wrong, use placeholder URLs marked with `TODO`.

---

## RALPLAN-DR Summary

### Principles
1. **Methodology over tooling** — The scaffold's value IS the discipline system (folder structure, immutable plans, amendments, session handover). Tooling is interchangeable; methodology is the product.
2. **Stranger-first documentation** — Every word in the README must be understandable by someone who has never heard of open-scaffold, OMC, or OMX. No insider jargon without definition.
3. **Teach by doing** — The onboarding experience should force the stranger through the methodology (MISSION.md fill-in), not just describe it.
4. **Layered value** — Core methodology works without any framework. OMC/OMX is the recommended runtime that unlocks the full experience. Neither layer should undermine the other.
5. **Minimal additions** — Prefer enhancing existing files. The repo should stay lean (11 core files + 1 template-state reset, not 20).
6. **Honest product shape** — The scaffold is a methodology template (pre-thought-out discipline system in a box), not code-generating scaffolding. The pitch must not overstate what it does.

### Decision Drivers
1. **Value proposition clarity** — Strangers must immediately understand why this exists alongside orchestration runtimes, not instead of them. The scaffold is the WHAT (project structure + discipline); runtimes are the HOW (execution engine).
2. **15-minute onboarding budget** — Every design choice must be weighed against the time it costs a stranger. Forked README reading path: philosophy is opt-in, walkthrough is the fast path.
3. **Session discipline sustainability** — The real test isn't day-one onboarding but day-thirty discipline. Documentation must address the "human nature decay" problem so builders return to the methodology when they drift.

### Viable Options

#### Option A: README-Centric Rewrite with Forked Reading Path (Recommended)
Heavy rewrite of README.md as the single stranger-facing entry point with a TOC and explicit "philosophy vs. action" fork near the top. Philosophy sections (human nature, scaffold-vs-runtime) are opt-in enrichment; walkthrough is the fast path. bootstrap.sh gets interactive MISSION.md fill-in. WORKFLOW.md simplified in place. MISSION.md reset to template state. Only 2 new files (LICENSE, .gitignore).

**Pros:**
- Single entry point for strangers — no navigation confusion
- Minimal file additions (11 total, up from 9)
- README is what GitHub renders by default — maximum visibility
- Stays true to "prefer enhancing existing files"
- Forked reading path resolves the README-length vs. 15-min-budget tension
- TOC makes long README navigable

**Cons:**
- README still longer than typical (~200 lines)
- Philosophy and quickstart coexist in one file (mitigated by fork + TOC)

#### Option B: Companion Docs Approach
Keep README lean (~50 lines: pitch + quickstart + links). Add `docs/GETTING-STARTED.md` (15-min walkthrough), `docs/PHILOSOPHY.md` (human nature problem + methodology), `docs/OMC-PRIMER.md` (what OMC/OMX are). Bootstrap unchanged except for interactive MISSION.md fill-in.

**Pros:**
- Clean separation of concerns (pitch vs. philosophy vs. tutorial)
- Each doc is focused and scannable
- README stays short and punchy

**Cons:**
- 4 new files (14 total, up from 9) — contradicts "minimal additions" constraint
- Strangers must navigate between docs — adds friction
- Philosophy doc may never be read if it's not in the README
- More files to keep in sync

#### Why Option B is not recommended:
The spec constrains: "Prefer enhancing existing files over adding new ones." Option B adds 4 new files where Option A adds 2. More critically, the human nature / value proposition content MUST be front-and-center in the README — burying it in `docs/PHILOSOPHY.md` means strangers skip the most important content. The forked reading path in Option A mitigates the length concern without requiring extra files.

### ADR (to be written on consensus approval)
- **Decision:** README-centric rewrite with forked reading path + enhanced interactive bootstrap
- **Drivers:** Value prop clarity, 15-min budget, minimal file additions, honest product shape
- **Alternatives considered:** Companion docs approach (rejected: too many files, buries key content)
- **Why chosen:** Single entry point maximizes stranger engagement; forked path resolves length vs. budget tension; keeps repo lean
- **Consequences:** README longer than typical but navigable via TOC and reading fork. MISSION.md must be reset to template state before release.
- **Follow-ups:** ADR 0002 (15-min budget) should be tested after implementation; consider ADR 0003 for the scaffold-vs-runtime distinction

### Architect Review Changes (Iteration 1)
| Concern | Severity | Resolution |
|---------|----------|------------|
| MISSION.md not in template state | BLOCKING | Added to "Modified files" — reset to template state with `<!-- mission:unset -->` marker. Added AC-16. |
| Open Question #2 (bootstrap depth) | HIGH | Resolved: prompt for mission, goals, non-goals. Skip constraints and changelog header. Detailed in Section 4 "bootstrap.sh interactive flow." |
| No TOC in README | HIGH | Added as explicit section in README structure. Added AC-17. |
| No reading fork in README | MEDIUM | Added "reading fork" as section 3 of README structure. Added AC-18. |
| get-shit-done differentiation | MEDIUM | Resolved: scaffold-vs-runtime framing is generic; added to "Out of scope" with rationale. |
| Weak verification step #9 | LOW | Strengthened: non-interactive mode creates dirs + stamps changelog, preserves `<!-- mission:unset -->` marker. Updated verification step #12. |

### Critic Review Changes (Iteration 2)
| Concern | Severity | Resolution |
|---------|----------|------------|
| Bootstrap "constraints" spec deviation undocumented | CRITICAL | Added explicit spec deviation note with rationale in bootstrap flow section |
| WORKFLOW.md "Dan's personal" framing not called out | MAJOR | Added to WORKFLOW.md row in files-to-touch table |
| Existing README sections (Why 9?, License TBD, Quickstart) unaddressed | MISSING | Added "Existing README sections to handle" block under README structure |
| AGENTS.md mirroring ambiguity (structure vs. semantics) | MISSING | Added explicit mirroring note: mirror semantically, not structurally |
| Existing glossary entries could be accidentally deleted | MISSING | Added note: preserve existing AC, ADR, Bootstrap entries |
| WORKFLOW.md scope-evolution + verification-marker sections at risk | MISSING | Explicitly noted in WORKFLOW.md row: keep these sections |
