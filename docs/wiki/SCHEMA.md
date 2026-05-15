# Open Scaffold Project Wiki Schema

## Domain

This wiki contains public-safe compiled knowledge about Open Scaffold as a body of work: project ontology, durable design principles, conceptual comparisons, and reusable query answers.

It is not the source of truth for live execution. Plans, issues, PRs, evidence, release notes, and current state stay in their existing project surfaces.

## Boundaries

- Product behavior and user instructions -> `README.md`, `docs/`, CLI help, examples.
- Work state and acceptance criteria -> `.osc/plans/`, GitHub Issues, GitHub PRs.
- Verification and outcome receipts -> `.osc/releases/`, evidence files, CI, PR discussion.
- Compiled project knowledge -> `docs/wiki/`.
- Private owner context -> private owner-level systems, linked only through neutral summaries when public-safe.

## Public Wording Rule

Public repo artifacts should avoid personal-name references. When owner perspective matters, use neutral wording such as "the owner" or "the project owner".

## Conventions

- File names are lowercase and hyphenated.
- Every wiki page starts with YAML frontmatter.
- Use `[[wikilinks]]` for internal links.
- Every non-raw page should link to at least two related pages once the wiki has enough pages.
- When updating a page, bump `updated`.
- Every new page must be added to `index.md`.
- Every meaningful action must be appended to `log.md`.
- Keep pages scannable; split pages over roughly 200 lines.

## Frontmatter

```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | summary
tags: []
sources: []
confidence: high | medium | low
contested: false
---
```

## Tag Taxonomy

- open-scaffold
- project-wiki
- compiled-knowledge
- source-of-truth
- workflow
- agent-orchestration
- evidence
- governance
- public-boundary

## Page Thresholds

Create or update a page when knowledge is durable enough that a future contributor or agent should not re-derive it from scratch.

Do not create pages for:

- active TODOs;
- current PR state;
- raw agent transcripts;
- private owner context;
- one-off implementation details better suited for product docs or release evidence.
