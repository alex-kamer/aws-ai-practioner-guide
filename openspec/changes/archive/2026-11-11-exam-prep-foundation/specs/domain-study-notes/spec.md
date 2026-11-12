# Spec Delta

## Purpose

Provides concise study notes for each AIF-C01 exam domain so the learner can review exam-relevant concepts and test themselves.

## ADDED Requirements

### Requirement: One notes file per exam domain
The repo SHALL contain one notes file per AIF-C01 domain under `domains/`, five in total, each stating the domain's exam weight.

#### Scenario: All domains present
- **WHEN** the learner opens `domains/`
- **THEN** five files exist, one for each of the five AIF-C01 domains, with the exam weight in each

### Requirement: Coverage of task statements
Each domain notes file SHALL have a section for every official task statement of that domain.

#### Scenario: Task statement lookup
- **WHEN** the learner looks for an official task statement of a domain
- **THEN** the domain's notes file has a section covering it

### Requirement: Self-check questions
Each domain notes file SHALL end with a self-check list of questions, with answers kept separate from the questions.

#### Scenario: Self-testing
- **WHEN** the learner finishes reading a domain file
- **THEN** they can answer the self-check questions and then compare against the provided answers
