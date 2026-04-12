# Plan: Frictionless Verification

## Context

open-scaffold's verification system (verify.sh) creates execution friction in two ways: (1) it always produces verbose output even when all checks pass, cluttering the agent's workflow, and (2) the .claude/settings.json permissions use hardcoded absolute paths, meaning only the original author can run verify.sh without bash permission prompts. The deep interview spec (`.omc/specs/deep-interview-frictionless-verification.md`) crystallized the requirement: invisible on success, loud on failure, portable out of the box.

## Goal

Make verify.sh silent when all checks pass and loud when any check fails, with portable permissions so any user who clones the repo gets zero bash-permission prompts.

## Constraints

- verify.sh must remain usable as a standalone manual tool (verbose output by default)
- No hook infrastructure — the simpler approach of quiet flag + portable permissions is sufficient
- No git hooks (existing design decision)
- Hard-block on failure must be preserved
- Two-layer architecture preserved: core methodology works without OMC
- AGENTS.md must mirror CLAUDE.md changes (ADR 0001)

## Files to touch

1. `verify.sh` — add `--quiet` flag support
2. `.claude/settings.json` — replace absolute paths with portable relative paths
3. `CLAUDE.md` — update compliance check instructions for silent-success model
4. `AGENTS.md` — mirror CLAUDE.md changes

## Acceptance criteria

- [ ] AC1: `./verify.sh --quick --quiet` produces NO stdout/stderr when all checks pass
- [ ] AC2: `./verify.sh --quick --quiet` produces clear error output when any check fails
- [ ] AC3: Exit codes unchanged (0 = pass, 1 = fail) regardless of --quiet flag
- [ ] AC4: `.claude/settings.json` uses `./verify.sh` relative paths, not absolute paths
- [ ] AC5: CLAUDE.md instructs agent to use `--quiet` and only surface output on failure
- [ ] AC6: AGENTS.md mirrors the updated verification instructions
- [ ] AC7: Manual `./verify.sh` (no --quiet) still produces full human-readable output
- [ ] AC8: `--quiet` works with all tiers: `--quick --quiet`, `--standard --quiet`, `--strict --quiet`

## Verification steps

1. Run `./verify.sh --quick --quiet` with mission defined + plan present → expect exit 0, no output
2. Run `./verify.sh --quick --quiet` with mission:unset marker in place → expect exit 1, failure output
3. Run `./verify.sh --quick` (no --quiet) → expect full verbose output (backward compatible)
4. Verify settings.json contains no absolute paths
5. Verify CLAUDE.md and AGENTS.md both reference `--quiet` in their compliance instructions
6. Verify CLAUDE.md preserves hard-block on failure language

## Open questions

1. ~~Will `Bash(./verify.sh --quick --quiet)` in settings.json permissions.allow match when Claude invokes the command from the project root?~~ **Resolved by Architect review:** Use `Bash(./verify.sh:*)` wildcard pattern (colon-star, no space before colon). This follows the existing convention at `settings.json:6-7` where `Bash(git commit -m ':*)` and `Bash(git push:*)` use the same suffix-matching pattern. One entry covers all flag combinations.

---

## RALPLAN-DR Summary

### Principles
1. **Invisible on success, loud on failure** — verification runs frequently but only surfaces when something is wrong
2. **Portable out of the box** — zero per-user configuration needed after cloning
3. **Preserve manual usability** — verify.sh remains a useful standalone tool
4. **Minimal changes** — don't over-engineer; the simplest correct solution wins

### Decision Drivers
1. Zero permission prompts for any user who clones the repo
2. Verification frequency unchanged — agent checks constantly, but output changes
3. Hard-block on failure preserved — this is the intentional friction point

### Viable Options

**Option A: `--quiet` flag in verify.sh (Recommended)**
- verify.sh gains a `--quiet` flag that suppresses all output on success, shows only failures on failure
- CLAUDE.md/AGENTS.md instruct agent to use `--quiet`
- settings.json switches to relative paths (`./verify.sh`)
- Pros: Simple, backward-compatible, explicit, works for all agent types
- Cons: Agent must remember to pass `--quiet` (mitigated by CLAUDE.md instructions)

**Option B: Output suppression in agent instructions only**
- No changes to verify.sh
- CLAUDE.md tells agent to redirect output: `./verify.sh --quick > /dev/null 2>&1`
- Pros: Zero script changes
- Cons: Fragile — relies on each agent correctly implementing suppression; different agents read different instruction files; `> /dev/null` hides failure output too unless agent adds complex conditional logic
- **Invalidated:** Pushes complexity into instructions read by multiple agent types; error-prone

**Option C: Auto-detect interactive context in verify.sh**
- verify.sh checks `[ -t 1 ]` (is stdout a terminal?) and auto-suppresses when non-interactive
- Pros: No flag needed; automatic
- Cons: Breaks legitimate piped usage (`verify.sh | tee log.txt` goes silent); violates principle of least surprise; unreliable detection
- **Invalidated:** Surprising behavior in scripted/piped contexts

### Implementation Steps

**Step 1: verify.sh — Add `--quiet` flag** (~30 lines changed)
- Parse args in a loop instead of single positional: `TIER` + `QUIET` variables
- When `QUIET=true` AND `FAIL_COUNT == 0`: suppress all output (pass, warn, summary)
- When `QUIET=true` AND `FAIL_COUNT > 0`: output failure lines + summary only
- Preserve all existing behavior when `--quiet` is absent

**Step 2: settings.json — Portable paths (all absolute paths)** (~15 lines changed)
- Replace ALL `/Users/danimal/code/open-scaffold/` prefixed entries with `./` relative paths
- Use `Bash(./verify.sh:*)` wildcard (colon-star suffix matching, per existing convention at settings.json:6-7) to cover all flag combinations in one entry
- Use `Bash(./bootstrap.sh)` for bootstrap
- Remove or make portable: `chmod +x ./verify.sh`, `chmod +x ./bootstrap.sh`
- Remove entries that are no longer needed: `Bash(grep -qE ...)` (was for one-time bash compat check), `Bash(git -C ... config --list)` (git config doesn't need allowlisting), `Bash(git -C ... log --oneline --all)` (absolute path not needed, use relative)
- Keep generic entries that are already portable: `Bash(git commit -m ':*)`, `Bash(git push:*)`, `Bash(bash --version)`, `Bash(echo "Exit: $?")`

**Step 3: CLAUDE.md — Silent-success instructions** (~10 lines changed)
- Update "Compliance checks" section: instruct agent to run `./verify.sh --quick --quiet`
- On exit 0: proceed silently, do not mention verification to user
- On exit 1: read the failure output from `--quiet` (which shows failure lines + summary). Hard-block and guide user. Single run — no double-run pattern.
- Preserve the "user can override" language

**Step 4: AGENTS.md — Mirror changes** (~5 lines changed)
- Update rule 7 to reference `--quiet` flag
- Same silent-success, hard-block-on-failure logic
