# Runtime Adapters

open-scaffold is the runtime-neutral core. It owns the project contract: mission, plans, amendments, verification, run artifacts, and prompt bundles under `.osc/`.

Adapters are optional engines that consume that contract.

## Generic core: `jeanclaudevibedan/open-scaffold`

Namespace: `.osc/`

Responsibilities:
- Parse missions, plans, amendments, acceptance criteria, and Execution Strategy sections.
- Generate prompt/artifact bundles with `osc`.
- Keep all outputs inspectable as files.
- Never spawn autonomous agents directly.

## OMC adapter: `jeanclaudevibedan/open-scaffold-omc`

Namespace: `.omc/`

Responsibilities:
- Integrate open-scaffold with oh-my-claudecode.
- Translate scaffold plan state into OMC-native `/team`, `/ultrawork`, `/ralph`, verification, and amendment flows.
- Shell out to `osc` for shared parsing and prompt/artifact generation where possible.
- Perform autonomous spawning through OMC, not through generic open-scaffold.

## OMX adapter: `jeanclaudevibedan/open-scaffold-omx`

Namespace: `.omx/`

Responsibilities:
- Integrate open-scaffold with oh-my-codex and Codex CLI.
- Follow OMX conventions: `.omx/` state, `AGENTS.md`, Codex skills/prompts, `.codex/hooks.json`, `$deep-interview`, `$ralplan`, `$team`, and `$ralph`.
- Shell out to `osc` for shared parsing and prompt/artifact generation where possible.
- Perform autonomous spawning through OMX/Codex team runtime, not through generic open-scaffold.

## Rule of thumb

`.osc` is the chassis. `.omc` and `.omx` are engines.

Do not put runtime-specific hook logic into generic open-scaffold. Put it in the adapter repo that owns that runtime.
