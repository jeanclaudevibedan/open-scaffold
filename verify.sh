#!/usr/bin/env bash
# open-scaffold compliance checker
# Configurable tiers: --quick, --standard (default), --strict
# Exit 0 = all pass, exit 1 = any fail
# Tested on macOS system bash (3.2). No GNU-only flags. No external dependencies.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TIER="--standard"
QUIET=false
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Parse flags (order-independent, bash 3.2 compatible)
for arg in "$@"; do
  case "$arg" in
    --quick|--standard|--strict) TIER="$arg" ;;
    --quiet) QUIET=true ;;
    *) printf 'Unknown flag: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  if [ "$QUIET" = false ]; then
    printf '  \033[32mPASS\033[0m  %s\n' "$1"
  fi
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  printf '  \033[31mFAIL\033[0m  %s\n' "$1"
}

warn() {
  WARN_COUNT=$((WARN_COUNT + 1))
  if [ "$QUIET" = false ]; then
    printf '  \033[33mWARN\033[0m  %s\n' "$1"
  fi
}

# ──────────────────────────────────────────
# QUICK tier: mission + plan (2 checks)
# ──────────────────────────────────────────

if [ "$QUIET" = false ]; then
  printf '\n  open-scaffold compliance check (%s)\n\n' "$TIER"
fi

# Check 1: Mission defined
if [ -f "$ROOT/MISSION.md" ]; then
  if grep -Fq 'mission:unset' "$ROOT/MISSION.md"; then
    fail "Mission not defined (MISSION.md contains <!-- mission:unset --> marker)"
  else
    pass "Mission defined"
  fi
else
  fail "MISSION.md not found"
fi

