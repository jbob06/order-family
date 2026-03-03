import type { Customer, Order, OrderFamily } from "@/types";

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Acme Communications Inc.",
    accountNumber: "ACM-10042",
    industry: "Media & Broadcasting",
    linkedCustomerIds: [],
  },
  {
    id: "cust-002",
    name: "TeleCorp Systems",
    accountNumber: "TCS-20187",
    industry: "Financial Services",
    linkedCustomerIds: [],
  },
  {
    id: "cust-003",
    name: "GlobalNet Solutions",
    accountNumber: "GNS-30094",
    industry: "Healthcare",
    linkedCustomerIds: [],
  },
  {
    id: "cust-004",
    name: "Vertex Telecom Group",
    accountNumber: "VTG-40231",
    industry: "Manufacturing",
    linkedCustomerIds: [],
  },
  {
    id: "cust-005",
    name: "Apex Network Services",
    accountNumber: "ANS-50178",
    industry: "Retail & eCommerce",
    linkedCustomerIds: [],
  },
  {
    id: "cust-006",
    name: "Meridian Enterprise Corp",
    accountNumber: "MEC-60312",
    industry: "Energy & Utilities",
    linkedCustomerIds: [],
  },
  {
    id: "cust-007",
    name: "Pinnacle Tech Holdings",
    accountNumber: "PTH-70445",
    industry: "Technology",
    linkedCustomerIds: [],
  },
];

