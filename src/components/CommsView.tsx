"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { FAMILY_COLORS } from "@/types";
import type { Communication, Customer, Order, OrderFamily, CommScope } from "@/types";

// ─── Context union ────────────────────────────────────────────────────────────

type SelectedCtx =
  | { scope: "customer"; customerId: string }
  | { scope: "family";   customerId: string; familyId: string }
  | { scope: "order";    customerId: string; familyId: string | null; orderId: string };

function ctxKey(ctx: SelectedCtx): string {
  if (ctx.scope === "customer") return `customer:${ctx.customerId}`;
  if (ctx.scope === "family")   return `family:${ctx.familyId}`;
  return `order:${ctx.orderId}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  const d   = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function commsFor(communications: Communication[], ctx: SelectedCtx): Communication[] {
  return communications
    .filter(c => {
      if (ctx.scope === "customer") return c.customerId === ctx.customerId && c.scope === "customer";
      if (ctx.scope === "family")   return c.familyId === ctx.familyId    && c.scope === "family";
      if (ctx.scope === "order")    return c.orderId  === ctx.orderId     && c.scope === "order";
      return false;
    })
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

function lastComm(communications: Communication[], ctx: SelectedCtx): Communication | undefined {
  return [...commsFor(communications, ctx)].sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
}

// ─── AI generators ────────────────────────────────────────────────────────────

// Detect what the last inbound message is asking about and generate a contextual reply.
function generateContextualReply(
  lastInbound: Communication,
  customer: Customer,
  contextLabel: string,
): { subject: string; body: string } | null {
  const text = (lastInbound.subject + " " + lastInbound.body).toLowerCase();

  const hasTopic = (keywords: string[]) => keywords.some(k => text.includes(k));

  const fromName = lastInbound.fromName;
  const firstName = fromName.split(" ")[0];

  // Billing / invoice question
  if (hasTopic(["billing", "invoice", "bill", "charge", "payment", "billing start", "billing date", "accrual"])) {
    return {
      subject: `Re: ${lastInbound.subject}`,
      body: `Hi ${firstName},

Thank you for your question regarding billing.

To clarify the billing start date: services are billed from the activation date. Your invoice will reflect the prorated amount for the first partial month, followed by a full monthly charge beginning the subsequent billing cycle.

If you have specific questions about a particular order's billing date or need a formal billing schedule document for your internal budget team, I can arrange that — just let me know the order numbers you'd like included.

Please don't hesitate to reach out with any additional questions.

Warm regards,
Account Management Team
Enterprise Services Division`,
    };
  }

  // Timeline / ETA question
  if (hasTopic(["when", "eta", "timeline", "deadline", "date", "porting", "cutover", "schedule", "how long", "status"])) {
    return {
      subject: `Re: ${lastInbound.subject}`,
      body: `Hi ${firstName},

Thank you for following up on the timeline.

Our current project schedule shows the service on track for completion within the committed window. For number porting requests specifically, the standard lead time is 10–15 business days from submission of the completed LOA (Letter of Authorization). If your team has a hard cutover date, please share it and we will do our best to coordinate accordingly.

I will proactively update you as soon as the completion date is confirmed by our provisioning team.

Warm regards,
Account Management Team
Enterprise Services Division`,
    };
  }

  // Technical / specs question
  if (hasTopic(["mtu", "bandwidth", "latency", "redundancy", "bgp", "config", "configuration", "technical", "spec", "burstable", "throughput", "vlan", "routing"])) {
    return {
      subject: `Re: ${lastInbound.subject}`,
      body: `Hi ${firstName},

Thank you for your technical inquiry.

I am coordinating with our network engineering team to pull the detailed specifications for your service. You can expect a comprehensive technical document — including circuit specifications, routing details, and any relevant configuration guides — within 2 business days.

If there are specific technical requirements or constraints on your end that we should account for (e.g., specific BGP ASN, VLAN tagging requirements, or redundancy topology), please share them so we can confirm compatibility in advance.

Warm regards,
Account Management Team
Enterprise Services Division`,
    };
  }

  // Documentation / paperwork question
  if (hasTopic(["document", "addendum", "loa", "agreement", "contract", "sign", "signature", "form", "paperwork", "legal"])) {
    return {
      subject: `Re: ${lastInbound.subject}`,
      body: `Hi ${firstName},

Thank you for following up on the documentation.

We have received your inquiry and will have the relevant documents — including the addendum you referenced — prepared and sent to you via DocuSign within 1 business day. Please ensure the correct signatory is available to review and execute the agreement promptly so we can proceed without delay.

If the executed documents need to be routed through a specific contact on your legal team, please share their details and we will copy them directly.

Warm regards,
Account Management Team
Enterprise Services Division`,
    };
  }

  // Escalation / issue / concern
  if (hasTopic(["escalat", "concerned", "issue", "problem", "delay", "overdue", "behind", "urgent", "frustrated", "disappoint"])) {
    return {
      subject: `Re: ${lastInbound.subject}`,
      body: `Hi ${firstName},

Thank you for bringing this to our attention. I understand your concern and want to assure you that this is being treated as a priority.

I have escalated this internally and our service delivery team is reviewing the situation. I will have a substantive update for you within 24 hours, including a revised timeline and any corrective actions being taken.

I sincerely apologize for any inconvenience caused and appreciate your patience as we work to resolve this promptly.

Warm regards,
Account Management Team
Enterprise Services Division`,
    };
  }

  return null; // no specific topic detected — fall through to standard generator
}

function generateCustomerEmail(customer: Customer, families: OrderFamily[], orders: Order[]) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const custOrders  = orders.filter(o => o.customerId === customer.id);
  const custFamilies = families.filter(f => f.customerId === customer.id);
  const totalValue  = custOrders.reduce((s, o) => s + o.value, 0);

  const statusLabels: Record<string, string> = {
    confirm: "Pending Confirmation", implement: "In Implementation",
    finalize: "Awaiting Finalization", activate: "Ready for Activation", billing: "Active & Billing",
  };

  let body = `Dear ${customer.name} Team,\n\n`;
  body += `I hope this message finds you well. Please find below a consolidated account update as of ${today}.\n\n`;
  body += `ACCOUNT OVERVIEW\n`;
  body += `  Account:      ${customer.accountNumber}\n`;
  body += `  Total Orders: ${custOrders.length}\n`;
  body += `  Monthly Value: $${totalValue.toLocaleString()}\n\n`;

  if (custFamilies.length > 0) {
    body += `━━━ ORDER FAMILIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    for (const f of custFamilies) {
      const fOrders = orders.filter(o => o.familyId === f.id);
      const fValue  = fOrders.reduce((s, o) => s + o.value, 0);
      body += `${f.name} (${fOrders.length} orders · $${fValue.toLocaleString()}/mo)\n`;
      for (const o of fOrders) {
        body += `  • ${o.orderNumber} — ${o.product}\n`;
        body += `    Status: ${statusLabels[o.status] ?? o.status}\n`;
      }
      body += "\n";
    }
  }

  const standalone = custOrders.filter(o => !o.familyId);
  if (standalone.length > 0) {
    body += `━━━ STANDALONE ORDERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    for (const o of standalone) {
      body += `  • ${o.orderNumber} — ${o.product}\n`;
      body += `    Status: ${statusLabels[o.status] ?? o.status} · $${o.value.toLocaleString()}/mo\n`;
    }
    body += "\n";
  }

  body += `Please don't hesitate to reach out with any questions.\n\n`;
  body += `Warm regards,\nAccount Management Team\nEnterprise Services Division`;

  return {
    subject: `Account Update — ${customer.name} (${custOrders.length} Active Orders)`,
    body,
  };
}

