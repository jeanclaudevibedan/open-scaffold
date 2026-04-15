#!/usr/bin/env bash
# open-scaffold amendment scaffolder
# Autonumbers the next amendment for an existing plan, scaffolds the 5-section
# schema from .omc/plans/README.md, and appends a one-line entry to MISSION.md's
# ## Changelog section. Designed to work with zero agent in the loop.
#
# Usage: ./amend.sh <plan-slug> [--stage] [--message "<text>"]
# Exit 0 = success, 1 = precondition/usage failure, 2 = unknown flag.
# Tested on macOS system bash (3.2). No GNU-only flags. No external dependencies.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PLANS_DIR="$ROOT/.omc/plans"
MISSION="$ROOT/MISSION.md"
TODAY="$(date +%Y-%m-%d)"

# ──────────────────────────────────────────
# Argument parsing
# ──────────────────────────────────────────

usage() {
  printf 'Usage: ./amend.sh <plan-slug> [--stage] [--message "<text>"]\n' >&2
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

# Be friendly: strip an accidental .md extension or -amendment-N suffix
SLUG="${SLUG%.md}"
case "$SLUG" in
  *-amendment-*)
    SLUG="${SLUG%-amendment-*}"
    ;;
esac

# ──────────────────────────────────────────
# Preconditions
# ──────────────────────────────────────────

if [ ! -f "$MISSION" ]; then
  printf 'Error: MISSION.md not found at %s\n' "$MISSION" >&2
  exit 1
fi

if grep -Fq 'mission:unset' "$MISSION"; then
  printf 'Error: mission is not yet defined. Run ./bootstrap.sh first.\n' >&2
  exit 1
fi

PARENT="$PLANS_DIR/$SLUG.md"
if [ ! -f "$PARENT" ]; then
  printf 'Error: parent plan .omc/plans/%s.md not found. Amendments must target an existing plan.\n' "$SLUG" >&2
  exit 1
fi

# ──────────────────────────────────────────
# Determine next amendment number
# ──────────────────────────────────────────

MAX=0
for f in "$PLANS_DIR/$SLUG"-amendment-*.md; do
  [ -f "$f" ] || continue
  base=$(basename "$f" .md)
  n="${base##*-amendment-}"
  case "$n" in
    ''|*[!0-9]*) continue ;;
  esac
  if [ "$n" -gt "$MAX" ]; then
    MAX="$n"
  fi
done
N=$((MAX + 1))

AMEND_BASENAME="${SLUG}-amendment-${N}.md"
AMEND_FILE="$PLANS_DIR/$AMEND_BASENAME"

if [ -e "$AMEND_FILE" ]; then
  printf 'Error: %s already exists. Refusing to overwrite.\n' "$AMEND_FILE" >&2
  exit 1
fi

# ──────────────────────────────────────────
# Scaffold the amendment file
# ──────────────────────────────────────────

cat > "$AMEND_FILE" << AMEND_EOF
# Amendment ${N}: ${SLUG}

## Parent

${SLUG}

## Date

${TODAY}

## Learning

TODO: what changed and why (the "I got smarter" moment)

## New direction

TODO: the revised goal or criteria, stated verbatim

## Impact on acceptance criteria

TODO: which acceptance criterion numbers change, and how
AMEND_EOF

# ──────────────────────────────────────────
# Stamp MISSION.md changelog (insert after anchor comment)
# ──────────────────────────────────────────

if [ -n "$MESSAGE" ]; then
  CHANGELOG_LINE="${TODAY}: ${MESSAGE} — see .omc/plans/${AMEND_BASENAME}"
else
  CHANGELOG_LINE="${TODAY}: amendment ${N} to ${SLUG} — see .omc/plans/${AMEND_BASENAME}"
fi

# Idempotent guard: skip if an entry already references this basename
CHANGELOG_STAMPED=false
if grep -Fq "$AMEND_BASENAME" "$MISSION"; then
  printf 'Notice: MISSION.md already references %s; skipping changelog stamp.\n' "$AMEND_BASENAME"
else
  ANCHOR='<!-- append YYYY-MM-DD entries below this line -->'
  if grep -Fq "$ANCHOR" "$MISSION"; then
    # Insert after the anchor line using a temp file (portable, no sed -i)
    TMPFILE=$(mktemp)
    while IFS= read -r line || [ -n "$line" ]; do
      printf '%s\n' "$line"
      if printf '%s' "$line" | grep -Fq "$ANCHOR"; then
        printf '- %s\n' "$CHANGELOG_LINE"
      fi
    done < "$MISSION" > "$TMPFILE"
    mv "$TMPFILE" "$MISSION"
  else
    # Fallback: append at EOF if anchor is missing
    printf 'Warning: MISSION.md is missing the changelog anchor comment. Appending at EOF.\n' >&2
    printf '\n- %s\n' "$CHANGELOG_LINE" >> "$MISSION"
  fi
  CHANGELOG_STAMPED=true
fi

# ──────────────────────────────────────────
# Optional git staging
# ──────────────────────────────────────────

STAGED=false
if [ "$STAGE" = true ]; then
  if command -v git > /dev/null 2>&1 && git -C "$ROOT" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git -C "$ROOT" add "$AMEND_FILE" "$MISSION"
    STAGED=true
  fi
fi

# ──────────────────────────────────────────
# Report
# ──────────────────────────────────────────

printf 'Created: .omc/plans/%s\n' "$AMEND_BASENAME"
if [ "$CHANGELOG_STAMPED" = true ]; then
  printf 'Stamped: MISSION.md changelog\n'
fi
printf 'Next:    fill in the TODO sections in the amendment, then commit.\n'
printf '         (verify with: ./verify.sh --standard)\n'
if [ "$STAGED" = true ]; then
  printf 'Staged:  both files added to git index.\n'
fi
