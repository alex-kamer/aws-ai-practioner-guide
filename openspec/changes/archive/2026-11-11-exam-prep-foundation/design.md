# Design

## Context

Greenfield markdown-only repo. See proposal.md for motivation. The learner has a practice exam in ~2 days and the real exam in ~2 weeks, so the content must be usable immediately and the repo must support refinement after the gap map is filled in.

## Goals / Non-Goals

**Goals:**
- Plain markdown, readable in the terminal, GitHub, or any editor.
- Layout that a later Copilot tutoring change can read without restructuring (stable paths, tabular gap map).

**Non-Goals:**
- No tooling, scripts, or quiz engine.
- No Copilot agents or skills in this change.

## Decisions

**Layout**
```
README.md                      entry point + schedule
domains/01..05-*.md            notes + self-check per domain
cheatsheets/services.md        service matching
cheatsheets/glossary.md
labs/01-prompting.md, 02-knowledge-base-rag.md, 03-guardrails.md
tracker/gap-map.md
```
- Domain files are numbered to match the official exam guide, so references stay unambiguous.
- Alternative considered: one big notes file. Rejected: harder to link from the gap map and to feed to Copilot later.

**Gap map as markdown tables, one section per attempt.** Alternative: CSV/spreadsheet. Rejected: not readable in plain review and awkward for Copilot. Ranking rule: priority = (100 - score%) x domain weight, highest first.

**Self-check answers at the bottom under a separate heading.** Keeps the questions usable as a quiz without extra tooling.

**Content source: the official AIF-C01 exam guide** for task statements and weights. The in-scope service list is taken from that guide. Content is checked against it, since AWS updates the guide.

**Labs are Bedrock-focused and limited to three.** Three labs keep the time cost low, and Domain 3 (28%) benefits most from hands-on work. The labs use on-demand pricing and no provisioned resources, and the RAG lab names the vector store cost and its cleanup.

## Risks / Trade-offs

- [Notes drift from the current exam guide] -> Cite the guide version/date at the top of each domain file.
- [Lab cost surprises, especially the knowledge base vector store] -> Show estimated cost up front and make cleanup mandatory and verifiable.
- [Time pressure before the practice exam] -> Write cheat-sheets and README first, then domain notes, then labs and the gap map.
- [Written content may contain errors] -> Mark as study aid and tell the learner to verify against AWS docs when a point seems off.