# Check 2: At least one plan file exists (beyond template and README)
PLAN_COUNT=0
if [ -d "$ROOT/.omc/plans" ]; then
  for f in "$ROOT"/.omc/plans/*.md; do
    [ -f "$f" ] || continue
    basename=$(basename "$f")
    if [ "$basename" != "README.md" ] && [ "$basename" != "handoff-template.md" ]; then
      PLAN_COUNT=$((PLAN_COUNT + 1))
    fi
  done
fi

if [ "$PLAN_COUNT" -gt 0 ]; then
  pass "Plan file(s) found ($PLAN_COUNT in .omc/plans/)"
else
  fail "No plan files found in .omc/plans/ (only template and README)"
fi

# ──────────────────────────────────────────
# STANDARD tier: + amendments + changelog (2 checks)
# ──────────────────────────────────────────

if [ "$TIER" = "--standard" ] || [ "$TIER" = "--strict" ]; then

  # Check 3: Amendment numbering is sequential per plan slug
  AMEND_OK=true
  for f in "$ROOT"/.omc/plans/*-amendment-*.md; do
    [ -f "$f" ] || continue
    basename=$(basename "$f" .md)
    # Extract the amendment number (last segment after "amendment-")
    num=$(printf '%s' "$basename" | sed 's/.*-amendment-//')
    slug=$(printf '%s' "$basename" | sed 's/-amendment-.*//')
    # Check if previous amendment exists (for n > 1)
    if [ "$num" -gt 1 ]; then
      prev=$((num - 1))
      if [ ! -f "$ROOT/.omc/plans/${slug}-amendment-${prev}.md" ]; then
        warn "Amendment gap: ${slug}-amendment-${num}.md exists but ${slug}-amendment-${prev}.md is missing"
        AMEND_OK=false
      fi
    fi
  done
  if $AMEND_OK; then
    pass "Amendment numbering is sequential (no gaps)"
  fi

  # Check 4: Changelog entry for each amendment
  CHANGELOG_OK=true
  for f in "$ROOT"/.omc/plans/*-amendment-*.md; do
    [ -f "$f" ] || continue
    basename=$(basename "$f")
    if [ -f "$ROOT/MISSION.md" ]; then
      if ! grep -Fq "$basename" "$ROOT/MISSION.md"; then
        warn "No changelog entry in MISSION.md for $basename"
        CHANGELOG_OK=false
      fi
    fi
  done
  if $CHANGELOG_OK; then
    pass "Changelog entries match amendment files"
  fi
fi

# ──────────────────────────────────────────
# STRICT tier: + schema + drift + immutability (3 checks)
# ──────────────────────────────────────────

if [ "$TIER" = "--strict" ]; then

  # Check 5: Plan files contain all 7 sections from handoff template
  SCHEMA_OK=true
  SECTIONS="Context Goal Constraints Files to touch Acceptance criteria Verification steps Open questions"
  for f in "$ROOT"/.omc/plans/*.md; do
    [ -f "$f" ] || continue
    basename=$(basename "$f")
    # Skip template, README, and amendment files
    if [ "$basename" = "README.md" ] || [ "$basename" = "handoff-template.md" ]; then
      continue
    fi
    case "$basename" in
      *-amendment-*) continue ;;
    esac
    for section in "Context" "Goal" "Constraints" "Files to touch" "Acceptance criteria" "Verification steps" "Open questions"; do
      if ! grep -qi "## .*$section" "$f"; then
        warn "Plan $basename missing section: $section"
        SCHEMA_OK=false
      fi
    done
  done
  if $SCHEMA_OK; then
    pass "Plan files contain all 7 required sections"
  fi

  # Check 6: CLAUDE.md and AGENTS.md both contain "Layered architecture" section
  DRIFT_OK=true
  if [ -f "$ROOT/CLAUDE.md" ]; then
    if ! grep -q '## Layered architecture' "$ROOT/CLAUDE.md"; then
      warn "CLAUDE.md missing 'Layered architecture' section (paired view drift)"
      DRIFT_OK=false
    fi
  fi
  if [ -f "$ROOT/AGENTS.md" ]; then
    if ! grep -q '## Layered architecture' "$ROOT/AGENTS.md"; then
      warn "AGENTS.md missing 'Layered architecture' section (paired view drift)"
      DRIFT_OK=false
    fi
  fi
  if $DRIFT_OK; then
    pass "CLAUDE.md and AGENTS.md paired view sync (Layered architecture)"
  fi

  # Check 7: Plan immutability — plan files (non-amendment, non-template) not modified after initial commit
  if command -v git > /dev/null 2>&1 && [ -d "$ROOT/.git" ]; then
    IMMUTABLE_OK=true
    for f in "$ROOT"/.omc/plans/*.md; do
      [ -f "$f" ] || continue
      basename=$(basename "$f")
      if [ "$basename" = "README.md" ] || [ "$basename" = "handoff-template.md" ]; then
        continue
      fi
      case "$basename" in
        *-amendment-*) continue ;;
      esac
      relpath=".omc/plans/$basename"
      # Count commits that modified this file (excluding the initial add)
      commit_count=$(git -C "$ROOT" log --oneline --follow -- "$relpath" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$commit_count" -gt 1 ]; then
        warn "Plan $basename was modified after initial commit ($commit_count commits)"
        IMMUTABLE_OK=false
      fi
    done
    if $IMMUTABLE_OK; then
      pass "Plan immutability intact (no post-commit edits)"
    fi
  else
    warn "Plan immutability check skipped (not a git repository or git not available)"
  fi

  # Check 8: Execution Strategy section structure (conditional — only if section is present)
  # This check validates internal structure, not presence. Plans without an Execution
  # Strategy section are valid (the section is optional).
  EXEC_STRATEGY_CHECKED=false
  EXEC_STRATEGY_OK=true
  for f in "$ROOT"/.omc/plans/*.md; do
    [ -f "$f" ] || continue
    basename=$(basename "$f")
    # Skip template, README, and amendment files
    if [ "$basename" = "README.md" ] || [ "$basename" = "handoff-template.md" ]; then
      continue
    fi
    case "$basename" in
      *-amendment-*) continue ;;
    esac
    # Only check if the plan has an Execution Strategy section
    if grep -qi '^## Execution strategy' "$f"; then
      EXEC_STRATEGY_CHECKED=true
      # Verify required sub-headings
      if ! grep -qi '^### Parallel groups' "$f"; then
        warn "Plan $basename has Execution Strategy but missing sub-heading: ### Parallel groups"
        EXEC_STRATEGY_OK=false
      fi
      if ! grep -qi '^### Dependencies' "$f"; then
        warn "Plan $basename has Execution Strategy but missing sub-heading: ### Dependencies"
        EXEC_STRATEGY_OK=false
      fi
    fi
  done
  if $EXEC_STRATEGY_CHECKED && $EXEC_STRATEGY_OK; then
    pass "Execution Strategy section structure valid (where present)"
  fi
fi

# ──────────────────────────────────────────
# Summary
# ──────────────────────────────────────────

if [ "$QUIET" = false ] || [ "$FAIL_COUNT" -gt 0 ]; then
  printf '\n  ─────────────────────────────────\n'
  printf '  %s pass, %s fail, %s warn\n\n' "$PASS_COUNT" "$FAIL_COUNT" "$WARN_COUNT"
fi
if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
else
  exit 0
fi
