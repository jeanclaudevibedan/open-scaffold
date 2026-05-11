#!/usr/bin/env bash
# open-scaffold delegation prompt generator
# Reads a plan's Execution Strategy section and generates actionable terminal
# prompts for each parallel group. Designed for users without a runtime harness
# or capable agents — paste the output into separate terminal sessions.
#
# Usage: ./delegate.sh <plan-file-path>
# Exit 0 = success or no Execution Strategy (not an error)
# Exit 1 = file not found or usage error
# Tested on macOS system bash (3.2). No GNU-only flags. No external dependencies.
set -uo pipefail

# ──────────────────────────────────────────
# Usage and argument parsing
# ──────────────────────────────────────────

if [ $# -lt 1 ]; then
  printf 'Usage: ./delegate.sh <plan-file-path>\n' >&2
  exit 1
fi

PLAN_FILE="$1"

if [ ! -f "$PLAN_FILE" ]; then
  printf 'Error: File not found: %s\n' "$PLAN_FILE" >&2
  exit 1
fi

# ──────────────────────────────────────────
# Check for Execution Strategy section
# ──────────────────────────────────────────

if ! grep -qi '^## Execution strategy' "$PLAN_FILE"; then
  printf 'No Execution Strategy section found in %s.\n' "$PLAN_FILE"
  printf 'This section is optional — see .osc/plans/handoff-template.md for the schema.\n'
  exit 0
fi

# ──────────────────────────────────────────
# Parse the Execution Strategy section
# ──────────────────────────────────────────

# Extract the Execution Strategy section (from its heading to the next ## heading)
IN_SECTION=false
SECTION_CONTENT=""
while IFS= read -r line; do
  if printf '%s' "$line" | grep -qi '^## Execution strategy'; then
    IN_SECTION=true
    continue
  fi
  if $IN_SECTION; then
    # Stop at the next ## heading (but not ### sub-headings)
    if printf '%s' "$line" | grep -q '^## [^#]'; then
      break
    fi
    SECTION_CONTENT="$SECTION_CONTENT
$line"
  fi
done < "$PLAN_FILE"

# Check for required sub-headings
HAS_GROUPS=false
HAS_DEPS=false
if printf '%s' "$SECTION_CONTENT" | grep -qi '^### Parallel groups'; then
  HAS_GROUPS=true
fi
if printf '%s' "$SECTION_CONTENT" | grep -qi '^### Dependencies'; then
  HAS_DEPS=true
fi

if ! $HAS_GROUPS; then
  printf 'Execution Strategy section found but could not be parsed — check the format against the schema in handoff-template.md.\n'
  printf 'Missing required sub-heading: ### Parallel groups\n'
  exit 0
fi

if ! $HAS_DEPS; then
  printf 'Execution Strategy section found but could not be parsed — check the format against the schema in handoff-template.md.\n'
  printf 'Missing required sub-heading: ### Dependencies\n'
  exit 0
fi

# ──────────────────────────────────────────
# Extract plan metadata for prompts
# ──────────────────────────────────────────

PLAN_NAME=$(basename "$PLAN_FILE" .md)

# Extract the plan's Goal section (first paragraph after ## Goal heading)
PLAN_GOAL=""
IN_GOAL=false
while IFS= read -r line; do
  if printf '%s' "$line" | grep -qi '^## Goal'; then
    IN_GOAL=true
    continue
  fi
  if $IN_GOAL; then
    if printf '%s' "$line" | grep -q '^## '; then
      break
    fi
    if [ -n "$line" ]; then
      PLAN_GOAL="$line"
      break
    fi
  fi
done < "$PLAN_FILE"

# ──────────────────────────────────────────
# Extract and display parallel groups
# ──────────────────────────────────────────

printf '═══════════════════════════════════════════\n'
printf '  Delegation prompts for: %s\n' "$PLAN_NAME"
printf '═══════════════════════════════════════════\n\n'

if [ -n "$PLAN_GOAL" ]; then
  printf 'Plan goal: %s\n\n' "$PLAN_GOAL"
fi

# Parse parallel groups section
# Write section content to a temp file to avoid unquoted heredoc expansion
# (prevents $(command) or `command` in plan markdown from executing)
IN_GROUPS=false
IN_DEPS=false
IN_DELEGATION=false
GROUP_COUNT=0
DEPS_TEXT=""
DELEGATION_TEXT=""
SECTION_TMPFILE=$(mktemp)
trap 'rm -f "$SECTION_TMPFILE"' EXIT
printf '%s\n' "$SECTION_CONTENT" > "$SECTION_TMPFILE"

while IFS= read -r line; do
  # Track which sub-section we're in
  if printf '%s' "$line" | grep -qi '^### Parallel groups'; then
    IN_GROUPS=true
    IN_DEPS=false
    IN_DELEGATION=false
    continue
  fi
  if printf '%s' "$line" | grep -qi '^### Dependencies'; then
    IN_GROUPS=false
    IN_DEPS=true
    IN_DELEGATION=false
    continue
  fi
  if printf '%s' "$line" | grep -qi '^### Delegation notes'; then
    IN_GROUPS=false
    IN_DEPS=false
    IN_DELEGATION=true
    continue
  fi
  if printf '%s' "$line" | grep -q '^### \|^## '; then
    IN_GROUPS=false
    IN_DEPS=false
    IN_DELEGATION=false
    continue
  fi

  # Collect dependencies text
  if $IN_DEPS && [ -n "$line" ]; then
    DEPS_TEXT="$DEPS_TEXT
$line"
  fi

  # Collect delegation notes
  if $IN_DELEGATION && [ -n "$line" ]; then
    DELEGATION_TEXT="$DELEGATION_TEXT
$line"
  fi

  # Process parallel group lines (format: - **Group X** (...): T1, T2 — reason)
  if $IN_GROUPS; then
    if printf '%s' "$line" | grep -q '^\- \*\*Group'; then
      GROUP_COUNT=$((GROUP_COUNT + 1))

      # Extract group name
      GROUP_NAME=$(printf '%s' "$line" | sed 's/^- \*\*\([^*]*\)\*\*.*/\1/')

      # Extract the parenthetical (rationale) — guard against lines without parens
      if printf '%s' "$line" | grep -q '('; then
        GROUP_RATIONALE=$(printf '%s' "$line" | sed 's/^[^(]*(\([^)]*\)).*/\1/')
      else
        GROUP_RATIONALE=""
      fi

      # Extract tasks after the colon
      GROUP_TASKS=$(printf '%s' "$line" | sed 's/^[^:]*: //')

      printf '───────────────────────────────────────────\n'
      printf '  PROMPT %d: %s\n' "$GROUP_COUNT" "$GROUP_NAME"
      printf '  %s\n' "$GROUP_RATIONALE"
      printf '───────────────────────────────────────────\n\n'

      printf 'Open a new terminal session and paste the following:\n\n'
      printf '  Tasks: %s\n\n' "$GROUP_TASKS"
      printf '  Instructions:\n'
      printf '  You are working on plan "%s".\n' "$PLAN_NAME"
      printf '  Your assignment is %s.\n' "$GROUP_NAME"
      printf '  Complete these tasks: %s\n' "$GROUP_TASKS"
      if printf '%s' "$GROUP_RATIONALE" | grep -qi 'depends on'; then
        printf '  NOTE: Wait for the prerequisite group to finish before starting.\n'
      fi
      printf '  When done, save your work and report which tasks you completed.\n'
      printf '\n'
    fi
  fi
done < "$SECTION_TMPFILE"

if [ "$GROUP_COUNT" -eq 0 ]; then
  printf 'No parallel groups found in the Execution Strategy section.\n'
  printf 'Expected format: - **Group A** (rationale): T1, T2 — description\n'
  exit 0
fi

# Print dependencies summary
if [ -n "$DEPS_TEXT" ]; then
  printf '───────────────────────────────────────────\n'
  printf '  DEPENDENCIES (execution order)\n'
  printf '───────────────────────────────────────────\n'
  printf '%s\n' "$DEPS_TEXT"
  printf '\n'
fi

# Print delegation notes if present
if [ -n "$DELEGATION_TEXT" ]; then
  printf '───────────────────────────────────────────\n'
  printf '  DELEGATION NOTES\n'
  printf '───────────────────────────────────────────\n'
  printf '%s\n' "$DELEGATION_TEXT"
  printf '\n'
fi

printf '═══════════════════════════════════════════\n'
printf '  %d parallel group(s) found. Open %d terminal session(s).\n' "$GROUP_COUNT" "$GROUP_COUNT"
printf '═══════════════════════════════════════════\n'
