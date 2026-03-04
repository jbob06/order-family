"use client";

import { create } from "zustand";
import type { AppUser, Customer, Order, OrderFamily, Communication } from "@/types";
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_FAMILIES, INITIAL_COMMUNICATIONS, INITIAL_USERS } from "@/data/placeholder";

const COLORS = ["blue", "green", "purple", "orange", "red", "teal", "pink", "yellow"];

interface StoreState {
  customers: Customer[];
  orders: Order[];
  families: OrderFamily[];

  // Selection state
  selectedCustomerId: string | null;
  selectedOrderIds: Set<string>;
  viewLinkedOrders: boolean;

  // Actions — customers
  selectCustomer: (id: string) => void;
  linkCustomers: (id1: string, id2: string) => void;
  unlinkCustomers: (id1: string, id2: string) => void;
  setViewLinkedOrders: (value: boolean) => void;

  // Actions — order selection
  toggleOrderSelection: (id: string) => void;
  selectAllOrders: (ids: string[]) => void;
  clearOrderSelection: () => void;

  // Actions — families
  createFamily: (name: string, color: string) => void;
  deleteFamily: (id: string) => void;
  renameFamily: (id: string, name: string) => void;
  assignOrdersToFamily: (orderIds: string[], familyId: string | null) => void;

  // Communications
  communications: Communication[];
  sendCommunication: (comm: Omit<Communication, "id">) => void;

  // Read tracking — keys: "customer:id" | "family:id" | "order:id"
  readThreadKeys: Set<string>;
  markThreadRead: (key: string) => void;
  markThreadUnread: (key: string) => void;

  // Multi-user
  users: AppUser[];
  currentUserId: string;
  switchUser: (id: string) => void;
  addCustomerToUser: (customerId: string) => void;
  removeCustomerFromUser: (customerId: string) => void;

  // Computed helpers
  getVisibleCustomerIds: () => string[];
  getLinkedGroupIds: () => string[];
  getCurrentUser: () => AppUser | undefined;
}

let familyCounter = 0;

export const useStore = create<StoreState>((set, get) => ({
  customers: INITIAL_CUSTOMERS,
  orders: INITIAL_ORDERS,
  families: INITIAL_FAMILIES,
  communications: INITIAL_COMMUNICATIONS,
  selectedCustomerId: null,
  selectedOrderIds: new Set(),
  viewLinkedOrders: false,
  readThreadKeys: new Set(),

  users: INITIAL_USERS,
  currentUserId: INITIAL_USERS[0].id,

  selectCustomer: (id) =>
    set({ selectedCustomerId: id, selectedOrderIds: new Set(), viewLinkedOrders: false }),

  linkCustomers: (id1, id2) =>
    set((state) => ({
      customers: state.customers.map((c) => {
        if (c.id === id1 && !c.linkedCustomerIds.includes(id2)) {
          return { ...c, linkedCustomerIds: [...c.linkedCustomerIds, id2] };
        }
        if (c.id === id2 && !c.linkedCustomerIds.includes(id1)) {
          return { ...c, linkedCustomerIds: [...c.linkedCustomerIds, id1] };
        }
        return c;
      }),
    })),

  unlinkCustomers: (id1, id2) =>
    set((state) => ({
      customers: state.customers.map((c) => {
        if (c.id === id1) {
          return { ...c, linkedCustomerIds: c.linkedCustomerIds.filter((id) => id !== id2) };
        }
        if (c.id === id2) {
          return { ...c, linkedCustomerIds: c.linkedCustomerIds.filter((id) => id !== id1) };
        }
        return c;
      }),
    })),

  setViewLinkedOrders: (value) => set({ viewLinkedOrders: value }),

  toggleOrderSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedOrderIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedOrderIds: next };
    }),

  selectAllOrders: (ids) =>
    set({ selectedOrderIds: new Set(ids) }),

  clearOrderSelection: () => set({ selectedOrderIds: new Set() }),

  createFamily: (name, color) => {
    const id = `fam-${Date.now()}-${++familyCounter}`;
    const { selectedCustomerId } = get();
    if (!selectedCustomerId) return;
    set((state) => ({
      families: [
        ...state.families,
        { id, name, color, customerId: selectedCustomerId },
      ],
    }));
  },

  deleteFamily: (id) =>
    set((state) => ({
      families: state.families.filter((f) => f.id !== id),
      orders: state.orders.map((o) =>
        o.familyId === id ? { ...o, familyId: null } : o
      ),
    })),

  renameFamily: (id, name) =>
    set((state) => ({
      families: state.families.map((f) => (f.id === id ? { ...f, name } : f)),
    })),

  assignOrdersToFamily: (orderIds, familyId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        orderIds.includes(o.id) ? { ...o, familyId } : o
      ),
      selectedOrderIds: new Set(),
    })),

  sendCommunication: (comm) => {
    const id = `comm-${Date.now()}`;
    set((state) => ({ communications: [...state.communications, { ...comm, id }] }));
  },

  markThreadRead: (key) =>
    set((state) => {
      const next = new Set(state.readThreadKeys);
      next.add(key);
      return { readThreadKeys: next };
    }),

  markThreadUnread: (key) =>
    set((state) => {
      const next = new Set(state.readThreadKeys);
      next.delete(key);
      return { readThreadKeys: next };
    }),

  switchUser: (id) =>
    set({ currentUserId: id, selectedCustomerId: null, selectedOrderIds: new Set(), viewLinkedOrders: false }),

  addCustomerToUser: (customerId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === state.currentUserId && !u.customerIds.includes(customerId)
          ? { ...u, customerIds: [...u.customerIds, customerId] }
          : u
      ),
    })),

  removeCustomerFromUser: (customerId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === state.currentUserId
          ? { ...u, customerIds: u.customerIds.filter((id) => id !== customerId) }
          : u
      ),
      selectedCustomerId:
        state.selectedCustomerId === customerId ? null : state.selectedCustomerId,
    })),

  getVisibleCustomerIds: () => {
    const { selectedCustomerId, customers, viewLinkedOrders } = get();
    if (!selectedCustomerId) return [];
    if (!viewLinkedOrders) return [selectedCustomerId];
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return [selectedCustomerId];
    return [selectedCustomerId, ...customer.linkedCustomerIds];
  },

  getLinkedGroupIds: () => {
    const { selectedCustomerId, customers } = get();
    if (!selectedCustomerId) return [];
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return [selectedCustomerId];
    return [selectedCustomerId, ...customer.linkedCustomerIds];
  },

  getCurrentUser: () => {
    const { users, currentUserId } = get();
    return users.find((u) => u.id === currentUserId);
  },
}));

export { COLORS };
