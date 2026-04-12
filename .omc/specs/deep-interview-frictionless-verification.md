# Deep Interview Spec: Frictionless Verification

## Metadata
- Interview ID: frictionless-verification-20260412
- Rounds: 6
- Final Ambiguity Score: 19.5%
- Type: brownfield
- Generated: 2026-04-12
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 0.35 | 0.315 |
| Constraint Clarity | 0.75 | 0.25 | 0.188 |
| Success Criteria | 0.85 | 0.25 | 0.213 |
| Context Clarity | 0.60 | 0.15 | 0.090 |
| **Total Clarity** | | | **0.805** |
| **Ambiguity** | | | **19.5%** |

## Goal
Make open-scaffold's verification system invisible during normal work and loud only when the user steps outside framework boundaries. Verification runs frequently (session start, before code changes, on scope expansion) but produces zero output and zero permission prompts on success. On failure, it hard-blocks the agent and guides the user to fix the violation.

## Constraints
- All three enforcement surfaces are changeable: verify.sh, CLAUDE.md instructions, and .claude/settings.json
- No hook infrastructure required — the simpler approach of portable permissions + silent verify.sh is sufficient
- Must be portable: any user who clones open-scaffold should get frictionless verification without editing settings.json
- verify.sh must remain usable as a standalone manual tool (all three tiers: --quick, --standard, --strict)
- The scaffold's two-layer architecture must be preserved: core methodology works without OMC, OMC-enhanced layer adds automation

## Non-Goals
- Building Claude Code hook infrastructure for verification (contrarian round eliminated this as unnecessary complexity)
- Changing what verify.sh checks (the --quick tier checks are correct: mission defined + plan exists)
- Making verification optional or skippable by default (failure should hard-block)
- Adding git hooks (existing design decision to avoid them)

