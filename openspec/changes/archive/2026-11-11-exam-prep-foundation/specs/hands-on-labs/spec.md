# Spec Delta

## Purpose

Gives the learner short hands-on exercises in their own AWS account, mainly with Amazon Bedrock, to reinforce Domain 3 concepts without unexpected cost.

## ADDED Requirements

### Requirement: Lab structure
Each lab SHALL state its exam domain, prerequisites, estimated time (about one hour or less), estimated cost, numbered steps, and a cleanup section.

#### Scenario: Starting a lab
- **WHEN** the learner opens a lab
- **THEN** they can see prerequisites, time, and cost before running any step

### Requirement: Cost safeguards
Each lab SHALL warn about billable resources and SHALL include cleanup steps that remove every resource it creates.

#### Scenario: Finishing a lab
- **WHEN** the learner completes the cleanup section
- **THEN** no billable resources created by the lab remain

### Requirement: Domain 3 coverage
The labs SHALL together cover foundation model prompting, a knowledge base (RAG), and guardrails.

#### Scenario: Lab set review
- **WHEN** the learner reviews the list of labs
- **THEN** there is a lab for each of prompting, RAG, and guardrails

### Requirement: Concept link
Each lab SHALL end with a short explanation of which exam concepts the exercise demonstrated.

#### Scenario: Tying a lab to the exam
- **WHEN** the learner finishes a lab
- **THEN** they see the exam concepts it reinforced and the matching domain notes
