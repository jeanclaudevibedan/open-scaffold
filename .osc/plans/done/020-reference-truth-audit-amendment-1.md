# Amendment 1: 020-reference-truth-audit

## Parent

020-reference-truth-audit

## Date

2026-05-15

## Learning

Codex review correctly noticed tension between the inherited draft constraint "Do not edit MISSION.md in this slice" and the Open Scaffold close protocol, which requires `./close.sh` to stamp `MISSION.md` when a plan moves to `done/`. The public-doc scope should still avoid strategic MISSION edits, but the mechanical close stamp is protocol evidence rather than product-scope drift.

## New direction

Permit the mechanical `MISSION.md` changelog stamp produced by `./close.sh` for this slice. Do not permit any broader mission/strategy edits under this plan.

## Impact on acceptance criteria

No acceptance criteria change. Constraint interpretation changes narrowly: "Do not edit MISSION.md" means no product/strategy mission edits; the mandatory close stamp is allowed as lifecycle evidence.
