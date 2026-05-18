# Prompt 03: AI Opportunity Scoring

Act as an AI product manager and UX strategy lead.

Score each task from the workflow audit using this scale:

- 1 = low
- 2 = moderate-low
- 3 = moderate
- 4 = high
- 5 = very high

Positive factors:

- frequency
- time_cost
- manual_repetition
- business_impact
- data_readiness
- ai_feasibility

Negative factors:

- compliance_sensitivity
- change_complexity

Formula:

`opportunity_score = frequency + time_cost + manual_repetition + business_impact + data_readiness + ai_feasibility - compliance_sensitivity - change_complexity`

Classify:

- 20+ = Quick win
- 15-19 = MVP candidate
- 10-14 = Investigate
- below 10 = Defer

Return a ranked table with these columns:

- workflow
- task
- pain_point
- possible_ai_feature_type
- frequency
- time_cost
- manual_repetition
- business_impact
- data_readiness
- ai_feasibility
- compliance_sensitivity
- change_complexity
- opportunity_score
- recommendation_bucket
- reasoning

