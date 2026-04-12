#!/usr/bin/env bash
# open-scaffold bootstrap
# Tested on macOS system bash (3.2). Avoids GNU-only date flags.
# Idempotent: safe to run any number of times.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TODAY="$(date +%Y-%m-%d)"   # portable; NOT `date -I` (GNU-only)

# 1. Create lazy directories (safe to re-run; mkdir -p is idempotent)
mkdir -p "$ROOT/.omc/research"
mkdir -p "$ROOT/.omc/state"

# 2. Idempotent MISSION changelog stamp
MISSION="$ROOT/MISSION.md"
STAMP="$TODAY: bootstrap run"
if [ -f "$MISSION" ] && ! grep -Fq "$STAMP" "$MISSION"; then
  printf '\n- %s\n' "$STAMP" >> "$MISSION"
fi

# 3. Point the human at the cheat-sheet
printf '\nBootstrap complete.\nRead: %s\n' "$ROOT/docs/WORKFLOW.md"
