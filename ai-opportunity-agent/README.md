# AI Opportunity Audit Agent

This kit defines an AI agent that helps product and UX teams discover AI opportunities, audit workflows, and generate implementation-ready recommendation reports for existing products and services.

It is designed for enterprise SaaS and regulated domains such as pharma research, healthcare operations, compliance-heavy platforms, and internal productivity tools.

## Local SaaS Runner

Open `index.html` through a local web server to use the browser-based audit workspace.

Current local command:

```bash
cd ai-opportunity-agent
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

The runner supports:

- product/service URL intake
- additional product or workflow links
- document uploads for PDF, Word, image, text, SOPs, support notes, and research material
- ordered screenshot-flow uploads
- manual screen-flow steps when screenshots are unavailable
- agent-stage execution view
- AI opportunity matrix
- implementation-ready markdown report
- report copy and markdown download

In this static local version, uploaded files are handled as local browser evidence metadata and screenshots are previewed in the browser. A production version should add a backend and model pipeline for PDF/DOC parsing, OCR, image understanding, source citation extraction, and true agent execution.

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

1. Open the local SaaS runner or fill `templates/intake-questionnaire.md`.
2. Collect available product material:
   - product walkthrough notes
   - product/service URLs
   - screenshots
   - screenshot sequences
   - SOPs
   - support tickets
   - user research notes
   - analytics exports
   - workflow documents
   - training documents
3. Upload or record the evidence in the runner.
4. Run the agent flow and review the generated opportunity matrix.
5. Use the prompts in order from `prompts/01-discovery.md` to `prompts/06-final-report.md` for a more rigorous LLM-assisted version.
6. Use `scoring-model.json` to rank opportunities.
7. Place the final output into `templates/final-report-template.md`.

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
