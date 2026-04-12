# Plan: Multi-Agent Delegation & Provider-Tier Support

## Context

open-scaffold currently has zero delegation detection — `docs/WORKFLOW.md:54` explicitly states "there is no automatic router between tools. You, the human, decide." The advisory parallelism rules at `docs/WORKFLOW.md:82-88` describe WHEN to parallelize but provide no mechanism for detection, instruction, or enforcement. A 9-round deep interview (11% ambiguity, spec at `.omc/specs/deep-interview-multi-agent-delegation.md`) crystallized the need for: (a) plan-time detection of delegation/parallelism points via a formal Execution Strategy section, (b) agent-driven automation of delegation proposals via CLAUDE.md instructions, (c) a delegation prompt generator for non-OMC users, and (d) provider-tier documentation with graceful degradation from full OMC automation down to local LLMs.

**Key insight from the interview:** Detection belongs at planning time, not execution time. The planner annotates the work; the agent reads the annotations and proposes; the human approves. For users without capable agents, a dedicated script compensates by generating actionable terminal prompts with outcomes, deliverables, and handover instructions.

**Architect review (iteration 1):** Extracting prompt generation from verify.sh into a separate `delegate.sh` preserves verify.sh's clean responsibility boundary (pure validation). Making Execution Strategy optional avoids friction for trivial single-agent plans. Dropping ceremonial amendments for completed plans respects what the amendment protocol is actually for (live scope evolution, not schema migration).

**Critic review (iteration 1):** Plan must be updated to reflect Architect's synthesis. Verification steps must be behavioral, not grep-existence. Principle 4 needs qualification. ACs need delegate.sh coverage and settings.json entry. The Execution Strategy markdown schema must be defined explicitly for agent parsing.

## Goal

Add an optional Execution Strategy section to the plan template with structured fields for parallel groups, dependencies, and delegation notes — then wire three layers to read it: CLAUDE.md agent instructions (detect and propose delegation), delegate.sh (generate actionable terminal prompts for non-OMC users), and WORKFLOW.md (human decision tree and provider-tier capability table). Verify.sh validates the section's structure when present, but does not require its presence.

## Constraints / Out of scope

**Constraints:**
- Execution Strategy section is OPTIONAL — present for multi-agent or parallel work, absent for trivial single-agent tasks. Handoff template includes it as a guided block with `<when to include>` guidance.
- The core template remains a "7-section schema" with an optional Execution Strategy section. References to "7-section" are NOT updated to "8-section" — the 7 sections remain mandatory, Execution Strategy is supplementary.
- verify.sh validates Execution Strategy section structure IF present (correct sub-fields, no self-contradicting dependency declarations). Does NOT fail on absence. Implemented as a new Check 8 in --strict tier, separate from the existing section-completeness loop at Check 5.
- Prompt generation lives in `delegate.sh` (new script), NOT in verify.sh. verify.sh remains a pure compliance checker per its header and the enforcement-layer plan's Principle 5.
- Existing plans (public-release, enforcement-layer, frictionless-verification) are grandfathered. No retrofit amendments — these plans are completed work and the amendment protocol is for live scope evolution, not schema migration.
- delegate.sh must be Bash 3.2+ compatible (macOS system bash), no external dependencies (consistent with verify.sh and bootstrap.sh)
- OMC is the primary documented path; CLAUDE.md agent instructions include fallback guidance for non-OMC agents
- CLAUDE.md and AGENTS.md must stay in sync (ADR 0001)

**Out of scope:**
- Building a runtime agent router or orchestration engine (the scaffold is files, not software)
- Full parity across all provider tiers (local LLMs get delegate.sh prompts, not agent automation)
- Automatic agent spawning without human approval
- Supporting specific local LLM frameworks (Ollama, LM Studio, etc.)
- CI/CD pipeline changes
- Retrofit amendments for existing completed plans

## Files to touch

