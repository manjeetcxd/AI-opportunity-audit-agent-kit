const STORAGE_KEY = "ai-opportunity-agent-saas-state";

const els = {
  readinessScore: document.querySelector("#readiness-score"),
  readinessCopy: document.querySelector("#readiness-copy"),
  linkList: document.querySelector("#link-list"),
  documentList: document.querySelector("#document-list"),
  screenFlow: document.querySelector("#screen-flow"),
  agentGrid: document.querySelector("#agent-grid"),
  matrixBody: document.querySelector("#matrix-body"),
  reportOutput: document.querySelector("#report-output"),
  linkTemplate: document.querySelector("#link-template"),
  screenTemplate: document.querySelector("#screen-template"),
};

const fields = {
  productName: document.querySelector("#product-name"),
  domain: document.querySelector("#domain"),
  users: document.querySelector("#users"),
  goal: document.querySelector("#goal"),
  productUrl: document.querySelector("#product-url"),
  productStage: document.querySelector("#product-stage"),
  constraints: document.querySelector("#constraints"),
};

const agentSteps = [
  {
    id: "intake",
    title: "1. Intake Structuring",
    description: "Normalize product context, users, URLs, documents, screenshots, and assumptions.",
  },
  {
    id: "workflow",
    title: "2. Workflow Audit",
    description: "Infer journeys, tasks, handoffs, decision points, and repeated effort from evidence.",
  },
  {
    id: "opportunity",
    title: "3. AI Opportunity Discovery",
    description: "Classify where summarizers, copilots, validators, search assistants, or agents fit.",
  },
  {
    id: "risk",
    title: "4. Risk And Control Review",
    description: "Define human approval, audit logs, source visibility, fallback, and compliance controls.",
  },
  {
    id: "roadmap",
    title: "5. Recommendation Report",
    description: "Prepare MVP scope, UX artifacts, success metrics, and next-phase design actions.",
  },
];

