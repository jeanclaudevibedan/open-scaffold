# Deep Interview Spec: Enforcement Layer for open-scaffold

## Metadata
- Interview ID: enforcement-layer-2026-04-12
- Rounds: 5
- Final Ambiguity Score: 17%
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
| Context Clarity | 0.80 | 0.15 | 0.120 |
| **Total Clarity** | | | **0.835** |
| **Ambiguity** | | | **0.165** |

## Goal

Add a non-blocking enforcement layer to open-scaffold that makes the methodology self-enforcing through three surfaces: (1) a `verify.sh` script as the single source of compliance truth with configurable tiers, (2) hardened agent instructions in CLAUDE.md/AGENTS.md that tell agents to run verify.sh before any code change and redirect to fix workflows on violations, and (3) bootstrap.sh running a subset of checks on re-run. The enforcement philosophy is "warn and redirect to fix" — agents automatically start fixing violations (define mission, create plan) rather than just reporting them, but users can override. The agent IS the guardrail — the human doesn't opt into compliance; the agent does it for them.

## Constraints

- **Non-blocking:** Warnings and redirects, never hard blocks. Users can always override. Respects ADR 0001's "shape over enforcement" spirit while adding a feedback loop.
- **Plain text + plain bash:** verify.sh must work on macOS bash 3.2+, no external dependencies, no GNU-only flags.
- **Stack-agnostic:** No language-specific checks, no CI/CD integration (consumers can add their own).
- **Agent-first:** The primary enforcement surface is the AI agent reading CLAUDE.md/AGENTS.md. verify.sh is the truth source; the agent is the enforcement mechanism.
- **Configurable tiers:** verify.sh supports `--quick`, `--standard` (default), and `--strict` modes so users pick their enforcement level.
- **No git hooks by default:** verify.sh exists as a script to be run; it is NOT installed as a git hook automatically. Users or runtimes can opt into hooks if they want, but the scaffold doesn't impose them.

## Non-Goals

- **Not a CI/CD pipeline:** verify.sh is a local tool. Consumers can wire it into CI if they want.
- **Not a linter:** verify.sh checks methodology compliance (mission, plans, amendments), not code quality.
- **Not a hard block:** Even the most severe violation (mission undefined) results in a redirect, not a refusal. The user always has the final say.
- **Not OMC-specific:** The enforcement layer works with any agent that reads CLAUDE.md/AGENTS.md, not just OMC.

## Acceptance Criteria

- [ ] AC-01: `verify.sh` exists at repo root and is executable
- [ ] AC-02: `verify.sh` with no flags runs `--standard` tier by default
- [ ] AC-03: `verify.sh --quick` checks: (1) mission defined (mission:unset marker absent), (2) at least one plan file exists in `.omc/plans/` beyond the template and README
- [ ] AC-04: `verify.sh --standard` checks everything in --quick plus: (3) amendment files are sequentially numbered per plan slug (no gaps), (4) MISSION.md changelog has a dated entry for each amendment file
- [ ] AC-05: `verify.sh --strict` checks everything in --standard plus: (5) plan files contain all 7 sections from the handoff template, (6) CLAUDE.md and AGENTS.md both contain the "Layered architecture" section (drift check), (7) no committed changes to files in `.omc/plans/` that aren't amendment files (plan immutability check)
- [ ] AC-06: verify.sh output is a human-readable checklist with PASS/WARN/FAIL per check, plus an overall summary line
- [ ] AC-07: verify.sh exit code is 0 if all checks pass, 1 if any check fails (for scriptable integration)
- [ ] AC-08: verify.sh works on macOS bash 3.2+ with no external dependencies
- [ ] AC-09: CLAUDE.md updated with enforcement protocol: agents MUST run `./verify.sh --quick` before any non-trivial code change. On violation: report results, then redirect to fix workflow (define mission / create plan / write amendment). User can override with explicit instruction.
- [ ] AC-10: AGENTS.md updated to mirror the enforcement protocol semantically (per ADR 0001)
- [ ] AC-11: bootstrap.sh runs `verify.sh --quick` at the end of its execution and reports results (non-blocking — bootstrap completes regardless)
- [ ] AC-12: README.md updated: "Your First 15 Minutes" step mentions verify.sh as a compliance check; Glossary adds "verify.sh" term
- [ ] AC-13: docs/WORKFLOW.md updated: Verify phase references `./verify.sh` as the built-in compliance tool alongside OMC's `/verify`
- [ ] AC-14: verify.sh is portable — no GNU-only flags, no external dependencies, works in sh-compatible shells
- [ ] AC-15: Existing functionality unbroken — all prior ACs from public-release plan still pass

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Enforcement means blocking | Spectrum from nudges to hard blocks (Round 1) | Checkpoints that warn — visibility without blocking |
| verify.sh is the enforcement | Warnings only work if someone reads them (Contrarian, Round 4) | The AGENT is the enforcement surface — it runs verify.sh automatically. The human doesn't opt in; the agent does it for them. |
| All checks are equal | Different violations have different severity (Round 3) | Configurable tiers: --quick (mission+plan), --standard (+amendments+changelog), --strict (+schema+drift+immutability) |
| Agent behavior on violation is binary | Should it refuse or just warn? (Round 5) | Warn and redirect to fix — agent starts the fix workflow automatically. User can override. |
| ADR 0001 forbids enforcement | "Shape over enforcement" philosophy (Round 1) | Warning-based enforcement IS shape — it redirects toward the right path rather than blocking the wrong one. Does not violate ADR 0001. |

