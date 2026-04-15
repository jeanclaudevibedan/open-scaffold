# Plan: amend-helper

## Context

Plans in `.omc/plans/` are immutable; scope evolution is captured via `<slug>-amendment-<n>.md` files plus a one-line entry in MISSION.md's Changelog. The mechanical steps (find next N, scaffold the file, append the changelog line) are currently manual. The amendment schema exists at `.omc/plans/README.md:7-13` (Parent / Date / Learning / New direction / Impact on acceptance criteria) but has never been exercised — no amendment file has been written against any plan in this repo. `verify.sh` already enforces sequential numbering (Check 3) and changelog containment of amendment basenames (Check 4), so any helper that passes those checks is automatically correct. This plan adds a fourth bash script, `amend.sh`, that operationalizes the existing schema, and a short paragraph in CLAUDE.md / AGENTS.md telling agents to drive it conversationally.

## Goal

A user can run `./amend.sh <plan-slug>` in a fresh open-scaffold checkout and end up with a correctly numbered, schema-complete amendment file in `.omc/plans/` and a matching one-line entry in MISSION.md's Changelog — with zero manual bookkeeping, and with `./verify.sh --standard` passing afterward.

## Constraints / Out of scope

- No runtime coupling between the script and agents. Layer 2 is plain instructions in CLAUDE.md/AGENTS.md; the script never assumes an agent is present.
- No new schema invention. The 5-section schema already defined in `.omc/plans/README.md` is the authoritative source; the script scaffolds it verbatim. If that schema is wrong, that is a separate change to README.md, not to this script.
- macOS system bash 3.2 compatible; no GNU-only flags (match the style of `bootstrap.sh`, `verify.sh`, `delegate.sh`); `set -uo pipefail`; idempotent and non-destructive.
- No interactive prompting by default. The script is a one-shot scaffolder; any conversational flow lives in the agent layer.
- Does not modify the parent plan file (immutability invariant must hold).
- Does not ship as a `.omc/` skill or Claude command — it is a first-class repo script alongside the other three.
- Not a linter. Validation beyond what `verify.sh` already covers is explicitly out of scope.

## Files to touch

- `amend.sh` — new. The scaffolder script.
- `CLAUDE.md` — add a short paragraph under or near the existing "Scope evolution protocol" section telling agents to drive `amend.sh` conversationally.
- `AGENTS.md` — mirror the same paragraph so the paired-view invariant (enforced by `verify.sh --strict` Check 6) stays intact.
- `.omc/plans/README.md` — add a one-line pointer at the bottom: "Tip: run `./amend.sh <plan-slug>` from the repo root to scaffold the next amendment and stamp the changelog automatically."
- `README.md` — optional one-line mention in the scripts list if one exists (verify before editing; do not invent a section).

Does NOT touch: `MISSION.md` (only modified at runtime by the script, never at plan-authoring time), any file under `.omc/plans/` other than `README.md`.

## Script behavior (specification)

**Invocation**

```
./amend.sh <plan-slug> [--stage] [--message "<one-line reason>"]
```

