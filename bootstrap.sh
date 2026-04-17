#!/usr/bin/env bash
# open-scaffold bootstrap
# Tested on macOS system bash (3.2). Avoids GNU-only date flags.
# Idempotent: safe to run any number of times.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TODAY="$(date +%Y-%m-%d)"   # portable; NOT `date -I` (GNU-only)
MISSION="$ROOT/MISSION.md"

# Detect template-repo mode. The .omc-dev/ directory is the maintainer's
# internal workspace — gitignored, so only present in the open-scaffold
# source repo itself, never in a downstream clone. When detected, skip
# stamping MISSION.md's changelog so the template ships with an empty
# changelog per public-release.md AC-16.
if [ -d "$ROOT/.omc-dev" ]; then
  IS_TEMPLATE_REPO=1
else
  IS_TEMPLATE_REPO=0
fi

stamp_changelog() {
  if [ "$IS_TEMPLATE_REPO" = "1" ]; then
    return 0
  fi
  if [ ! -f "$MISSION" ]; then
    return 0
  fi
  STAMP="$TODAY: bootstrap run"
  if ! grep -Fq "$STAMP" "$MISSION"; then
    ANCHOR='<!-- append YYYY-MM-DD entries below this line -->'
    if grep -Fq "$ANCHOR" "$MISSION"; then
      # Insert after the anchor line using a temp file (portable)
      TMPFILE=$(mktemp)
      while IFS= read -r line || [ -n "$line" ]; do
        printf '%s\n' "$line"
        if printf '%s' "$line" | grep -Fq "$ANCHOR"; then
          printf -- '- %s\n' "$STAMP"
        fi
      done < "$MISSION" > "$TMPFILE"
      mv "$TMPFILE" "$MISSION"
    else
      printf -- '- %s\n' "$STAMP" >> "$MISSION"
    fi
  fi
}

# 1. Create lazy directories (safe to re-run; mkdir -p is idempotent)
mkdir -p "$ROOT/.omc/research"
mkdir -p "$ROOT/.omc/state"
mkdir -p "$ROOT/.omc/plans/active"
mkdir -p "$ROOT/.omc/plans/backlog"
mkdir -p "$ROOT/.omc/plans/done"
mkdir -p "$ROOT/.omc/plans/blocked"

# 2. Interactive MISSION.md fill-in (only if marker is present and stdin is a terminal)
if [ -f "$MISSION" ] && grep -Fq 'mission:unset' "$MISSION"; then
  if [ -t 0 ]; then
    printf '\n'
    printf '=== open-scaffold: Define Your Mission ===\n'
    printf '\n'
    printf 'The methodology starts here: what are you building?\n'
    printf 'Answer these three questions to fill in MISSION.md.\n'
    printf '(Press Enter to skip any question and fill it in later.)\n'
    printf '\n'

    printf 'What is this project? (one sentence)\n'
    printf 'Example: A recipe book app that saves my family recipes and lets relatives browse them.\n> '
    read -r USER_MISSION
    printf '\n'

    printf 'What should it achieve? (main outcomes — separate multiple with semicolons)\n'
    printf 'Example: Save recipes with photos; browse by category; share via a link.\n> '
    read -r USER_GOALS
    printf '\n'

    printf 'What should this project NOT do? (separate multiple with semicolons)\n'
    printf 'Good non-goals are adjacent features you could plausibly build but are choosing not to.\n'
    printf 'That is how scope creep gets prevented later. For a recipe app: not a meal planner;\n'
    printf 'not a calorie tracker; not a shopping list generator.\n> '
    read -r USER_NONGOALS
    printf '\n'

    # Only rewrite MISSION.md if the user provided at least a mission statement
    if [ -n "$USER_MISSION" ]; then
      # Format goals as bullet list
      GOALS_LIST=""
      if [ -n "$USER_GOALS" ]; then
        # Split on commas OR semicolons, trim whitespace, format as bullets
        GOALS_LIST=$(printf '%s' "$USER_GOALS" | tr ',;' '\n\n' | while read -r item; do
          trimmed=$(printf '%s' "$item" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
          if [ -n "$trimmed" ]; then
            printf '- %s\n' "$trimmed"
          fi
        done)
      fi
      if [ -z "$GOALS_LIST" ]; then
        GOALS_LIST="- TODO: define your project's goals"
      fi

      # Format non-goals as bullet list
      NONGOALS_LIST=""
      if [ -n "$USER_NONGOALS" ]; then
        # Split on commas OR semicolons, trim whitespace, format as bullets
        NONGOALS_LIST=$(printf '%s' "$USER_NONGOALS" | tr ',;' '\n\n' | while read -r item; do
          trimmed=$(printf '%s' "$item" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
          if [ -n "$trimmed" ]; then
            printf '- %s\n' "$trimmed"
          fi
        done)
      fi
      if [ -z "$NONGOALS_LIST" ]; then
        NONGOALS_LIST="- TODO: define your project's non-goals"
      fi

      # Write the new MISSION.md
      cat > "$MISSION" << MISSION_EOF
# Mission

$USER_MISSION

## Goals

$GOALS_LIST

## Non-Goals

Explicit things this project is NOT trying to do. Legitimate scope discipline starts here. When new information arrives that would change what belongs in this list, follow the amendment protocol in \`.omc/plans/README.md\` — do not silently edit the list.

$NONGOALS_LIST

## Changelog

One-line dated entries for every scope pivot. Format: \`YYYY-MM-DD: <one-line pivot description + link to amendment file if applicable>\`. Append entries in chronological order. Never rewrite history here.

<!-- append YYYY-MM-DD entries below this line -->
MISSION_EOF

      stamp_changelog
      printf 'Mission defined! Your MISSION.md has been updated.\n'
    else
      printf 'No mission entered. You can edit MISSION.md manually later.\n'
      stamp_changelog
    fi
  else
    # Non-interactive mode: just stamp the changelog, preserve the marker
    stamp_changelog
  fi
else
  # Mission already defined or no MISSION.md — idempotent changelog stamp
  stamp_changelog
fi

# 3. Run compliance check (non-blocking — bootstrap completes regardless)
if [ -x "$ROOT/verify.sh" ]; then
  printf '\n'
  "$ROOT/verify.sh" --quick || true
fi

# 4. Point the human at the cheat-sheet
printf '\nBootstrap complete.\nRead: %s\n' "$ROOT/docs/WORKFLOW.md"