### New files (1)
| File | Action | Purpose |
|------|--------|---------|
| `delegate.sh` | Create | Reads a plan's Execution Strategy section and generates actionable terminal prompts for each parallel group. Input: plan file path. Output: one prompt per parallel group with task list, outcomes, deliverables, handover file conventions. Bash 3.2+ compatible. |

### Modified files (6)
| File | Action | Scope of change |
|------|--------|-----------------|
| `.omc/plans/handoff-template.md` | Add optional section | New "Execution strategy" section with structured fields: task decomposition table, parallel groups, dependencies, delegation notes. Included as a guided block with `<when to include>` instructions, consistent with the template's existing `<placeholder>` style. |
| `CLAUDE.md` | Add section | New "Delegation detection" section: agent reads Execution Strategy when present, proposes /team or /ultrawork for parallel groups (OMC) or describes parallelism opportunity in plain text (non-OMC), warns on tasks marked parallel that share files. |
| `AGENTS.md` | Mirror CLAUDE.md | Add delegation detection as operating rule #8. Mirror semantically per ADR 0001. |
| `verify.sh` | Add check | New Check 8 in --strict tier: IF "Execution strategy" heading is found in a plan file, validate it contains the required sub-fields (task decomposition, parallel groups, dependencies). Separate from existing Check 5 section-completeness loop. Does NOT add "Execution strategy" to the Check 5 loop. |
| `docs/WORKFLOW.md` | Add sections | Delegation decision tree in "When to use what" section. Provider-tier capability row in existing table format. |
| `README.md` | Add content | Provider-tier capability note in "Recommended runtimes" section. Mention delegate.sh in glossary and "What's inside" table. |

### Also modified (1)
| File | Action | Purpose |
|------|--------|---------|
| `.claude/settings.json` | Add permission | Add `Bash(./delegate.sh:*)` wildcard entry for delegate.sh |

### Unchanged files
- `MISSION.md` — no amendments means no changelog entries needed
- `bootstrap.sh` — no execution strategy awareness needed at bootstrap time
- `docs/decisions/` — ADR 0003 is a follow-up, not part of this plan's scope
- `.omc/plans/README.md` — amendment protocol unchanged
- Existing plan files — grandfathered, no amendments

## Execution strategy

<This plan involves multi-agent or parallel work. Include this section when a plan has 3+ tasks that can be grouped into independent parallel batches.>

### Task decomposition
| ID | Task | Dependencies | Parallel group |
|----|------|-------------|----------------|
| T1 | Update handoff-template.md with optional Execution Strategy section | None | A |
| T2 | Create delegate.sh script | T1 (needs to know the section format) | B |
| T3 | Add delegation detection section to CLAUDE.md | T1 (needs to reference the schema) | B |
| T4 | Add verify.sh Check 8 for Execution Strategy validation | T1 (needs to know the section format) | B |
| T5 | Update WORKFLOW.md with decision tree + provider-tier info | None | A |
| T6 | Update README.md with provider-tier section + delegate.sh docs | T2 (needs delegate.sh to exist for accurate docs) | C |
| T7 | Mirror delegation detection to AGENTS.md | T3 (mirrors CLAUDE.md) | C |
| T8 | Add delegate.sh permission to settings.json | T2 | C |

### Parallel groups
- **Group A** (independent, no prerequisites): T1, T5 — template schema + WORKFLOW.md
- **Group B** (depends on Group A completing): T2, T3, T4 — delegate.sh, CLAUDE.md, verify.sh
- **Group C** (depends on Group B completing): T6, T7, T8 — README, AGENTS.md mirror, settings.json

### Dependencies

- Group B depends on Group A (T2, T3, T4 need the template schema from T1 to reference)
- Group C depends on Group B (T7 mirrors T3; T6 documents T2; T8 adds permissions for T2)

### Delegation notes

- Group A tasks are independent and don't share files — suitable for `/team` or `/ultrawork` with 2 parallel agents
- Group B tasks are independent of each other (different files) — suitable for 3 parallel agents
- Group C tasks are lightweight — single agent, sequential

## Acceptance criteria

