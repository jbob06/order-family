export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "on_hold";

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  industry: string;
  linkedCustomerIds: string[];
}

export interface Order {
  id: string;
  customerId: string;
  orderNumber: string;
  product: string;
  status: OrderStatus;
  submittedDate: string;
  value: number;
  familyId: string | null;
}

export interface OrderFamily {
  id: string;
  name: string;
  color: string;
  customerId: string;
}

export const FAMILY_COLORS = [
  { value: "blue", label: "Blue", bg: "bg-blue-100", border: "border-blue-400", badge: "bg-blue-100 text-blue-800", dot: "bg-blue-400" },
  { value: "green", label: "Green", bg: "bg-green-100", border: "border-green-400", badge: "bg-green-100 text-green-800", dot: "bg-green-400" },
  { value: "purple", label: "Purple", bg: "bg-purple-100", border: "border-purple-400", badge: "bg-purple-100 text-purple-800", dot: "bg-purple-400" },
  { value: "orange", label: "Orange", bg: "bg-orange-100", border: "border-orange-400", badge: "bg-orange-100 text-orange-800", dot: "bg-orange-400" },
  { value: "red", label: "Red", bg: "bg-red-100", border: "border-red-400", badge: "bg-red-100 text-red-800", dot: "bg-red-400" },
  { value: "teal", label: "Teal", bg: "bg-teal-100", border: "border-teal-400", badge: "bg-teal-100 text-teal-800", dot: "bg-teal-400" },
  { value: "pink", label: "Pink", bg: "bg-pink-100", border: "border-pink-400", badge: "bg-pink-100 text-pink-800", dot: "bg-pink-400" },
  { value: "yellow", label: "Yellow", bg: "bg-yellow-100", border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
] as const;

export type FamilyColor = typeof FAMILY_COLORS[number]["value"];
