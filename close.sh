#!/usr/bin/env bash
# open-scaffold plan closer
# Moves a plan (and its amendments) to done/ and stamps MISSION.md changelog.
#
# Usage: ./close.sh <plan-slug> [--stage] [--message "<text>"]
# Exit 0 = success, 1 = precondition/usage failure, 2 = unknown flag.
# Tested on macOS system bash (3.2). No GNU-only flags. No external dependencies.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PLANS_DIR="$ROOT/.osc/plans"
DONE_DIR="$PLANS_DIR/done"
MISSION="$ROOT/MISSION.md"
TODAY="$(date +%Y-%m-%d)"

# ──────────────────────────────────────────
# Argument parsing
# ──────────────────────────────────────────

usage() {
  printf 'Usage: ./close.sh <plan-slug> [--stage] [--message "<text>"]\n' >&2
}

if [ $# -lt 1 ]; then
  usage
  exit 1
fi

SLUG=""
STAGE=false
MESSAGE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --stage)
      STAGE=true
      shift
      ;;
    --message)
      if [ $# -lt 2 ]; then
        printf 'Error: --message requires a value\n' >&2
        exit 1
      fi
      MESSAGE="$2"
      shift 2
      ;;
    --*)
      printf 'Unknown flag: %s\n' "$1" >&2
      exit 2
      ;;
    *)
      if [ -z "$SLUG" ]; then
        SLUG="$1"
      else
        printf 'Error: unexpected argument: %s\n' "$1" >&2
        usage
        exit 1
      fi
      shift
      ;;
  esac
done

if [ -z "$SLUG" ]; then
  usage
  exit 1
fi

# Be friendly: strip an accidental .md extension or path prefix
SLUG="$(basename "$SLUG" .md)"

# ──────────────────────────────────────────
# Find the plan in a stage folder
# ──────────────────────────────────────────

PARENT=""
PARENT_DIR=""
for dir in "$PLANS_DIR/active" "$PLANS_DIR/backlog" "$PLANS_DIR/blocked" "$PLANS_DIR"; do
  if [ -f "$dir/$SLUG.md" ]; then
    PARENT="$dir/$SLUG.md"
    PARENT_DIR="$dir"
    break
  fi
done

if [ -z "$PARENT" ]; then
  printf 'Error: plan %s.md not found in any stage folder.\n' "$SLUG" >&2
  exit 1
fi

# Don't close something already in done/
if [ "$PARENT_DIR" = "$DONE_DIR" ]; then
  printf 'Plan %s.md is already in done/.\n' "$SLUG"
  exit 0
fi

# ──────────────────────────────────────────
# Ensure done/ exists
# ──────────────────────────────────────────

mkdir -p "$DONE_DIR"

# ──────────────────────────────────────────
# Move plan and all its amendments to done/
# ──────────────────────────────────────────

MOVED_FILES=()

mv "$PARENT" "$DONE_DIR/"
MOVED_FILES+=("$SLUG.md")

for f in "$PARENT_DIR/$SLUG"-amendment-*.md; do
  [ -f "$f" ] || continue
  mv "$f" "$DONE_DIR/"
  MOVED_FILES+=("$(basename "$f")")
done

# ──────────────────────────────────────────
# Stamp MISSION.md changelog
# ──────────────────────────────────────────

if [ -n "$MESSAGE" ]; then
  CHANGELOG_LINE="${TODAY}: closed ${SLUG} — ${MESSAGE}"
else
  CHANGELOG_LINE="${TODAY}: closed ${SLUG}"
fi

CHANGELOG_STAMPED=false
ANCHOR='<!-- append YYYY-MM-DD entries below this line -->'
if grep -Fq "$ANCHOR" "$MISSION"; then
  TMPFILE=$(mktemp)
  while IFS= read -r line || [ -n "$line" ]; do
    printf '%s\n' "$line"
    if printf '%s' "$line" | grep -Fq "$ANCHOR"; then
      printf '- %s\n' "$CHANGELOG_LINE"
    fi
  done < "$MISSION" > "$TMPFILE"
  mv "$TMPFILE" "$MISSION"
  CHANGELOG_STAMPED=true
else
  printf '\n- %s\n' "$CHANGELOG_LINE" >> "$MISSION"
  CHANGELOG_STAMPED=true
fi

# ──────────────────────────────────────────
# Optional git staging
# ──────────────────────────────────────────

STAGED=false
if [ "$STAGE" = true ]; then
  if command -v git > /dev/null 2>&1 && git -C "$ROOT" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    for f in "${MOVED_FILES[@]}"; do
      git -C "$ROOT" add "$DONE_DIR/$f"
    done
    # Stage the removal from the old location and the changelog update
    git -C "$ROOT" add "$PARENT_DIR/" "$MISSION"
    STAGED=true
  fi
fi

# ──────────────────────────────────────────
# Report
# ──────────────────────────────────────────

printf 'Closed: %s\n' "$SLUG"
printf 'Moved to done/: %s\n' "${MOVED_FILES[*]}"
if [ "$CHANGELOG_STAMPED" = true ]; then
  printf 'Stamped: MISSION.md changelog\n'
fi
if [ "$STAGED" = true ]; then
  printf 'Staged: all changes added to git index.\n'
fi
