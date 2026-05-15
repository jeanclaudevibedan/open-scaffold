# Release / Evidence Note: Runtime profiles v0

Date: 2026-05-15

## Summary

Runtime selection is now schema-backed and project-extensible without changing the core spawning boundary. This slice adds runtime profile v0: built-in runtime profiles, project-local custom profiles, read-only runtime profile CLI commands, and run-packet profile metadata.

## Traceability

- Roadmap item: `ROADMAP.md` — Milestone 9 runtime profile follow-up.
- Plan: `.osc/plans/done/034-runtime-profiles-v0.md`.
- Task: `t_fba215ae` — Runtime profiles v0.
- Branch: `runtime/runtime-profiles-v0`.
- PR: pending owner review.
- Run packet: not generated; this was a direct CLI/docs/schema implementation after read-only architecture consultation.

## Evidence

- `src/runtimes.ts` defines `open-scaffold.runtime-profile.v1`, built-in profiles, project-local profile loading from `.osc/runtimes/*.json`, and validation.
- `src/cli.ts` adds `osc runtimes list`, `osc runtimes show <id>`, and `osc run <plan> --runtime <id>` resolution through runtime profiles.
- `src/artifacts.ts` adds `profileId` and `profileSource` to `runtimeSelection` in `run.json`.
- `docs/RUNTIME_PROFILES.md` documents the runtime profile contract, project-local customization, and no-install/no-spawn boundary.
- `docs/examples/runtime-profiles/company-review-bot.json` gives a user-defined profile example.
- Runtime docs and roadmap now point to runtime profiles as the v0 interoperability layer.

## Boundary decisions

- Built-in profiles are data, not certified runtime integrations.
- Project-local profiles are allowed in `.osc/runtimes/*.json`.
- Built-in profile ids cannot be overridden by project-local profiles.
- Profiles with `install.auto !== false` are rejected.
- Profiles with `launch.spawning !== false` are rejected.
- Open Scaffold core still does not install, authenticate, launch, supervise, or spawn runtimes.
- GSD and future frameworks can be represented as user-defined profiles, but are not claimed as certified/built-in integrations without conformance evidence.

## Verification

Final verification before PR:

```text
git diff --check          -> passed
./verify.sh --strict      -> 10 pass, 0 fail, 0 warn
npm run osc -- verify     -> PASS, 0 warnings
npm test                  -> 8 test files passed, 69 tests passed
npm run build             -> passed
```

## Outcome

Runtime selection is now a registry/profile contract rather than hard-coded CLI special cases. This creates the safe next step toward runtime interoperability while preserving source-of-truth, evidence, and approval boundaries.

## Follow-up

- Consider per-user XDG runtime profile scope only after project-local profiles prove useful.
- Add built-in/certified status for more frameworks only after conformance evidence exists.
- Keep runtime installation, launch, network registries, marketplace behavior, and credential handling behind separate safety-reviewed plans.
