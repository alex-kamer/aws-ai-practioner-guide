# gap-tracking Specification

## Purpose
Lets the learner record practice-exam results by domain and topic and derive a prioritized list of what to study next.

## Requirements

### Requirement: Gap map template
The repo SHALL contain a gap map under `tracker/` with a per-domain table of score, missed topics, and confidence, left blank for the learner to fill in.

#### Scenario: Recording practice-exam results
- **WHEN** the learner finishes a practice exam
- **THEN** they can enter each domain's score and missed topics in the gap map

### Requirement: Prioritized study list
The gap map SHALL define how to rank domains for study, combining low score and high exam weight.

#### Scenario: Choosing what to study next
- **WHEN** the learner has entered scores for all domains
- **THEN** the gap map's ranking rule tells them which domain and topics to study first

### Requirement: Links from gaps to material
The gap map SHALL tell the learner which notes, cheat-sheet sections, or labs to use for each domain.

#### Scenario: Following up on a weak domain
- **WHEN** a domain is ranked as a priority
- **THEN** the gap map points to the matching domain file, cheat-sheet section, and relevant lab

### Requirement: Repeated attempts
The gap map SHALL support recording more than one practice-exam attempt so progress can be compared.

#### Scenario: Second practice exam
- **WHEN** the learner takes a second practice exam
- **THEN** they can add the results without overwriting the first attempt
