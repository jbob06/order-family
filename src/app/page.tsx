"use client";

import { useState, useEffect } from "react";
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
  const { orders, selectedOrderIds, assignOrdersToFamily, users, currentUserId, switchUser } = useStore();
  const [activeView, setActiveView]           = useState<View>("orders");
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showLinkCustomers, setShowLinkCustomers] = useState(false);
  const [activeDragOrderId, setActiveDragOrderId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

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
  const currentUser = users.find(u => u.id === currentUserId);

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Top navigation ──────────────────────────────────────────────── */}
      <nav className="flex items-center border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 flex-shrink-0">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mr-6 py-2.5">Order Family</span>

        {(["orders", "communications"] as View[]).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize
              ${activeView === view
                ? "border-blue-600 text-blue-700 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"}`}
          >
            {view === "orders" ? "Orders" : "Communications"}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(m => !m)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(m => !m)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {currentUser?.name.charAt(0)}
              </div>
              <span className="font-medium">{currentUser?.name}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-1">
                <div className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Switch User</div>
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => { switchUser(user.id); setShowUserMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                      ${user.id === currentUserId
                        ? "bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0
                      ${user.id === currentUserId
                        ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.customerIds.length} customer{user.customerIds.length !== 1 ? "s" : ""}</div>
                    </div>
                    {user.id === currentUserId && (
                      <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Orders view ─────────────────────────────────────────────────── */}
      {activeView === "orders" && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-1 overflow-hidden" onClick={() => setShowUserMenu(false)}>
            <CustomerSidebar onLinkRequest={() => setShowLinkCustomers(true)} />
            <OrdersPanel onCreateFamily={() => setShowCreateFamily(true)} />
            <FamiliesPanel onCreateFamily={() => setShowCreateFamily(true)} />
          </div>

          <DragOverlay>
            {activeDragOrder && (
              <div className="bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-600 shadow-lg rounded-md px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 opacity-95">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM9 19a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <div>
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{activeDragOrder.orderNumber}</div>
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
        <div className="flex flex-1 overflow-hidden" onClick={() => setShowUserMenu(false)}>
          <CommsView />
        </div>
      )}

      {showCreateFamily && <CreateFamilyModal onClose={() => setShowCreateFamily(false)} />}
      {showLinkCustomers && <LinkCustomersModal onClose={() => setShowLinkCustomers(false)} />}

      {/* Close user menu on outside click */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