export const INITIAL_ORDERS: Order[] = [
  // Acme Communications Inc.
  { id: "ord-001", customerId: "cust-001", orderNumber: "ORD-2024-10042", product: "Dedicated Internet Access (DIA)", status: "processing", submittedDate: "2024-11-01", value: 4800, familyId: null },
  { id: "ord-002", customerId: "cust-001", orderNumber: "ORD-2024-10043", product: "MPLS VPN Circuit", status: "pending", submittedDate: "2024-11-02", value: 7200, familyId: null },
  { id: "ord-003", customerId: "cust-001", orderNumber: "ORD-2024-10044", product: "SIP Trunking", status: "pending", submittedDate: "2024-11-02", value: 1500, familyId: null },
  { id: "ord-004", customerId: "cust-001", orderNumber: "ORD-2024-10045", product: "Unified Communications Suite", status: "on_hold", submittedDate: "2024-10-28", value: 11200, familyId: null },
  { id: "ord-005", customerId: "cust-001", orderNumber: "ORD-2024-10046", product: "SD-WAN Managed Service", status: "completed", submittedDate: "2024-10-15", value: 3600, familyId: null },
  { id: "ord-006", customerId: "cust-001", orderNumber: "ORD-2024-10047", product: "Metro Ethernet (10G)", status: "processing", submittedDate: "2024-11-03", value: 9400, familyId: null },

  // TeleCorp Systems
  { id: "ord-007", customerId: "cust-002", orderNumber: "ORD-2024-20187", product: "Private Line (OC-3)", status: "processing", submittedDate: "2024-10-22", value: 18500, familyId: null },
  { id: "ord-008", customerId: "cust-002", orderNumber: "ORD-2024-20188", product: "Dedicated Internet Access (DIA)", status: "pending", submittedDate: "2024-11-01", value: 6200, familyId: null },
  { id: "ord-009", customerId: "cust-002", orderNumber: "ORD-2024-20189", product: "Cloud Connect (AWS Direct Connect)", status: "on_hold", submittedDate: "2024-10-30", value: 14000, familyId: null },
  { id: "ord-010", customerId: "cust-002", orderNumber: "ORD-2024-20190", product: "MPLS VPN Circuit", status: "pending", submittedDate: "2024-11-04", value: 8800, familyId: null },
  { id: "ord-011", customerId: "cust-002", orderNumber: "ORD-2024-20191", product: "Colocation Services (Quarter Rack)", status: "completed", submittedDate: "2024-09-10", value: 2200, familyId: null },
  { id: "ord-012", customerId: "cust-002", orderNumber: "ORD-2024-20192", product: "SD-WAN Managed Service", status: "processing", submittedDate: "2024-10-18", value: 5500, familyId: null },
  { id: "ord-013", customerId: "cust-002", orderNumber: "ORD-2024-20193", product: "Ethernet VPN (E-Line)", status: "pending", submittedDate: "2024-11-05", value: 3900, familyId: null },

  // GlobalNet Solutions
  { id: "ord-014", customerId: "cust-003", orderNumber: "ORD-2024-30094", product: "Dedicated Internet Access (DIA)", status: "completed", submittedDate: "2024-09-20", value: 3200, familyId: null },
  { id: "ord-015", customerId: "cust-003", orderNumber: "ORD-2024-30095", product: "Wavelength Transport (100G)", status: "processing", submittedDate: "2024-10-14", value: 22000, familyId: null },
  { id: "ord-016", customerId: "cust-003", orderNumber: "ORD-2024-30096", product: "SIP Trunking", status: "pending", submittedDate: "2024-11-01", value: 2100, familyId: null },
  { id: "ord-017", customerId: "cust-003", orderNumber: "ORD-2024-30097", product: "Managed WiFi (Enterprise)", status: "on_hold", submittedDate: "2024-10-29", value: 4700, familyId: null },
  { id: "ord-018", customerId: "cust-003", orderNumber: "ORD-2024-30098", product: "Cloud PBX (100 seats)", status: "pending", submittedDate: "2024-11-03", value: 6000, familyId: null },

  // Vertex Telecom Group
  { id: "ord-019", customerId: "cust-004", orderNumber: "ORD-2024-40231", product: "Dark Fiber IRU", status: "on_hold", submittedDate: "2024-10-05", value: 85000, familyId: null },
  { id: "ord-020", customerId: "cust-004", orderNumber: "ORD-2024-40232", product: "MPLS VPN Circuit", status: "pending", submittedDate: "2024-11-02", value: 9600, familyId: null },
  { id: "ord-021", customerId: "cust-004", orderNumber: "ORD-2024-40233", product: "Dedicated Internet Access (DIA)", status: "processing", submittedDate: "2024-10-28", value: 7800, familyId: null },
  { id: "ord-022", customerId: "cust-004", orderNumber: "ORD-2024-40234", product: "Cloud Connect (Azure ExpressRoute)", status: "pending", submittedDate: "2024-11-04", value: 16500, familyId: null },
  { id: "ord-023", customerId: "cust-004", orderNumber: "ORD-2024-40235", product: "Ethernet VPN (E-LAN)", status: "completed", submittedDate: "2024-08-30", value: 5200, familyId: null },
  { id: "ord-024", customerId: "cust-004", orderNumber: "ORD-2024-40236", product: "Metro Ethernet (1G)", status: "processing", submittedDate: "2024-10-20", value: 4100, familyId: null },

  // Apex Network Services
  { id: "ord-025", customerId: "cust-005", orderNumber: "ORD-2024-50178", product: "SD-WAN Managed Service", status: "processing", submittedDate: "2024-10-25", value: 8900, familyId: null },
  { id: "ord-026", customerId: "cust-005", orderNumber: "ORD-2024-50179", product: "Dedicated Internet Access (DIA)", status: "pending", submittedDate: "2024-11-01", value: 5100, familyId: null },
  { id: "ord-027", customerId: "cust-005", orderNumber: "ORD-2024-50180", product: "SIP Trunking", status: "on_hold", submittedDate: "2024-10-27", value: 1800, familyId: null },
  { id: "ord-028", customerId: "cust-005", orderNumber: "ORD-2024-50181", product: "Colocation Services (Half Rack)", status: "completed", submittedDate: "2024-09-05", value: 4400, familyId: null },
  { id: "ord-029", customerId: "cust-005", orderNumber: "ORD-2024-50182", product: "Managed WiFi (Enterprise)", status: "pending", submittedDate: "2024-11-04", value: 3600, familyId: null },

  // Meridian Enterprise Corp
  { id: "ord-030", customerId: "cust-006", orderNumber: "ORD-2024-60312", product: "Private Line (DS3)", status: "completed", submittedDate: "2024-09-15", value: 12000, familyId: null },
  { id: "ord-031", customerId: "cust-006", orderNumber: "ORD-2024-60313", product: "MPLS VPN Circuit", status: "processing", submittedDate: "2024-10-22", value: 10500, familyId: null },
  { id: "ord-032", customerId: "cust-006", orderNumber: "ORD-2024-60314", product: "Dedicated Internet Access (DIA)", status: "pending", submittedDate: "2024-11-02", value: 6800, familyId: null },
  { id: "ord-033", customerId: "cust-006", orderNumber: "ORD-2024-60315", product: "Wavelength Transport (10G)", status: "on_hold", submittedDate: "2024-10-31", value: 18000, familyId: null },
  { id: "ord-034", customerId: "cust-006", orderNumber: "ORD-2024-60316", product: "Cloud Connect (GCP Partner Interconnect)", status: "pending", submittedDate: "2024-11-05", value: 9200, familyId: null },
  { id: "ord-035", customerId: "cust-006", orderNumber: "ORD-2024-60317", product: "Unified Communications Suite", status: "processing", submittedDate: "2024-10-18", value: 13500, familyId: null },
  { id: "ord-036", customerId: "cust-006", orderNumber: "ORD-2024-60318", product: "Metro Ethernet (10G)", status: "pending", submittedDate: "2024-11-06", value: 8700, familyId: null },

  // Pinnacle Tech Holdings
  { id: "ord-037", customerId: "cust-007", orderNumber: "ORD-2024-70445", product: "Cloud Connect (AWS Direct Connect)", status: "processing", submittedDate: "2024-10-12", value: 21000, familyId: null },
  { id: "ord-038", customerId: "cust-007", orderNumber: "ORD-2024-70446", product: "SD-WAN Managed Service", status: "pending", submittedDate: "2024-11-01", value: 11200, familyId: null },
  { id: "ord-039", customerId: "cust-007", orderNumber: "ORD-2024-70447", product: "Dedicated Internet Access (DIA)", status: "processing", submittedDate: "2024-10-28", value: 9600, familyId: null },
  { id: "ord-040", customerId: "cust-007", orderNumber: "ORD-2024-70448", product: "Colocation Services (Full Rack)", status: "completed", submittedDate: "2024-08-20", value: 8800, familyId: null },
  { id: "ord-041", customerId: "cust-007", orderNumber: "ORD-2024-70449", product: "Dark Fiber IRU", status: "on_hold", submittedDate: "2024-10-30", value: 120000, familyId: null },
  { id: "ord-042", customerId: "cust-007", orderNumber: "ORD-2024-70450", product: "Ethernet VPN (E-Line)", status: "pending", submittedDate: "2024-11-03", value: 4500, familyId: null },
];

export const INITIAL_FAMILIES: OrderFamily[] = [];
