"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useStore } from "@/store/useStore";
import { CustomerSidebar } from "@/components/CustomerSidebar";
import { OrdersPanel } from "@/components/OrdersPanel";
import { FamiliesPanel } from "@/components/FamiliesPanel";
import { CommsView } from "@/components/CommsView";
import { CreateFamilyModal } from "@/components/CreateFamilyModal";
import { LinkCustomersModal } from "@/components/LinkCustomersModal";

type View = "orders" | "communications";

export default function Home() {
  const { orders, selectedOrderIds, assignOrdersToFamily } = useStore();
  const [activeView, setActiveView]           = useState<View>("orders");
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showLinkCustomers, setShowLinkCustomers] = useState(false);
  const [activeDragOrderId, setActiveDragOrderId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "order") {
      setActiveDragOrderId(event.active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragOrderId(null);
    if (!over || active.data.current?.type !== "order") return;
    const draggedOrderId = active.id as string;
    const targetFamilyId = (over.id as string) === "unassigned" ? null : (over.id as string);
    const idsToMove = selectedOrderIds.has(draggedOrderId)
      ? Array.from(selectedOrderIds)
      : [draggedOrderId];
    assignOrdersToFamily(idsToMove, targetFamilyId);
  };

  const activeDragOrder = activeDragOrderId ? orders.find(o => o.id === activeDragOrderId) : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Top navigation ──────────────────────────────────────────────── */}
      <nav className="flex items-center border-b border-slate-200 bg-white px-4 flex-shrink-0">
        <span className="text-sm font-bold text-slate-800 mr-6 py-2.5">Order Family</span>

        {(["orders", "communications"] as View[]).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize
              ${activeView === view
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
          >
            {view === "orders" ? "Orders" : "Communications"}
          </button>
        ))}
      </nav>

      {/* ── Orders view ─────────────────────────────────────────────────── */}
      {activeView === "orders" && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-1 overflow-hidden">
            <CustomerSidebar onLinkRequest={() => setShowLinkCustomers(true)} />
            <OrdersPanel onCreateFamily={() => setShowCreateFamily(true)} />
            <FamiliesPanel onCreateFamily={() => setShowCreateFamily(true)} />
          </div>

          <DragOverlay>
            {activeDragOrder && (
              <div className="bg-white border border-blue-300 shadow-lg rounded-md px-3 py-2 text-sm font-medium text-slate-800 flex items-center gap-2 opacity-95">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 19a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <div>
                  <div className="font-mono text-xs text-slate-500">{activeDragOrder.orderNumber}</div>
                  <div className="truncate max-w-[200px]">{activeDragOrder.product}</div>
                </div>
                {selectedOrderIds.has(activeDragOrder.id) && selectedOrderIds.size > 1 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {selectedOrderIds.size}
                  </span>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Communications view ─────────────────────────────────────────── */}
      {activeView === "communications" && (
        <div className="flex flex-1 overflow-hidden">
          <CommsView />
        </div>
      )}

      {showCreateFamily && <CreateFamilyModal onClose={() => setShowCreateFamily(false)} />}
      {showLinkCustomers && <LinkCustomersModal onClose={() => setShowLinkCustomers(false)} />}
    </div>
  );
}
