# Spec Delta

## MODIFIED Requirements

### Requirement: Gap map template
The repo SHALL contain an interactive gap map page under `tracker/` where the learner enters per-domain score, missed topics, and confidence, saved in the browser.

#### Scenario: Recording practice-exam results
- **WHEN** the learner finishes a practice exam
- **THEN** they can enter each domain's score and missed topics in the gap map and the entries persist

### Requirement: Prioritized study list
The gap map SHALL automatically calculate each domain's priority as (100 - score%) x exam weight and rank the domains, updating as scores are entered.

#### Scenario: Choosing what to study next
- **WHEN** the learner has entered scores for domains
- **THEN** the page shows the ranked domains with priority values, highest first

### Requirement: Repeated attempts
The gap map SHALL let the learner add and switch between multiple attempts without overwriting earlier ones.

#### Scenario: Second practice exam
- **WHEN** the learner adds a second attempt
- **THEN** the first attempt's data remains and both can be viewed
