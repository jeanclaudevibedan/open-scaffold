---
title: Evidence-First Development
created: 2026-05-15
updated: 2026-05-15
type: concept
tags: [open-scaffold, evidence, governance, workflow]
sources: [docs/SLICE_CLOSE_PROTOCOL.md, docs/VERIFICATION.md, ROADMAP.md]
confidence: high
contested: false
---

# Evidence-First Development

Evidence-first development is the Open Scaffold habit of treating verification artifacts as part of the work, not as an optional afterthought.

A slice is not complete because an agent says it is complete. It is complete when the repository contains enough proof for a reviewer to understand what changed, how it was checked, and what remains unknown.

## Evidence examples

- Passing verification commands.
- Failing command output with an explicit blocker.
- Screenshots or manual test notes when visual behavior matters.
- PR links and review outcomes.
- Release notes that cite plan, run, verification, and follow-up state.

## Evidence boundary

Evidence is not the same as a wiki page. Evidence records what happened in a slice. The wiki distills what the project learned into reusable concepts.

Related: [[source-of-truth-first-development]], [[human-in-the-loop-governance]], [[run-packets]].
