# study-schedule Specification

## Purpose
Gives the learner a day-by-day plan from the practice exam to the real exam, and an entry point to all repo material.

## Requirements

### Requirement: README entry point
The repo SHALL have a README that explains the study loop and links to every domain file, cheat-sheet, lab, and the gap map.

#### Scenario: First visit
- **WHEN** the learner opens the README
- **THEN** they can reach every study resource from it

### Requirement: Two-phase schedule
The README SHALL include a schedule with a pre-practice-exam phase (cheat-sheet skim, about two days) and a post-practice-exam phase (targeted study driven by the gap map, up to the real exam in about two weeks).

#### Scenario: Before the practice exam
- **WHEN** the practice exam is within two days
- **THEN** the schedule tells the learner to skim the cheat-sheets and not to start labs yet

#### Scenario: After the practice exam
- **WHEN** the learner has filled in the gap map
- **THEN** the schedule tells them to spend study days on the ranked weak domains, and to take one or two timed full mock exams before the real exam

### Requirement: Adjustable dates
The schedule SHALL be expressed in relative days (for example, "Day 3") so it stays valid if exam dates shift.

#### Scenario: Exam date moves
- **WHEN** the real exam date changes
- **THEN** the learner can compress or extend the schedule without rewriting it