function generateFamilyEmail(customer: Customer, family: OrderFamily, familyOrders: Order[]) {
  const totalValue = familyOrders.reduce((s, o) => s + o.value, 0);
  const statusLabels: Record<string, string> = {
    confirm: "Pending Confirmation", implement: "In Implementation",
    finalize: "Awaiting Finalization", activate: "Ready for Activation", billing: "Active & Billing",
  };
  const byStatus = {
    billing:   familyOrders.filter(o => o.status === "billing"),
    activate:  familyOrders.filter(o => o.status === "activate"),
    implement: familyOrders.filter(o => o.status === "implement"),
    finalize:  familyOrders.filter(o => o.status === "finalize"),
    confirm:   familyOrders.filter(o => o.status === "confirm"),
  };
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  let body = `Dear ${customer.name} Team,\n\n`;
  body += `I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "${family.name}" order family as of ${today}.\n\n`;
  body += `This family currently encompasses ${familyOrders.length} service order${familyOrders.length !== 1 ? "s" : ""} with a combined contracted value of $${totalValue.toLocaleString()}.\n\n`;
  body += `━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (const o of familyOrders) {
    body += `${o.orderNumber} | ${o.product}\n`;
    body += `   Status:   ${statusLabels[o.status] ?? o.status}\n`;
    body += `   Location: ${o.address}\n`;
    body += `   Value:    $${o.value.toLocaleString()}/mo\n\n`;
  }

  body += `━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  if (byStatus.billing.length > 0)   body += `✓  ACTIVE & BILLING (${byStatus.billing.length})\n` + byStatus.billing.map(o => `   • ${o.product} — Fully operational`).join("\n") + "\n\n";
  if (byStatus.activate.length > 0)  body += `◎  ACTIVATION READY (${byStatus.activate.length})\n` + byStatus.activate.map(o => `   • ${o.product} — Circuits tested, scheduled for activation`).join("\n") + "\n\n";
  if (byStatus.implement.length > 0) body += `⟳  IN IMPLEMENTATION (${byStatus.implement.length})\n` + byStatus.implement.map(o => `   • ${o.product} — Field teams engaged, on schedule`).join("\n") + "\n\n";
  if (byStatus.finalize.length > 0)  body += `◈  PENDING FINALIZATION (${byStatus.finalize.length})\n` + byStatus.finalize.map(o => `   • ${o.product} — Awaiting final sign-off`).join("\n") + "\n\n";
  if (byStatus.confirm.length > 0)   body += `◻  AWAITING CONFIRMATION (${byStatus.confirm.length})\n` + byStatus.confirm.map(o => `   • ${o.product} — Submitted, pending confirmation`).join("\n") + "\n\n";

  const hasInFlight = byStatus.implement.length + byStatus.confirm.length > 0;
  const hasNearDone = byStatus.activate.length + byStatus.finalize.length > 0;

  body += `━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  if (hasInFlight)      body += `Our teams are actively progressing these orders. Expect your next update within 5–7 business days.\n\n`;
  else if (hasNearDone) body += `We are in the final stages of bringing these services live. Your team will be contacted to coordinate activation.\n\n`;
  else                  body += `All services in this family are now active and billing.\n\n`;

  body += `Should you have any questions, please don't hesitate to reach out.\n\n`;
  body += `Warm regards,\nAccount Management Team\nEnterprise Services Division`;

  return {
    subject: `Status Update — ${family.name} (${familyOrders.length} Order${familyOrders.length !== 1 ? "s" : ""})`,
    body,
  };
}

