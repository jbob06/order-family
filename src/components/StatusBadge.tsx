"use client";

import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-slate-100 text-slate-700" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-700" },
  cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-700" },
  on_hold:    { label: "On Hold",    className: "bg-yellow-100 text-yellow-700" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