- `<plan-slug>` (required) — the bare slug, without the `.md` extension and without any `-amendment-N` suffix. Example: `amend-helper`.
- `--stage` (optional) — run `git add` on the new amendment file and MISSION.md after writing them. Off by default. If `git` is unavailable or the repo is not a git working tree, the flag is a silent no-op (consistent with `verify.sh`'s git-optional pattern at lines 178-202).
- `--message "<text>"` (optional) — override the default changelog entry text. If omitted, the entry reads: `YYYY-MM-DD: amendment <N> to <plan-slug> — see .omc/plans/<plan-slug>-amendment-<N>.md`.

**Preconditions**

1. Must be run from or resolve to the repo root containing `MISSION.md` and `.omc/plans/`. Use the same `ROOT="$(cd "$(dirname "$0")" && pwd)"` pattern used by the other three scripts.
2. Parent plan file `.omc/plans/<plan-slug>.md` must exist. If it does not, exit 1 with: `Error: parent plan .omc/plans/<plan-slug>.md not found. Amendments must target an existing plan.`
3. `MISSION.md` must exist and must contain the `<!-- append YYYY-MM-DD entries below this line -->` anchor. If the anchor is missing, fall back to appending at end-of-file and print a warning. Never silently corrupt MISSION.md.
4. If MISSION.md still contains the `<!-- mission:unset -->` marker, refuse to proceed and exit 1 with: `Error: mission is not yet defined. Run ./bootstrap.sh first.`

**Numbering**

1. Scan `.omc/plans/<plan-slug>-amendment-*.md`. For each match, strip the prefix and suffix to get the integer, track the max.
2. Next amendment number N = max + 1. If no existing amendments, N = 1.
3. If `.omc/plans/<plan-slug>-amendment-<N>.md` already exists (race or filesystem oddity), exit 1 with a clear error; never overwrite.

**Scaffold content**

Write `.omc/plans/<plan-slug>-amendment-<N>.md` with exactly the 5-section schema from `.omc/plans/README.md:7-13`:

```
# Amendment <N>: <plan-slug>

## Parent

<plan-slug>

## Date

YYYY-MM-DD

## Learning

TODO: what changed and why (the "I got smarter" moment)

## New direction

TODO: the revised goal or criteria, stated verbatim

## Impact on acceptance criteria

TODO: which acceptance criterion numbers change, and how
```

Date is produced by `date +%Y-%m-%d` (portable, matching bootstrap.sh:8). The `TODO:` lines are literal placeholders the user (or the agent driving the script) fills in after the script exits.

**Changelog stamping**

1. Build the changelog line: `- <DATE>: amendment <N> to <plan-slug> — see .omc/plans/<plan-slug>-amendment-<N>.md` (or the custom message if `--message` was passed, with the amendment filename appended so `verify.sh` Check 4 still finds the basename).
2. Find the anchor comment in MISSION.md and insert the new line immediately after it.
3. Use a sed-free approach (bash 3.2 + `sed -i ''` is gnarly on macOS). Recommended implementation: read MISSION.md line-by-line with `while IFS= read -r`, echo each line, and after matching the anchor, echo the new line. Write to a temp file, then `mv` atomically. Do not use `sed -i`.
4. Idempotent guard: if a line containing the exact amendment basename already exists in MISSION.md, skip the insert and print a notice. Reuses the `grep -Fq` pattern from `bootstrap.sh:99`.

**Output**

On success, print to stdout (one section per concern, match the style of `bootstrap.sh`'s `printf` output):

```
Created: .omc/plans/<plan-slug>-amendment-<N>.md
Stamped: MISSION.md changelog
Next:    fill in the TODO sections in the amendment, then commit.
         (verify with: ./verify.sh --standard)
```

If `--stage` was passed and git succeeded, add a fourth line: `Staged:  both files added to git index.`

**Exit codes**

- `0` — amendment scaffolded and changelog stamped successfully.
- `1` — precondition failure (missing parent plan, missing MISSION.md, mission unset, filesystem collision, usage error).
- `2` — unknown flag (matches `verify.sh:20`).

## Acceptance criteria

- [ ] `amend.sh` exists at the repo root, is executable (`chmod +x`), and passes `shellcheck` with no errors (warnings acceptable if they match patterns already present in `verify.sh`/`delegate.sh`).
- [ ] Running `./amend.sh amend-helper` against a fresh checkout produces `.omc/plans/amend-helper-amendment-1.md` containing the exact 5 sections listed in the scaffold spec above, with `date +%Y-%m-%d` in the Date field.
- [ ] Running `./amend.sh amend-helper` a second time produces `-amendment-2.md`, not an overwrite; numbering is strictly monotonic.
- [ ] After two runs, MISSION.md's Changelog contains exactly two new lines, each referencing the corresponding amendment basename, inserted directly after the anchor comment (not appended at EOF unless the anchor was missing).
- [ ] `./verify.sh --standard` exits 0 after running `amend.sh` twice (i.e., Checks 3 and 4 both pass on the scripted output).
- [ ] `./amend.sh nonexistent-plan` exits 1 with the specified error message and does not create any file or modify MISSION.md.
- [ ] `./amend.sh amend-helper --stage` (when run inside a git working tree) stages both files; running the same command outside a git repo is a silent no-op with exit 0.
- [ ] Running `amend.sh` does NOT modify `.omc/plans/amend-helper.md` (plan immutability preserved; check with `git diff` on the parent plan file).
- [ ] The script runs cleanly under macOS system bash 3.2 (verify by running with `/bin/bash -3.2` or inspecting that no bash-4+ features are used: no `[[ =~ ]]` beyond what verify.sh uses, no associative arrays, no `mapfile`).
- [ ] `CLAUDE.md` and `AGENTS.md` both contain a new paragraph (4-6 sentences max) describing the agent-driven amendment flow, and both paragraphs are identical verbatim (paired-view invariant — `verify.sh --strict` Check 6 still passes).
- [ ] The CLAUDE.md/AGENTS.md paragraph does not instruct the agent to edit MISSION.md or amendment files directly; it instructs the agent to invoke `./amend.sh` and then fill in the TODO sections.
- [ ] `.omc/plans/README.md` gets the one-line "Tip:" pointer at the bottom, and no other changes.

## Verification steps

1. `shellcheck amend.sh` → no errors.
2. From a fresh clone: `./bootstrap.sh` (non-interactive), define mission manually, then `./amend.sh amend-helper` → check file exists, content matches schema.
3. Run `./amend.sh amend-helper` a second time → check `-amendment-2.md` exists, `-amendment-1.md` is unchanged (`git diff --exit-code .omc/plans/amend-helper-amendment-1.md`).
4. `grep -c 'amend-helper-amendment' MISSION.md` → should return 2.
5. `./verify.sh --standard` → exit 0, no FAIL lines.
6. `./verify.sh --strict` → exit 0 (verifies paired-view sync and plan immutability after the doc edits).
7. `./amend.sh does-not-exist` → exit 1, no files written (check `git status --porcelain` is clean).
8. Destroy `.omc/plans/amend-helper-amendment-1.md`, run `./amend.sh amend-helper` → numbering should regenerate as `-amendment-1.md` (numbering is based on current filesystem state, which is the correct behavior for a no-agent tool — the agent/user is responsible for not deleting committed amendments).

## Open questions

- **Anchor fallback behavior.** If MISSION.md is missing the `<!-- append YYYY-MM-DD entries below this line -->` anchor (e.g., the user manually edited MISSION.md and removed it), should the script (a) append at EOF with a warning, (b) refuse to proceed, or (c) regenerate the anchor? The plan as written chooses (a). Validate with the first real amendment.
- **Message flag UX.** Should `--message` replace the default line or prepend to it? Plan as written: replace the human-readable portion but always append the amendment filename so `verify.sh` Check 4 still matches. Confirm this is the desired semantics before a user hits it.
- **Git staging for the parent plan.** Amendments never modify the parent plan, so `--stage` only stages the amendment file and MISSION.md. Confirmed non-goal, but worth calling out so a future reader doesn't add the parent plan to the stage list.

---

## RALPLAN-DR summary

### Principles

1. **Operationalize, don't re-invent.** The amendment schema is already written in `.omc/plans/README.md:7-13`. This helper scaffolds from the existing schema; it does not mint a new one.
2. **No runtime coupling between layers.** The bash script must be complete and useful with zero agent in the loop. The agent paragraph in CLAUDE.md/AGENTS.md is instructions *on top of* the script, not a caller contract.
3. **Match the existing script style.** macOS bash 3.2, `set -uo pipefail`, idempotent, graceful git-optional, no GNU flags, `printf` output. Consistency with `bootstrap.sh`/`verify.sh`/`delegate.sh` is a hard constraint, not a preference.
4. **Let `verify.sh` be the spec.** Checks 3 and 4 already define what correct amendment output looks like. If `amend.sh` produces output that passes them, it is correct by construction.
5. **Plan immutability is inviolable.** The script must not touch the parent plan file under any circumstance, and verification must confirm this.

### Decision drivers

1. **Resolving the implicit schema gap.** The 5-section schema exists in prose but has never been exercised — running the helper on a real amendment is the first stress test. (Reframes the user's "schema is undefined" framing: the schema is *defined but untested*, and the helper is the test.)
2. **Day-one usability for users without an agent.** open-scaffold's core value prop is working for any agent or no agent. A Claude-command-only solution would violate that.
3. **Paired-view CLAUDE.md/AGENTS.md invariant.** `verify.sh --strict` Check 6 enforces structural sync between these two files. Any layer-2 documentation edit must be mirrored.

### Viable options

**Option A: Bash script + agent paragraph (the proposed design).**
- *Pros:* Matches existing scaffold style. Zero-agent usable. Agent layer is additive. Aligns with `verify.sh` enforcement. Cheap to build (~60 lines of bash + 5-section paragraph ×2).
- *Cons:* Users with agents pay the minor cognitive cost of "the agent will run a bash script at me." Requires disciplined bash 3.2 authoring to avoid GNU-ism regressions.

**Option B: Claude Code slash command / skill only (e.g., `/amend`).**
- *Pros:* Nicer interactive UX inside Claude Code. No shell portability concerns.
- *Cons:* **Violates Principle 2** — open-scaffold users without Claude Code get nothing. Also doesn't define the schema for no-agent use, which was the point. **Rejected.**

**Option C: Pure documentation — expand `.omc/plans/README.md` to include a worked example and call it done.**
- *Pros:* Zero code, zero maintenance surface.
- *Cons:* Doesn't reduce the per-amendment friction the user identified (autonumbering, changelog stamping). Still requires humans to hand-edit MISSION.md without a safety net. Leaves `verify.sh` Check 4 as the only catch for changelog mistakes, after the fact. **Rejected as insufficient.**

**Option D: Bash script only, skip the agent paragraph.**
- *Pros:* Smallest diff. Avoids paired-view churn.
- *Cons:* Loses the conversational-driver upside the user explicitly called out. Agents would still invent their own amendment workflows ad hoc. **Rejected as half-shipping.**

Chosen: **Option A.**

---

## ADR

**Decision.** Add a fourth repo-root bash script `amend.sh <plan-slug> [--stage] [--message ...]` that autonumbers, scaffolds, and changelog-stamps an amendment file against an existing plan, plus a short mirrored paragraph in CLAUDE.md and AGENTS.md instructing agents to drive it conversationally.

**Drivers.**
- open-scaffold's zero-agent-usable constraint (Principle 2 / Driver 2).
- The amendment schema already exists at `.omc/plans/README.md:7-13` but has never been exercised (Driver 1).
- `verify.sh` Checks 3 and 4 already define mechanical correctness for amendment output (Principle 4).
- The paired-view CLAUDE.md/AGENTS.md invariant enforced by `verify.sh --strict` Check 6 (Driver 3).

**Alternatives considered.**
- **Option B (slash command / skill only)** — rejected: violates zero-agent-usable constraint.
- **Option C (documentation only)** — rejected: doesn't reduce per-amendment friction and doesn't exercise the schema.
- **Option D (script without agent paragraph)** — rejected: loses the conversational driver the user explicitly wanted.

**Why chosen.** Option A is the only option that satisfies all three drivers simultaneously. It also resolves the implicit "schema defined but untested" gap by making the helper the first real exercise of the schema. The `amend.sh`-before-ADR sequencing the user proposed is correct: a separately-written ADR would just re-assert the schema that already exists in `.omc/plans/README.md`, whereas shipping the helper makes that schema real.

**Consequences.**
- Positive: Every future amendment in any open-scaffold checkout is one command away. `verify.sh` Checks 3 and 4 become much harder to fail. The schema in `.omc/plans/README.md` gets tested by actual use.
- Neutral: CLAUDE.md and AGENTS.md both grow by ~5 sentences; the paired-view invariant is preserved.
- Negative: One more bash script to maintain in bash 3.2-compatible style. The MISSION.md anchor comment becomes load-bearing — if a user deletes it, the script falls back to EOF append with a warning, but this is a subtle contract worth documenting.

**Follow-ups.**
- After the first real amendment is written through `amend.sh`, decide whether the 5-section schema in `.omc/plans/README.md` needs revision (e.g., an optional "Related ADR" field). If yes, revise the schema and the script scaffold in lockstep.
- Consider whether `verify.sh --strict` should grow a Check 9 that validates the 5 sections are present and non-empty inside each amendment file. Not part of this plan; file as a separate open-scaffold issue once the helper has seen real-world use.
- Evaluate whether `bootstrap.sh` should mention `amend.sh` in its final "Read: docs/WORKFLOW.md" output. Probably yes, but bundle with a broader WORKFLOW.md update rather than a drive-by edit.
