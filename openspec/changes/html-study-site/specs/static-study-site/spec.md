# Spec Delta

## Purpose

Provides the offline static HTML site shell that hosts all study content.

## ADDED Requirements

### Requirement: Works offline from the file system
The site SHALL be fully usable by opening `index.html` directly from disk, with no server, build step, or network access.

#### Scenario: Open without a server
- **WHEN** the learner opens `index.html` via a file:// URL
- **THEN** all pages, styles, quizzes, search, and progress features work

### Requirement: Consistent navigation
Every page SHALL use a documentation layout with a top bar, a left sidebar linking to the index, every domain, the cheat-sheets, the labs, and the gap map (grouped by section, current page highlighted), and, on content pages, a right-hand table of contents built from the page headings.

#### Scenario: Moving between pages
- **WHEN** the learner is on any page
- **THEN** they can reach any other page in one click from the sidebar

#### Scenario: Jumping within a page
- **WHEN** the learner is on a long content page
- **THEN** the "On this page" list links to each section and highlights the one in view

#### Scenario: Narrow screen
- **WHEN** the viewport is narrow
- **THEN** the sidebar collapses behind a menu button and the page remains usable

### Requirement: Browser-local persistence
Quiz results, progress checkmarks, and gap map attempts SHALL be saved in the browser's local storage, and SHALL NOT be sent over the network.

#### Scenario: Return later
- **WHEN** the learner reloads or revisits the site in the same browser
- **THEN** their saved quiz results, progress, and gap map attempts are still shown

### Requirement: Readable on screen and in print
The site SHALL be responsive and SHALL support a dark mode that follows the system setting.

#### Scenario: Dark system theme
- **WHEN** the system prefers a dark color scheme
- **THEN** the site renders with a dark theme with readable contrast