const demoState = {
  context: {
    productName: "Clinical research operations platform",
    domain: "Pharma research SaaS",
    users: "Study managers, clinical reviewers, data coordinators, compliance reviewers",
    goal: "Identify AI features that reduce manual study setup, SOP search, and reporting effort",
    productUrl: "https://example.com/research-ops-platform",
    productStage: "Existing product",
    constraints:
      "Regulated workflow, human approval before save, role-based permissions, source traceability, validation requirements, audit logs, privacy-sensitive research data.",
  },
  links: [
    { url: "https://example.com/study-setup", notes: "Study setup flow and document extraction entry point" },
    { url: "https://example.com/compliance-review", notes: "Checklist review and approval workflow" },
  ],
  documents: [
    { name: "Study setup SOP.pdf", type: "application/pdf", size: 1420000, category: "SOP / policy" },
    { name: "User interview synthesis.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 284000, category: "Research notes" },
  ],
  screens: [
    {
      step: 1,
      name: "Upload protocol",
      notes: "Study manager uploads protocol and manually checks document version before continuing.",
    },
    {
      step: 2,
      name: "Map extracted fields",
      notes: "User copies study title, phase, sites, dates, inclusion criteria, and owner details into setup fields.",
    },
    {
      step: 3,
      name: "Compliance checklist",
      notes: "Reviewer checks required fields and returns missing information to the study manager.",
    },
    {
      step: 4,
      name: "Submit setup for approval",
      notes: "Final submission requires approval, audit log, and ability to see who changed each field.",
    },
  ],
  runStatus: "ready",
};

let state = loadState();

function createInitialState() {
  return {
    context: {
      productName: "",
      domain: "",
      users: "",
      goal: "",
      productUrl: "",
      productStage: "Existing product",
      constraints: "",
    },
    links: [{ url: "", notes: "" }],
    documents: [],
    screens: [],
    runStatus: "idle",
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(demoState);
  try {
    return { ...createInitialState(), ...JSON.parse(saved) };
  } catch {
    return structuredClone(demoState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncContextFromState() {
  Object.entries(fields).forEach(([key, field]) => {
    field.value = state.context[key] || "";
  });
}

function syncContextToState() {
  Object.entries(fields).forEach(([key, field]) => {
    state.context[key] = field.value.trim();
  });
}

function addLink(link = { url: "", notes: "" }) {
  state.links.push(link);
  render();
}

function renderLinks() {
  els.linkList.innerHTML = "";
  state.links.forEach((link, index) => {
    const node = els.linkTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('[data-link-field="url"]').value = link.url || "";
    node.querySelector('[data-link-field="notes"]').value = link.notes || "";

    node.querySelectorAll("[data-link-field]").forEach((input) => {
      input.addEventListener("input", () => {
        state.links[index][input.dataset.linkField] = input.value.trim();
        renderLight();
      });
    });

    node.querySelector(".remove-link").addEventListener("click", () => {
      state.links.splice(index, 1);
      if (!state.links.length) state.links.push({ url: "", notes: "" });
      render();
    });

    els.linkList.appendChild(node);
  });
}

function addDocuments(files) {
  [...files].forEach((file) => {
    state.documents.push({
      name: file.name,
      type: file.type || "unknown",
      size: file.size,
      category: inferDocumentCategory(file.name, file.type),
    });
  });
  render();
}

function inferDocumentCategory(name, type) {
  const lower = name.toLowerCase();
  if (type.startsWith("image/")) return "Image evidence";
  if (lower.includes("sop") || lower.includes("policy")) return "SOP / policy";
  if (lower.includes("research") || lower.includes("interview") || lower.includes("user")) return "Research notes";
  if (lower.includes("ticket") || lower.includes("support")) return "Support evidence";
  if (lower.includes("analytics") || lower.includes("export")) return "Analytics export";
  return "Workflow document";
}

function renderDocuments() {
  if (!state.documents.length) {
    els.documentList.innerHTML = `<div class="empty-state">No documents uploaded yet.</div>`;
    return;
  }

  els.documentList.innerHTML = state.documents
    .map(
      (doc, index) => `
        <article class="asset-card">
          <div>
            <strong>${escapeHtml(doc.name)}</strong>
            <span>${escapeHtml(doc.category)} · ${formatBytes(doc.size)}</span>
          </div>
          <button class="text-button" data-remove-doc="${index}" type="button">Remove</button>
        </article>
      `,
    )
    .join("");

  els.documentList.querySelectorAll("[data-remove-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      state.documents.splice(Number(button.dataset.removeDoc), 1);
      render();
    });
  });
}

function addScreens(files) {
  [...files].forEach((file, index) => {
    const reader = new FileReader();
    const nextStep = state.screens.length + index + 1;
    reader.addEventListener("load", () => {
      state.screens.push({
        step: nextStep,
        name: file.name.replace(/\.[^.]+$/, ""),
        notes: "",
        fileName: file.name,
        preview: reader.result,
      });
      render();
    });
    reader.readAsDataURL(file);
  });
}

function addManualScreen() {
  state.screens.push({
    step: state.screens.length + 1,
    name: "",
    notes: "",
    fileName: "",
    preview: "",
  });
  render();
}

function renderScreens() {
  if (!state.screens.length) {
    els.screenFlow.innerHTML = `<div class="empty-state">No screenshots or manual flow steps added yet.</div>`;
    return;
  }

  els.screenFlow.innerHTML = "";
  getSortedScreens().forEach((screen) => {
    const index = state.screens.indexOf(screen);
    const node = els.screenTemplate.content.firstElementChild.cloneNode(true);
    const preview = node.querySelector("[data-preview]");
    const stepInput = node.querySelector('[data-screen-field="step"]');
    const nameInput = node.querySelector('[data-screen-field="name"]');
    const notesInput = node.querySelector('[data-screen-field="notes"]');

    stepInput.value = screen.step;
    nameInput.value = screen.name || "";
    notesInput.value = screen.notes || "";

    if (screen.preview) {
      preview.innerHTML = `<img src="${screen.preview}" alt="${escapeHtml(screen.name || `Step ${screen.step}`)}" />`;
    } else {
      preview.textContent = `Step ${screen.step}`;
    }

    node.querySelectorAll("[data-screen-field]").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.screenField;
        state.screens[index][key] = key === "step" ? Number(input.value) : input.value.trim();
        renderLight();
      });
    });

    node.querySelector(".remove-screen").addEventListener("click", () => {
      state.screens.splice(index, 1);
      render();
    });

    els.screenFlow.appendChild(node);
  });
}

function getSortedScreens() {
  return [...state.screens].sort((a, b) => Number(a.step || 0) - Number(b.step || 0));
}

function renderAgentSteps() {
  const statusByRunState = {
    idle: "waiting",
    ready: "complete",
    running: "running",
    complete: "complete",
  };
  const currentStatus = statusByRunState[state.runStatus] || "waiting";

  els.agentGrid.innerHTML = agentSteps
    .map(
      (step) => `
        <article class="agent-card ${currentStatus}">
          <span>${currentStatus}</span>
          <strong>${step.title}</strong>
          <p>${step.description}</p>
        </article>
      `,
    )
    .join("");
}

