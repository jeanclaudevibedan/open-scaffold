# LLM Quickstart — open-scaffold

You are an LLM helping a human bootstrap a new project from the [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold) template. Walk the human through the steps below interactively — confirm each step with them before proceeding to the next.

## Capability check

Before anything else, determine whether you can execute shell commands in this session.

- **If yes** (coding agent: Claude Code, Cursor, Codex CLI, Aider, etc.) — run the commands yourself and report output.
- **If no** (chat LLM: ChatGPT, Claude.ai, Gemini web, etc.) — print each command in a fenced block and wait for the user to paste results back before continuing.

State which mode you're in before step 1.

## Step 1 — Clone the template

**Before running any clone command, ask the user what they want to name their project.** The name becomes the folder name, and renaming it after the clone is awkward — you'd have to `cd ..`, rename, `cd` back, and re-run anything that already executed. Do not proceed until you have a name. If the user has no preference, suggest `my-project` as a placeholder and confirm before using it.

Then run (replacing `<name>` with the project name you just collected — not the literal string `open-scaffold`):

```bash
gh repo create <name> --template jeanclaudevibedan/open-scaffold --clone
cd <name>
```

Fallback if `gh` is unavailable:

```bash
git clone https://github.com/jeanclaudevibedan/open-scaffold <name>
cd <name>
```

## Step 2 — Initialize the scaffolding

Run `./bootstrap.sh`. The script ensures the lazy directories exist (`.scaffold/state/`, `.scaffold/research/`) and stamps today's date into MISSION.md's changelog.

**What happens to MISSION.md depends on how bootstrap was invoked:**

- **Interactive (human running this quickstart themselves in a real terminal, or a chat-LLM telling them to):** bootstrap.sh asks three questions — *What is this project?*, *What should it achieve?*, *What should this project NOT do?* — with an example under each. The user can press Enter to skip any question. After the prompts, MISSION.md contains their answers or TODO placeholders, and the `<!-- mission:unset -->` marker is removed.

- **Non-interactive (coding agent invoking the script via a non-TTY shell — typical for Claude Code, Cursor, Codex CLI, Aider):** bootstrap.sh's interactive prompts are skipped by design. The gate is `[ -t 0 ]` at [bootstrap.sh:17](bootstrap.sh#L17), which is false when an agent runs the script. MISSION.md will still contain the `<!-- mission:unset -->` marker. **This is expected — don't try to work around it.** The downstream session in Step 4 elicits the mission conversationally. It has more context than a bash `read -r` loop and can ask follow-ups, give examples, and iterate — it's a genuinely better interviewer than bootstrap.sh can be.

Whichever path fired, confirm bootstrap.sh exited 0 before proceeding.

## Step 3 — Verify the floor

Run `./verify.sh --quick` and report the exit code to the user.

- **If Step 2's interactive path fired:** `verify.sh --quick` should fail on "no plan file" only (mission is defined, the first plan doesn't exist yet). Expected — the next session writes the first plan.
- **If Step 2's non-interactive path fired:** `verify.sh --quick` will fail on "mission undefined" (progressive disclosure — the plan check is gated behind the mission check, so it won't even run yet). Expected — Step 4 elicits the mission.

Either way, report the failing check and proceed to Step 4. A passing `--quick` here would be surprising — if it happens, stop and investigate.

## Step 4 — Hand off

Ask the user two questions:

1. Which runtime are you using?
   - **OMC** ([oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) installed)
   - **Plain agent** (Claude Code, Cursor, Codex, Aider — no OMC)
   - **Fully manual** (no agent)
2. Is your first task clear in your head, or still fuzzy?

Print the matching handoff verbatim, then stop. Each handoff assumes the downstream session may inherit a `mission:unset` MISSION.md and tells it to elicit the mission if needed.

| Runtime | Task state | Handoff |
|---|---|---|
| OMC | Clear | `Run /autopilot with: "If my MISSION.md is still unset, elicit it from me first (one sentence on what this project is; main outcomes; adjacent features I'm choosing NOT to build). Stamp MISSION.md with my answers. Then write a plan in .scaffold/plans/ for <task> using .scaffold/plans/handoff-template.md."` |
| OMC | Fuzzy | `Run /deep-interview. Tell it your MISSION.md is unset AND your first task is fuzzy — it will cover both in one interview, stamp MISSION.md, and write the plan.` |
| Plain agent | Clear | `Tell your agent: "My MISSION.md is unset. Ask me three things: (a) what is this project in one sentence, (b) main outcomes, (c) adjacent features I could plausibly build but am choosing not to (good non-goals are adjacent, not unrelated — think 'recipe app: not a meal planner' rather than 'recipe app: not a television'). Update MISSION.md with my answers, then write a plan in .scaffold/plans/ for <task> using .scaffold/plans/handoff-template.md."` |
| Plain agent | Fuzzy | `Tell your agent: "My MISSION.md is unset AND my first task is fuzzy. Interview me until both are clear — mission (what, main outcomes, adjacent non-goals) and task (specific enough for a 7-section plan). Update MISSION.md, then write the plan in .scaffold/plans/ using .scaffold/plans/handoff-template.md."` |
| Manual | Either | `Open MISSION.md in your editor and fill in the three TODO sections by hand (if they are still there — interactive bootstrap may have replaced them). Then run: cp .scaffold/plans/handoff-template.md .scaffold/plans/my-first-task.md — open the copy and fill in its 7 sections.` |

## Stop condition

Do **not** write the first plan yourself. Do **not** stamp MISSION.md yourself, even if it is still marked `mission:unset`. Both are the next session's job. Your scope ends at: a cloned repo in the user's chosen directory, bootstrap's changelog stamp applied, `verify.sh --quick` honestly reported, and the printed handoff. Then stop.
