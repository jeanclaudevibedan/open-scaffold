# Deep Interview Spec: Multi-Agent Delegation & Provider-Tier Support

## Metadata
- Interview ID: multi-agent-delegation-2026-04-12
- Rounds: 9
- Final Ambiguity Score: 11%
- Type: brownfield
- Generated: 2026-04-12
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.95 | 0.35 | 0.333 |
| Constraint Clarity | 0.85 | 0.25 | 0.213 |
| Success Criteria | 0.85 | 0.25 | 0.213 |
| Context Clarity | 0.90 | 0.15 | 0.135 |
| **Total Clarity** | | | **0.893** |
| **Ambiguity** | | | **10.7%** |

## Goal

Make open-scaffold actively recognize when work should be delegated to multiple agents or run in parallel, instruct the human (or agent) on what to do at those points, and gracefully degrade across provider tiers — from full OMC automation, through plain Claude Code, down to local open-source LLMs where verify.sh compensates for agent limitations by generating actionable terminal prompts.

## Constraints
- OMC is the primary documented path; other providers get explicit escape hatches, not full parity
- The handoff template gains a new formal "Execution Strategy" section with structured fields (parallel groups, dependencies, delegation candidates)
- Existing plans in `.omc/plans/` are retrofitted via the amendment protocol (immutability preserved — no in-place edits)
- verify.sh must remain Bash 3.2+ compatible (macOS system bash)
- All 5 delivery pieces ship together as one coherent change — no phased rollout
- Plan annotations are the single source of truth for delegation decisions; agent behavior and verify.sh analysis both read from them

## Non-Goals
- Building a runtime agent router or orchestration engine (the scaffold is files, not software)
- Full parity across all provider tiers (local LLMs get verify.sh-based prompts, not agent automation)
- Automatic agent spawning without human approval (the human approves, the agent proposes)
- Supporting specific local LLM frameworks (Ollama, LM Studio, etc.) — the scaffold is framework-agnostic at the escape-hatch tier

## Acceptance Criteria
- [ ] The handoff template (`.omc/plans/handoff-template.md`) has an "Execution Strategy" section with structured fields for parallel groups, dependencies, and delegation candidates
- [ ] An OMC-equipped agent reading a plan with the Execution Strategy section proactively identifies parallelizable tasks and proposes specific tools (`/team`, `/ultrawork`, `/ultrawork` with delegation)
- [ ] `verify.sh --strict` validates that the Execution Strategy section exists in plan files and is well-formed (correct structure, no parallel groups containing dependent tasks if dependencies are declared)
- [ ] For non-OMC users, `verify.sh` prints actionable prompts they can paste into separate terminal sessions, including: specific outcomes per task, deliverables, handover file expectations, and instructions
- [ ] `docs/WORKFLOW.md` documents a decision tree for manual fallback (when to parallelize, when to delegate, when to stay sequential)
- [ ] README or WORKFLOW.md explicitly documents provider-tier capabilities: what works at each level (OMC = full automation, plain Claude Code = partial agent detection, local LLM = verify.sh prompt generation only)

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| The human decides when to delegate | "What if the agent could detect it?" | Agent detects and proposes; human approves |
| Detection happens at execution time | "What if it happens at planning time?" | Plan-embedded annotations — detection shifts to planning phase |
| All providers need the same workflow | "What's the minimum for a local LLM?" | OMC-first with escape hatches; verify.sh compensates for limited agents |
| Escape hatches are just documentation | "What if verify.sh actively helped?" | verify.sh generates full prompts with outcomes, deliverables, handover files |
| Four detection mechanisms is too many | Simplifier challenge: "What's the simplest version?" | All four ship together — half-measures leave the scaffold incomplete |
| Existing plans don't need the new schema | "What about retroactive consistency?" | Retrofit all via amendment protocol (immutability preserved) |

## Technical Context

### Existing Codebase (Brownfield Findings)
- **`docs/WORKFLOW.md`** (lines 52-63): Has a task-shape decision table but explicitly says "there is no automatic router — you, the human, decide"
- **`docs/WORKFLOW.md`** (lines 82-88): Has parallel vs. sequential rules (advisory only, no enforcement)
- **`.omc/plans/handoff-template.md`**: 7-section schema — Context, Goal, Constraints, Files, ACs, Verification, Open Questions. No execution strategy section.
- **`verify.sh`**: Three tiers (--quick, --standard, --strict). Currently checks mission definition, plan existence, amendment numbering, changelog coverage, schema completeness, paired view sync, and plan immutability. No parallelism detection.
- **`CLAUDE.md`**: Contains compliance check instructions (run verify.sh --quick --quiet before code changes). No delegation detection instructions.
- **Existing plans**: `public-release.md`, `enforcement-layer.md`, `frictionless-verification.md` — none have execution strategy annotations. Will need amendment files.
- **README.md**: Lists OMC and OMX as "recommended runtimes" but says "neither is required." No provider-tier capability breakdown.

