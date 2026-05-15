# Release / Evidence Note: roadmap scope discipline

## Summary

This slice applies the 2026-05-14 external review's roadmap scope-discipline recommendation.

The public roadmap now includes an explicit visibility rule: keep at most five planned/backlog milestones visible ahead of the current focus, preserve completed milestones for provenance, and move farther speculation to parking lot/research notes until the owner explicitly promotes it.

## Traceability

- Plan: `.osc/plans/backlog/024-roadmap-scope-discipline.md` before activation; `.osc/plans/done/024-roadmap-scope-discipline.md` after close.
- Source rationale: 2026-05-14 external review ingest, summarized in the plan context and this release note.
- Branch: `docs/roadmap-scope-discipline`.
- Kanban: `t_48170d97`.

## Verification

Commands for this slice:

```text
grep -n "Status: backlog via" ROADMAP.md
./verify.sh --standard
./verify.sh --strict
npm test
npm run build
git diff --check
```

Observed result before PR: all verification commands exited 0. The roadmap has five visible `Status: backlog via` planned milestones.

## Outcome

Milestone 16 is now complete/deferred for public roadmap purposes: compliance-grade agentic OS and hashgraph-style regulated-SDLC expansion remain research hypotheses, not near-term public product commitments. Milestone 10 remaining packaging polish is parked, Milestone 14 reflects the shipped tiered-init slice, and the public roadmap presents exactly five visible planned/backlog milestones ahead.