- [ ] AC-01: `.omc/plans/handoff-template.md` contains an "Execution strategy" section with structured sub-fields: task decomposition table, parallel groups, dependencies, and delegation notes. The section includes `<when to include>` guidance making clear it is optional.
- [ ] AC-02: CLAUDE.md contains a "Delegation detection" section that instructs agents to: (a) check whether the current plan has an Execution Strategy section, (b) if present, propose specific tools for parallel groups — `/team` or `/ultrawork` for OMC users, or plain-text parallelism suggestion for non-OMC agents, (c) warn when tasks marked as parallel share files listed in "Files to touch" or have undeclared cross-group dependencies.
- [ ] AC-03: AGENTS.md mirrors the delegation detection instructions semantically as operating rule #8 (per ADR 0001).
- [ ] AC-04: `verify.sh --strict` includes a new Check 8 that WARNs on malformed Execution Strategy sections IF the `## Execution strategy` heading is present in a plan file. Check 8 uses `warn()` (not `fail()`) — consistent with other --strict structural checks and appropriate for an optional section. Check 8 verifies: the section contains "Parallel groups" and "Dependencies" sub-headings. Check 8 does NOT run if the heading is absent (no warning on missing section). Check 8 is separate from the existing Check 5 section-completeness loop (Check 5 still validates the original 7 sections only).
- [ ] AC-05: `delegate.sh` exists at repo root, is executable (committed with executable bit), and accepts a plan file path as its first argument. It reads the Execution Strategy section from the specified file and prints one actionable prompt per parallel group. Each prompt includes: (a) the group's task list, (b) expected outcomes/deliverables per task, (c) handover convention (where to save output). If the plan has no Execution Strategy section, it prints a clear message and exits 0. If the section heading is present but the structure is unparseable (e.g., missing sub-headings), it prints a diagnostic message ("Execution Strategy section found but could not be parsed — check the format against the schema in handoff-template.md") and exits 0 (not a hard error).
- [ ] AC-06: `delegate.sh` output is generic (not OMC-specific) — prompts say "open a terminal and paste this prompt" without assuming a specific agent or runtime.
- [ ] AC-07: `docs/WORKFLOW.md` contains delegation guidance: a decision tree (independent tasks → parallelize; shared files → sequential; OMC → agent auto-proposes; no OMC → run `./delegate.sh`) integrated into the existing "When to use what" section or as a closely adjacent section.
- [ ] AC-08: Provider-tier capabilities are documented (in WORKFLOW.md or README.md): OMC = agent reads Execution Strategy and proposes delegation automatically; plain Claude Code = agent reads Execution Strategy if instructed; local LLM or no agent = run `./delegate.sh <plan-path>` for actionable prompts.
- [ ] AC-09: `.claude/settings.json` includes `Bash(./delegate.sh:*)` and `Bash(chmod +x ./delegate.sh)` in the allow list.
- [ ] AC-10: `delegate.sh` is Bash 3.2+ compatible with no external dependencies (consistent with verify.sh and bootstrap.sh).
- [ ] AC-11: verify.sh remains fully backward compatible — `./verify.sh --strict` still passes on plans that predate the Execution Strategy section (the original 7 sections are still the only mandatory ones).
- [ ] AC-12: All prior acceptance criteria from previous plans still pass (existing functionality intact).
- [ ] AC-13: `README.md` glossary includes delegate.sh and "What's inside" table includes it.

## Verification steps