### Changes Required
1. **`.omc/plans/handoff-template.md`** — Add "Execution Strategy" section (section 8) with structured fields
2. **`CLAUDE.md`** — Add instructions for agent-driven detection: read Execution Strategy, propose delegation/parallelism, suggest specific tools
3. **`verify.sh`** — Add --strict check for Execution Strategy schema validation; add delegation prompt generation for non-OMC users
4. **`docs/WORKFLOW.md`** — Add decision tree for delegation/parallelism; add provider-tier capability table
5. **`README.md`** — Add provider-tier section documenting what works at each level
6. **`.omc/plans/`** — Amendment files for existing plans adding Execution Strategy sections

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| open-scaffold | core domain | methodology template, files-based, no runtime | Contains all other entities |
| Execution Strategy section | core domain | parallel groups, dependencies, delegation candidates | Added to handoff-template; read by Agent automation and verify.sh |
| Agent automation | core domain | detection, proposal, tool suggestion | Reads Execution Strategy; outputs to human for approval |
| verify.sh delegation planner | core domain | schema validation, prompt generation | Validates Execution Strategy; generates Terminal session prompts |
| CLAUDE.md instructions | mechanism | agent behavior rules, detection triggers | Instructs Agent automation behavior |
| WORKFLOW.md decision tree | mechanism | task shape routing, manual fallback | Documents delegation decisions for human reference |
| Provider tier | supporting | OMC (full), Claude Code (partial), local LLM (verify.sh only) | Determines which mechanisms are available |
| Provider tier documentation | supporting | capability table, escape hatch descriptions | Visible to new users in README/WORKFLOW.md |
| Terminal session prompts | supporting | outcomes, deliverables, handover files, instructions | Generated by verify.sh for non-OMC users |
| Plan amendments | supporting | retrofit mechanism, immutability-preserving | Adds Execution Strategy to existing plans |
| verify.sh prompt generation | mechanism | actionable output, copy-pasteable prompts | Part of verify.sh delegation planner |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 4 | 4 | - | - | N/A |
| 2 | 6 | 3 | 0 | 3 | 50% |
| 3 | 7 | 1 | 1 | 5 | 86% |
| 4 | 8 | 1 | 1 | 6 | 88% |
| 5 | 9 | 1 | 0 | 8 | 89% |
| 6 | 10 | 1 | 2 | 7 | 90% |
| 7 | 10 | 0 | 0 | 10 | 100% |
| 8 | 10 | 1 | 1 | 7 | 80% |
| 9 | 11 | 1 | 0 | 10 | 91% |

## Interview Transcript
<details>
<summary>Full Q&A (9 rounds)</summary>

### Round 1
**Q:** Your idea spans four distinct concerns: (1) how the framework detects delegation/parallelism points, (2) how humans are instructed at those points, (3) Anthropic-only workflows without OMX, and (4) local/open-source LLM support. Are you looking to DOCUMENT how the framework should handle these, BUILD detection/routing logic, or ANALYZE gaps only?
**A:** Build detection + guidance
**Ambiguity:** 77% (Goal: 0.30, Constraints: 0.10, Criteria: 0.10, Context: 0.50)

### Round 2
**Q:** Open-scaffold is a methodology scaffold — it's files, not a runtime engine. Currently WORKFLOW.md says "there is no automatic router." When you say you want the framework to "recognize that a point has been reached," what form do you imagine that taking?
**A:** Both + workflow docs — CLAUDE.md instructions for agent-side detection, verify.sh for plan-level analysis, AND updated WORKFLOW.md with a decision tree.
**Ambiguity:** 72% (Goal: 0.40, Constraints: 0.15, Criteria: 0.10, Context: 0.55)

### Round 3
**Q:** Are you envisioning tiered workflow paths per provider, capability-based abstraction, or OMC-first with escape hatches?
**A:** OMC-first with escape hatches
**Ambiguity:** 63% (Goal: 0.55, Constraints: 0.25, Criteria: 0.10, Context: 0.60)

### Round 4
**Q:** When the scaffold detects a delegation/parallelism point, what should the human experience?
**A:** Plan-embedded annotations — detection happens at planning time, not execution time. The planner marks tasks as parallelizable or delegate-candidate.
**Ambiguity:** 55% (Goal: 0.70, Constraints: 0.30, Criteria: 0.15, Context: 0.65)

### Round 5 (Contrarian Mode)
**Q:** You've described four mechanisms. What if most of that is unnecessary? What's the ONE concrete outcome that would make you say "yes, the scaffold handled that correctly"?
**A:** Agent did it automatically — the agent reads plan annotations, recognizes parallelism, and either executes or proposes a concrete action. The human's job is to approve, not figure it out.
**Ambiguity:** 45% (Goal: 0.75, Constraints: 0.30, Criteria: 0.45, Context: 0.70)

### Round 6
**Q:** Local open-source LLMs can't use tools, spawn sub-agents, or read CLAUDE.md reliably. For the escape hatches at this capability cliff, what's the minimum viable experience?
**A:** verify.sh tells them what to do, and gives them the prompts they need to run in separate terminal sessions with the specific outcomes, deliverables, handover files, instructions, etc.
**Ambiguity:** 35% (Goal: 0.85, Constraints: 0.45, Criteria: 0.50, Context: 0.75)

### Round 7 (Simplifier Mode)
**Q:** We've described 5 pieces across 4+ files. What's the simplest version that would still be valuable? Is there a subset you'd ship first?
**A:** Ship it all as designed. The full scope is the right scope. Half-measures would leave the scaffold incomplete.
**Ambiguity:** 30% (Goal: 0.90, Constraints: 0.50, Criteria: 0.55, Context: 0.80)

### Round 8
**Q:** Should existing plans be retroactively annotated or only new plans? Should annotations be a formal schema or freeform?
**A:** Retrofit all + formal schema. Add Execution Strategy section to existing plans via amendments. Fully formal and validated.
**Ambiguity:** 22% (Goal: 0.90, Constraints: 0.75, Criteria: 0.60, Context: 0.85)

### Round 9
**Q:** Proposed 5 acceptance criteria. What's missing?
**A:** Missing: provider-tier docs — README/WORKFLOW.md must explicitly document what works at each provider tier.
**Ambiguity:** 11% (Goal: 0.95, Constraints: 0.85, Criteria: 0.85, Context: 0.90)

</details>
