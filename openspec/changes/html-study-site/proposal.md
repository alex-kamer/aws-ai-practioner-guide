# Proposal

## Why

The study material is plain markdown, which is hard to self-test with and hard to navigate. The learner wants a nicer, interactive reading experience: quizzes, an auto-calculating gap map, search, and progress tracking.

## What Changes

- Replace all markdown study content (README, domains, cheat-sheets, labs, gap map) with styled HTML pages that use shared CSS and JavaScript. The `.md` study files are removed (**BREAKING** for any links to them).
- Self-check questions become interactive: reveal the answer, mark right/wrong, and see a score per domain.
- The gap map becomes an interactive page that calculates the ranking, supports multiple attempts, and saves in the browser.
- Add site-wide search and a per-domain progress checklist, both saved in the browser.
- Works by opening `index.html` directly (no server, no install, no network).
- Documentation-style layout (Mintlify-like): top bar, left sidebar grouped by section, right-hand "On this page" table of contents, card grids, callouts, and a Cmd/Ctrl-K search dialog. Built with custom CSS/JS, with no framework or build step.
- Out of scope: Copilot tutoring, backend or accounts, syncing progress across devices.

## Capabilities

### New Capabilities
- `static-study-site`: Offline static HTML site shell with shared styling, navigation, and browser-local persistence.

### Modified Capabilities
- `domain-study-notes`: Domain pages are HTML; self-check questions are interactive; per-domain progress checklist.
- `gap-tracking`: Gap map is interactive, auto-calculates the ranking, and persists attempts locally.
- `service-cheatsheets`: Adds site-wide search across all content.
- `study-schedule`: Entry point is the site index page instead of a README.

## Impact

- Removes `README.md`, `domains/*.md`, `cheatsheets/*.md`, `labs/*.md`, `tracker/gap-map.md`; adds `index.html`, `domains/*.html`, `cheatsheets/*.html`, `labs/*.html`, `tracker/gap-map.html`, `assets/` (CSS, JS, search index).
- Adds a small Node script to regenerate the search index; reading the site needs no Node.
