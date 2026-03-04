"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import type { Customer } from "@/types";

interface Props {
  onLinkRequest: () => void;
}

export function CustomerSidebar({ onLinkRequest }: Props) {
  const {
    customers, selectedCustomerId, selectCustomer,
    users, currentUserId, addCustomerToUser, removeCustomerFromUser,
  } = useStore();
  const [search, setSearch] = useState("");
  const [showTrack, setShowTrack] = useState(false);

  const currentUser = users.find(u => u.id === currentUserId);
  const myCustomerIds = new Set(currentUser?.customerIds ?? []);

  const myCustomers = customers.filter(c => myCustomerIds.has(c.id));
  const filtered = myCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Customers not yet in the user's list
  const untrackedCustomers = customers.filter(c => !myCustomerIds.has(c.id));

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200">
        <h1 className="text-base font-semibold text-slate-900">Order Family Manager</h1>
        <p className="text-xs text-slate-500 mt-0.5">My Customers</p>
      </div>

      <div className="px-3 py-2 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No customers found</p>
        )}
        {filtered.map((customer) => (
          <CustomerItem
            key={customer.id}
            customer={customer}
            isSelected={selectedCustomerId === customer.id}
            linkedCustomers={customer.linkedCustomerIds
              .map((id) => customers.find((c) => c.id === id))
              .filter(Boolean) as Customer[]}
            onSelect={() => selectCustomer(customer.id)}
            onUntrack={() => removeCustomerFromUser(customer.id)}
          />
        ))}
      </div>

      {/* Track customer panel */}
      {showTrack && untrackedCustomers.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 max-h-48 overflow-y-auto">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add to tracking</span>
            <button onClick={() => setShowTrack(false)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {untrackedCustomers.map(c => (
            <button
              key={c.id}
              onClick={() => addCustomerToUser(c.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-white transition-colors"
            >
              <div className="min-w-0 text-left">
                <div className="truncate font-medium">{c.name}</div>
                <div className="text-xs text-slate-400">{c.accountNumber}</div>
              </div>
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-slate-100 flex gap-2">
        <button
          onClick={onLinkRequest}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Link
        </button>
        <button
          onClick={() => setShowTrack(t => !t)}
          title="Track a customer"
          className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md transition-colors
            ${showTrack ? "bg-blue-50 border-blue-200 text-blue-700" : "text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

function CustomerItem({
  customer,
  isSelected,
  linkedCustomers,
  onSelect,
  onUntrack,
}: {
  customer: Customer;
  isSelected: boolean;
  linkedCustomers: Customer[];
  onSelect: () => void;
  onUntrack: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        onContextMenu={e => { e.preventDefault(); setShowMenu(m => !m); }}
        className={`w-full text-left px-3 py-2.5 border-l-2 transition-colors ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-transparent hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium leading-tight ${isSelected ? "text-blue-900" : "text-slate-900"}`}>
            {customer.name}
          </span>
          {linkedCustomers.length > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-slate-400" title={`Linked to: ${linkedCustomers.map((c) => c.name).join(", ")}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {linkedCustomers.length}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{customer.accountNumber}</div>
        {linkedCustomers.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {linkedCustomers.map((lc) => (
              <span key={lc.id} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                {lc.name.split(" ")[0]}
              </span>
            ))}
          </div>
        )}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute left-full top-0 ml-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={() => { onUntrack(); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h12a6 6 0 00-6-6zM21 12h-6" />
              </svg>
              Remove from my list
            </button>
          </div>
        </>
      )}
    </div>
  );
}
