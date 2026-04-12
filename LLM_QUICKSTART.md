# LLM Quickstart — open-scaffold

You are an LLM helping a human bootstrap a new project from the [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold) template. Walk the human through the steps below interactively — confirm each step with them before proceeding to the next.

## Capability check

Before anything else, determine whether you can execute shell commands in this session.

- **If yes** (coding agent: Claude Code, Cursor, Codex CLI, Aider, etc.) — run the commands yourself and report output.
- **If no** (chat LLM: ChatGPT, Claude.ai, Gemini web, etc.) — print each command in a fenced block and wait for the user to paste results back before continuing.

State which mode you're in before step 1.

## Step 1 — Clone the template

Ask the user for a project name, then run:

```bash
gh repo create <name> --template jeanclaudevibedan/open-scaffold --clone
cd <name>
```

Fallback if `gh` is unavailable:

```bash
git clone https://github.com/jeanclaudevibedan/open-scaffold <name>
cd <name>
```

## Step 2 — Bootstrap the mission

Run `./bootstrap.sh`. It asks three questions:

1. What is this project? (one sentence)
2. What should it achieve? (comma-separated goals)
3. What is it NOT? (comma-separated non-goals)

Relay the user's answers into the script. When it finishes, confirm `MISSION.md` no longer contains the marker `<!-- mission:unset -->`.

## Step 3 — Verify the floor

Run `./verify.sh --quick` and report the exit code. It is expected to fail on the "no plan file" check — that is fine. The next session fixes it.

## Step 4 — Hand off

Ask the user two questions:

1. Which runtime are you using?
   - **OMC** ([oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) installed)
   - **Plain agent** (Claude Code, Cursor, Codex, Aider — no OMC)
   - **Fully manual** (no agent)
2. Is your first task clear in your head, or still fuzzy?

Print the matching handoff verbatim, then stop:

| Runtime | Task state | Handoff |
|---|---|---|
| OMC | Clear | `Run /autopilot with: write a plan in .omc/plans/ for <task> using the handoff template.` |
| OMC | Fuzzy | `Run /deep-interview — it will interview you to clarity, then write the plan for you.` |
| Plain agent | Clear | `Tell your agent: "Write a plan in .omc/plans/ for <task> using .omc/plans/handoff-template.md."` |
| Plain agent | Fuzzy | `Tell your agent: "Interview me until you understand exactly what to build, then write a plan in .omc/plans/ using .omc/plans/handoff-template.md."` |
| Manual | Either | `Run: cp .omc/plans/handoff-template.md .omc/plans/my-first-task.md — then open it in your editor and fill in the 7 sections.` |

## Stop condition

Do **not** write the first plan yourself. That is the next session's job. Your scope ends at a defined mission, a passing `--quick` verify (except the expected plan-file failure), and the printed handoff.