1. **Template section exists:** Open `.omc/plans/handoff-template.md` and confirm it contains `## Execution strategy` with sub-fields for task decomposition, parallel groups, dependencies, and delegation notes. Confirm the section includes `<when to include>` guidance.
2. **Template section is optional:** Confirm that existing plans (public-release.md, enforcement-layer.md, frictionless-verification.md) do NOT have the section, and `./verify.sh --strict` still passes without it (exit 0, no Execution Strategy failure).
3. **CLAUDE.md delegation instructions:** Open CLAUDE.md "Delegation detection" section. Confirm it: (a) tells the agent to check for Execution Strategy in the current plan, (b) includes OMC-specific tool suggestions (/team, /ultrawork) AND a non-OMC fallback (plain-text suggestion), (c) includes the shared-file warning instruction.
4. **AGENTS.md mirror:** Open AGENTS.md operating rules. Confirm rule #8 covers delegation detection with semantic parity to CLAUDE.md (per ADR 0001's "mirror semantically, not structurally" convention).
5. **verify.sh Check 8 — positive case:** Create a test plan with a well-formed Execution Strategy section. Run `./verify.sh --strict`. Confirm output includes a PASS line for the Execution Strategy structure check.
6. **verify.sh Check 8 — negative case (malformed):** Create a test plan with an Execution Strategy heading but missing "Parallel groups" sub-field. Run `./verify.sh --strict`. Confirm output includes a WARN line identifying the missing sub-field.
7. **verify.sh Check 8 — absent section:** Run `./verify.sh --strict` against an existing plan without Execution Strategy (e.g., public-release.md). Confirm NO failure or warning about Execution Strategy — the check is skipped silently.
8. **verify.sh backward compat:** Run `./verify.sh --quick --quiet` — confirm exit 0, no output (existing behavior preserved).
9. **delegate.sh — happy path:** Run `./delegate.sh .omc/plans/multi-agent-delegation.md`. Confirm output contains prompts for each parallel group (Group A, Group B, Group C) with task lists and expected outcomes.
10. **delegate.sh — no Execution Strategy:** Run `./delegate.sh .omc/plans/public-release.md`. Confirm it prints a message like "No Execution Strategy section found" and exits 0.
11. **delegate.sh — missing file:** Run `./delegate.sh nonexistent.md`. Confirm it prints an error and exits 1.
12. **delegate.sh — generic output:** Inspect delegate.sh output — confirm it does NOT reference OMC-specific tools (/team, /ultrawork, /ralph). Prompts should be agent-agnostic.
13. **WORKFLOW.md decision tree:** Open docs/WORKFLOW.md. Confirm it contains delegation decision guidance and a provider-tier row/table showing OMC, Claude Code, and local LLM tiers.
14. **README.md coverage:** Confirm README.md mentions delegate.sh in the glossary and "What's inside" table. Confirm provider-tier capabilities are documented.
15. **Settings.json:** Confirm `.claude/settings.json` contains `Bash(./delegate.sh:*)`.
16. **Bash compat:** Run `./delegate.sh .omc/plans/multi-agent-delegation.md` and `./verify.sh --strict` — both complete without errors on the current shell.

## Open questions

1. **delegate.sh prompt format:** Should each parallel group's prompt include an explicit "when you're done, save your work to `<path>`" handover instruction, or just describe the tasks and let the user handle handover? Current recommendation: include handover instructions, since local LLM users won't have agent-managed session handover.
2. **ADR 0003:** Consider writing an ADR for the Execution Strategy schema design and the delegate.sh decision. Not blocking for this plan but recommended as a follow-up.
3. **Execution Strategy template style:** The handoff template uses `<placeholder text>` style (not HTML comments). The Execution Strategy section should follow the same convention with `<when to include>` guidance text, not a commented-out block.

---

## RALPLAN-DR Summary

### Principles
1. **Detection at planning time** — Delegation decisions are made when writing the plan, not during execution. The Execution Strategy section captures work decomposition at the point of maximum information.
2. **Agent proposes, human approves** — The agent reads plan annotations, detects parallelism opportunities, and suggests specific tools. The human has final say — the agent never auto-spawns without approval.
3. **Graceful degradation** — Full automation (OMC with /team, /ultrawork) → partial detection (plain Claude Code reads annotations) → script-generated prompts (delegate.sh for local LLMs). Every tier gets value.
4. **Plan as delegation source of truth** — When a plan involves parallel or multi-agent work, the Execution Strategy section is where those decisions live. Trivial single-agent plans may omit it — delegation decisions only exist when the work warrants them.
5. **Immutability-compatible, schema-light** — The 7 mandatory sections remain the core schema. Execution Strategy is supplementary. Existing plans are grandfathered — no retrofit amendments for completed work. The amendment protocol is reserved for live scope evolution.

