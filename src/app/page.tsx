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
import { CreateFamilyModal } from "@/components/CreateFamilyModal";
import { LinkCustomersModal } from "@/components/LinkCustomersModal";

export default function Home() {
  const { orders, selectedOrderIds, assignOrdersToFamily } = useStore();
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showLinkCustomers, setShowLinkCustomers] = useState(false);
  const [activeDragOrderId, setActiveDragOrderId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "order") {
      setActiveDragOrderId(active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragOrderId(null);

    if (!over || active.data.current?.type !== "order") return;

    const draggedOrderId = active.id as string;
    const targetId = over.id as string;
    const targetFamilyId = targetId === "unassigned" ? null : targetId;

    // If the dragged order is in the selection, move all selected orders
    const idsToMove = selectedOrderIds.has(draggedOrderId)
      ? Array.from(selectedOrderIds)
      : [draggedOrderId];

    assignOrdersToFamily(idsToMove, targetFamilyId);
  };

  const activeDragOrder = activeDragOrderId
    ? orders.find((o) => o.id === activeDragOrderId)
    : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        <CustomerSidebar onLinkRequest={() => setShowLinkCustomers(true)} />
        <OrdersPanel onCreateFamily={() => setShowCreateFamily(true)} />
        <FamiliesPanel onCreateFamily={() => setShowCreateFamily(true)} />
      </div>

      {/* Drag overlay */}
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

      {showCreateFamily && <CreateFamilyModal onClose={() => setShowCreateFamily(false)} />}
      {showLinkCustomers && <LinkCustomersModal onClose={() => setShowLinkCustomers(false)} />}
    </DndContext>
  );
}
