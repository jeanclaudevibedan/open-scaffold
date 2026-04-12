# 0002 — Orchestration is agent-mediated, not runtime-native

## Status
Accepted

## Context
A deep external audit (April 2026) verified open-scaffold's claims against the actual OMC codebase and found one imprecise piece of FAQ wording: it implied that OMC's `/team` and `/ultrawork` slash commands natively parse a plan's `## Execution strategy` section. They do not. A direct search of the OMC repository for "Execution Strategy" returns zero results, and `skills/team/SKILL.md` / `skills/ultrawork/SKILL.md` document no such parser. The orchestration described in the FAQ actually happens via agent intermediation: an OMC-equipped Claude (or Codex, Gemini, etc.) reads the plan, parses the section per instructions in `CLAUDE.md` / `AGENTS.md`, and dispatches the parallel groups into the runtime's slash commands itself. The behavior is real and works in practice; only the literal phrasing was wrong.

## Decision
Document open-scaffold's orchestration model as **agent-mediated**. Specifically:

- The plan's `## Execution strategy` section is a contract for *agents*, not for runtime slash commands.
- The agent reads the section, parses the parallel groups, and dispatches work into `/team`, `/ultrawork`, or whatever the runtime exposes.
- The runtime is the worker; the agent is the dispatcher; the scaffold is the contract that lets them coordinate.
- `delegate.sh` is the only tool that implements a literal parser of the section, and it exists precisely so the same contract works for users with no agent at all.
- All marketing copy (README, FAQs, `docs/WORKFLOW.md`) must reflect this model and avoid wording that implies any specific runtime command natively parses the section.

## Consequences

**What becomes easier:**
- No coupling to a specific runtime's internals — the scaffold survives OMC renaming `/team` or replacing `/ultrawork` with something else.
- The same `Execution Strategy` section works for non-OMC agents (a plain Claude session, Codex, Gemini) without code changes.
- `delegate.sh` is now unambiguously the canonical literal-parser implementation; if any runtime ever wants to ship a native parser, `delegate.sh` is the reference.

**What becomes harder:**
- The story is one sentence longer to explain. "The agent reads it, the runtime runs it" is less catchy than "`/team` reads the section."
- Anyone hoping to wire open-scaffold into a non-agentic CI pipeline must either use `delegate.sh` (which does parse the section literally) or write their own parser.

**Trade-off accepted:** A slightly longer pitch in exchange for portability across runtimes and honesty about what each layer does. The audit caught the wording precisely because the literal version was easy to falsify; the agent-mediated version is the one that actually holds.

## Revisit trigger
If a runtime ever ships a native parser for the `## Execution strategy` section (e.g., OMC's `/team` learns to read the plan file directly), supersede this ADR with `000N` documenting the new dual-mode behavior. Until then, agent-mediation is the only model the scaffold claims to support.
