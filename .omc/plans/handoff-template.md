# Plan: <slug>

<!--
Copy this template to `.omc/plans/<slug>.md` for each task or feature slice.
Fill every section. Keep each section tight — a reader with no prior context
should be able to act on the plan after reading it once.

Plans are IMMUTABLE once committed. If new information changes the plan,
write an amendment file `<slug>-amendment-<n>.md` in this directory and
add a one-line entry to MISSION.md's Changelog section.
-->

## Context

<1-3 sentences: why this plan exists. What happened that made us write it now? What prior plan or decision does it follow from, if any?>

## Goal

<One crisp sentence describing the outcome that defines "done" for this plan. Not a feature list — the single observable change in the world when this is complete.>

## Constraints / Out of scope

- <what this plan will NOT do>
- <non-goals specific to this slice>
- <boundaries on stack, time, or surface area>

## Files to touch

- `path/to/file.ext` — <one-line reason>
- `path/to/other.ext` — <one-line reason>

## Acceptance criteria

- [ ] <testable bullet — something a verifier can check mechanically or with a clear yes/no>
- [ ] <testable bullet>
- [ ] <testable bullet>

## Verification steps

1. <command or manual check>
2. <expected output or observable>
3. <pass criterion: exactly what makes this step green>

## Open questions

- <unresolved decision, tag with owner if known>
- <assumption that needs validation before or during execution>