function buildOpportunities() {
  const context = state.context;
  const screens = getSortedScreens();
  const sourceStrength = Math.min(5, Math.max(1, state.documents.length + state.links.filter((link) => link.url).length));
  const flowStrength = Math.min(5, Math.max(1, screens.length));
  const regulated = /pharma|health|clinical|regulated|compliance|audit|gxp|hipaa/i.test(
    `${context.domain} ${context.constraints}`,
  );

  const candidates = [
    {
      opportunity: "Extract structured data from uploaded documents into workflow fields",
      aiFeature: "Extractor + copilot",
      evidence: "Documents, SOPs, setup forms, long protocol or policy artifacts",
      base: 17,
      artifact: "AI-assisted form wireframe with source citations",
      control: "Approve before save",
    },
    {
      opportunity: "Answer product and process questions from trusted documentation",
      aiFeature: "Search assistant",
      evidence: "Product URLs, SOPs, support notes, onboarding material",
      base: 15,
      artifact: "Conversational search panel with cited answers",
      control: "View source before action",
    },
    {
      opportunity: "Validate missing fields, policy conflicts, and risky submissions",
      aiFeature: "Validator",
      evidence: "Checklist steps, compliance notes, approval screens",
      base: regulated ? 18 : 14,
      artifact: "Review checklist and exception-handling flow",
      control: "Accept, reject, or escalate",
    },
    {
      opportunity: "Summarize workflow state and produce stakeholder-ready reports",
      aiFeature: "Report generator",
      evidence: "Repeated status updates, review notes, audit summaries",
      base: 14,
      artifact: "Report preview and edit-before-send screen",
      control: "Review and edit",
    },
    {
      opportunity: "Run bounded multi-step workflow preparation with human approval",
      aiFeature: "Agentic task performer",
      evidence: "Ordered screenshot flow, repeated handoffs, clear approval checkpoints",
      base: screens.length >= 3 ? 16 : 11,
      artifact: "Agent task panel with permissions and progress states",
      control: "Manual override required",
    },
  ];

  return candidates
    .map((candidate) => {
      const score = Math.min(25, candidate.base + sourceStrength + flowStrength - (regulated ? 3 : 1));
      return {
        ...candidate,
        score,
        bucket: getBucket(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function renderMatrix() {
  const opportunities = buildOpportunities();
  els.matrixBody.innerHTML = opportunities
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.opportunity)}</td>
          <td>${escapeHtml(item.aiFeature)}</td>
          <td>${escapeHtml(item.evidence)}</td>
          <td><span class="score">${item.score}</span></td>
          <td><span class="bucket ${item.bucket.toLowerCase().replaceAll(" ", "-")}">${item.bucket}</span></td>
          <td>${escapeHtml(item.artifact)}</td>
        </tr>
      `,
    )
    .join("");
}

function getBucket(score) {
  if (score >= 20) return "Quick win";
  if (score >= 15) return "MVP candidate";
  if (score >= 10) return "Investigate";
  return "Defer";
}

function generateReport() {
  const context = state.context;
  const screens = getSortedScreens();
  const opportunities = buildOpportunities();
  const top = opportunities[0];
  const links = state.links.filter((link) => link.url);

  return `# AI Opportunity Audit Report

## 1. Executive Summary

Product/service: ${context.productName || "Not specified"}
Domain: ${context.domain || "Not specified"}
Stage: ${context.productStage || "Not specified"}
Primary users: ${context.users || "Not specified"}
Audit goal: ${context.goal || "Not specified"}

Recommended first opportunity: ${top ? top.opportunity : "Not enough evidence yet"}
Recommended first UX artifact: ${top ? top.artifact : "Complete source intake and screenshot flow first"}

This audit is intended to help a UX designer move from product evidence to the next phase: ideation finalization, wireframe design, and product/engineering discussion.

## 2. Evidence Ingested

Product URL: ${context.productUrl || "Not provided"}

Additional links:
${links.length ? links.map((link) => `- ${link.url} — ${link.notes || "No notes"}`).join("\n") : "- No additional links provided"}

Uploaded documents:
${state.documents.length ? state.documents.map((doc) => `- ${doc.name} (${doc.category}, ${formatBytes(doc.size)})`).join("\n") : "- No documents uploaded"}

Screenshot flow:
${screens.length ? screens.map((screen) => `- Step ${screen.step}: ${screen.name || "Untitled screen"} — ${screen.notes || "No notes"}`).join("\n") : "- No screenshots or manual flow steps provided"}

## 3. Agent Execution Summary

1. Intake Structuring: normalized product context, source material, and user constraints.
2. Workflow Audit: inferred journey steps from uploaded screenshots and notes.
3. AI Opportunity Discovery: classified candidate features by workflow fit.
4. Risk Review: defined human control and auditability needs.
5. Recommendation Planning: prepared UX artifacts for ideation and wireframing.

## 4. AI Opportunity Matrix

| Rank | Opportunity | AI feature | Score | Bucket | Next UX artifact |
|---:|---|---|---:|---|---|
${opportunities
  .map((item, index) => `| ${index + 1} | ${item.opportunity} | ${item.aiFeature} | ${item.score} | ${item.bucket} | ${item.artifact} |`)
  .join("\n")}

## 5. Recommended Feature Concepts

${opportunities
  .slice(0, 3)
  .map(
    (item, index) => `### ${index + 1}. ${item.aiFeature}

- Opportunity: ${item.opportunity}
- Evidence: ${item.evidence}
- Human control: ${item.control}
- UX states to design: source review, low confidence, edit suggestion, approve, reject, undo, audit trail
- MVP scope: one workflow, one primary user role, explicit human approval, source visibility, measurable time saved
- Success metrics: task time reduction, correction rate, adoption, user trust, review effort reduction`,
  )
  .join("\n\n")}

## 6. Risk And Governance Notes

- Do not allow AI to silently update regulated or business-critical records.
- Require source references for extracted, summarized, or recommended content.
- Keep approval, rejection, override, and audit log states visible in the UI.
- Separate AI suggestion from user-confirmed action.
- Use role-based permissions for agentic actions.

## 7. Next Phase For UX Designer

### Ideation Finalization

- Convert top 3 opportunities into "how might we" statements.
- Select one quick win and one strategic bet.
- Confirm user role, trigger, input, AI action, human action, and expected outcome.

### Wireframe Screen Design

- Current workflow map
- Future AI-assisted workflow map
- AI panel or assistant surface
- Source citation view
- Review/edit/approve state
- Low-confidence and error state
- Audit trail/history state

### Product And Engineering Handoff

- Data required
- Integration points
- Permissions
- Audit logs
- Evaluation criteria
- MVP release boundary

## 8. Open Questions

- Which uploaded documents are authoritative sources?
- Which actions can AI perform versus only suggest?
- Which user role owns final approval?
- What logs are required for compliance?
- What data is available through APIs versus documents only?
`;
}

function updateReadiness() {
  const contextScore = [state.context.productName, state.context.domain, state.context.users, state.context.goal].filter(Boolean).length;
  const sourceScore = Math.min(3, state.documents.length + state.links.filter((link) => link.url).length);
  const screenScore = Math.min(3, state.screens.length);
  const total = Math.round(((contextScore + sourceScore + screenScore) / 10) * 100);
  els.readinessScore.textContent = `${total}%`;
  els.readinessCopy.textContent =
    total >= 80
      ? "Ready to run a strong audit."
      : total >= 50
        ? "Enough to draft an audit. Add more screens or documents for better evidence."
        : "Add project context, source evidence, and screen flow steps to improve the audit.";
}

function renderReport() {
  els.reportOutput.value = generateReport();
}

function renderLight() {
  syncContextToState();
  updateReadiness();
  renderMatrix();
  renderReport();
  saveState();
}

function render() {
  syncContextFromState();
  renderLinks();
  renderDocuments();
  renderScreens();
  renderAgentSteps();
  renderLight();
}

function runAgent() {
  syncContextToState();
  state.runStatus = "running";
  renderAgentSteps();

  window.setTimeout(() => {
    state.runStatus = "complete";
    render();
    document.querySelector("#opportunities").scrollIntoView({ behavior: "smooth" });
  }, 700);
}

function formatBytes(bytes) {
  if (!bytes) return "unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function downloadReport() {
  const blob = new Blob([els.reportOutput.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  const fileBase = `${state.context.productName || "ai-opportunity-audit"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  anchor.download = `${fileBase || "ai-opportunity-audit"}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

Object.values(fields).forEach((field) => field.addEventListener("input", renderLight));

document.querySelector("#add-link").addEventListener("click", () => addLink());
document.querySelector("#document-upload").addEventListener("change", (event) => {
  addDocuments(event.target.files);
  event.target.value = "";
});
document.querySelector("#screenshot-upload").addEventListener("change", (event) => {
  addScreens(event.target.files);
  event.target.value = "";
});
document.querySelector("#add-empty-screen").addEventListener("click", addManualScreen);
document.querySelector("#run-agent").addEventListener("click", runAgent);
document.querySelector("#run-agent-top").addEventListener("click", runAgent);
document.querySelector("#load-demo").addEventListener("click", () => {
  state = structuredClone(demoState);
  render();
});
document.querySelector("#copy-report").addEventListener("click", async () => {
  await navigator.clipboard.writeText(els.reportOutput.value);
});
document.querySelector("#download-report").addEventListener("click", downloadReport);

render();
