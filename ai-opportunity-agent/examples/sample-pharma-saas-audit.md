# Sample Output: Pharma Research SaaS AI Opportunity Audit

## Executive Summary

The strongest near-term AI opportunity is an AI-assisted document review and study setup copilot. The workflow is frequent, document-heavy, time-consuming, and currently dependent on manual extraction, cross-checking, and repeated data entry.

Recommended first pilot:

**Protocol-to-study setup assistant**

The assistant extracts key protocol details, proposes study setup fields, highlights missing information, and requires user approval before saving anything to the system.

## Top Opportunities

| Rank | Workflow | AI opportunity | Feature type | Bucket |
|---:|---|---|---|---|
| 1 | Study setup | Extract protocol fields and pre-fill setup form | Extractor + copilot | Quick win |
| 2 | SOP search | Answer questions from approved SOPs | Search assistant | MVP candidate |
| 3 | Review checklist | Detect missing compliance fields | Validator | MVP candidate |
| 4 | Status reporting | Draft study progress summaries | Report generator | Quick win |
| 5 | Data review | Highlight unusual values or missing records | Anomaly detector | Strategic bet |

## Human-In-The-Loop Control

| AI action | Human control | Approval needed | Audit log |
|---|---|---|---|
| Extract fields from protocol | Review and edit extracted fields | Yes | Yes |
| Suggest missing setup fields | Accept, reject, or mark not applicable | Yes | Yes |
| Answer SOP questions | View cited source section | No for viewing, yes for action | Search log optional |
| Draft status report | Edit before sending | Yes | Yes |

## MVP Recommendation

Build a narrow assistant for one high-volume study setup workflow.

MVP scope:

- upload or select protocol
- extract key entities
- map extracted values to setup form
- show source references
- allow user edit and approval
- save only after explicit confirmation
- log extracted value, source, editor, and approval timestamp

Success metrics:

- setup time reduction
- percentage of fields pre-filled
- correction rate
- user trust score
- error reduction
- manual review time reduction

