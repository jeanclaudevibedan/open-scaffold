# 0001 — Paired views (CLAUDE.md / AGENTS.md) are duplicated manually

## Status
Accepted

## Context
The open-scaffold template must present the same project facts to multiple agent CLIs (Claude Code, Codex CLI, Antigravity Gemini) in the file format each tool reads natively. Claude Code reads `CLAUDE.md`; Codex and most other agents read `AGENTS.md`. The content is near-identical; only the formatting conventions differ.

Three sync mechanisms were considered: (a) manual duplication with a header contract, (b) a generator script that produces AGENTS.md from CLAUDE.md (or vice versa) as a build step, (c) a shared fragment file included into both via markers and hydrated by a build script.

## Decision
Both files are **hand-authored duplicates** with a paired-view header comment at the top of each file stating that edits here MUST be mirrored in the other file and pointing at this ADR. No generator, no symlink, no build step. The contract is social, not mechanical, and documented in this record so that future readers understand why the duplication exists.

When editing either file, the author is expected to immediately mirror the change into the other. Drift, if it happens, is caught on the next read — not by tooling.

## Consequences

**What becomes easier:**
- Zero build dependencies. Any tool, any editor, any OS can read and edit these files.
- The template survives 6+ months of neglect without rotting — there is no script to break.
- Forks and template instantiations inherit the contract trivially.
- Both files remain native to their consuming agent's expectations; neither is a stub or include-pointer.

**What becomes harder:**
- Drift risk relies on human discipline. The first time an author edits one file at 11pm on a Tuesday and forgets the other, the files disagree.
- There is no automated alarm when drift happens. A reader must notice.

**Trade-off accepted:** Durability-under-neglect beats drift-prevention-with-machinery. This aligns with the open-scaffold principle "plain text, plain bash" and "shape over enforcement." The cost of drift is one inconsistent answer from an agent, which is recoverable by re-reading and re-editing. The cost of a broken generator script is silent template bit-rot, which is not.

**Revisit trigger:** if drift occurs three or more times in the first year of using this template, file a new ADR superseding this one and introduce a generator or lint step.
