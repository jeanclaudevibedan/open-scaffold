#!/usr/bin/env bash
# open-scaffold bootstrap
# Tested on macOS system bash (3.2). Avoids GNU-only date flags.
# Idempotent: safe to run any number of times.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TODAY="$(date +%Y-%m-%d)"   # portable; NOT `date -I` (GNU-only)
MISSION="$ROOT/MISSION.md"

# 1. Create lazy directories (safe to re-run; mkdir -p is idempotent)
mkdir -p "$ROOT/.omc/research"
mkdir -p "$ROOT/.omc/state"

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

    printf 'What is this project? (one sentence)\n> '
    read -r USER_MISSION
    printf '\n'

    printf 'What should it achieve? (comma-separated goals)\n> '
    read -r USER_GOALS
    printf '\n'

    printf 'What is it NOT? (comma-separated non-goals)\n> '
    read -r USER_NONGOALS
    printf '\n'

    # Only rewrite MISSION.md if the user provided at least a mission statement
    if [ -n "$USER_MISSION" ]; then
      # Format goals as bullet list
      GOALS_LIST=""
      if [ -n "$USER_GOALS" ]; then
        # Split on commas, trim whitespace, format as bullets
        GOALS_LIST=$(printf '%s' "$USER_GOALS" | tr ',' '\n' | while read -r item; do
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
        NONGOALS_LIST=$(printf '%s' "$USER_NONGOALS" | tr ',' '\n' | while read -r item; do
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

- $TODAY: bootstrap run
MISSION_EOF

      printf 'Mission defined! Your MISSION.md has been updated.\n'
    else
      printf 'No mission entered. You can edit MISSION.md manually later.\n'
      # Still stamp the changelog
      STAMP="$TODAY: bootstrap run"
      if ! grep -Fq "$STAMP" "$MISSION"; then
        printf '\n- %s\n' "$STAMP" >> "$MISSION"
      fi
    fi
  else
    # Non-interactive mode: just stamp the changelog, preserve the marker
    STAMP="$TODAY: bootstrap run"
    if ! grep -Fq "$STAMP" "$MISSION"; then
      printf '\n- %s\n' "$STAMP" >> "$MISSION"
    fi
  fi
else
  # Mission already defined or no MISSION.md — idempotent changelog stamp
  if [ -f "$MISSION" ]; then
    STAMP="$TODAY: bootstrap run"
    if ! grep -Fq "$STAMP" "$MISSION"; then
      printf '\n- %s\n' "$STAMP" >> "$MISSION"
    fi
  fi
fi

# 3. Point the human at the cheat-sheet
printf '\nBootstrap complete.\nRead: %s\n' "$ROOT/docs/WORKFLOW.md"