## Acceptance Criteria
- [ ] AC1: verify.sh produces NO stdout/stderr when all checks pass (silent success mode)
- [ ] AC2: verify.sh produces clear, actionable error output when any check fails (current behavior preserved)
- [ ] AC3: verify.sh exit codes unchanged (0 = pass, 1 = fail) so callers can check status without parsing output
- [ ] AC4: .claude/settings.json uses portable paths (not absolute paths tied to a specific user/machine) so that any user who clones the repo gets verify.sh pre-authorized without editing the file
- [ ] AC5: CLAUDE.md instructions updated to reflect silent-success model (agent runs verify.sh frequently but doesn't report success to user)
- [ ] AC6: On verify.sh failure, agent hard-blocks and guides user to fix the violation (current behavior preserved)
- [ ] AC7: Manual runs of verify.sh (without --quiet flag or equivalent) still produce human-readable output for direct terminal use
- [ ] AC8: A fresh clone of open-scaffold by a new user can run through a basic workflow (define mission, create plan, write code) with zero bash-permission prompts for verify.sh

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Hooks are needed for frictionless verification | Contrarian: "What if silent success is enough?" | Silent success + portable permissions eliminates the need for hooks. The friction was visibility, not frequency. |
| Verification should run less often | User confirmed: before every non-trivial change, session start, scope expansion, boundary crossings | Frequency is fine. The problem is that successful runs create noise and permission prompts, not that they run too often. |
| Absolute paths in settings.json are the portable format | Exploration revealed hardcoded `/Users/danimal/...` paths | Must switch to relative paths or another portable mechanism. Technical validation needed. |

## Technical Context

### Current State (brownfield)
- **verify.sh** (6.9KB): Three tiers (--quick: 2 checks, --standard: 4, --strict: 7). Always produces human-readable checklist output. Exit codes: 0 pass, 1 fail.
- **settings.json**: Permissions allow-list with 4 absolute-path entries for verify.sh. Only works for `/Users/danimal/code/open-scaffold/`.
- **CLAUDE.md**: "Before any non-trivial code change, run `./verify.sh --quick`" — instruction-driven enforcement, not hook-driven.
- **No git hooks**: Enforcement is purely via agent instructions in CLAUDE.md/AGENTS.md.

### Changes Required
1. **verify.sh**: Add a `--quiet` flag (or make `--quick` silent by default when called by agent). On success: exit 0, no output. On failure: exit 1, full error output. Manual runs (no --quiet) keep current verbose output.
2. **settings.json**: Replace absolute paths with portable format. Test whether `Bash(./verify.sh --quick)` works. Fallback: document that users may need to accept once.
3. **CLAUDE.md**: Update compliance check instructions to: (a) always use --quiet or capture exit code silently, (b) only surface verify.sh output to user on failure, (c) preserve hard-block on failure.
4. **AGENTS.md**: Mirror changes from CLAUDE.md (per ADR 0001 paired-view duplication).

### Open Technical Question
Whether `Bash(./verify.sh --quick)` in settings.json permissions.allow works portably needs to be tested empirically. If relative paths don't work, the fallback is either: (a) a first-run bootstrap that writes the correct absolute paths, or (b) using Claude Code hooks with `$CLAUDE_PROJECT_DIR` for portability.

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| verify.sh | core domain | tiers (quick/standard/strict), exit codes, output mode (verbose/quiet) | Called by CLAUDE.md instructions; authorized by settings.json |
| settings.json | supporting | permissions.allow list, path format | Authorizes verify.sh; must be portable |
| CLAUDE.md | supporting | compliance instructions, enforcement protocol | Triggers verify.sh runs; mirrors to AGENTS.md |
| User/Adopter | core domain | clone path, permission mode, framework familiarity | Receives zero prompts on success; receives hard-block on failure |
| Drift Signal | core domain | trigger type (session start, pre-edit, scope expansion, boundary crossing) | Triggers verify.sh; detected by agent via CLAUDE.md logic |
| Claude Code Hook | supporting (deprioritized) | event, matcher, command, permissionDecision | Fallback if relative paths don't work in settings.json |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 4 | 4 | - | - | N/A |
| 2 | 5 | 1 | 0 | 4 | 80% |
| 3 | 5 | 0 | 0 | 5 | 100% |
| 4 | 6 | 1 | 0 | 5 | 83% |
| 5 | 6 | 0 | 0 | 6 | 100% |
| 6 | 6 | 0 | 0 | 6 | 100% |

## Interview Transcript
<details>
<summary>Full Q&A (6 rounds)</summary>

### Round 1
**Q:** The biggest friction source I see is that settings.json uses hardcoded absolute paths. Is your primary concern making this frictionless for OTHER users who adopt the scaffold, or are you experiencing friction yourself right now?
**A:** Both — portable AND smooth for me
**Ambiguity:** 62.5% (Goal: 0.50, Constraints: 0.30, Criteria: 0.20, Context: 0.50)

### Round 2
**Q:** What does 'no friction' look like to you concretely? (a) Never asks permission, (b) only runs when wrong, (c) runs but stays quiet on success?
**A:** Only runs when something is wrong
**Ambiguity:** 50% (Goal: 0.65, Constraints: 0.35, Criteria: 0.45, Context: 0.50)

### Round 3
**Q:** Which enforcement surfaces are you willing to change?
**A:** All three — whatever it takes
**Ambiguity:** 43% (Goal: 0.65, Constraints: 0.60, Criteria: 0.45, Context: 0.55)

### Round 4 (+ codebase research on hooks)
**Q:** When should the agent actually bother checking?
**A:** Before every non-trivial code change + scope expansion + session start + boundary crossings. Also asked about OMC hooks.
**Ambiguity:** 32% (Goal: 0.80, Constraints: 0.65, Criteria: 0.60, Context: 0.60)

### Round 5 (Contrarian Mode)
**Q:** What if the real friction isn't frequency but VISIBILITY? Maybe silent success is enough without hooks?
**A:** Yes — silent success is enough
**Ambiguity:** 26% (Goal: 0.85, Constraints: 0.70, Criteria: 0.70, Context: 0.60)

### Round 6
**Q:** When verify.sh fails, should it hard-block or warn?
**A:** Hard block — stop and fix
**Ambiguity:** 19.5% (Goal: 0.90, Constraints: 0.75, Criteria: 0.85, Context: 0.60)

</details>
