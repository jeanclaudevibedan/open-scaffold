# Plan: runtime-strategy-native-runtime-exploration

## Status

done

## Context

Open Scaffold currently presents itself as a runtime-neutral launch checklist, dispatch contract, and black-box recorder. That boundary is useful, but it may also dilute the product if users expect the system to initiate or supervise actual agent work. This plan captures the unresolved strategic question: should Open Scaffold stay non-spawning, add a thin opt-in spawner, or eventually grow a native runtime as a separate governed layer?

## Goal

Produce a decision-grade runtime strategy that says whether Open Scaffold should remain non-spawning, add thin adapter invocation, move spawning into adapter packages, or explore a native runtime product.

## Constraints / Out of scope

- Do not implement real autonomous runtime spawning in this discovery slice.
- Do not add Claude/Codex/OpenCode/Hermes/OMC/OMX-specific dependencies to core during discovery.
- Do not weaken the current safety boundary without an explicit decision record.
- Do not treat a thin spawner and a native runtime as the same product choice.
- Do not overfit the answer to Daniel's local Command Center setup; public Open Scaffold users must be considered.

## Files to touch

- `ROADMAP.md` — keep the runtime strategy question visible as a product milestone.
- `MISSION.md` — clarify current non-spawning stance while acknowledging explicit long-term exploration.
- `docs/SPAWNING_BOUNDARY.md` — likely new decision/discovery note for thin `osc spawn` versus native runtime.
- `docs/RUNTIME_BINDING_CONTRACT.md` — update only if the discovery changes the contract language.
- `docs/OPEN_SCAFFOLD_SYSTEM.md` — update only if the system ontology gains a runtime layer.
- `docs/decisions/README.md` or a future ADR file — record the final decision and rationale.

## Execution strategy

### Task decomposition

| ID | Task | Dependencies | Parallel group |
|----|------|--------------|----------------|
| T1 | Product vision analysis: what runtime ownership would add beyond launch checklist / dispatch contract / black-box recorder | None | A |
| T2 | Technology and market scan: compare agent runtimes, coding-agent CLIs, workflow engines, CI runners, task orchestrators, and evidence/audit systems | None | A |
| T3 | Architecture options: no-spawn, thin `osc spawn`, adapter packages, sibling runtime product, hosted coordinator, native runtime | T1, T2 | B |
| T4 | Safety/governance model: credentials, env allowlists, workspace isolation, process supervision, commit authority, audit trail, failure states | T1, T2 | B |
| T5 | Recommendation and decision record: choose what to build now, what to defer, and what not to do | T3, T4 | C |
| T6 | Roadmap update: convert the chosen direction into concrete follow-up slices with acceptance criteria | T5 | D |

### Parallel groups

- **Group A**: product vision and external technology scan can run independently.
- **Group B**: architecture and safety can run in parallel after the first analysis pass.
- **Group C/D**: recommendation and roadmap updates must wait for evidence.

### Dependencies

- Do not write a final decision before T1–T4 have explicit evidence.
- Do not prototype a real spawner before the safety model is written.

### Delegation notes

- This is suitable for multi-agent research: one product strategist, one runtime/architecture reviewer, one safety/governance reviewer, and one skeptical critic.
- Ask reviewers to challenge whether native runtime ownership would strengthen or confuse Open Scaffold's identity.

## Acceptance criteria

- [ ] The discovery compares at least five relevant external systems or product categories, not just Open Scaffold internals.
- [ ] The final recommendation distinguishes clearly between no-spawn, thin local adapter invocation, official adapter packages, and native runtime ownership.
- [ ] Safety/governance requirements are explicit: credentials, env allowlists, workspace isolation, process lifecycle, audit logs, commit/push/merge authority, and failure states.
- [ ] The recommendation states what Open Scaffold wants to be in one sentence.
- [ ] If thin `osc spawn` is recommended, its first implementation slice is limited to fake/local adapters and dispatch receipts.
- [ ] If native runtime exploration remains open, the roadmap captures it as an explicit research/product track, not accidental scope creep.
- [ ] Public docs continue to state honestly what exists today versus what is future exploration.

## Verification steps

1. Run `./verify.sh --strict`; expected pass.
2. Run `git diff --check`; expected clean.
3. Review `MISSION.md`, `ROADMAP.md`, and any decision docs together; expected no contradiction between current non-spawning boundary and long-term runtime exploration.
4. Ask a skeptical reviewer whether the recommendation over-expands Open Scaffold; expected critique is addressed or captured as an open question.

## Open questions

- Is Open Scaffold's strongest identity the repo-native protocol/black-box recorder, or does it need a runtime to become a product rather than methodology?
- Should `osc spawn` be a core command, an official plugin/package, or only an example adapter pattern?
- Would native runtime ownership compete with or complement Hermes, OMC, OMX, Claude Code, Codex, OpenCode, and GitHub Actions?
- What minimum supervision features would make a native runtime meaningfully different from shelling out to existing CLIs?
- Should an Open Scaffold Runtime be a sibling product that consumes `.osc` packets rather than part of core?
