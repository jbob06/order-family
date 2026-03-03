"use client";

import { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useStore } from "@/store/useStore";
import { FAMILY_COLORS } from "@/types";
import type { Order, OrderStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";

// ─── Column definitions ───────────────────────────────────────────────────────

type ColKey = "orderNumber" | "product" | "account" | "status" | "submittedDate" | "value" | "address" | "family";
type SortCol = "orderNumber" | "product" | "status" | "submittedDate" | "value" | "family";
type FamilyRef = { id: string; name: string; color: string };

interface ColDef {
  key: ColKey;
  label: string;
  sortKey?: SortCol;
  align?: "right";
}

const ALL_COLUMNS: ColDef[] = [
  { key: "orderNumber",   label: "Order #",   sortKey: "orderNumber" },
  { key: "product",       label: "Product",   sortKey: "product" },
  { key: "account",       label: "Account" },
  { key: "status",        label: "Status",    sortKey: "status" },
  { key: "submittedDate", label: "Submitted", sortKey: "submittedDate" },
  { key: "value",         label: "Value",     sortKey: "value",  align: "right" },
  { key: "address",       label: "Address" },
  { key: "family",        label: "Family",    sortKey: "family" },
];

const DEFAULT_COL_ORDER: ColKey[] = ["orderNumber", "product", "account", "status", "submittedDate", "value", "address", "family"];

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all",       label: "All Statuses" },
  { value: "confirm",   label: "Confirm" },
  { value: "implement", label: "Implement" },
  { value: "finalize",  label: "Finalize" },
  { value: "activate",  label: "Activate" },
  { value: "billing",   label: "Billing" },
];

const SORT_OPTIONS = [
  { value: "orderNumber",   label: "Order #" },
  { value: "product",       label: "Product" },
  { value: "status",        label: "Status" },
  { value: "submittedDate", label: "Date" },
  { value: "value",         label: "Value" },
  { value: "family",        label: "Family" },
];

const STATUS_CARD_BORDER: Record<OrderStatus, string> = {
  confirm:   "border-l-amber-400",
  implement: "border-l-blue-500",
  finalize:  "border-l-purple-500",
  activate:  "border-l-teal-500",
  billing:   "border-l-green-500",
};

// ─── Main panel ───────────────────────────────────────────────────────────────

interface Props { onCreateFamily: () => void; }

