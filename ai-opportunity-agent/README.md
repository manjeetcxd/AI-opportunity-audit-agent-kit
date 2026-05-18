# AI Opportunity Audit Agent

This kit defines an AI agent that helps product and UX teams discover AI opportunities, audit workflows, and generate implementation-ready recommendation reports for existing products and services.

It is designed for enterprise SaaS and regulated domains such as pharma research, healthcare operations, compliance-heavy platforms, and internal productivity tools.

## Agent Outcome

The agent produces a decision-ready report with:

- Workflow inventory
- User role and task analysis
- Manual effort and friction audit
- AI opportunity matrix
- Recommended AI/copilot/agentic features
- Human-in-the-loop control model
- Risk and governance matrix
- MVP roadmap
- Implementation notes for product, design, and engineering

## Recommended Use

1. Fill `templates/intake-questionnaire.md`.
2. Collect available product material:
   - product walkthrough notes
   - screenshots
   - SOPs
   - support tickets
   - user research notes
   - analytics exports
   - workflow documents
   - training documents
3. Use the prompts in order from `prompts/01-discovery.md` to `prompts/06-final-report.md`.
4. Use `scoring-model.json` to rank opportunities.
5. Place the final output into `templates/final-report-template.md`.

## Agent Roles

The agent should behave like a combined:

- Senior UX strategist
- Enterprise product discovery lead
- AI product manager
- Workflow automation analyst
- Compliance-aware design reviewer
- Implementation planning partner

## Best-Fit Use Cases

- "Where should we introduce AI in our existing SaaS product?"
- "Which workflows waste the most manual effort?"
- "Which AI features are safe enough for MVP?"
- "Can this workflow support an AI copilot or agent?"
- "What should we build first?"
- "What risks must be handled before engineering starts?"

## Suggested AI Architecture

For a productized version, use:

- One intake agent to structure product context
- One workflow audit agent to map jobs, steps, friction, and systems
- One AI opportunity agent to propose use cases
- One risk agent to review compliance, privacy, trust, and human approval needs
- One implementation agent to define MVP, data needs, integrations, and metrics
- One report agent to generate the final client-ready output

OpenAI's current recommended agentic building blocks include the Responses API for tool-using interactions and the Agents SDK for multi-agent workflows, handoffs, tools, and traces.

## Folder Contents

- `agent-blueprint.md`: full agent design and operating process
- `scoring-model.json`: opportunity scoring model
- `prompts/`: reusable prompts for each audit stage
- `templates/`: intake and report templates
- `examples/`: sample pharma SaaS report outline

