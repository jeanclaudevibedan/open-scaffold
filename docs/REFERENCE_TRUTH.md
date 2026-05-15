# Public Reference Truth Labels

Open Scaffold deliberately mentions external coordinators, runtime harnesses, and operator surfaces. Those names are examples and boundary references, not hidden product dependencies.

Use these labels when public docs mention a tool whose availability or role could be misunderstood:

| Label | Meaning |
|---|---|
| **Public example** | Publicly reachable tool, service, or repository used as an example. |
| **Private deployment example** | A private installation or dogfood environment that proves a pattern, but is not part of Open Scaffold core and is not required to adopt it. |
| **Adapter candidate** | A future or optional adapter direction; the Open Scaffold core contract is stable enough to describe, but no core runtime launch dependency is implied. |
| **Runtime lane** | A tool that can execute a bounded run packet outside Open Scaffold core. It is not canonical project truth. |
| **Operator surface** | A chat, PR, CLI, dashboard, or notification layer that shows status or asks questions. It is not the source of truth. |
| **Historical/unmigrated repository** | A public repository that exists under an older owner or namespace. Treat links as historical until an owner-approved migration happens. |

## Current public references

| Reference | Label | Public truth |
|---|---|---|
| GitHub Issues / PRs / CI | Public example | GitHub can own public work artifacts and review gates. Open Scaffold does not replace it. |
| Discord / Slack / Telegram / CLI dashboards | Operator surface | These can expose status and approvals, but repo files and GitHub remain durable truth. |
| Hermes / Hermes Kanban | Private deployment example / coordinator example | Mentioned as one coordinator pattern. Not required, bundled, or a dependency of Open Scaffold. |
| Claw / OpenClaw | Runtime lane / coordinator example | Mentioned as a possible agent lane. Not bundled or required. |
| OMC / oh-my-claudecode | Runtime lane / adapter candidate | Claude Code-oriented harness lane that can consume Open Scaffold run packets through an adapter outside core. |
| OMX / oh-my-codex | Runtime lane / adapter candidate | Codex-oriented harness lane that can consume Open Scaffold run packets through an adapter outside core. |
| `open-scaffold-omc` / `open-scaffold-omx` under `jeanclaudevibedan` | Historical/unmigrated repository | Public repositories exist at the older namespace. They are not core dependencies and should be relabeled if migrated. |
| Command Center / private cockpit examples | Private deployment example | Owner-local dogfood evidence only. Do not copy private state, auth assumptions, or project-specific machinery into public core. |

## Writing rule

When adding or editing docs, keep the distinction explicit:

```text
Open Scaffold core packages and preserves truth.
Coordinators choose and route work.
Runtime lanes execute outside core.
Operator surfaces show status and collect approvals.
Private dogfood examples prove patterns but are not adoption requirements.
```
