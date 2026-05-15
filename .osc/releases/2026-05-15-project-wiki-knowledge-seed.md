# Release / Evidence Note: project wiki knowledge seed

## Summary

Open Scaffold's project wiki moved from skeleton to a curated public-safe body-of-work knowledge seed.

This slice added 12 wiki pages across concepts, comparisons, and query answers, then updated wiki navigation and log surfaces so future readers and agents can use `docs/wiki/` as compiled project knowledge rather than active task state.

## Traceability

- Plan: `.osc/plans/active/029-project-wiki-knowledge-seed.md` before close; `.osc/plans/done/029-project-wiki-knowledge-seed.md` after close.
- Branch: `docs/project-wiki-knowledge-seed`.
- Pull request: https://github.com/graphanov/open-scaffold/pull/28
- Follow-up hygiene branch: `docs/close-project-wiki-seed`.
- Primary docs: `docs/wiki/index.md`, `docs/wiki/log.md`, `docs/wiki/concepts/`, `docs/wiki/comparisons/`, `docs/wiki/queries/`.

## Verification

Commands for the wiki seed and closure:

```text
./verify.sh --strict
npm test
npm run build
git diff --check
```

Observed result before close: all commands exited 0. Codex review found one source-path issue in PR #28, fixed in commit `d68a2f5`, then returned no major issues.

## Outcome

`docs/wiki/` now has a coherent public-safe seed pack for durable Open Scaffold concepts. Live work state remains in `.osc/plans/`, GitHub PRs, run evidence, and release notes rather than the wiki.
