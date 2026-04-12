# Plan: Enforcement Layer for open-scaffold

## 1. Context

open-scaffold currently has zero hard enforcement — all methodology compliance is social contract. A 5-round deep interview (17% ambiguity, spec at `.omc/specs/deep-interview-enforcement-layer.md`) crystallized the need for a non-blocking enforcement layer with three surfaces: verify.sh (source of truth), hardened agent instructions (primary enforcement mechanism), and bootstrap.sh (first-run checkpoint). The core insight: the agent IS the guardrail — the human doesn't opt into compliance; the agent does it for them.

## 2. Goal

Add a three-surface enforcement layer that makes open-scaffold's methodology self-enforcing through warn-and-redirect behavior, without violating the existing "shape over enforcement" philosophy (ADR 0001).

## 3. Constraints / Out of scope

**Constraints:**
- Non-blocking: warnings and redirects, never hard blocks
- Plain text + plain bash: macOS bash 3.2+, no external dependencies
- Agent-first: the agent is the primary enforcement mechanism, not the human
- Configurable tiers: --quick, --standard (default), --strict
- No git hooks installed by default
- CLAUDE.md/AGENTS.md must stay in sync (ADR 0001)
- Agents can execute shell commands (assumed). For agents that cannot, CLAUDE.md includes inline fallback checks for --quick tier.
- AGENTS.md rule #1 ("refuse to expand scope") is softened to "redirect to fix" to align with warn-and-redirect philosophy. Same intent, more helpful behavior.

**Out of scope:**
- CI/CD integration, code quality linting, OMC-specific enforcement, git hook installation

## 4. Files to touch

### New files (1)
| File | Action | Purpose |
|------|--------|---------|
| `verify.sh` | Create | Compliance checker with configurable tiers (--quick/--standard/--strict) |

### Modified files (5)
| File | Action | Scope of change |
|------|--------|-----------------|
| `CLAUDE.md` | Add enforcement protocol | New "Compliance checks" section: agents run verify.sh --quick before non-trivial changes, redirect to fix on violations |
| `AGENTS.md` | Mirror CLAUDE.md | Add "Compliance checks" as operating rule #7 in the existing numbered list. Rewrite rule #1 from "refuse to expand scope" to "redirect to defining the mission" to align with warn-and-redirect philosophy. |
| `bootstrap.sh` | Add verify.sh call | Run `./verify.sh --quick \|\| true` at end to report results without aborting (bootstrap.sh uses `set -e`, so verify.sh exit code 1 must not propagate) |
| `README.md` | Minor additions | Add verify.sh mention in "Your First 15 Minutes" step 4, add glossary term |
| `docs/WORKFLOW.md` | Minor addition | Reference verify.sh in the Verify phase |

### verify.sh tier checks

**--quick** (2 checks — run by agents before code changes):
1. Mission defined: `! grep -Fq 'mission:unset' MISSION.md`
2. Plan exists: at least one `.md` file in `.omc/plans/` that isn't `README.md` or `handoff-template.md`

**--standard** (adds 2 checks — default when run manually):
3. Amendment numbering: for each plan slug, amendment files are sequential (no gaps)
4. Changelog coverage: each amendment file has a corresponding dated entry in MISSION.md changelog

**--strict** (adds 3 checks — for disciplined teams):
5. Plan schema: each plan file contains all 7 section headers from handoff-template.md
6. Paired view sync: both CLAUDE.md and AGENTS.md contain "Layered architecture" section
7. Plan immutability: no committed plan files (non-amendment, non-template) have been modified after their initial commit (via `git log`)

### Agent enforcement protocol (for CLAUDE.md)

```
## Compliance checks

Before any non-trivial code change, run `./verify.sh --quick` and check the results:

- **Mission undefined →** Stop. Say: "Your mission isn't defined yet. Let's define it now — what is this project?" Guide the user through MISSION.md fill-in (or run `./bootstrap.sh`). Do not proceed until the mission is defined or the user explicitly says to skip.
- **No plan file →** Stop. Say: "There's no plan for this work. Let's create one — what are you trying to build?" Create a plan in `.omc/plans/` using the handoff template. Do not proceed until a plan exists or the user explicitly says to skip.
- **All checks pass →** Proceed normally.

The user can always override with "skip verification", "just do it", or similar. Respect their autonomy, but the default is to fix violations first.
```

## 5. Acceptance criteria

