# Amendment 4: 001-generic-osc-core

## Parent

001-generic-osc-core

## Date

2026-05-12

## Learning

Daniel's Command Center proved the missing private bridge: Hermes Kanban can remain operational truth while a bounded harness dispatcher launches OMX `$ralplan` and records run evidence. Open Scaffold should absorb this as a public pattern, but not by copying Daniel-specific Hermes Kanban, Codex auth, Discord, or `.omx/` Command Center machinery into core.

The clarified layer split is:

```text
Open Scaffold core = portable task/run/evidence contract
Coordinator/task bridge = operational state and launch decision
Runtime harness = execution lane
Operator surface = glass/question/approval transport
GitHub = publication/review layer
```

## New direction

Add public documentation for the runtime harness dispatch pattern. Open Scaffold core should continue generating `.osc/runs/<run_id>/run.json` with `spawning: false`, while documenting how coordinators/adapters consume that package to launch OMX/OMC/plain-agent/human lanes and promote evidence back.

This slice should also include a Mermaid diagram showing the current system position: private Command Center bridge proven, Open Scaffold now productizing the public contract/docs, future adapter/binding work still separate.

## Impact on acceptance criteria

- Extends Amendment 3 AC16/AC18: generated run records are not only schema artifacts; docs must show how a coordinator/adapter consumes them for real harness dispatch without moving spawning into core.
- Adds AC21: docs include a Mermaid process diagram locating the current phase between the proven Command Center bridge and future public runtime bindings.
- Adds AC22: docs explicitly distinguish Open Scaffold's portable pattern from Daniel-specific Hermes Kanban/Command Center implementation.
- Adds AC23: docs include an OMX `$ralplan` dispatch example that preserves core's non-spawning boundary and commit/push approval gate.
