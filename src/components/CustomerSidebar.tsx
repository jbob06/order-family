"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import type { Customer } from "@/types";

interface Props {
  onLinkRequest: () => void;
}

export function CustomerSidebar({ onLinkRequest }: Props) {
  const { customers, selectedCustomerId, selectCustomer } = useStore();
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200">
        <h1 className="text-base font-semibold text-slate-900">Order Family Manager</h1>
        <p className="text-xs text-slate-500 mt-0.5">Customers</p>
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
          />
        ))}
      </div>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onLinkRequest}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Link Customers
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
}: {
  customer: Customer;
  isSelected: boolean;
  linkedCustomers: Customer[];
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
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
  );
}
