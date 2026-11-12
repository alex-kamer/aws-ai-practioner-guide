# Proposal

## Why

The repo is empty, and the author (baseline AWS AI knowledge) has a practice exam in 2 days and the real AWS Certified AI Practitioner (AIF-C01) exam within 2 weeks. They don't know their weak areas, so the repo needs fast-to-use study material plus a way to turn practice-exam results into a targeted study plan.

## What Changes

- Add static study content organized by the five AIF-C01 domains (with exam weights).
- Add quick-reference cheat-sheets: AWS AI/ML service matching and a glossary of core terms.
- Add a gap-map tracker that is filled in from practice-exam results and drives what to study next.
- Add a small set of cost-capped, hands-on Bedrock labs focused on Domain 3.
- Add a README with a 2-week study schedule tied to the practice exam and real exam dates.
- Content is written for the user; only the gap map is left for them to fill in.
- Out of scope: Copilot tutoring (agent prompts/skills), to be a later change that reads the gap map; dynamic quizzes; exam registration logistics.

## Capabilities

### New Capabilities
- `domain-study-notes`: Concise notes per AIF-C01 domain covering the official task statements, each with a self-check question list.
- `service-cheatsheets`: Service-matching cheat-sheet and glossary for fast review.
- `gap-tracking`: Template and process for recording practice-exam results by domain/topic and deriving a prioritized study list.
- `hands-on-labs`: Cost-capped Bedrock-centered labs with prerequisites, steps, cost warnings, and cleanup.
- `study-schedule`: README-level schedule covering the 2-day pre-practice-exam skim and the 2-week plan to the real exam.

### Modified Capabilities

## Impact

- New markdown files only at the repo root (`README.md`, `domains/`, `cheatsheets/`, `labs/`, `tracker/`).
- No code or dependencies. Labs use the user's AWS account and may incur small costs, which the labs must call out.
