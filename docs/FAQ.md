# Extended FAQ — open-scaffold

Questions that didn't make the cut for the main README but are still worth answering. For the core questions, see the [README](../README.md#-questions-youre-probably-asking).

---

### Can I run this for 5 hours straight and come back to a finished product?

> No. Anyone who says their framework does that is selling you something. What you *can* do: write a plan, hand it to an autonomous adapter runtime such as [open-scaffold-omc](https://github.com/jeanclaudevibedan/open-scaffold-omc) with `/autopilot`/`/ralph`, or [open-scaffold-omx](https://github.com/jeanclaudevibedan/open-scaffold-omx) with `$team`/`$ralph`, and come back to mostly-done work that traces back to your acceptance criteria. The difference the scaffold makes is **recoverability** — because the plan is on disk, you can read what the agent did, compare against the ACs, and know exactly where to resume. Without it, a 5-hour run is a 5-hour black box.

### Does this reduce token usage / cost?

> Usually, yes — indirectly. Plans mean less context-stuffing ("remember yesterday when..."). Immutability means no back-and-forth about what was already decided. `verify.sh` catches methodology drift mechanically instead of via a review round. Not benchmarked, so treat it as a hypothesis — but the "wait, we already decided this" loops are the expensive ones, and the scaffold is designed to eliminate them.

### Will my agent actually follow the protocol, or will it just ignore the files?

> Depends on the agent and how you prompt it. Claude Code and Codex read [CLAUDE.md](../CLAUDE.md) and [AGENTS.md](../AGENTS.md) automatically. Cursor, Aider, and most others will too if you tell them to once. Compliance holds up because the instructions are direct and `verify.sh` is mechanical — not a judgment call. If your agent is the type that routinely ignores explicit instructions, no scaffold will save you.

### Why are CLAUDE.md and AGENTS.md hand-duplicated instead of generated from one source?

> Because a build script that breaks in six months is worse than two files that might drift in six months. Drift you notice on the next read; a broken generator rots the template silently. The paired-view header in each file tells you to mirror edits, and if drift happens three times in the first year, we revisit. ([Design choices](decisions/README.md))

### Isn't this just Agile / PRD-driven development with new vocabulary?

> Partially. The mission/plan/amendment loop is lifted from disciplined engineering practice — none of it is new. What *is* new: the protocol is designed so an agent can execute it mechanically. Plans are structured so they parse. Amendments are numbered so they order. `verify.sh` is a compliance check, not a process meeting. It's Agile for a workforce that reads markdown.

### How much time does this actually save me vs. just winging it?

> Not benchmarked, honestly. Treat any specific time-savings number as a hypothesis until you've measured it on your own workflow. What *is* observable: fewer "wait, I thought we decided X" moments, and sessions that resume in under a minute instead of fifteen.

### What if I'm bad at writing plans? Does this fall apart?

> No. The [handoff template](../.osc/plans/handoff-template.md) is a fill-in-the-blanks form with 7 sections. If you can answer "what am I trying to do, how will I know it worked, what's out of scope," you can write a plan. If you can't answer those, you probably shouldn't be coding yet — which is exactly the point.

### Is this just going to slow me down? I'm used to vibing.

> Yes — by about 15 minutes on day one. That's the tax. After that, it speeds you up because session two doesn't start with "OK so where were we..." You trade 15 upfront minutes for zero re-explanation cost forever. For anything you'll work on more than once, the trade is obvious.

### Can I adopt this mid-project, or is it only for new repos?

> Mid-project works fine. Copy the template files into your existing repo, write a `MISSION.md` describing what the project is *now* (not what it was when you started), and create your first plan for whatever you're working on next. Everything before adoption stays as-is; everything after gets the discipline.

### Does this work for non-code projects — writing, research, design?

> Yes. Swap "files to touch" for "deliverables" and "acceptance criteria" for "done means" — the rest maps cleanly. Mission definitions, immutable plans, amendments, and session handovers are writing-agnostic. Research projects arguably benefit *more* — their drift problem is worse, not better.

### What happens if my agent and the methodology disagree?

> The methodology wins, and the agent writes an ADR explaining why it thinks the rule is wrong. If the rule actually *is* wrong, the amendment protocol is how you fix it: propose a change, get it reviewed, write it down. What you don't do is silently ignore the rule.

### Can I customize the plan schema / folder layout / amendment rules?

> Yes. It's your fork. The handoff template is a starting point, not a law. Add a "Risks" section if your project needs one, rename folders if you want, bring your own ADR format. Just keep the immutability rule — that's the load-bearing one.

### Do I have to commit plans to git, or can I keep them local?

> You have to commit them. Immutability means "committed to version control." An uncommitted plan is a draft; a committed plan is a record. Uncommitted plans can be edited silently, which is exactly what the protocol exists to prevent.

### What power level will I achieve when using this?

> Over 9000, obviously.
>
> More usefully: you'll stop losing context between sessions, stop re-explaining constraints, and stop waking up to "what did I decide last Tuesday?" For a multi-session project, that's a bigger deal than it sounds.

### Who built this?

> [@jeanclaudevibedan](https://github.com/jeanclaudevibedan). Scoped, planned, implemented, reviewed, and shipped using the scaffold's own methodology.

### Is it production-ready, or a toy?

> Production-ready in the **methodology** sense — the rules are stable, the scripts work, the template boots in one session. Early in the **adoption** sense — very few people are using it yet. Expect the schema to stay backward-compatible; expect the tooling around it to grow.

### Was this built with AI? Isn't that ironic?

> Yes, and no. The point is that AI-assisted development needs discipline *more* than traditional development, not less — the failure modes (context loss, silent drift, scope creep) are amplified, not introduced, by AI. Dogfooding the methodology on itself is the tightest possible test loop.

### How stable is the methodology? Will the schema change next month?

> The core rules — plan immutability, amendment protocol, mission-first gating — are stable and won't break. The plan schema may gain optional sections. The scripts may grow flags. If anything breaks, you'll see it in a CHANGELOG and — because the scaffold eats its own dogfood — in an amendment file to the scaffold's own plans.

### What's the "I tried it and it didn't work" story?

> The most likely failure mode: you write the mission and the first plan, then never touch the methodology again. The files go stale, the amendment protocol becomes a "later" item, and you're back to winging it with extra paperwork on top. Fix: treat `verify.sh` as a habit, not a ceremony. If the check fails, fix it before moving on. If that sounds like too much work, this isn't for you — and that's a reasonable conclusion to reach.

### Do plans get stale and rot over time?

> Plans are *supposed* to get stale. That's the point of immutability — they're a record of what you decided *at the time*, not a living document. When the world changes, you write an amendment, not an edit. The mission-level changelog is your map of how the project's understanding has evolved over time.

### What if I have to pivot hard and the mission is now wrong?

> Rewrite `MISSION.md`, stamp the changelog with a "pivot" entry explaining why, and either amend the outstanding plans or mark them superseded. The protocol handles pivots fine — it just requires you to *document* them instead of silently changing direction. That documentation is the whole feature.