### Decision Drivers
1. **The agent automation ceiling** — OMC can automate delegation end-to-end. Local LLMs can't even read CLAUDE.md reliably. The scaffold must provide value at both ends of this spectrum, with delegate.sh as the universal compensator.
2. **Responsibility separation** — verify.sh is a compliance checker (validation). delegate.sh is a prompt generator (generation). Mixing these responsibilities would erode verify.sh's clean mandate and set a precedent for feature creep.
3. **Scaffold, not runtime** — open-scaffold is files (markdown + bash), not a runtime engine. "Detection" means structured annotations and instructions that agents read — not code that routes tasks at runtime. A third script (delegate.sh, alongside verify.sh and bootstrap.sh) is consistent with the project's existing pattern.

### Viable Options

#### Option A: Plan Template + CLAUDE.md + delegate.sh + verify.sh Validation (Recommended)
Add optional Execution Strategy to the handoff template. CLAUDE.md instructs agents to read it and propose delegation. delegate.sh generates terminal prompts for non-OMC users. verify.sh validates section structure if present (--strict, Check 8). WORKFLOW.md documents the decision tree and provider tiers.

**Pros:**
- Clean responsibility separation: verify.sh validates, delegate.sh generates
- Optional section avoids friction for simple plans while providing value for complex ones
- Three-script pattern (verify.sh, bootstrap.sh, delegate.sh) is consistent and learnable
- Graceful degradation across all provider tiers
- No schema migration — 7 mandatory sections unchanged
- Backward compatible — existing plans, existing verify.sh checks all still work
- No ceremonial amendments for completed plans

**Cons:**
- One new script file (12 total files, up from 11)
- Optional section means agents must handle both cases (plan with and without Execution Strategy)
- delegate.sh adds a tool that may be under-used (local LLM users are a small audience)
- verify.sh gains a conditional check (Check 8) that only runs when the section is present

#### Option B: WORKFLOW.md Decision Tree Only (Documentation-Only)
No template changes, no scripts. Just update WORKFLOW.md with a comprehensive decision tree and provider-tier table.

**Pros:**
- Minimal changes (1 file)
- Zero backward-compatibility concerns
- Zero verify.sh complexity

**Cons:**
- No detection — humans must remember to consult the decision tree
- No validation — nothing catches bad parallelization
- No compensation for limited agents — no actionable prompts
- Doesn't satisfy the spec's core requirement: "agent did it automatically"
- **Invalidated:** Fails the primary interview insight (agent proposes, human approves). Provides no value to limited-agent users beyond what exists today.

#### Option C: Runtime-Specific Plugins
Each runtime (OMC, OMX) implements its own delegation detection via hooks or metadata.

**Pros:**
- Each runtime optimizes for its capabilities
- No changes to the scaffold itself

**Cons:**
- Local LLM users get nothing (no runtime = no detection)
- Fragments experience across runtimes
- Violates "scaffold, not runtime" — pushes methodology logic into runtimes
- Requires coordination with OMC/OMX maintainers for a feature they may not want
- **Invalidated:** Contradicts the scaffold's core value proposition. The scaffold must work without any runtime.

### ADR
- **Decision:** Plan template + CLAUDE.md + delegate.sh + verify.sh validation (Option A)
- **Drivers:** Agent automation ceiling, responsibility separation, scaffold-not-runtime
- **Alternatives considered:** WORKFLOW.md decision tree only (too passive, no agent automation, no compensation for limited agents), runtime-specific plugins (fragments experience, violates scaffold philosophy, excludes local LLM users)
- **Why chosen:** Only option that provides value at all three provider tiers while maintaining clean responsibility separation (verify validates, delegate generates). Optional section avoids schema migration friction. New script is consistent with existing two-script pattern.
- **Consequences:** Repo gains one new script (delegate.sh). Plan template gains one optional section. verify.sh gains one conditional check. CLAUDE.md gains delegation instructions with OMC and non-OMC paths. Provider-tier capabilities documented for the first time.
- **Follow-ups:** ADR 0003 for Execution Strategy schema design. Monitor delegate.sh usage by local-LLM users — if unused, consider removing in a future iteration. Consider whether delegate.sh should eventually support amendment-chained Execution Strategy (reading plan + amendments together).