## Technical Context

### verify.sh Check Matrix

| Check | --quick | --standard | --strict | On Fail |
|-------|---------|------------|----------|---------|
| Mission defined (no mission:unset marker) | X | X | X | Redirect: "Let me help define your mission" |
| At least one plan file exists | X | X | X | Redirect: "Let me help create your first plan" |
| Amendment numbering sequential | | X | X | Warn: "Amendment gap detected in {slug}" |
| Changelog entry per amendment | | X | X | Warn: "Amendment {file} has no changelog entry" |
| Plan files have 7 sections | | | X | Warn: "Plan {file} missing section: {section}" |
| CLAUDE.md/AGENTS.md layered-arch sync | | | X | Warn: "Paired view drift detected" |
| Plan immutability (no edits to committed plans) | | | X | Warn: "Plan {file} was edited after commit" |

### Agent Enforcement Protocol (for CLAUDE.md/AGENTS.md)

```
BEFORE any non-trivial code change:
1. Run ./verify.sh --quick silently
2. If all checks pass: proceed normally
3. If mission undefined: 
   - Report: "Your mission isn't defined yet."
   - Redirect: "Let me help you define it now. What is this project?"
   - Do not proceed to the original request until resolved or user explicitly overrides
4. If no plan file:
   - Report: "No plan file found for this work."
   - Redirect: "Let me help create a plan. What are you trying to build?"
   - Do not proceed until plan is created or user explicitly overrides
5. User override: if user says "skip", "just do it", "ignore verify", proceed with a note
```

### Three-Surface Architecture

```
Surface 1: verify.sh (source of truth)
  ├── --quick  (mission + plan)
  ├── --standard (+ amendments + changelog) [default]
  └── --strict (+ schema + drift + immutability)

Surface 2: Agent Instructions (primary enforcement mechanism)
  ├── CLAUDE.md: "Run verify.sh --quick before any non-trivial change"
  ├── AGENTS.md: mirrors semantically
  └── Behavior: warn → redirect to fix → proceed only when resolved or overridden

Surface 3: bootstrap.sh (first-run checkpoint)
  └── Runs verify.sh --quick at end, reports results
```

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Enforcement Layer | core domain | non-blocking, warning-based, three surfaces | contains verify.sh, Agent Protocol, Bootstrap Checks |
| verify.sh | core domain | bash script, configurable tiers, exit codes | source of truth; run by agents and bootstrap |
| Agent-First Enforcement | core domain | agent reads CLAUDE.md, runs verify.sh, redirects | primary enforcement mechanism |
| Redirect-to-Fix | core domain | warn, start fix workflow, allow override | agent behavior on violation |
| Mission Gate | core domain | mission:unset marker check | --quick tier check |
| Plan Gate | core domain | plan file existence check | --quick tier check |
| Amendment Check | core domain | sequential numbering, changelog entries | --standard tier check |
| Tier System | supporting | quick, standard, strict | configures verify.sh depth |
| Bootstrap Checks | supporting | verify.sh --quick at end of bootstrap | first-run checkpoint |
| Three-Surface Architecture | supporting | verify.sh + agent + bootstrap | overall enforcement design |
| Agent Instructions | supporting | CLAUDE.md, AGENTS.md | encode enforcement protocol |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 7 | 7 | - | - | N/A |
| 2 | 9 | 2 | 1 | 6 | 78% |
| 3 | 10 | 1 | 1 | 8 | 90% |
| 4 | 11 | 1 | 3 | 7 | 91% |
| 5 | 11 | 1 | 2 | 8 | 91% |

## Interview Transcript

<details>
<summary>Full Q&A (5 rounds)</summary>

### Round 1
**Q:** What does 'self-enforcing' mean to you? How hard should the guardrails be?
**A:** Checkpoints that warn
**Ambiguity:** 64% (Goal: 0.50, Constraints: 0.30, Criteria: 0.10, Context: 0.60)

### Round 2
**Q:** Imagine a stranger has cloned open-scaffold, skipped the mission fill-in, and started telling their agent to write code directly. What should happen?
**A:** All three, layered — verify.sh as truth, agent instructions reference it, bootstrap runs a subset
**Ambiguity:** 42% (Goal: 0.70, Constraints: 0.40, Criteria: 0.55, Context: 0.65)

### Round 3
**Q:** Which protocol rules should verify.sh actually check?
**A:** Configurable tiers — --quick (mission+plan), --standard (+amendments+changelog), --strict (+schema+drift+traceability). Default is --standard.
**Ambiguity:** 30% (Goal: 0.80, Constraints: 0.65, Criteria: 0.60, Context: 0.70)

### Round 4 [CONTRARIAN MODE]
**Q:** The people who need enforcement the most are exactly the ones who won't opt into it. How do you solve this?
**A:** Agent IS the guardrail — the agent reads CLAUDE.md, runs verify.sh automatically. The human doesn't opt in; the agent does it for them.
**Ambiguity:** 24% (Goal: 0.85, Constraints: 0.70, Criteria: 0.70, Context: 0.75)

### Round 5
**Q:** The agent runs verify.sh, detects violations. What does it do next?
**A:** Warn and redirect to the fix — agent starts the fix workflow automatically, user can override
**Ambiguity:** 17% (Goal: 0.90, Constraints: 0.80, Criteria: 0.80, Context: 0.80)

</details>
