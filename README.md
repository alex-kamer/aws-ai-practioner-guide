# AWS Certified AI Practitioner (AIF-C01) Study Guide

A self-contained study site for the AWS Certified AI Practitioner exam. It is plain HTML, CSS and JavaScript with no build step and no server. Content follows the official AIF-C01 exam guide (v1.4).

## Quick start

Open `index.html` in a browser (double-click it, or `open index.html`). Everything works from `file://`.

Your progress (quiz scores, checklists, practice-exam history, gap map) is saved in your browser's local storage. It is per browser and per machine, so use the gap map's JSON export if you want a backup.

## What's in the site

| Area | Where | What it does |
| --- | --- | --- |
| Domain notes | `domains/01..05-*.html` | In-depth notes, one section per official task statement, with exam tips, common traps, and key takeaways |
| Self-check questions | End of each domain page | Short-answer cards: reveal the answer, then mark "I got it" or "I missed it" |
| Multiple-choice practice | End of each domain page | Exam-style questions with instant feedback and explanations |
| Practice exam | `practice/exam.html` | Timed, domain-weighted mock exam with a per-domain score breakdown and review |
| Gap map | `tracker/gap-map.html` | Enter scores per domain and get a ranked study order |
| Cheat-sheets | `cheatsheets/` | AWS services mapped to use cases, and a glossary |
| Labs | `labs/` | Hands-on AWS exercises (see caveats) |
| Search | Cmd/Ctrl-K, or `/` | Full-text search across all pages |

## Suggested workflow

1. Skim the cheat-sheets, then take the practice exam as a diagnostic.
2. Click "Save to gap map" on the results page. The gap map ranks domains by `(100 - score%) x domain weight`.
3. Study the top-ranked domain's notes, then do its self-check and multiple-choice questions.
4. Retake the practice exam and repeat until your scores are consistently strong across all domains.

The home page has a two-phase schedule that assumes a practice exam first, then about two weeks to the real exam.

## Exam facts

- 65 questions (50 scored, 15 unscored), 90 minutes.
- Passing score is a scaled 700 / 1000, with compensatory scoring: you don't have to pass each domain on its own.
- Domain weights: D1 20%, D2 24%, D3 28%, D4 14%, D5 14%.

The practice exam reports a plain percentage. The real score is scaled, so a percentage is only a rough guide.

## Repository layout

```
index.html            Overview, domain progress, schedule
domains/              Five domain study pages
cheatsheets/          Services and glossary
labs/                 Three hands-on labs
practice/exam.html    Practice exam
tracker/gap-map.html  Gap map
assets/
  style.css           Docs-style theme (light and dark)
  app.js              Layout, sidebar, table of contents, search, quiz and progress logic
  mcq.js              Multiple-choice and practice-exam engine
  mcq/d1..d5.js       Question bank (one file per domain)
  gapmap.js           Gap map logic
  search-index.js     Generated search index (do not edit by hand)
tools/
  build-search-index.js  Regenerates the search index
openspec/             Specs and change history (OpenSpec)
```

## Editing content

- **Notes:** edit the HTML in `domains/`, `cheatsheets/` or `labs/` directly. Keep each task-statement heading's `data-task` checkbox, because the home-page progress bars read them.
- **Questions:** add entries to `assets/mcq/dN.js`. Each is `{ d, t, q, o: [4 options], a: correctIndex, e: explanation }`, where `t` is the task statement such as `"3.2"`. The practice exam picks them up automatically.
- **Search:** after changing any page text, regenerate the index. It needs Node.js and no dependencies:

  ```
  node tools/build-search-index.js
  ```

- **Home-page progress totals:** if you change the number of short-answer questions in a domain, update `data-questions` on that domain's card in `index.html`.

## OpenSpec

Requirements and design decisions live in `openspec/`. `openspec/specs/` holds the current capabilities, and `openspec/changes/` holds active and archived changes. This is project tooling and isn't needed to use the site.

## Caveats

- This is a study aid, not an official AWS resource. Content was written from the official exam guide, and the notes and questions have not been independently verified against current AWS documentation. Verify anything surprising.
- AWS services change often. Accuracy was last reviewed on 2026-11-12. Amazon Forecast, Fraud Detector and Kendra are closed to new customers, but the exam guide may still reference them. Some service names are the older ones, for example "Agents for Amazon Bedrock" is now "Amazon Bedrock Agents". Check the current AWS docs before relying on availability details.
- The questions are original practice items, not real exam questions.
- The labs have not been tested against the live AWS console, so steps and screens may be out of date. Labs can incur AWS charges, so follow each lab's cleanup steps.
- Browser local storage can be cleared by the browser, and some browsers treat `file://` pages differently. If you lose progress, restore the gap map from its JSON export.
