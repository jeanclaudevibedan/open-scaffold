# Architecture Decisions

Architecture Decision Records (ADRs) document significant choices and their rationale. Each non-trivial decision becomes one file in this directory.

## How to add an ADR

1. Copy the inline template below into a new file named `NNNN-kebab-slug.md`, where `NNNN` is the next zero-padded number in the sequence.
2. Fill every section. Keep it short — an ADR is a decision record, not an essay.
3. Commit the ADR before or alongside the code change it describes.
4. Add a row to the index table at the bottom.

## ADR template

```markdown
# NNNN — <short decision title>

## Status
Proposed | Accepted | Deprecated | Superseded by NNNN

## Context
<1-3 sentences: what forces made this decision necessary now? What is the problem being solved?>

## Decision
<1-3 sentences: what did we decide? Concrete and specific.>

## Consequences
<What becomes easier, harder, or different because of this decision? What trade-offs are we accepting?>
```

## Index

| # | Title | Status |
|---|-------|--------|
| 0001 | Paired views (CLAUDE.md / AGENTS.md) are duplicated manually | Accepted |
| 0002 | Fifteen-minute budget evidence (AC #10 of the dan-starter spec) | Proposed |
