# Design choices

The decisions that shaped open-scaffold and why. Every entry here is a fork in the road we explicitly chose, not a default we stumbled into. Read these if you want to understand what the scaffold *is*, not just what it does.

## The decisions

**[Why CLAUDE.md and AGENTS.md are hand-duplicated instead of generated.](0001-paired-views-are-duplicated-manually.md)** Because a build script that breaks in six months is worse than two files that might drift in six months. Drift you notice on the next read; a broken generator rots silently. The paired-view header in each file tells you to mirror edits, and if drift happens three times in the first year, we revisit. Status: **Accepted**.

**[Why orchestration is agent-mediated, not runtime-native.](0002-orchestration-is-agent-mediated.md)** The plan's `Execution strategy` section is a contract for *agents*, not for runtime slash commands. The agent reads it and dispatches; the runtime just runs what it's told. This makes the scaffold portable across any runtime — OMC, Cursor, plain Claude, or a human in a terminal — without coupling the scaffold to anyone's internals. Status: **Accepted**.

## How to add an ADR

1. Copy the inline template below into a new file named `NNNN-kebab-slug.md`, where `NNNN` is the next zero-padded number in the sequence.
2. Fill every section. Keep it short — an ADR is a decision record, not an essay.
3. Commit the ADR before or alongside the code change it describes.
4. Add a one-paragraph teaser to **The decisions** list above. Match the voice of the existing entries: declarative, opinionated, no flinching.

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
