#!/usr/bin/env bash
set -euo pipefail

rm -f notes.txt
bash notes.sh add "hello smoke"
grep -Fxq "hello smoke" notes.txt
printf 'tiny-notes test passed\n'
