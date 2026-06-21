export interface ProposalInput {
  clientCompany: string;
  scopeNeeds: string[];
  budget: number;
}

export interface ProposalResult {
  success: boolean;
  proposalText: string;
  generatedAt: string;
  estimatedTimelineWeeks: number;
  aiScribeLog: string;
}

export const writeSalesProposal = (input: ProposalInput): ProposalResult => {
  const { clientCompany, scopeNeeds, budget } = input;
  
  const estimatedTimelineWeeks = Math.max(4, Math.round(scopeNeeds.length * 1.5));
  
  // Format the deliverables dynamically
  const deliverablesMarkdown = scopeNeeds.map((need, idx) => {
    return `* **Deliverable ${idx + 1}: ${need} Core Workflow Integration**
  * Automated data triggers, data field transformations, and error handling.
  * Direct synchronization with ${clientCompany}'s primary database and downstream CRMs.`;
  }).join('\n\n');

  // Draft the complete markdown proposal text
  const proposalText = `# BUSINESS AUTOMATION & INTEGRATION PROPOSAL
**Prepared for:** ${clientCompany}  
**Prepared by:** Simpler Life (SimplerLife.io)  
**Estimated Project Duration:** ${estimatedTimelineWeeks} Weeks  
**Total Proposed Budget:** $${budget.toLocaleString()} USD  

---

## 1. Executive Summary
At Simpler Life, our primary goal is to help ${clientCompany} eliminate manual, error-prone data entry and administrative bottlenecks. By designing and launching custom automation scripts and secure data pipelines, we will free up dozens of hours weekly for your team, allowing you to focus on high-leverage growth.

This proposal outlines the tailored scope, milestones, and deliverables we recommend to implement your core business automation objectives.

---

## 2. Proposed Scope of Work & Deliverables
We propose a complete, end-to-end integration and automation package targeting your specified requirements:

${deliverablesMarkdown}

* **Platform Security & Compliance Integration**
  * Multi-tier cryptographic signing (HMAC-SHA256 headers).
  * API session security utilizing JSON Web Tokens (JWT).
  * Auto-generation of structured audit logging in a secure operational database.

---

## 3. Implementation Schedule & Milestones
We recommend a phased rollout over the estimated **${estimatedTimelineWeeks} weeks** to ensure zero interruption to your live business operations:

* **Phase 1 (Weeks 1-2): Discovery & API Underwriting**
  * Technical schema validation, secure API credential mapping, and initial sandbox construction.
* **Phase 2 (Weeks 3-5): Core Integration & Simulated Ingestion**
  * Developing customized Node.js controllers, workflow services, and trigger structures.
* **Phase 3 (Weeks 6-7): Secure Testing & Live Verification**
  * Running operational integration tests to ensure 100% success on concurrent web submissions.
* **Phase 4 (Week 8+): Production Launch & Retainer Handoff**
  * Final domain binding, client training, and monthly retainer support initiation.

---

## 4. Financial Agreement & Retainer Terms
* **One-Time Implementation Fee:** $${Math.round(budget * 0.8).toLocaleString()} (Invoiced 50% upfront, 50% upon successful live verification).
* **Ongoing Support & Optimization Retainer:** $${Math.round(budget * 0.2).toLocaleString()} / Month (Covers API maintenance, schema adjustments, and system scaling).

---

We look forward to partnering with ${clientCompany} to build a simpler, highly-automated life for your team!

**Accepted by:**  
_________________________________  
Authorized representative for ${clientCompany}
`;

  return {
    success: true,
    proposalText,
    generatedAt: new Date().toISOString(),
    estimatedTimelineWeeks,
    aiScribeLog: `[AI Scribe service] Custom sales proposal drafted successfully for ${clientCompany}. Total scope covers ${scopeNeeds.length} core workflow modules. Approved for client review.`
  };
};
