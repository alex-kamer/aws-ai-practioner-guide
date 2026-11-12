# Design

## Context

Content currently lives in markdown files (see proposal.md). The learner reads only, in a browser, and wants quizzes, search, and persistent progress without running anything.

## Goals / Non-Goals

**Goals:** open `index.html` and everything works offline; hand-authored, readable HTML; no runtime dependencies.

**Non-Goals:** frameworks, bundlers, backend, cross-device sync.

## Decisions

**Layout**
```
index.html                      schedule, progress, links
domains/01..05-*.html
cheatsheets/services.html, glossary.html
labs/01..03-*.html
tracker/gap-map.html
assets/style.css  assets/app.js  assets/search-index.js
tools/build-search-index.js     (optional, regenerates search-index.js)
```
- **Plain HTML + one shared `app.js` + `style.css`.** Alternatives: a framework/SSG (rejected: build tooling for a read-only site) or a single-page JS app (rejected: less "real HTML", harder to edit).
- **Docs look, custom-built.** Three-column layout (sidebar, content, "On this page" TOC), sticky top bar, card grids on the index, callout styles, and a Cmd/Ctrl-K search dialog. Alternative: VitePress/Docusaurus. Rejected: needs a Node build and dev server (breaks double-click offline use) and makes markdown the source again.
- **Nav and TOC injected by `app.js`** from one list and the page's `h2`/`h3` headings, so pages aren't repeated. Each page sets a `data-root` attribute on `<body>` for relative paths (file:// can't use absolute paths).
- **Quiz markup is declarative:** `<ol class="quiz">` with `<li>` holding `<p class="q">` and `<div class="a">`. `app.js` adds reveal and right/wrong buttons and stores results in localStorage keyed by page and question index.
- **Progress:** `<input type="checkbox" data-task="1.1">` per task statement; stored by page and id; index reads the same keys.
- **Search:** file:// blocks `fetch`, so the index is a generated JS file (`window.SEARCH_INDEX`) loaded by a script tag. `tools/build-search-index.js` (Node, no dependencies) rebuilds it from the HTML. Alternative: runtime fetching (rejected: fails on file://).
- **Gap map:** inputs per domain; ranking computed in JS with the same formula; attempts stored as JSON in localStorage.
- **Dark mode** via `prefers-color-scheme` CSS variables.
- The `.md` study files are deleted once the HTML is verified.

## Risks / Trade-offs

- [Search index goes stale when content is edited] -> Document the one-line rebuild command in the index page footer; a stale index only affects search.
- [localStorage is per-browser and per-origin; file:// origins can differ between browsers] -> State this on the gap map page; offer JSON export/import.
- [Converting content may introduce errors] -> Convert mechanically from the existing md and compare section counts before deleting md.