### Architect Review Changes (Iteration 1)
| Concern | Severity | Resolution |
|---------|----------|------------|
| verify.sh scope creep (--delegate violates SRP) | BLOCKING | Extracted to separate `delegate.sh` script |
| 7→8 section schema ripple | HIGH | Execution Strategy is optional; 7-section schema references unchanged |
| OR-logic for plan vs amendment presence | MEDIUM | Eliminated — validate structure if present, don't validate presence |
| Ceremonial amendments for completed plans | MEDIUM | Dropped — existing plans grandfathered |
| Schema design for agent parsing | MEDIUM | Defined flat markdown schema (bold-key tables and bullet lists) |
| Backward compatibility for non-adopters | LOW | Addressed by optional section — no penalty for omission |
| Provider-tier doc scope | LOW | Kept in WORKFLOW.md's existing table format |

### Critic Review Changes (Iteration 1)
| Concern | Severity | Resolution |
|---------|----------|------------|
| ACs contradict Architect's accepted recommendations | CRITICAL | All ACs rewritten to reflect: optional section, delegate.sh, no amendments, no schema rename |
| Principle 4 inconsistent with optional section | MAJOR | Rewritten as "Plan as delegation source of truth" — qualified for when delegation decisions exist |
| Verification steps are grep-existence checks | MAJOR | Replaced with behavioral checks: positive/negative/absent cases for verify.sh, happy path/no-section/missing-file for delegate.sh |
| 7→8 section naming wrong if optional | MAJOR | Kept as "7-section schema" — Execution Strategy is supplementary |
| verify.sh Check 8 implementation ambiguity | MAJOR | Explicitly specified: new Check 8, separate from Check 5 loop, conditional on heading presence |
| No ACs for delegate.sh | MISSING | Added AC-05, AC-06, AC-10 for delegate.sh behavior, output format, bash compat |
| No settings.json entry | MISSING | Added AC-09 for `Bash(./delegate.sh:*)` |
| Non-OMC agent fallback in CLAUDE.md | MISSING | AC-02(b) now specifies both OMC tool suggestions AND non-OMC plain-text fallback |

### Execution Strategy Schema Definition

The Execution Strategy section uses flat, agent-parsable markdown consistent with the template's existing conventions (tables, bullets, bold labels):

```markdown
## Execution strategy

<Include this section when a plan involves 3+ tasks that can be organized into independent parallel batches. Omit for simple single-agent plans.>

### Task decomposition
| ID | Task | Dependencies | Parallel group |
|----|------|-------------|----------------|
| T1 | <task description> | None | A |
| T2 | <task description> | T1 | B |
| T3 | <task description> | None | A |

### Parallel groups
- **Group A** (<rationale>): T1, T3 — <why these are independent>
- **Group B** (depends on Group A): T2 — <why this must wait>

### Dependencies
- T2 depends on T1 (<specific reason — e.g., "needs the API schema T1 produces">)

### Delegation notes
- Group A tasks are independent — suitable for parallel agents or separate terminal sessions
- Group B must wait for Group A to complete
```

**Parsing contract for agents and delegate.sh:**
- `## Execution strategy` heading marks the section start
- `### Task decomposition` table uses `| ID | Task | Dependencies | Parallel group |` header
- `### Parallel groups` uses `**Group X**` bold-key pattern
- `### Dependencies` uses bullet list with task ID cross-references
- `### Delegation notes` uses plain bullet list
- All sub-sections are optional within the Execution Strategy section, but verify.sh Check 8 requires at minimum "Parallel groups" and "Dependencies" sub-headings if the top-level section is present
