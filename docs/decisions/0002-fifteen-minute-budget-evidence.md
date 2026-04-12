# 0002 — Fifteen-minute budget evidence (AC #10 of the open-scaffold spec)

## Status
Proposed

## Context
The open-scaffold spec originally asserted a build-time acceptance criterion: "A fresh project can go from `gh repo create` to 'first plan file written and first commit made' in under 15 minutes." Time budgets cannot be asserted; they can only be measured. Amendment 3 to the spec (see `.omc/specs/deep-interview-open-scaffold-amendment-3.md`) rewrote the criterion to require a dated stopwatch run on the first real project created from open-scaffold, with the result logged to this ADR. This ADR ships with the template in `Status: Proposed` and is promoted (or superseded) after the measurement runs.

## Decision
Within 7 days of open-scaffold being published as a GitHub template, a dated stopwatch run will be performed on the first real consumer project:

1. Start timer at `gh repo create <project> --template open-scaffold --clone`.
2. Stop timer at the first real plan file (following `.omc/plans/handoff-template.md`) committed to the new project.
3. Record the measured duration, the date of the run, and the project name.
4. Commit this ADR (or a replacement ADR) to open-scaffold with the result.

If the measured duration is **≤ 15 minutes**, this ADR's `Status` flips from `Proposed` to `Accepted` and the template's v1.0 release is considered verified against AC #10.

## Consequences — Pre-committed Contingency (CRITICAL)

**If the measured duration is > 15 minutes**, do NOT silently re-baseline the budget. Instead:

1. File a new ADR `0003-fifteen-minute-budget-blown.md` with `Status: Accepted`.
2. In ADR 0003, record:
   - The measured duration
   - The step(s) that consumed the overage (scaffolding, reading WORKFLOW.md, writing the first plan, etc.)
   - The root cause analysis
   - One of the following responses, chosen explicitly:
     - **(a) Revise the workflow** to hit the budget on a second run — and schedule the second run.
     - **(b) Revise the budget** to reflect measured reality, with explicit rationale for why 15 minutes was the wrong target.
     - **(c) Accept that AC #10 was aspirational** and document that the workflow-as-shipped is slower than the original target, with no further action planned.
3. Only after ADR 0003 is written AND the underlying issue has been addressed (for options a and b) may a second stopwatch run be performed.
4. Do NOT silently edit this ADR to change the budget. The whole point of the contingency is to prevent post-hoc rationalization.

**Rationale for the contingency:** pre-committing the failure branch is what makes the measurement honest. Without a pre-committed response to an over-budget result, there is a strong tendency to silently re-baseline ("well, 18 minutes is still pretty fast") instead of investigating. This ADR exists so that future-Dan cannot accidentally lie to present-Dan.

## Measurement placeholder

| Field | Value |
|-------|-------|
| Date of run | _(pending)_ |
| Project name | _(pending)_ |
| Measured duration | _(pending)_ |
| Bootstrap used? | _(pending)_ |
| Outcome | _(pending — will be one of: Accepted / Blown → 0003)_ |
