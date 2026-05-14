# Release / Evidence Note: First-touch adoption path

## Summary

This bundled slice compresses the README first-touch path, adds a 60-second viewer demo, and reduces jargon in the first-read surface while preserving deeper protocol links.

## Traceability

- Roadmap area: `ROADMAP.md` → Milestone 15 — Docs compression and public positioning.
- Task: Hermes Kanban `t_79619622`.
- Plans:
  - `.osc/plans/active/018-readme-compression.md`
  - `.osc/plans/active/022-sixty-second-demo.md`
  - `.osc/plans/active/026-vocabulary-compression.md`
- Branch: `docs/readme-compression-positioning`.
- Pull request: pending Daniel review/approval.
- Run packet: not generated; this was a direct Hermes docs pass.

## Evidence

- `README.md` is 6142 bytes, satisfying the `<= 6144` byte limit.
- `docs/EXAMPLES.md` contains a 60-second viewer demo covering mission, plan, verification, and evidence/status.
- README links to `docs/EXAMPLES.md#60-second-viewer-demo`.
- README introduces 10 Open Scaffold-specific first-touch terms before Quickstart:
  1. mission
  2. roadmap
  3. plans
  4. run packets — aliased on first use as `execution packages`
  5. evidence
  6. decisions
  7. handoff notes
  8. acceptance criteria
  9. verification
  10. amendments
- `docs/GLASS_COCKPIT_PROTOCOL.md` aliases `operator surfaces` as places people watch, steer, and approve work.
- `docs/SLICE_CLOSE_PROTOCOL.md` aliases `slice close` as the evidence-backed closeout decision.
- `docs/RUNTIME_BINDING_CONTRACT.md` aliases `runtime bindings` as execution adapters and `run packet` as a repo-written execution package.
- `docs/OPEN_SCAFFOLD_SYSTEM.md` aliases `operator surfaces` as places people watch, steer, and approve work.

## Vocabulary audit command

```bash
grep -RniE "glass cockpit|slice close|runtime binding|operator surface|run packet" README.md docs/*.md
```

Remaining deep-doc occurrences are retained as canonical protocol vocabulary after first-use explanation.

## Verification

Commands run on 2026-05-14:

```text
wc -c README.md                         -> 6142 README.md
./verify.sh --standard                  -> 6 pass, 0 fail, 0 warn
git diff --check                        -> passed
README first-touch term count           -> 10
README demo link check                  -> passed
docs/EXAMPLES.md demo artifact check    -> passed
```

## Outcome

Ready for Daniel review as one bundled adoption-facing PR. Out of scope for this bundle: mission rewrite, roadmap rewrite, runtime/spawn changes, comparison page, CLI packaging, and broad vocabulary overhaul.
