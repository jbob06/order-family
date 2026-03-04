"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { FAMILY_COLORS } from "@/types";
import type { Communication, Customer, Order, OrderFamily } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── AI email generator ───────────────────────────────────────────────────────

function generateStatusEmail(
  customer: Customer,
  family: OrderFamily,
  familyOrders: Order[],
): { subject: string; body: string } {
  const totalValue = familyOrders.reduce((s, o) => s + o.value, 0);
  const statusLabels: Record<string, string> = {
    confirm:   "Pending Confirmation",
    implement: "In Implementation",
    finalize:  "Awaiting Finalization",
    activate:  "Ready for Activation",
    billing:   "Active & Billing",
  };

  const byStatus = {
    billing:   familyOrders.filter(o => o.status === "billing"),
    activate:  familyOrders.filter(o => o.status === "activate"),
    implement: familyOrders.filter(o => o.status === "implement"),
    finalize:  familyOrders.filter(o => o.status === "finalize"),
    confirm:   familyOrders.filter(o => o.status === "confirm"),
  };

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const subject = `Status Update — ${family.name} (${familyOrders.length} Order${familyOrders.length !== 1 ? "s" : ""})`;

  let body = `Dear ${customer.name} Team,\n\n`;
  body += `I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "${family.name}" order family as of ${today}.\n\n`;
  body += `This family currently encompasses ${familyOrders.length} service order${familyOrders.length !== 1 ? "s" : ""} with a combined contracted value of $${totalValue.toLocaleString()}.\n\n`;
  body += `━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (const order of familyOrders) {
    body += `${order.orderNumber} | ${order.product}\n`;
    body += `   Status:   ${statusLabels[order.status] ?? order.status}\n`;
    body += `   Location: ${order.address}\n`;
    body += `   Value:    $${order.value.toLocaleString()}/mo\n\n`;
  }

  body += `━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (byStatus.billing.length > 0) {
    body += `✓  ACTIVE & BILLING (${byStatus.billing.length})\n`;
    body += byStatus.billing.map(o => `   • ${o.product} — Fully operational`).join("\n") + "\n\n";
  }
  if (byStatus.activate.length > 0) {
    body += `◎  ACTIVATION READY (${byStatus.activate.length})\n`;
    body += byStatus.activate.map(o => `   • ${o.product} — Circuits tested and confirmed, scheduled for activation`).join("\n") + "\n\n";
  }
  if (byStatus.implement.length > 0) {
    body += `⟳  IMPLEMENTATION IN PROGRESS (${byStatus.implement.length})\n`;
    body += byStatus.implement.map(o => `   • ${o.product} — Field teams engaged, installation on schedule`).join("\n") + "\n\n";
  }
  if (byStatus.finalize.length > 0) {
    body += `◈  PENDING FINALIZATION (${byStatus.finalize.length})\n`;
    body += byStatus.finalize.map(o => `   • ${o.product} — Awaiting final documentation sign-off`).join("\n") + "\n\n";
  }
  if (byStatus.confirm.length > 0) {
    body += `◻  AWAITING CONFIRMATION (${byStatus.confirm.length})\n`;
    body += byStatus.confirm.map(o => `   • ${o.product} — Order submitted, pending internal confirmation`).join("\n") + "\n\n";
  }

  body += `━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const hasInFlight = byStatus.implement.length + byStatus.confirm.length > 0;
  const hasNearDone = byStatus.activate.length + byStatus.finalize.length > 0;

  if (hasInFlight) {
    body += `Our implementation and provisioning teams are actively progressing the above orders. You can expect your next update within 5–7 business days, or sooner if there are significant status changes.\n\n`;
  } else if (hasNearDone) {
    body += `We are in the final stages of bringing these services live. Your account team will reach out shortly to coordinate activation windows and any required on-site access.\n\n`;
  } else {
    body += `All services in this order family are now active and billing. Please review your next invoice for these services and contact us with any questions.\n\n`;
  }

  body += `Should you have any questions or require clarification on any aspect of this update, please don't hesitate to reach out directly to your account manager or reply to this message.\n\n`;
  body += `We appreciate your continued partnership and look forward to delivering the full "${family.name}" portfolio.\n\n`;
  body += `Warm regards,\nAccount Management Team\nEnterprise Services Division`;

  return { subject, body };
}

// ─── Email card ───────────────────────────────────────────────────────────────

