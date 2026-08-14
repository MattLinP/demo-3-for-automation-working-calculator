# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This repo is **single-context**.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the glossary / ubiquitous language.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Current layout:

```
/
├── CONTEXT.md
└── docs/adr/
    ├── 0001-two-files-no-build.md
    └── 0002-percent-means-divide-by-100.md
```

If this repo ever splits into multiple bounded contexts, the layout becomes a root `CONTEXT-MAP.md` pointing at one `CONTEXT.md` per context (`src/<context>/CONTEXT.md`), with `docs/adr/` at the root for system-wide decisions and `src/<context>/docs/adr/` for context-scoped ones. Read `CONTEXT-MAP.md` first when it exists, then each `CONTEXT.md` relevant to the topic.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (percent means divide by 100) — but worth reopening because…_