function generateOrderEmail(customer: Customer, order: Order) {
  const statusLabels: Record<string, string> = {
    confirm: "Pending Confirmation", implement: "In Implementation",
    finalize: "Awaiting Finalization", activate: "Ready for Activation", billing: "Active & Billing",
  };
  const statusDetails: Record<string, string> = {
    confirm:   "Your order has been submitted and is currently pending internal confirmation. Our provisioning team is reviewing the order details and circuit path availability. You can expect a confirmation within 3–5 business days.",
    implement: "Your order is actively in implementation. Our field and provisioning teams are working to bring this service live. We will notify you promptly once testing is complete and the service is ready for handoff.",
    finalize:  "Your order is in the finalization stage. We are completing final documentation, configuration review, and internal sign-offs before implementation begins. Please ensure any outstanding items on your side are completed promptly to avoid delays.",
    activate:  "Your service is ready for activation. All circuits have been tested and confirmed. Our team will coordinate with you directly to schedule the activation window at a time that minimizes disruption to your operations.",
    billing:   "Your service is fully operational and billing. If you have any questions about your invoice or service performance, please don't hesitate to reach out.",
  };
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const body = `Dear ${customer.name} Team,

This message provides a focused status update on a single service order as of ${today}.

━━━ ORDER DETAILS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Order Number:   ${order.orderNumber}
  Product:        ${order.product}
  Location:       ${order.address}
  Monthly Value:  $${order.value.toLocaleString()}/mo
  Submitted:      ${order.submittedDate}
  Due Date:       ${order.dueDate}
  Current Status: ${statusLabels[order.status] ?? order.status}

━━━ STATUS UPDATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${statusDetails[order.status] ?? "Your order is progressing as expected."}

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We will continue to keep you informed of any changes to this order's status. If you have specific questions or requirements related to this service, please reply to this message or contact your account manager directly.

Warm regards,
Account Management Team
Enterprise Services Division`;

  return {
    subject: `Status Update — ${order.orderNumber}: ${order.product}`,
    body,
  };
}

