"use client";

import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useStore } from "@/store/useStore";
import { FAMILY_COLORS } from "@/types";
import type { Order, OrderFamily } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  onCreateFamily: () => void;
}

export function FamiliesPanel({ onCreateFamily }: Props) {
  const {
    customers,
    orders,
    families,
    selectedCustomerId,
    getLinkedGroupIds,
    deleteFamily,
    renameFamily,
    assignOrdersToFamily,
  } = useStore();

  const linkedGroupIds = getLinkedGroupIds();

  const visibleFamilies = families.filter((f) => linkedGroupIds.includes(f.customerId));
  const groupOrders = orders.filter((o) => linkedGroupIds.includes(o.customerId));
  const unassignedOrders = groupOrders.filter((o) => o.familyId === null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const hasLinkedCustomers = (selectedCustomer?.linkedCustomerIds.length ?? 0) > 0;

  return (
    <aside className="w-80 flex-shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Order Families</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{visibleFamilies.length} families</p>
        </div>
        {selectedCustomerId && (
          <button
            onClick={onCreateFamily}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        )}
      </div>

      {hasLinkedCustomers && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
          Families from all linked accounts are shown. Drag any order into any family to link across accounts.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!selectedCustomerId && (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">Select a customer to manage families</p>
        )}

        {selectedCustomerId && (
          <>
            <UnassignedDropZone orders={unassignedOrders} customers={customers} />

            {visibleFamilies.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 dark:text-slate-500">No families yet</p>
                <button onClick={onCreateFamily} className="mt-2 text-xs text-blue-600 hover:underline">
                  Create one
                </button>
              </div>
            )}

            {visibleFamilies.map((family) => {
              const familyOrders = orders.filter((o) => o.familyId === family.id);
              return (
                <FamilyCard
                  key={family.id}
                  family={family}
                  orders={familyOrders}
                  customers={customers}
                  onDelete={() => deleteFamily(family.id)}
                  onRename={(name) => renameFamily(family.id, name)}
                  onRemoveOrder={(orderId) => assignOrdersToFamily([orderId], null)}
                />
              );
            })}
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Draggable item inside the unassigned list ───────────────────────────────

function DraggableUnassignedItem({
  order,
  customerName,
}: {
  order: Order;
  customerName: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { type: "order", orderId: order.id, familyId: null },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
      className={`flex items-center gap-2 px-2 py-1.5 rounded border bg-white dark:bg-slate-800 select-none transition-all ${
        isDragging
          ? "opacity-40 border-slate-200 dark:border-slate-700"
          : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm"
      }`}
    >
      <svg className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 19a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate">{order.orderNumber}</div>
        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{order.product}</div>
        {customerName && <div className="text-xs text-slate-300 dark:text-slate-600 truncate">{customerName}</div>}
      </div>
    </div>
  );
}

// ─── Unassigned drop zone ─────────────────────────────────────────────────────

function UnassignedDropZone({
  orders,
  customers,
}: {
  orders: Order[];
  customers: { id: string; name: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const { isOver, setNodeRef } = useDroppable({ id: "unassigned" });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 border-dashed transition-colors ${
        isOver
          ? "border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-700"
          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Unassigned</span>
          <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOver && (
        <div className="px-3 pb-2 text-xs text-slate-500 dark:text-slate-400 text-center">Drop here to remove from family</div>
      )}

      {expanded && orders.length > 0 && (
        <div className="px-3 pb-3 space-y-1">
          {orders.map((order) => {
            const customerName = customers.find((c) => c.id === order.customerId)?.name ?? "";
            return (
              <DraggableUnassignedItem key={order.id} order={order} customerName={customerName} />
            );
          })}
        </div>
      )}

      {expanded && orders.length === 0 && (
        <div className="px-3 pb-3 text-xs text-slate-400 dark:text-slate-500 text-center">All orders are assigned</div>
      )}
    </div>
  );
}

// ─── Family card ──────────────────────────────────────────────────────────────

function FamilyCard({
  family,
  orders,
  customers,
  onDelete,
  onRename,
  onRemoveOrder,
}: {
  family: OrderFamily;
  orders: Order[];
  customers: { id: string; name: string }[];
  onDelete: () => void;
  onRename: (name: string) => void;
  onRemoveOrder: (orderId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(family.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { isOver, setNodeRef } = useDroppable({ id: family.id });
  const colorConfig = FAMILY_COLORS.find((c) => c.value === family.color) ?? FAMILY_COLORS[0];

  const handleRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== family.name) onRename(trimmed);
    setEditing(false);
  };

  const totalValue = orders.reduce((sum, o) => sum + o.value, 0);

  // Unique customer names derived from actual orders in this family — shows all
  // customers that have contributed orders, not just the family "owner".
  const customerNames = [
    ...new Set(
      orders
        .map((o) => customers.find((c) => c.id === o.customerId)?.name)
        .filter((n): n is string => !!n)
    ),
  ];

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border transition-all ${colorConfig.bg} ${
        isOver ? `border-2 ${colorConfig.border} shadow-md` : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {/* Family header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorConfig.dot}`} />

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full text-left text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 truncate block"
              title="Click to rename"
            >
              {family.name}
            </button>
          )}
          {/* Show every customer that has an order in this family */}
          {customerNames.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate">
              {customerNames.join(" · ")}
            </span>
          )}
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 flex-shrink-0"
        >
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOver && (
        <div className={`mx-3 mb-2 py-1.5 rounded text-xs text-center font-medium ${colorConfig.badge}`}>
          Drop to add to &ldquo;{family.name}&rdquo;
        </div>
      )}

      {/* Expanded orders */}
      {expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-slate-200 dark:border-slate-700 pt-2.5">
          {orders.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-1">No orders — drag some here</p>
          )}
          {orders.map((order) => {
            const customer = customers.find((c) => c.id === order.customerId);
            return (
              <div key={order.id} className="bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 px-2.5 py-2">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate">{order.orderNumber}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={order.product}>{order.product}</div>
                    {customer && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{customer.name}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <StatusBadge status={order.status} />
                    <button
                      onClick={() => onRemoveOrder(order.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors p-0.5"
                      title="Remove from family"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">${order.value.toLocaleString()}</div>
              </div>
            );
          })}

          {orders.length > 0 && (
            <div className="text-right text-xs font-medium text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
              Total: ${totalValue.toLocaleString()}
            </div>
          )}

          <div className="pt-1">
            {confirmDelete ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex-1">Delete this family?</span>
                <button onClick={onDelete} className="text-red-600 font-medium hover:underline">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-slate-400 hover:underline">No</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Delete family
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
