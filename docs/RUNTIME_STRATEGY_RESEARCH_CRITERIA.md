# Runtime Strategy Research Criteria

This document defines the shared research brief for Open Scaffold Milestone 16. Use it when assigning one researcher, agent, or terminal session to evaluate a specific framework, runtime, harness, task system, workflow engine, CI runner, or evidence/audit product.

The purpose is comparability. Each framework report should return the same shape of evidence so the consolidation pass can compare options without relying on hype, memory, or inconsistent reviewer taste.

## Research purpose

Evaluate whether the target framework should influence Open Scaffold's runtime strategy:

- remain runtime-neutral / non-spawning;
- add a thin opt-in `osc spawn` adapter invoker;
- move spawning into adapter packages;
- create a sibling native runtime product.

## Hard constraints

- Do not propose adding framework-specific dependencies to Open Scaffold core.
- Do not implement anything during research.
- Focus on architecture, product model, safety, governance, and evidence fit.
- Distinguish what the framework actually does today from marketing claims.
- Cite source files, docs, URLs, examples, or issues for every important claim.
- Treat all runtime/spawner moves as product and architecture decisions requiring evidence.

## Worker brief template

```text
Research target: <framework/tool/product name>
Repository / docs URL: <url>
Research purpose:
Evaluate whether this framework should influence Open Scaffold Milestone 16 runtime strategy:
- stay runtime-neutral / non-spawning
- add thin opt-in `osc spawn`
- move spawning into adapter packages
- create a sibling native runtime product

Hard constraints:
- Do not propose adding framework-specific dependencies to Open Scaffold core.
- Do not implement anything.
- Focus on architecture/product/security evidence, not hype.
- Distinguish what the framework actually does today from marketing claims.
- Cite source files/docs/URLs for every important claim.

Return a structured report with these sections:

1. Executive summary
- What is this framework in one sentence?
- What problem does it solve?
- Is it primarily a runtime, orchestrator, workflow engine, agent framework, CLI harness, task system, CI runner, or evidence/audit layer?
- Initial relevance to Open Scaffold: high / medium / low.

2. Product model
- Who is the apparent target user?
- What is the core workflow?
- What is the “unit of work”?
  Examples: task, run, agent, workflow, session, job, step, graph node, issue, PR.
- Does it assume a chat UI, CLI, API, repo files, web dashboard, daemon, hosted service, or local process?
- What does it make easy that Open Scaffold currently does not?

3. Architecture model
- Main components.
- How work is declared.
- How work is executed.
- How state is stored.
- How outputs/artifacts are captured.
- Whether it supports local execution, hosted execution, or both.
- Whether it has a plugin/adapter model.
- Whether it can consume an external task/run packet like `.osc/runs/<run_id>/run.json`.

4. Runtime/spawning behavior
- Does it spawn agents/processes directly?
- If yes:
  - how are commands/processes launched?
  - how are logs captured?
  - how are failures handled?
  - how are long-running jobs supervised?
  - how are cancellations handled?
- If no:
  - what layer is expected to execute work?
- Is spawning core to the product or optional?

5. Safety and governance
Evaluate explicitly:
- credential handling
- environment allowlists / sandboxing
- workspace isolation
- process lifecycle supervision
- commit/push/merge authority
- human approval gates
- audit logs / traceability
- failure states
- rollback/recovery
- prompt-injection or untrusted-input boundaries
- suitability for regulated or compliance-sensitive SDLC

6. Evidence and black-box recorder fit
- Does it record durable evidence?
- Are logs structured or raw?
- Can another agent/human reconstruct what happened after the fact?
- Does it separate runtime logs from canonical project truth?
- Does it support IDs equivalent to `task_id`, `run_id`, `question_id`, PR, issue, evidence receipt?
- Does it improve or conflict with Open Scaffold’s repo-native black-box recorder thesis?

7. Fit against Open Scaffold options
Score each option from 1–5 and explain why:

A. Open Scaffold stays non-spawning; learn only from docs/examples.
B. Open Scaffold adds thin `osc spawn --adapter <name>` local invocation.
C. Spawning belongs in official adapter packages.
D. Open Scaffold Runtime becomes a sibling product.
E. This framework is irrelevant or strategically misleading.

8. Competitive lessons
- What should Open Scaffold copy conceptually?
- What should Open Scaffold avoid?
- What terminology is clearer than ours?
- What user experience is better than ours?
- What architectural boundary is better than ours?
- What looks dangerous, bloated, or incompatible?

9. Source-grounded findings
Include a table:

| Claim | Evidence/source | Confidence |
|---|---|---|

Use links to docs, README sections, source files, examples, or issues.

10. Recommendation
Answer directly:
- Should this framework affect Milestone 16? yes/no/partially
- If yes, what concrete decision should it influence?
- Does it push us toward no-spawn, thin spawn, adapter packages, or sibling runtime?
- What follow-up question should the consolidation pass answer?

11. Red flags / unknowns
- Missing docs
- Unclear license
- Unclear security model
- Abandoned repo
- Too much provider lock-in
- Too much hidden hosted state
- Unclear runtime authority
- Anything that would contaminate Open Scaffold core
```

## Expected report location

For parallel research runs, save one report per target framework:

```text
/tmp/open-scaffold-m16-research/<framework-slug>.md
```

If the reports become durable project evidence, promote the selected synthesis or source-grounded findings into a tracked Open Scaffold document or release/evidence note. Raw worker scratch files should not automatically become canonical project truth.

## Consolidation pass input

The consolidation pass should read all worker reports and produce a matrix that maps each framework back to the Milestone 16 strategy options:

| Framework | Category | Relevance | No-spawn | Thin `osc spawn` | Adapter package | Sibling runtime | Key lesson | Red flag |
|---|---|---:|---:|---:|---:|---:|---|---|

The final Milestone 16 recommendation should not be written until the comparative evidence, safety model, and product identity implications are explicit.
