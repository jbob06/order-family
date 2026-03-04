"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

interface Props {
  onClose: () => void;
}

export function LinkCustomersModal({ onClose }: Props) {
  const { customers, selectedCustomerId, linkCustomers, unlinkCustomers } = useStore();
  const [search, setSearch] = useState("");

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  if (!selectedCustomer) return null;

  const otherCustomers = customers.filter(
    (c) => c.id !== selectedCustomerId &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.accountNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Link Customers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Link accounts to <strong>{selectedCustomer.name}</strong> so you can view and manage their orders together.
          </p>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <input
            autoFocus
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
          {otherCustomers.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No other customers found</p>
          )}
          {otherCustomers.map((customer) => {
            const isLinked = selectedCustomer.linkedCustomerIds.includes(customer.id);
            return (
              <div key={customer.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{customer.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{customer.accountNumber} · {customer.industry}</div>
                </div>
                <button
                  onClick={() => isLinked
                    ? unlinkCustomers(selectedCustomer.id, customer.id)
                    : linkCustomers(selectedCustomer.id, customer.id)
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isLinked
                      ? "text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
                      : "text-blue-600 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  {isLinked ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Unlink
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Link
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {selectedCustomer.linkedCustomerIds.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Currently linked:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedCustomer.linkedCustomerIds.map((id) => {
                const c = customers.find((c) => c.id === id);
                return c ? (
                  <span key={id} className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {c.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="p-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
