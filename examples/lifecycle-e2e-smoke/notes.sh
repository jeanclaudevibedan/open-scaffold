#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: bash notes.sh add "note text"\n' >&2
}

if [ "${1:-}" != "add" ] || [ $# -lt 2 ]; then
  usage
  exit 2
fi

shift
note="$*"
if [ -z "$note" ]; then
  usage
  exit 2
fi

printf '%s\n' "$note" >> notes.txt
