# Tasks

## 1. Site shell

- [x] 1.1 Create `assets/style.css` (docs layout: sidebar, content, right TOC, cards, callouts; responsive; dark mode via prefers-color-scheme) and `assets/app.js` (sidebar and TOC injection, Cmd/Ctrl-K search dialog, quiz and progress handling); verify by opening a test page in a headless browser with no console errors
- [x] 1.2 Create `index.html` with study loop, schedule, per-domain progress, and links to all pages; verify it renders and progress reads saved checkboxes

## 2. Content pages

- [x] 2.1 Convert the five `domains/*.md` into `domains/*.html` with task-statement checkboxes and interactive self-check quizzes; verify the section and question counts match the md
- [x] 2.2 Convert `cheatsheets/services.md` and `glossary.md` into HTML; verify all table rows are preserved
- [x] 2.3 Convert `labs/*.md` into HTML; verify each keeps prerequisites, cost, steps, cleanup, and concepts

## 3. Gap map and search

- [x] 3.1 Create `tracker/gap-map.html` with per-domain inputs, auto-ranked priorities, multiple attempts, and JSON export/import; verify the worked example (80/60/50/90/70) ranks D3, D2, D5, D1, D4
- [x] 3.2 Create `tools/build-search-index.js` and generate `assets/search-index.js`; verify searching "temperature" returns the expected pages

## 4. Cleanup and verification

- [x] 4.1 Delete the old `.md` study files (README, domains, cheatsheets, labs, tracker); verify no remaining links point to them and every relative link in the HTML resolves
- [x] 4.2 Run a headless-browser smoke test over all pages from file:// (nav, quiz scoring, progress persistence, search, gap map); verify it passes

## 5. Multiple-choice practice and practice exam

- [x] 5.1 Add a 110-question multiple-choice bank (`assets/mcq/d1-d5.js`, tagged by domain and task statement, with explanations) and render it at the end of each domain page with instant feedback and saved answers
- [x] 5.2 Add `practice/exam.html`: timed 65-question exam sampled by domain weight with shuffled options, question palette and flagging, per-domain results with review, run history, and a "Save to gap map" action; verify in a headless browser