function EmailCard({ comm }: { comm: Communication }) {
  const [expanded, setExpanded] = useState(true);
  const isOut = comm.direction === "outbound";

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${isOut ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200"}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
          ${isOut ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
          {comm.fromName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">{comm.fromName}</span>
            {comm.isAiGenerated && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-700 flex-shrink-0">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/>
                </svg>
                AI Generated
              </span>
            )}
            <span className={`text-xs flex-shrink-0 ${isOut ? "text-blue-500" : "text-slate-400"}`}>
              {isOut ? "↑ Outbound" : "↓ Inbound"}
            </span>
            <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{formatDate(comm.sentAt)}</span>
          </div>
          <div className="text-sm font-medium text-slate-700 mt-0.5 truncate">{comm.subject}</div>
          {!expanded && (
            <div className="text-xs text-slate-400 truncate mt-0.5">
              {comm.body.split("\n").filter(l => l.trim()).slice(0, 1).join(" ")}
            </div>
          )}
        </div>

        <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
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

// ─── Main view ────────────────────────────────────────────────────────────────

export function CommsView() {
  const { customers, orders, families, communications, sendCommunication } = useStore();

  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<Set<string>>(
    () => new Set(families.map(f => f.customerId)) // start all expanded
  );
  const [subject, setSubject]     = useState("");
  const [body, setBody]           = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending]     = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);

  const selectedFamily   = families.find(f => f.id === selectedFamilyId);
  const selectedCustomer = selectedFamily ? customers.find(c => c.id === selectedFamily.customerId) : null;
  const familyOrders     = orders.filter(o => o.familyId === selectedFamilyId);
  const familyComms      = communications
    .filter(c => c.familyId === selectedFamilyId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));

  // Scroll to bottom of thread when switching families or new message arrives
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFamilyId, familyComms.length]);

  // Customers that own at least one family
  const customersWithFamilies = customers.filter(c => families.some(f => f.customerId === c.id));

  const toggleCustomer = (id: string) => {
    setExpandedCustomerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleGenerateAI = async () => {
    if (!selectedFamily || !selectedCustomer) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1400));
    const result = generateStatusEmail(selectedCustomer, selectedFamily, familyOrders);
    setSubject(result.subject);
    setBody(result.body);
    setGenerating(false);
  };

  const handleSend = async () => {
    if (!selectedFamilyId || !selectedCustomer || !selectedFamily || !subject.trim() || !body.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 700));
    sendCommunication({
      familyId:    selectedFamilyId,
      customerId:  selectedFamily.customerId,
      subject:     subject.trim(),
      body:        body.trim(),
      sentAt:      new Date().toISOString(),
      fromName:    "Account Management Team",
      fromEmail:   "accounts@orderco.com",
      toName:      selectedCustomer.name,
      toEmail:     `accounts@${selectedCustomer.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      direction:   "outbound",
      isAiGenerated: false,
    });
    setSubject("");
    setBody("");
    setSending(false);
  };

  const colorConfig = selectedFamily ? FAMILY_COLORS.find(c => c.value === selectedFamily.color) : null;

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ── Left panel: customer / family list ───────────────────────────── */}
      <div className="w-72 border-r border-slate-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Communications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Order family message history</p>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {customersWithFamilies.length === 0 && (
            <div className="px-4 py-10 text-center text-xs text-slate-400">
              No order families yet.<br />Create families in the Orders view.
            </div>
          )}

          {customersWithFamilies.map(customer => {
            const customerFamilies = families.filter(f => f.customerId === customer.id);
            const isExpanded = expandedCustomerIds.has(customer.id);

            return (
              <div key={customer.id}>
                {/* Customer row */}
                <button
                  onClick={() => toggleCustomer(customer.id)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <svg className={`w-3 h-3 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{customer.name}</div>
                    <div className="text-xs text-slate-400">
                      {customerFamilies.length} famil{customerFamilies.length !== 1 ? "ies" : "y"}
                    </div>
                  </div>
                </button>

                {/* Families under this customer */}
                {isExpanded && (
                  <div className="ml-3 border-l border-slate-100 mb-1">
                    {customerFamilies.map(family => {
                      const fc = FAMILY_COLORS.find(c => c.value === family.color);
                      const commsForFamily = communications.filter(c => c.familyId === family.id);
                      const lastComm = [...commsForFamily].sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
                      const hasUnread = lastComm?.direction === "inbound";
                      const isSelected = selectedFamilyId === family.id;

                      return (
                        <button
                          key={family.id}
                          onClick={() => setSelectedFamilyId(family.id)}
                          className={`w-full flex items-center gap-2.5 pl-3 pr-3 py-2.5 text-left transition-colors
                            ${isSelected ? "bg-blue-50 border-r-2 border-blue-500" : "hover:bg-slate-50"}`}
                        >
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fc?.dot ?? "bg-slate-300"}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-medium truncate ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                              {family.name}
                            </div>
                            {lastComm ? (
                              <div className="text-xs text-slate-400">
                                {formatShortDate(lastComm.sentAt)} · {commsForFamily.length} msg{commsForFamily.length !== 1 ? "s" : ""}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-300">No messages yet</div>
                            )}
                          </div>
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Last message is inbound" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      {!selectedFamily ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 text-sm">Select an order family to view communications</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Thread header */}
          <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${colorConfig?.dot ?? "bg-slate-300"}`} />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{selectedFamily.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedCustomer?.name} · {familyOrders.length} order{familyOrders.length !== 1 ? "s" : ""}
                  {familyOrders.length > 0 && (
                    <> · ${familyOrders.reduce((s, o) => s + o.value, 0).toLocaleString()}/mo</>
                  )}
                  {" · "}{familyComms.length} message{familyComms.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Order summary chips */}
              <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
                {familyOrders.slice(0, 3).map(o => (
                  <span key={o.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    {o.orderNumber}
                  </span>
                ))}
                {familyOrders.length > 3 && (
                  <span className="text-xs text-slate-400">+{familyOrders.length - 3} more</span>
                )}
              </div>
            </div>
          </div>

          {/* Email thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {familyComms.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">
                No messages yet for this order family.
                <br />Use the compose area below to send the first update.
              </div>
            )}
            {familyComms.map(comm => (
              <EmailCard key={comm.id} comm={comm} />
            ))}
            <div ref={threadEndRef} />
          </div>

          {/* Compose area */}
          <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Write a message, or click Generate AI Update to draft a status email automatically…"
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={handleGenerateAI}
                  disabled={generating || sending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-md hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"/>
                      </svg>
                      Generate AI Update
                    </>
                  )}
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || generating || !subject.trim() || !body.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40"
                >
                  {sending ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