- [ ] AC-01: `verify.sh` exists at repo root and is executable
- [ ] AC-02: `verify.sh` with no flags runs `--standard` tier
- [ ] AC-03: `verify.sh --quick` checks mission defined + plan exists
- [ ] AC-04: `verify.sh --standard` adds amendment numbering + changelog coverage
- [ ] AC-05: `verify.sh --strict` adds schema + drift + immutability checks
- [ ] AC-06: Output is human-readable checklist: PASS/WARN/FAIL per check + summary
- [ ] AC-07: Exit code 0 = all pass, 1 = any fail
- [ ] AC-08: Works on macOS bash 3.2+ with no external dependencies
- [ ] AC-09: CLAUDE.md has enforcement protocol section
- [ ] AC-10: AGENTS.md mirrors enforcement protocol semantically
- [ ] AC-11: bootstrap.sh runs verify.sh --quick at end, reports results
- [ ] AC-12: README.md mentions verify.sh in walkthrough + glossary
- [ ] AC-13: WORKFLOW.md references verify.sh in Verify phase
- [ ] AC-14: verify.sh is portable: bash 3.2+ compatible, no GNU-only flags, no external dependencies
- [ ] AC-15: Existing public-release ACs still pass

## 6. Verification steps

1. `test -x verify.sh` — executable
2. `./verify.sh --quick 2>&1` — runs, shows PASS/FAIL for mission + plan checks
3. `./verify.sh 2>&1` — runs --standard by default
4. `./verify.sh --strict 2>&1` — runs all 7 checks
5. `echo $?` after verify.sh with violations — exit code 1
6. `grep -q 'Compliance checks' CLAUDE.md` — enforcement protocol present
7. `grep -q 'Compliance checks' AGENTS.md` — mirrored
8. `echo "" | ./bootstrap.sh 2>&1 | grep -q 'verify'` — bootstrap runs verify at end
9. `grep -q 'verify.sh' README.md` — mentioned in README
10. `grep -q 'verify.sh' docs/WORKFLOW.md` — mentioned in workflow

## 7. Open questions

1. **Plan immutability check (--strict):** Should this use `git log` to detect edits, or just check if the file's first commit date differs from its last modification? The git approach is more accurate but adds complexity.

---

## RALPLAN-DR Summary

### Principles
1. **Agent-first enforcement** — The agent is the primary enforcement surface. verify.sh is truth; the agent is the mechanism.
2. **Warn and redirect, never block** — Violations trigger fix workflows, not refusals. User always has final say.
3. **Configurable depth** — Quick for agents, standard for humans, strict for disciplined teams.
4. **Shape over machinery** — Respect ADR 0001. The enforcement adds a feedback loop, not a wall.
5. **Single source of truth** — verify.sh is the one place compliance logic lives. Agent instructions and bootstrap reference it, not duplicate it.

### Decision Drivers
1. **The agent-guardrail insight** — The human doesn't opt in; the agent does it for them. This flips the default from undisciplined to disciplined.
2. **Bash 3.2 portability** — verify.sh must work on stock macOS. This constrains implementation (no associative arrays, no process substitution).
3. **Backward compatibility** — All prior public-release ACs must still pass. The enforcement layer adds, never removes.

### Viable Options

#### Option A: Single verify.sh + Agent Protocol (Recommended)
One script at repo root with tier flags. Agent instructions in CLAUDE.md/AGENTS.md reference it. bootstrap.sh calls it. No git hooks.

**Pros:**
- Single source of truth for all compliance logic
- Agent-first enforcement via CLAUDE.md instructions
- Configurable depth via flags
- No imposed automation (consumers add hooks/CI if they want)
- Minimal additions (1 new file, 5 modified)

**Cons:**
- verify.sh adds ~100-150 lines of bash
- --strict tier's git-based checks add complexity
- Agent compliance depends on CLAUDE.md instructions being read and followed

#### Option B: Distributed Checks (No Central Script)
Embed checks directly: bootstrap.sh checks mission, CLAUDE.md/AGENTS.md instructions check for plans, no central verify.sh.

**Pros:**
- No new files
- Checks happen at the natural enforcement points

**Cons:**
- Compliance logic scattered across multiple files
- No single "run all checks" command
- Can't configure tiers
- Harder to extend with new checks
- Consumers can't wire into CI

#### Why Option B is not recommended:
The spec explicitly calls for verify.sh as the "single source of compliance truth." Distributed checks violate the single-source principle and make it impossible to run a quick compliance audit. Option A keeps all logic in one place while still distributing the enforcement surface across three touch points (agent, bootstrap, manual).
