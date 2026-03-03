"use client";

import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  confirm:   { label: "Confirm",   className: "bg-amber-100 text-amber-700" },
  implement: { label: "Implement", className: "bg-blue-100 text-blue-700" },
  finalize:  { label: "Finalize",  className: "bg-purple-100 text-purple-700" },
  activate:  { label: "Activate",  className: "bg-teal-100 text-teal-700" },
  billing:   { label: "Billing",   className: "bg-green-100 text-green-700" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
