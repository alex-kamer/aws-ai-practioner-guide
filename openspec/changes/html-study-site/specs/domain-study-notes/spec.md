# Spec Delta

## MODIFIED Requirements

### Requirement: One notes file per exam domain
The repo SHALL contain one notes page per AIF-C01 domain under `domains/` as HTML, five in total, each stating the domain's exam weight.

#### Scenario: All domains present
- **WHEN** the learner opens `domains/`
- **THEN** five HTML pages exist, one for each of the five AIF-C01 domains, with the exam weight in each

### Requirement: Self-check questions
Each domain page SHALL end with interactive self-check questions: the learner can reveal each answer, mark themselves right or wrong, and see a running score that is saved.

#### Scenario: Self-testing
- **WHEN** the learner reveals an answer and marks it right or wrong
- **THEN** the page updates the domain score and keeps it after a reload

## ADDED Requirements

### Requirement: Progress checklist
Each domain page SHALL provide a checkbox per task statement, and the index page SHALL show per-domain progress from those checkboxes.

#### Scenario: Marking a task statement studied
- **WHEN** the learner checks a task statement on a domain page
- **THEN** the index page shows updated progress for that domain