// ─── Email card ───────────────────────────────────────────────────────────────

function EmailCard({ comm }: { comm: Communication }) {
  const [expanded, setExpanded] = useState(true);
  const isOut = comm.direction === "outbound";

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${isOut ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200"}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
          ${isOut ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
          {comm.fromName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">{comm.fromName}</span>
            {comm.isAiGenerated && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-700 flex-shrink-0">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/></svg>
                AI
              </span>
            )}
            <span className={`text-xs flex-shrink-0 ${isOut ? "text-blue-500" : "text-slate-400"}`}>
              {isOut ? "↑ Sent" : "↓ Received"}
            </span>
            <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{formatDate(comm.sentAt)}</span>
          </div>
          <div className="text-sm font-medium text-slate-700 mt-0.5 truncate">{comm.subject}</div>
          {!expanded && (
            <div className="text-xs text-slate-400 truncate mt-0.5">
              {comm.body.split("\n").find(l => l.trim()) ?? ""}
            </div>
          )}
        </div>

        <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <div className="text-xs text-slate-400 mb-2">
            <span className="font-medium">To:</span> {comm.toName} &lt;{comm.toEmail}&gt;
          </div>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {comm.body}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Left panel tree ──────────────────────────────────────────────────────────

const SCOPE_LABEL: Record<CommScope, string> = {
  customer: "Account",
  family:   "Family",
  order:    "Order",
};

function TreeNode({
  label, sublabel, dot, indent, selected, unread, commCount, lastSentAt, onClick,
  onContextMenu, children,
}: {
  label: string; sublabel?: string; dot?: string; indent: number; selected: boolean;
  unread?: boolean; commCount: number; lastSentAt?: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`w-full flex items-center gap-2 text-left transition-colors
          ${selected ? "bg-blue-50 border-r-2 border-blue-500" : "hover:bg-slate-50"}
          ${indent === 0 ? "py-2.5 px-4" : indent === 1 ? "py-2 pl-7 pr-3" : "py-1.5 pl-10 pr-3"}`}
      >
        {dot && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />}
        <div className="flex-1 min-w-0">
          <div className={`truncate ${indent === 0 ? "text-sm font-medium text-slate-800" : indent === 1 ? "text-xs font-medium text-slate-700" : "text-xs text-slate-600"} ${selected ? (indent === 0 ? "text-blue-800" : "text-blue-700") : ""}`}>
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-slate-400 truncate">{sublabel}</div>
          )}
          {lastSentAt && commCount > 0 && (
            <div className="text-xs text-slate-400">
              {formatShortDate(lastSentAt)} · {commCount} msg{commCount !== 1 ? "s" : ""}
            </div>
          )}
          {commCount === 0 && (
            <div className="text-xs text-slate-300">No messages</div>
          )}
        </div>
        {unread && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
      </button>
      {children}
    </div>
  );
}

// ─── Scope badge ──────────────────────────────────────────────────────────────

function ScopeBadge({ scope }: { scope: CommScope }) {
  const styles: Record<CommScope, string> = {
    customer: "bg-slate-100 text-slate-600",
    family:   "bg-blue-100 text-blue-700",
    order:    "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${styles[scope]}`}>
      {SCOPE_LABEL[scope]}
    </span>
  );
}

// ─── Status badge (mini) ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  confirm:   "bg-amber-100 text-amber-800",
  implement: "bg-blue-100 text-blue-800",
  finalize:  "bg-purple-100 text-purple-800",
  activate:  "bg-teal-100 text-teal-800",
  billing:   "bg-green-100 text-green-800",
};
const STATUS_LABELS: Record<string, string> = {
  confirm: "Confirm", implement: "Implement", finalize: "Finalize",
  activate: "Activate", billing: "Billing",
};