export function OrdersPanel({ onCreateFamily }: Props) {
  const {
    customers, orders, families,
    selectedCustomerId, selectedOrderIds, viewLinkedOrders,
    setViewLinkedOrders, toggleOrderSelection, selectAllOrders,
    clearOrderSelection, assignOrdersToFamily,
    getVisibleCustomerIds, getLinkedGroupIds,
  } = useStore();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [bulkFamilyId, setBulkFamilyId] = useState<string>("");
  const [view, setView]                 = useState<"table" | "cards">("table");
  const [sortCol, setSortCol]           = useState<SortCol>("submittedDate");
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("desc");
  const [columnOrder, setColumnOrder]   = useState<ColKey[]>(DEFAULT_COL_ORDER);

  const [draggedCol, setDraggedCol] = useState<ColKey | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColKey | null>(null);

  const selectedCustomer   = customers.find((c) => c.id === selectedCustomerId);
  const visibleCustomerIds = getVisibleCustomerIds();
  const linkedGroupIds     = getLinkedGroupIds();
  const availableFamilies  = families.filter((f) => linkedGroupIds.includes(f.customerId));

  // Ordered columns; filter "account" when not in linked mode
  const visibleColumns = columnOrder
    .map((k) => ALL_COLUMNS.find((c) => c.key === k)!)
    .filter((c) => c && (c.key !== "account" || viewLinkedOrders));

  // ── Filtered + sorted orders ──────────────────────────────────────────────
  const visibleOrders = useMemo(() => {
    const filtered = orders.filter((o) => {
      if (!visibleCustomerIds.includes(o.customerId)) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!o.orderNumber.toLowerCase().includes(q) && !o.product.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "orderNumber":   cmp = a.orderNumber.localeCompare(b.orderNumber); break;
        case "product":       cmp = a.product.localeCompare(b.product); break;
        case "status":        cmp = a.status.localeCompare(b.status); break;
        case "submittedDate": cmp = a.submittedDate.localeCompare(b.submittedDate); break;
        case "value":         cmp = a.value - b.value; break;
        case "family": {
          const af = families.find((f) => f.id === a.familyId)?.name ?? "";
          const bf = families.find((f) => f.id === b.familyId)?.name ?? "";
          cmp = af.localeCompare(bf); break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [orders, visibleCustomerIds, statusFilter, search, sortCol, sortDir, families]);

  const allSelected  = visibleOrders.length > 0 && visibleOrders.every((o) => selectedOrderIds.has(o.id));
  const someSelected = selectedOrderIds.size > 0;

  const linkedCustomers = selectedCustomer
    ? selectedCustomer.linkedCustomerIds.map((id) => customers.find((c) => c.id === id)).filter(Boolean)
    : [];

  const handleSort = (col: SortCol) => {
    if (col === sortCol) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const handleSelectAll = () => {
    if (allSelected) clearOrderSelection();
    else selectAllOrders(visibleOrders.map((o) => o.id));
  };

  const handleBulkAssign = () => {
    if (!bulkFamilyId) return;
    if (bulkFamilyId === "__new__") { onCreateFamily(); setBulkFamilyId(""); return; }
    assignOrdersToFamily(Array.from(selectedOrderIds), bulkFamilyId === "unassigned" ? null : bulkFamilyId);
    setBulkFamilyId("");
  };

  // ── Column drag handlers (native HTML drag, no DndContext needed) ──────────
  const handleColDragStart = (key: ColKey) => setDraggedCol(key);
  const handleColDragEnd   = () => { setDraggedCol(null); setDragOverCol(null); };
  const handleColDrop      = (targetKey: ColKey) => {
    if (!draggedCol || draggedCol === targetKey) return;
    setColumnOrder((prev) => arrayMove(prev, prev.indexOf(draggedCol), prev.indexOf(targetKey)));
  };

  if (!selectedCustomerId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 text-sm">Select a customer to view orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{selectedCustomer?.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedCustomer?.accountNumber} · {selectedCustomer?.industry}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {linkedCustomers.length > 0 && (
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input type="checkbox" checked={viewLinkedOrders} onChange={(e) => setViewLinkedOrders(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600" />
                Show linked accounts ({linkedCustomers.length})
              </label>
            )}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
              <button onClick={() => setView("table")} title="Table view"
                className={`px-2 py-1.5 transition-colors ${view === "table" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 10h18M3 14h18M10 4v16M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
                </svg>
              </button>
              <button onClick={() => setView("cards")} title="Card view"
                className={`px-2 py-1.5 transition-colors border-l border-slate-200 ${view === "cards" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
            <button onClick={onCreateFamily}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Family
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 mt-3">
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="flex items-center gap-1 border border-slate-200 rounded-md overflow-hidden bg-white">
            <select value={sortCol} onChange={(e) => setSortCol(e.target.value as SortCol)}
              className="pl-2 pr-1 py-1.5 text-xs text-slate-600 bg-transparent focus:outline-none">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-2 py-1.5 text-slate-500 hover:bg-slate-50 border-l border-slate-200 transition-colors"
              title={sortDir === "asc" ? "Ascending" : "Descending"}>
              {sortDir === "asc"
                ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m10 0l-4-4m4 4l-4 4" /></svg>
                : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m10 4l-4 4m4-4l-4-4" /></svg>}
            </button>
          </div>
          <span className="text-xs text-slate-400">{visibleOrders.length} orders</span>
        </div>
      </div>

      {/* ── Bulk bar ────────────────────────────────────────────────────────── */}
      {someSelected && (
        <div className="bg-blue-600 text-white px-5 py-2 flex items-center gap-3">
          <span className="text-sm font-medium">{selectedOrderIds.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <select value={bulkFamilyId} onChange={(e) => setBulkFamilyId(e.target.value)}
              className="px-2 py-1 text-sm text-slate-900 bg-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-white">
              <option value="">Assign to family...</option>
              <option value="unassigned">— Remove from family —</option>
              <option value="__new__">+ Create new family...</option>
              {availableFamilies.length > 0 && <option disabled>──────────────</option>}
              {availableFamilies.map((f) => {
                const owner  = customers.find((c) => c.id === f.customerId);
                const linked = f.customerId !== selectedCustomerId;
                return <option key={f.id} value={f.id}>{f.name}{linked && owner ? ` (${owner.name.split(" ")[0]})` : ""}</option>;
              })}
            </select>
            <button onClick={handleBulkAssign} disabled={!bulkFamilyId}
              className="px-3 py-1 text-sm bg-white text-blue-700 font-medium rounded disabled:opacity-40 hover:bg-blue-50 transition-colors">
              Apply
            </button>
            <button onClick={clearOrderSelection} className="px-2 py-1 text-sm text-blue-200 hover:text-white transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {view === "table" ? (
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5 w-10">
                  <input type="checkbox" checked={allSelected} onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600" />
                </th>
                {visibleColumns.map((col) => (
                  <ColHeader
                    key={col.key}
                    col={col}
                    sortCol={sortCol}
                    sortDir={sortDir}
                    onSort={handleSort}
                    draggedCol={draggedCol}
                    dragOverCol={dragOverCol}
                    setDragOverCol={setDragOverCol}
                    onDragStart={handleColDragStart}
                    onDragEnd={handleColDragEnd}
                    onDrop={handleColDrop}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  columns={visibleColumns}
                  isSelected={selectedOrderIds.has(order.id)}
                  onToggle={() => toggleOrderSelection(order.id)}
                  families={availableFamilies}
                  showAccount={viewLinkedOrders}
                  accountName={customers.find((c) => c.id === order.customerId)?.name ?? ""}
                />
              ))}
              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center py-12 text-slate-400 text-sm">
                    No orders match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-4 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrderIds.has(order.id)}
                onToggle={() => toggleOrderSelection(order.id)}
                families={availableFamilies}
                showAccount={viewLinkedOrders}
                accountName={customers.find((c) => c.id === order.customerId)?.name ?? ""}
                address={order.address}
              />
            ))}
            {visibleOrders.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-400 text-sm">
                No orders match the current filters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Column header with native HTML drag-to-reorder ──────────────────────────

function ColHeader({
  col, sortCol, sortDir, onSort,
  draggedCol, dragOverCol, setDragOverCol,
  onDragStart, onDragEnd, onDrop,
}: {
  col: ColDef; sortCol: SortCol; sortDir: "asc" | "desc"; onSort: (c: SortCol) => void;
  draggedCol: ColKey | null; dragOverCol: ColKey | null;
  setDragOverCol: (k: ColKey | null) => void;
  onDragStart: (k: ColKey) => void; onDragEnd: () => void; onDrop: (k: ColKey) => void;
}) {
  const isActive    = col.sortKey === sortCol;
  const isDragging  = draggedCol === col.key;
  const isOver      = dragOverCol === col.key && !isDragging;

  return (
    <th
      draggable
      onDragStart={(e) => {
        onDragStart(col.key);
        const ghost = document.createElement("div");
        ghost.textContent = col.label;
        ghost.style.cssText = "position:fixed;top:-999px;padding:4px 10px;background:#fff;border:1px solid #93c5fd;border-radius:6px;font-size:11px;font-weight:700;color:#1d4ed8;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.15)";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 14);
        requestAnimationFrame(() => document.body.removeChild(ghost));
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (!draggedCol) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverCol(col.key);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverCol(null);
      }}
      onDrop={(e) => { e.preventDefault(); onDrop(col.key); setDragOverCol(null); }}
      onClick={() => { if (col.sortKey) onSort(col.sortKey); }}
      className={`px-3 py-2.5 text-${col.align ?? "left"} text-xs uppercase tracking-wide whitespace-nowrap
        select-none transition-colors cursor-grab active:cursor-grabbing
        ${col.sortKey ? "hover:bg-slate-50" : ""}
        ${isDragging ? "opacity-30" : ""}
        ${isOver ? "bg-blue-50 border-l-2 border-blue-400" : ""}`}
    >
      <div className={`inline-flex items-center gap-0.5 font-medium
        ${col.sortKey ? (isActive ? "text-blue-600" : "text-slate-600") : "text-slate-600"}`}
      >
        {col.label}
        {col.sortKey && (
          <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
            {isActive && sortDir === "asc"
              ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
              : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>}
          </span>
        )}
      </div>
    </th>
  );
}

// ─── Table row (cells driven by column order) ─────────────────────────────────

function OrderRow({
  order, columns, isSelected, onToggle, families, showAccount, accountName,
}: {
  order: Order; columns: ColDef[]; isSelected: boolean; onToggle: () => void;
  families: FamilyRef[]; showAccount: boolean; accountName: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { type: "order", orderId: order.id, familyId: order.familyId },
  });

  return (
    <tr
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
      className={`border-b border-slate-100 transition-colors select-none ${
        isDragging ? "opacity-40" : ""
      } ${isSelected ? "bg-blue-50" : "bg-white hover:bg-slate-50"}`}
    >
      <td className="px-4 py-2.5" onPointerDown={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={isSelected} onChange={onToggle}
          style={{ cursor: "pointer" }} className="rounded border-slate-300 text-blue-600" />
      </td>
      {columns.map((col) => renderCell(col, order, families, showAccount, accountName))}
    </tr>
  );
}

// Renders the correct <td> for each column key
function renderCell(
  col: ColDef, order: Order, families: FamilyRef[], showAccount: boolean, accountName: string,
): React.ReactElement | null {
  const family      = families.find((f) => f.id === order.familyId);
  const colorConfig = family ? FAMILY_COLORS.find((c) => c.value === family.color) : null;

  switch (col.key) {
    case "orderNumber":
      return (
        <td key="orderNumber" className="px-3 py-2.5 font-mono text-xs text-slate-700 font-medium whitespace-nowrap">
          {order.orderNumber}
        </td>
      );
    case "product":
      return (
        <td key="product" className="px-3 py-2.5 text-slate-800 max-w-[220px]">
          <span className="block truncate" title={order.product}>{order.product}</span>
        </td>
      );
    case "account":
      if (!showAccount) return null;
      return (
        <td key="account" className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
          {accountName.split(" ").slice(0, 2).join(" ")}
        </td>
      );
    case "status":
      return (
        <td key="status" className="px-3 py-2.5">
          <StatusBadge status={order.status} />
        </td>
      );
    case "submittedDate":
      return (
        <td key="submittedDate" className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
          {order.submittedDate}
        </td>
      );
    case "value":
      return (
        <td key="value" className="px-3 py-2.5 text-right text-xs text-slate-700 whitespace-nowrap font-medium">
          ${order.value.toLocaleString()}
        </td>
      );
    case "address":
      return (
        <td key="address" className="px-3 py-2.5 text-xs text-slate-500 max-w-[180px]">
          <span className="block truncate" title={order.address}>{order.address}</span>
        </td>
      );
    case "family":
      return (
        <td key="family" className="px-3 py-2.5">
          {family && colorConfig ? (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorConfig.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.dot}`} />
              {family.name}
            </span>
          ) : (
            <span className="text-xs text-slate-300">—</span>
          )}
        </td>
      );
    default:
      return null;
  }
}

// ─── Card view ────────────────────────────────────────────────────────────────

function OrderCard({
  order, isSelected, onToggle, families, showAccount, accountName, address,
}: {
  order: Order; isSelected: boolean; onToggle: () => void;
  families: FamilyRef[]; showAccount: boolean; accountName: string; address: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { type: "order", orderId: order.id, familyId: order.familyId },
  });

  const family      = families.find((f) => f.id === order.familyId);
  const colorConfig = family ? FAMILY_COLORS.find((c) => c.value === family.color) : null;

  return (
    <div
      ref={setNodeRef} {...listeners} {...attributes}
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
      className={`bg-white rounded-xl border-l-4 border border-slate-200 shadow-sm select-none transition-all duration-150
        ${STATUS_CARD_BORDER[order.status]}
        ${isDragging ? "opacity-40 shadow-none" : "hover:shadow-md hover:-translate-y-0.5"}
        ${isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div onPointerDown={(e) => e.stopPropagation()} className="flex items-center mt-0.5">
            <input type="checkbox" checked={isSelected} onChange={onToggle}
              style={{ cursor: "pointer" }} className="rounded border-slate-300 text-blue-600" />
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="font-mono text-xs text-slate-400 font-medium mb-1">{order.orderNumber}</div>
        <div className="text-sm font-semibold text-slate-800 leading-snug mb-3" title={order.product}>
          {order.product}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{order.submittedDate}</span>
          <span className="font-semibold text-slate-700">${order.value.toLocaleString()}</span>
        </div>
        {showAccount && accountName && (
          <div className="text-xs text-slate-400 mt-1.5 truncate">{accountName}</div>
        )}
        <div className="flex items-start gap-1 mt-1.5">
          <svg className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-slate-400 leading-tight" title={address}>{address}</span>
        </div>
        {family && colorConfig ? (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium w-full justify-center ${colorConfig.badge}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorConfig.dot}`} />
              {family.name}
            </span>
          </div>
        ) : (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <span className="text-xs text-slate-300 block text-center">Unassigned — drag to a family</span>
          </div>
        )}
      </div>
    </div>
  );
}