// ─── Context menu ─────────────────────────────────────────────────────────────

function CtxMenu({
  x, y, isRead, onMarkRead, onMarkUnread, onClose,
}: {
  x: number; y: number; isRead: boolean;
  onMarkRead: () => void; onMarkUnread: () => void; onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1"
        style={{ left: x, top: y }}
      >
        {isRead ? (
          <button
            onClick={() => { onMarkUnread(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mark as unread
          </button>
        ) : (
          <button
            onClick={() => { onMarkRead(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as read
          </button>
        )}
      </div>
    </>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function CommsView() {
  const {
    customers, orders, families, communications, sendCommunication,
    readThreadKeys, markThreadRead, markThreadUnread,
    users, currentUserId, assignOrdersToFamily,
  } = useStore();

  const currentUser = users.find(u => u.id === currentUserId);
  const myCustomerIds = new Set(currentUser?.customerIds ?? []);
  const myCustomers = customers.filter(c => myCustomerIds.has(c.id));

  const [ctx, setCtxState]               = useState<SelectedCtx | null>(null);
  const [expandedCustIds, setExpandedCustIds] = useState<Set<string>>(
    () => new Set(myCustomers.map(c => c.id))
  );
  const [expandedFamIds, setExpandedFamIds]   = useState<Set<string>>(new Set());
  const [subject, setSubject]           = useState("");
  const [body, setBody]                 = useState("");
  const [generating, setGenerating]     = useState(false);
  const [sending, setSending]           = useState(false);

  // Context menu state
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; key: string } | null>(null);

  // Drag-over state for unassigned orders → families in left panel
  const [dragOverFamId, setDragOverFamId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Change context and clear draft + mark as read
  const setCtx = (newCtx: SelectedCtx | null) => {
    setSubject("");
    setBody("");
    setCtxState(newCtx);
    if (newCtx) markThreadRead(ctxKey(newCtx));
  };

  // Also mark read when clicking into a thread that already has ctx set to same key
  useEffect(() => {
    if (ctx) markThreadRead(ctxKey(ctx));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  const threadComms = ctx ? commsFor(communications, ctx) : [];

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ctx, threadComms.length]);

  // Derived context objects
  const ctxCustomer = ctx ? customers.find(c => c.id === ctx.customerId) : null;
  const ctxFamily   = ctx?.scope !== "customer" && ctx?.familyId
    ? families.find(f => f.id === ctx.familyId) : null;
  const ctxOrder    = ctx?.scope === "order"
    ? orders.find(o => o.id === ctx.orderId) : null;
  const ctxFamilyOrders = ctxFamily ? orders.filter(o => o.familyId === ctxFamily.id) : [];
  const colorConfig = ctxFamily ? FAMILY_COLORS.find(c => c.value === ctxFamily.color) : null;

  const toggleCust = (id: string) => setExpandedCustIds(prev => {
    const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });
  const toggleFam = (id: string) => setExpandedFamIds(prev => {
    const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });

  function isUnread(nodeCtx: SelectedCtx): boolean {
    const lc = lastComm(communications, nodeCtx);
    if (!lc || lc.direction !== "inbound") return false;
    return !readThreadKeys.has(ctxKey(nodeCtx));
  }

  const handleContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, key });
  };

  const handleGenerateAI = async () => {
    if (!ctx || !ctxCustomer) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1400));

    // Try contextual reply first if there's an inbound message
    const lastInbound = [...commsFor(communications, ctx)]
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
      .find(c => c.direction === "inbound");

    let result: { subject: string; body: string };

    if (lastInbound) {
      const contextual = generateContextualReply(lastInbound, ctxCustomer, ctx.scope);
      if (contextual) {
        result = contextual;
        setSubject(result.subject);
        setBody(result.body);
        setGenerating(false);
        return;
      }
    }

    // Fall back to standard status update generators
    if (ctx.scope === "customer")      result = generateCustomerEmail(ctxCustomer, families.filter(f => f.customerId === ctx.customerId), orders);
    else if (ctx.scope === "family" && ctxFamily) result = generateFamilyEmail(ctxCustomer, ctxFamily, ctxFamilyOrders);
    else if (ctx.scope === "order"  && ctxOrder)  result = generateOrderEmail(ctxCustomer, ctxOrder);
    else result = { subject: "", body: "" };
    setSubject(result.subject);
    setBody(result.body);
    setGenerating(false);
  };

  const handleSend = async () => {
    if (!ctx || !ctxCustomer || !subject.trim() || !body.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 700));
    const toEmail = `accounts@${ctxCustomer.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    sendCommunication({
      scope:     ctx.scope,
      customerId: ctx.customerId,
      familyId:  ctx.scope !== "customer" ? (ctx.familyId ?? null) : null,
      orderId:   ctx.scope === "order" ? ctx.orderId : null,
      subject:   subject.trim(),
      body:      body.trim(),
      sentAt:    new Date().toISOString(),
      fromName:  "Account Management Team",
      fromEmail: "accounts@orderco.com",
      toName:    ctxCustomer.name,
      toEmail,
      direction: "outbound",
      isAiGenerated: false,
    });
    setSubject(""); setBody(""); setSending(false);
  };

  // ── Native drag for unassigned orders in left panel ────────────────────────
  const handleOrderDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFamDragOver = (e: React.DragEvent, famId: string) => {
    if (!e.dataTransfer.types.includes("text/plain") && e.dataTransfer.getData("orderId") !== "") {
      e.preventDefault();
    }
    e.preventDefault();
    setDragOverFamId(famId);
  };

  const handleFamDrop = (e: React.DragEvent, famId: string) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId) assignOrdersToFamily([orderId], famId);
    setDragOverFamId(null);
  };

  // ── Header breadcrumb ──────────────────────────────────────────────────────
  const headerParts: string[] = [];
  if (ctxCustomer) headerParts.push(ctxCustomer.name);
  if (ctxFamily)   headerParts.push(ctxFamily.name);
  if (ctxOrder)    headerParts.push(ctxOrder.orderNumber);

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ── Left panel ───────────────────────────────────────────────────── */}
      <div className="w-72 border-r border-slate-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-sm font-semibold text-slate-900">Communications</h2>
          <p className="text-xs text-slate-500 mt-0.5">By customer, family, or order</p>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {myCustomers.map(customer => {
            const custCtx: SelectedCtx = { scope: "customer", customerId: customer.id };
            const custComms    = commsFor(communications, custCtx);
            const custLast     = lastComm(communications, custCtx);
            const custFamilies = families.filter(f => f.customerId === customer.id);
            const custOrders   = orders.filter(o => o.customerId === customer.id);
            const standalone   = custOrders.filter(o => !o.familyId);
            const isCustExpanded = expandedCustIds.has(customer.id);
            const isCustSelected = ctx?.scope === "customer" && ctx.customerId === customer.id;
            const custUnread   = isUnread(custCtx);

            return (
              <div key={customer.id}>
                {/* Customer row */}
                <div className="flex items-stretch">
                  <button
                    onClick={() => toggleCust(customer.id)}
                    className="flex items-center justify-center px-2 py-2.5 hover:bg-slate-50 transition-colors flex-shrink-0"
                  >
                    <svg className={`w-3 h-3 text-slate-400 transition-transform ${isCustExpanded ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <TreeNode
                    label={customer.name} sublabel={customer.accountNumber}
                    indent={0} selected={isCustSelected}
                    commCount={custComms.length} lastSentAt={custLast?.sentAt}
                    unread={custUnread}
                    onClick={() => setCtx(custCtx)}
                    onContextMenu={e => handleContextMenu(e, ctxKey(custCtx))}
                  />
                </div>

                {/* Families + orders under this customer */}
                {isCustExpanded && (
                  <div className="border-l border-slate-100 ml-5">
                    {custFamilies.map(family => {
                      const fc      = FAMILY_COLORS.find(c => c.value === family.color);
                      const famCtx: SelectedCtx = { scope: "family", customerId: customer.id, familyId: family.id };
                      const famComms  = commsFor(communications, famCtx);
                      const famLast   = lastComm(communications, famCtx);
                      const famOrders = orders.filter(o => o.familyId === family.id);
                      const isFamExpanded = expandedFamIds.has(family.id);
                      const isFamSelected = ctx?.scope === "family" && ctx.familyId === family.id;
                      const famUnread = isUnread(famCtx);
                      const isDragTarget = dragOverFamId === family.id;

                      return (
                        <div key={family.id}
                          onDragOver={e => handleFamDragOver(e, family.id)}
                          onDragLeave={() => setDragOverFamId(null)}
                          onDrop={e => handleFamDrop(e, family.id)}
                          className={isDragTarget ? "bg-blue-50 rounded" : ""}
                        >
                          <div className="flex items-stretch">
                            <button
                              onClick={() => toggleFam(family.id)}
                              className="flex items-center justify-center px-2 py-2 hover:bg-slate-50 transition-colors flex-shrink-0"
                            >
                              <svg className={`w-3 h-3 text-slate-300 transition-transform ${isFamExpanded ? "rotate-90" : ""}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <TreeNode
                              label={family.name} dot={fc?.dot}
                              indent={1} selected={isFamSelected}
                              commCount={famComms.length} lastSentAt={famLast?.sentAt}
                              unread={famUnread}
                              onClick={() => setCtx(famCtx)}
                              onContextMenu={e => handleContextMenu(e, ctxKey(famCtx))}
                            />
                          </div>

                          {isFamExpanded && famOrders.map(order => {
                            const ordCtx: SelectedCtx = { scope: "order", customerId: customer.id, familyId: family.id, orderId: order.id };
                            const ordComms  = commsFor(communications, ordCtx);
                            const ordLast   = lastComm(communications, ordCtx);
                            const isOrdSelected = ctx?.scope === "order" && ctx.orderId === order.id;
                            const ordUnread = isUnread(ordCtx);
                            return (
                              <div key={order.id} className="border-l border-slate-100 ml-4">
                                <TreeNode
                                  label={order.orderNumber}
                                  sublabel={order.product}
                                  indent={2} selected={isOrdSelected}
                                  commCount={ordComms.length} lastSentAt={ordLast?.sentAt}
                                  unread={ordUnread}
                                  onClick={() => setCtx(ordCtx)}
                                  onContextMenu={e => handleContextMenu(e, ctxKey(ordCtx))}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}

                    {/* Standalone (unassigned) orders — draggable into families */}
                    {standalone.map(order => {
                      const ordCtx: SelectedCtx = { scope: "order", customerId: customer.id, familyId: null, orderId: order.id };
                      const ordComms = commsFor(communications, ordCtx);
                      const ordLast  = lastComm(communications, ordCtx);
                      const isOrdSelected = ctx?.scope === "order" && ctx.orderId === order.id;
                      const ordUnread = isUnread(ordCtx);
                      return (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={e => handleOrderDragStart(e, order.id)}
                          className="cursor-grab active:cursor-grabbing"
                          title="Drag to assign to a family"
                        >
                          <TreeNode
                            label={order.orderNumber}
                            sublabel={order.product}
                            indent={1} selected={isOrdSelected}
                            commCount={ordComms.length} lastSentAt={ordLast?.sentAt}
                            unread={ordUnread}
                            onClick={() => setCtx(ordCtx)}
                            onContextMenu={e => handleContextMenu(e, ctxKey(ordCtx))}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {myCustomers.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-slate-400">No customers assigned.</p>
              <p className="text-xs text-slate-300 mt-1">Use the Orders tab to add customers.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      {!ctx ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 text-sm">Select a customer, family, or order</p>
            <p className="text-slate-300 text-xs mt-1">to view and send communications</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 mb-1">
                  {headerParts.map((part, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {i > 0 && <span>›</span>}
                      <span className={i === headerParts.length - 1 ? "text-slate-700 font-medium" : ""}>{part}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {colorConfig && <span className={`w-2.5 h-2.5 rounded-full ${colorConfig.dot}`} />}
                  <ScopeBadge scope={ctx.scope} />
                  {ctxOrder && (
                    <span className="text-sm text-slate-600 font-medium">{ctxOrder.product}</span>
                  )}
                  {ctxOrder && (
                    <span className="text-xs text-slate-400">{ctxOrder.address}</span>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="text-right flex-shrink-0 text-xs text-slate-400">
                <div>{threadComms.length} message{threadComms.length !== 1 ? "s" : ""}</div>
                {ctxOrder && <div className="font-semibold text-slate-600 mt-0.5">${ctxOrder.value.toLocaleString()}/mo</div>}
                {ctxOrder && <div className="mt-0.5">Due: {ctxOrder.dueDate}</div>}
                {ctxFamily && !ctxOrder && (
                  <div className="font-semibold text-slate-600 mt-0.5">
                    ${ctxFamilyOrders.reduce((s, o) => s + o.value, 0).toLocaleString()}/mo · {ctxFamilyOrders.length} orders
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Family detail summary */}
          {ctxFamily && !ctxOrder && ctxFamilyOrders.length > 0 && (
            <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Orders in this family</div>
              <div className="flex flex-wrap gap-1.5">
                {ctxFamilyOrders.map(o => (
                  <div key={o.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS_STYLES[o.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                    <span className="text-xs text-slate-700 font-mono">{o.orderNumber}</span>
                    <span className="text-xs text-slate-500 max-w-[160px] truncate">{o.product}</span>
                    <span className="text-xs text-slate-400">${o.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {ctxFamilyOrders.length} order{ctxFamilyOrders.length !== 1 ? "s" : ""} ·{" "}
                Total: <span className="font-semibold text-slate-600">${ctxFamilyOrders.reduce((s, o) => s + o.value, 0).toLocaleString()}/mo</span>
                {" · "}Products: {[...new Set(ctxFamilyOrders.map(o => o.product.split(" ")[0]))].join(", ")}
              </div>
            </div>
          )}

          {/* Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {threadComms.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">
                No messages yet at this level.
                <br />Use the compose area below to send the first one.
              </div>
            )}
            {threadComms.map(comm => <EmailCard key={comm.id} comm={comm} />)}
            <div ref={threadEndRef} />
          </div>

          {/* Compose */}
          <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
            <div className="space-y-2">
              <input
                type="text" placeholder="Subject" value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Write a message, or click Generate AI Update…"
                value={body} onChange={e => setBody(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={handleGenerateAI} disabled={generating || sending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-md hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <><svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Generating…</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/></svg>Generate AI Update</>
                  )}
                </button>
                <button
                  onClick={handleSend} disabled={sending || generating || !subject.trim() || !body.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40"
                >
                  {sending ? (
                    <><svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Sending…</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {ctxMenu && (
        <CtxMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          isRead={readThreadKeys.has(ctxMenu.key)}
          onMarkRead={() => markThreadRead(ctxMenu.key)}
          onMarkUnread={() => markThreadUnread(ctxMenu.key)}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </div>
  );
}
