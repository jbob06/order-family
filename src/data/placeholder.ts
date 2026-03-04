import type { Customer, Order, OrderFamily, Communication } from "@/types";

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-001", name: "Acme Communications Inc.",  accountNumber: "ACM-10042", industry: "Media & Broadcasting",    linkedCustomerIds: [] },
  { id: "cust-002", name: "TeleCorp Systems",           accountNumber: "TCS-20187", industry: "Financial Services",       linkedCustomerIds: [] },
  { id: "cust-003", name: "GlobalNet Solutions",        accountNumber: "GNS-30094", industry: "Healthcare",               linkedCustomerIds: [] },
  { id: "cust-004", name: "Vertex Telecom Group",       accountNumber: "VTG-40231", industry: "Manufacturing",            linkedCustomerIds: [] },
  { id: "cust-005", name: "Apex Network Services",      accountNumber: "ANS-50178", industry: "Retail & eCommerce",       linkedCustomerIds: [] },
  { id: "cust-006", name: "Meridian Enterprise Corp",   accountNumber: "MEC-60312", industry: "Energy & Utilities",       linkedCustomerIds: [] },
  { id: "cust-007", name: "Pinnacle Tech Holdings",     accountNumber: "PTH-70445", industry: "Technology",               linkedCustomerIds: [] },
];

export const INITIAL_ORDERS: Order[] = [
  // ── Acme Communications Inc. ──────────────────────────────────────────────────────────────
  { id: "ord-001", customerId: "cust-001", orderNumber: "ORD-2024-10042", product: "Dedicated Internet Access (DIA)",    status: "implement", submittedDate: "2024-11-01", value: 4800,   address: "1221 Avenue of the Americas, New York, NY 10020", familyId: "fam-001" },
  { id: "ord-002", customerId: "cust-001", orderNumber: "ORD-2024-10043", product: "MPLS VPN Circuit",                   status: "confirm",   submittedDate: "2024-11-02", value: 7200,   address: "30 Hudson Yards, New York, NY 10001",              familyId: "fam-001" },
  { id: "ord-003", customerId: "cust-001", orderNumber: "ORD-2024-10044", product: "SIP Trunking",                       status: "confirm",   submittedDate: "2024-11-02", value: 1500,   address: "555 W Madison St, Chicago, IL 60661",              familyId: "fam-002" },
  { id: "ord-004", customerId: "cust-001", orderNumber: "ORD-2024-10045", product: "Unified Communications Suite",       status: "finalize",  submittedDate: "2024-10-28", value: 11200,  address: "10960 Wilshire Blvd, Los Angeles, CA 90024",       familyId: "fam-002" },
  { id: "ord-005", customerId: "cust-001", orderNumber: "ORD-2024-10046", product: "SD-WAN Managed Service",             status: "billing",   submittedDate: "2024-10-15", value: 3600,   address: "200 S Biscayne Blvd, Miami, FL 33131",             familyId: null },
  { id: "ord-006", customerId: "cust-001", orderNumber: "ORD-2024-10047", product: "Metro Ethernet (10G)",               status: "implement", submittedDate: "2024-11-03", value: 9400,   address: "1221 Avenue of the Americas, New York, NY 10020", familyId: "fam-001" },

  // ── TeleCorp Systems ──────────────────────────────────────────────────────────────────────
  { id: "ord-007", customerId: "cust-002", orderNumber: "ORD-2024-20187", product: "Private Line (OC-3)",                status: "implement", submittedDate: "2024-10-22", value: 18500,  address: "383 Madison Ave, New York, NY 10017",              familyId: "fam-003" },
  { id: "ord-008", customerId: "cust-002", orderNumber: "ORD-2024-20188", product: "Dedicated Internet Access (DIA)",    status: "confirm",   submittedDate: "2024-11-01", value: 6200,   address: "2200 Ross Ave, Dallas, TX 75201",                  familyId: null },
  { id: "ord-009", customerId: "cust-002", orderNumber: "ORD-2024-20189", product: "Cloud Connect (AWS Direct Connect)", status: "finalize",  submittedDate: "2024-10-30", value: 14000,  address: "101 California St, San Francisco, CA 94111",       familyId: "fam-004" },
  { id: "ord-010", customerId: "cust-002", orderNumber: "ORD-2024-20190", product: "MPLS VPN Circuit",                   status: "confirm",   submittedDate: "2024-11-04", value: 8800,   address: "383 Madison Ave, New York, NY 10017",              familyId: "fam-003" },
  { id: "ord-011", customerId: "cust-002", orderNumber: "ORD-2024-20191", product: "Colocation Services (Quarter Rack)", status: "billing",   submittedDate: "2024-09-10", value: 2200,   address: "3 World Trade Center, New York, NY 10007",         familyId: "fam-003" },
  { id: "ord-012", customerId: "cust-002", orderNumber: "ORD-2024-20192", product: "SD-WAN Managed Service",             status: "activate",  submittedDate: "2024-10-18", value: 5500,   address: "2200 Ross Ave, Dallas, TX 75201",                  familyId: "fam-004" },
  { id: "ord-013", customerId: "cust-002", orderNumber: "ORD-2024-20193", product: "Ethernet VPN (E-Line)",              status: "confirm",   submittedDate: "2024-11-05", value: 3900,   address: "101 California St, San Francisco, CA 94111",       familyId: null },

  // ── GlobalNet Solutions ───────────────────────────────────────────────────────────────────
  { id: "ord-014", customerId: "cust-003", orderNumber: "ORD-2024-30094", product: "Dedicated Internet Access (DIA)",    status: "billing",   submittedDate: "2024-09-20", value: 3200,   address: "800 Boylston St, Boston, MA 02199",                familyId: null },
  { id: "ord-015", customerId: "cust-003", orderNumber: "ORD-2024-30095", product: "Wavelength Transport (100G)",        status: "implement", submittedDate: "2024-10-14", value: 22000,  address: "1301 Fannin St, Houston, TX 77002",                familyId: null },
  { id: "ord-016", customerId: "cust-003", orderNumber: "ORD-2024-30096", product: "SIP Trunking",                       status: "confirm",   submittedDate: "2024-11-01", value: 2100,   address: "303 Peachtree St NE, Atlanta, GA 30308",           familyId: null },
  { id: "ord-017", customerId: "cust-003", orderNumber: "ORD-2024-30097", product: "Managed WiFi (Enterprise)",          status: "finalize",  submittedDate: "2024-10-29", value: 4700,   address: "800 Boylston St, Boston, MA 02199",                familyId: null },
  { id: "ord-018", customerId: "cust-003", orderNumber: "ORD-2024-30098", product: "Cloud PBX (100 seats)",              status: "confirm",   submittedDate: "2024-11-03", value: 6000,   address: "1301 Fannin St, Houston, TX 77002",                familyId: null },

  // ── Vertex Telecom Group ──────────────────────────────────────────────────────────────────
  { id: "ord-019", customerId: "cust-004", orderNumber: "ORD-2024-40231", product: "Dark Fiber IRU",                     status: "finalize",  submittedDate: "2024-10-05", value: 85000,  address: "500 Woodward Ave, Detroit, MI 48226",              familyId: "fam-005" },
  { id: "ord-020", customerId: "cust-004", orderNumber: "ORD-2024-40232", product: "MPLS VPN Circuit",                   status: "confirm",   submittedDate: "2024-11-02", value: 9600,   address: "127 Public Square, Cleveland, OH 44114",           familyId: "fam-005" },
  { id: "ord-021", customerId: "cust-004", orderNumber: "ORD-2024-40233", product: "Dedicated Internet Access (DIA)",    status: "implement", submittedDate: "2024-10-28", value: 7800,   address: "600 Grant St, Pittsburgh, PA 15219",               familyId: "fam-005" },
  { id: "ord-022", customerId: "cust-004", orderNumber: "ORD-2024-40234", product: "Cloud Connect (Azure ExpressRoute)", status: "confirm",   submittedDate: "2024-11-04", value: 16500,  address: "500 Woodward Ave, Detroit, MI 48226",              familyId: null },
  { id: "ord-023", customerId: "cust-004", orderNumber: "ORD-2024-40235", product: "Ethernet VPN (E-LAN)",               status: "billing",   submittedDate: "2024-08-30", value: 5200,   address: "127 Public Square, Cleveland, OH 44114",           familyId: null },
  { id: "ord-024", customerId: "cust-004", orderNumber: "ORD-2024-40236", product: "Metro Ethernet (1G)",                status: "activate",  submittedDate: "2024-10-20", value: 4100,   address: "600 Grant St, Pittsburgh, PA 15219",               familyId: null },

  // ── Apex Network Services ─────────────────────────────────────────────────────────────────
  { id: "ord-025", customerId: "cust-005", orderNumber: "ORD-2024-50178", product: "SD-WAN Managed Service",             status: "activate",  submittedDate: "2024-10-25", value: 8900,   address: "2777 N Stemmons Fwy, Dallas, TX 75207",            familyId: null },
  { id: "ord-026", customerId: "cust-005", orderNumber: "ORD-2024-50179", product: "Dedicated Internet Access (DIA)",    status: "confirm",   submittedDate: "2024-11-01", value: 5100,   address: "2 N Central Ave, Phoenix, AZ 85004",               familyId: null },
  { id: "ord-027", customerId: "cust-005", orderNumber: "ORD-2024-50180", product: "SIP Trunking",                       status: "finalize",  submittedDate: "2024-10-27", value: 1800,   address: "1201 3rd Ave, Seattle, WA 98101",                  familyId: null },
  { id: "ord-028", customerId: "cust-005", orderNumber: "ORD-2024-50181", product: "Colocation Services (Half Rack)",    status: "billing",   submittedDate: "2024-09-05", value: 4400,   address: "2777 N Stemmons Fwy, Dallas, TX 75207",            familyId: null },
  { id: "ord-029", customerId: "cust-005", orderNumber: "ORD-2024-50182", product: "Managed WiFi (Enterprise)",          status: "confirm",   submittedDate: "2024-11-04", value: 3600,   address: "2 N Central Ave, Phoenix, AZ 85004",               familyId: null },

  // ── Meridian Enterprise Corp ──────────────────────────────────────────────────────────────
  { id: "ord-030", customerId: "cust-006", orderNumber: "ORD-2024-60312", product: "Private Line (DS3)",                 status: "billing",   submittedDate: "2024-09-15", value: 12000,  address: "1500 Louisiana St, Houston, TX 77002",             familyId: null },
  { id: "ord-031", customerId: "cust-006", orderNumber: "ORD-2024-60313", product: "MPLS VPN Circuit",                   status: "activate",  submittedDate: "2024-10-22", value: 10500,  address: "1670 Broadway, Denver, CO 80202",                  familyId: null },
  { id: "ord-032", customerId: "cust-006", orderNumber: "ORD-2024-60314", product: "Dedicated Internet Access (DIA)",    status: "confirm",   submittedDate: "2024-11-02", value: 6800,   address: "909 Poydras St, New Orleans, LA 70112",            familyId: null },
  { id: "ord-033", customerId: "cust-006", orderNumber: "ORD-2024-60315", product: "Wavelength Transport (10G)",         status: "finalize",  submittedDate: "2024-10-31", value: 18000,  address: "1500 Louisiana St, Houston, TX 77002",             familyId: null },
  { id: "ord-034", customerId: "cust-006", orderNumber: "ORD-2024-60316", product: "Cloud Connect (GCP Partner)",        status: "confirm",   submittedDate: "2024-11-05", value: 9200,   address: "1670 Broadway, Denver, CO 80202",                  familyId: null },
  { id: "ord-035", customerId: "cust-006", orderNumber: "ORD-2024-60317", product: "Unified Communications Suite",       status: "implement", submittedDate: "2024-10-18", value: 13500,  address: "909 Poydras St, New Orleans, LA 70112",            familyId: null },
  { id: "ord-036", customerId: "cust-006", orderNumber: "ORD-2024-60318", product: "Metro Ethernet (10G)",               status: "confirm",   submittedDate: "2024-11-06", value: 8700,   address: "1500 Louisiana St, Houston, TX 77002",             familyId: null },

  // ── Pinnacle Tech Holdings ────────────────────────────────────────────────────────────────
  { id: "ord-037", customerId: "cust-007", orderNumber: "ORD-2024-70445", product: "Cloud Connect (AWS Direct Connect)", status: "activate",  submittedDate: "2024-10-12", value: 21000,  address: "415 Mission St, San Francisco, CA 94105",          familyId: null },
  { id: "ord-038", customerId: "cust-007", orderNumber: "ORD-2024-70446", product: "SD-WAN Managed Service",             status: "confirm",   submittedDate: "2024-11-01", value: 11200,  address: "300 W 6th St, Austin, TX 78701",                   familyId: null },
  { id: "ord-039", customerId: "cust-007", orderNumber: "ORD-2024-70447", product: "Dedicated Internet Access (DIA)",    status: "implement", submittedDate: "2024-10-28", value: 9600,   address: "1201 3rd Ave, Seattle, WA 98101",                  familyId: null },
  { id: "ord-040", customerId: "cust-007", orderNumber: "ORD-2024-70448", product: "Colocation Services (Full Rack)",    status: "billing",   submittedDate: "2024-08-20", value: 8800,   address: "415 Mission St, San Francisco, CA 94105",          familyId: null },
  { id: "ord-041", customerId: "cust-007", orderNumber: "ORD-2024-70449", product: "Dark Fiber IRU",                     status: "finalize",  submittedDate: "2024-10-30", value: 120000, address: "300 W 6th St, Austin, TX 78701",                   familyId: null },
  { id: "ord-042", customerId: "cust-007", orderNumber: "ORD-2024-70450", product: "Ethernet VPN (E-Line)",              status: "confirm",   submittedDate: "2024-11-03", value: 4500,   address: "1201 3rd Ave, Seattle, WA 98101",                  familyId: null },
];

export const INITIAL_FAMILIES: OrderFamily[] = [
  { id: "fam-001", name: "NY Metro Infrastructure",    color: "blue",   customerId: "cust-001" },
  { id: "fam-002", name: "National Voice Platform",    color: "green",  customerId: "cust-001" },
  { id: "fam-003", name: "Financial Services Network", color: "purple", customerId: "cust-002" },
  { id: "fam-004", name: "Cloud Connect Suite",        color: "orange", customerId: "cust-002" },
  { id: "fam-005", name: "Midwest Core Network",       color: "red",    customerId: "cust-004" },
];

export const INITIAL_COMMUNICATIONS: Communication[] = [

  // ── fam-001: NY Metro Infrastructure (Acme) ─────────────────────────────────────────────
  {
    id: "comm-001", scope: "family", orderId: null, familyId: "fam-001", customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-01T13:00:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Order Family Created: NY Metro Infrastructure",
    body: `Hi James,

I hope you're well. I've grouped your three active New York metro service orders into a new order family called "NY Metro Infrastructure" to make it easier to track them together.

Here's a summary of what's included:

  • ORD-2024-10042 — Dedicated Internet Access (DIA), 1221 Avenue of the Americas
  • ORD-2024-10043 — MPLS VPN Circuit, 30 Hudson Yards
  • ORD-2024-10047 — Metro Ethernet (10G), 1221 Avenue of the Americas

Combined contracted value: $21,400/month

All three orders are currently in the implementation and confirmation phases. I'll be sending you regular status updates under this family going forward, so you'll always have a single consolidated view of where things stand.

Please don't hesitate to reach out if you have any questions.

Best,
Sarah Chen
Enterprise Account Manager`,
  },
  {
    id: "comm-002", scope: "family", orderId: null, familyId: "fam-001", customerId: "cust-001", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-09T15:30:00.000Z",
    fromName: "James Whitfield", fromEmail: "j.whitfield@acmecommunications.com",
    toName: "Sarah Chen", toEmail: "s.chen@orderco.com",
    subject: "Re: Order Family Created: NY Metro Infrastructure",
    body: `Hi Sarah,

Thanks for setting this up — really helpful to see everything in one place.

A couple of questions:

1. Do we have a confirmed implementation window for the DIA at 1221 Avenue of the Americas? Our IT team needs to coordinate with the building's facilities management for after-hours access, and they're asking for at least 2 weeks' notice.

2. Will the Metro Ethernet installation at the same address happen concurrently with the DIA, or are these scheduled separately?

Also, is there a point-of-contact on your field team I can connect my IT director with directly?

Thanks,
James Whitfield
Director of IT, Acme Communications Inc.`,
  },
  {
    id: "comm-003", scope: "family", orderId: null, familyId: "fam-001", customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-16T10:15:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Re: NY Metro Infrastructure — Implementation Schedule",
    body: `Hi James,

Great questions — let me address each one:

1. DIA Implementation Window: Our field team has provisionally scheduled the DIA installation for the week of October 28th, with October 30th as the target date. Your IT team would need building access from approximately 6:00 PM to 10:00 PM. I'll send a formal appointment confirmation by October 18th, which gives your team 10 days' notice. If you need an earlier notification, please let me know and I'll see what I can do.

2. Metro Ethernet Scheduling: The Metro Ethernet (10G) at 1221 Avenue of the Americas is currently scheduled independently, approximately 1–2 weeks after the DIA is live. This is standard practice to avoid conflicting access windows and allows our team to verify the DIA infrastructure before adding the Ethernet overlay. We can discuss consolidating if your team has a preference.

3. Field Contact: Your primary technical point of contact will be our Senior Field Engineer, Marcus Webb (m.webb@orderco.com, +1 212-555-0194). Feel free to have your IT director reach out to him directly to discuss access logistics.

Please let me know if you have any other questions.

Best,
Sarah Chen`,
  },
  {
    id: "comm-004", scope: "family", orderId: null, familyId: "fam-001", customerId: "cust-001", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-10-28T11:00:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Status Update — NY Metro Infrastructure (3 Orders)",
    body: `Dear Acme Communications Inc. Team,

I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "NY Metro Infrastructure" order family as of October 28, 2024.

This family currently encompasses 3 service orders with a combined contracted value of $21,400.

━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORD-2024-10042 | Dedicated Internet Access (DIA)
   Status:   In Implementation
   Location: 1221 Avenue of the Americas, New York, NY 10020
   Value:    $4,800/mo

ORD-2024-10043 | MPLS VPN Circuit
   Status:   Pending Confirmation
   Location: 30 Hudson Yards, New York, NY 10001
   Value:    $7,200/mo

ORD-2024-10047 | Metro Ethernet (10G)
   Status:   In Implementation
   Location: 1221 Avenue of the Americas, New York, NY 10020
   Value:    $9,400/mo

━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⟳  IMPLEMENTATION IN PROGRESS (2)
   • Dedicated Internet Access (DIA) — Field teams on-site today for structured cabling and CPE installation. Service expected to pass testing by October 30th.
   • Metro Ethernet (10G) — Cross-connect provisioned at the carrier hotel. Scheduled for physical turn-up the week of November 4th.

◻  AWAITING CONFIRMATION (1)
   • MPLS VPN Circuit — Order submitted and queued for internal circuit path validation. Confirmation expected within 3–5 business days.

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our implementation and provisioning teams are actively progressing the above orders. You can expect your next update within 5–7 business days, or sooner if there are significant status changes.

Should you have any questions or require clarification on any aspect of this update, please don't hesitate to reach out.

Warm regards,
Sarah Chen
Account Management Team
Enterprise Services Division`,
  },
  {
    id: "comm-005", scope: "family", orderId: null, familyId: "fam-001", customerId: "cust-001", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-11-02T16:45:00.000Z",
    fromName: "James Whitfield", fromEmail: "j.whitfield@acmecommunications.com",
    toName: "Sarah Chen", toEmail: "s.chen@orderco.com",
    subject: "Re: Status Update — NY Metro Infrastructure",
    body: `Hi Sarah,

Thanks for the detailed update. Good to hear the DIA is progressing — our facilities team confirmed building access was granted without any issues on the 30th.

One follow-up: any update on the MPLS VPN Circuit confirmation timeline? We have a network architecture review scheduled for November 12th and it would be helpful to have the confirmed circuit details (access speed, CIR, EIR) before then so our team can finalize the routing design.

Let me know.

James`,
  },

  // ── fam-002: National Voice Platform (Acme) ─────────────────────────────────────────────
  {
    id: "comm-006", scope: "family", orderId: null, familyId: "fam-002", customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-12T09:30:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Order Family Created: National Voice Platform",
    body: `Hi James,

Following our conversation last week, I've created a second order family to track your voice and communications orders separately from the network infrastructure work.

"National Voice Platform" includes:

  • ORD-2024-10044 — SIP Trunking, 555 W Madison St, Chicago
  • ORD-2024-10045 — Unified Communications Suite, 10960 Wilshire Blvd, Los Angeles

Combined contracted value: $12,700/month

The SIP Trunking order is currently awaiting confirmation, and the Unified Communications Suite is in the finalization stage — meaning we're wrapping up the statement of work and getting final sign-offs before implementation begins.

I'll keep you posted on both. As always, feel free to reach out.

Best,
Sarah`,
  },
  {
    id: "comm-007", scope: "family", orderId: null, familyId: "fam-002", customerId: "cust-001", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-10-20T10:00:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Status Update — National Voice Platform (2 Orders)",
    body: `Dear Acme Communications Inc. Team,

I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "National Voice Platform" order family as of October 20, 2024.

This family currently encompasses 2 service orders with a combined contracted value of $12,700.

━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORD-2024-10044 | SIP Trunking
   Status:   Pending Confirmation
   Location: 555 W Madison St, Chicago, IL 60661
   Value:    $1,500/mo

ORD-2024-10045 | Unified Communications Suite
   Status:   Awaiting Finalization
   Location: 10960 Wilshire Blvd, Los Angeles, CA 90024
   Value:    $11,200/mo

━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◈  PENDING FINALIZATION (1)
   • Unified Communications Suite — Statement of work reviewed and approved internally. Awaiting your team's final signature on the service addendum. Once received, implementation is targeted to begin within 10 business days.

◻  AWAITING CONFIRMATION (1)
   • SIP Trunking — DID block provisioning is in queue. Number porting request has been submitted to the losing carrier; typical turnaround is 7–10 business days.

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We are in the final stages of bringing these services live. Your account team will reach out to coordinate the activation window and any required on-site access.

Warm regards,
Sarah Chen
Account Management Team
Enterprise Services Division`,
  },
  {
    id: "comm-008", scope: "family", orderId: null, familyId: "fam-002", customerId: "cust-001", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-25T14:20:00.000Z",
    fromName: "James Whitfield", fromEmail: "j.whitfield@acmecommunications.com",
    toName: "Sarah Chen", toEmail: "s.chen@orderco.com",
    subject: "Re: National Voice Platform — Billing Start Date",
    body: `Sarah,

Thanks for the update. I'll follow up with our legal team on the UC Suite addendum today — should have it back to you by end of the week.

One question: once the Unified Communications Suite is active, what's the billing start date? Is it the activation date or the end of that billing cycle? We're trying to align our internal budget accruals for Q4.

Also, for the SIP Trunking — do you have an ETA on the number porting? We have a hard deadline of November 15th for our Chicago office cutover.

Thanks,
James`,
  },
  {
    id: "comm-009", scope: "family", orderId: null, familyId: "fam-002", customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-31T11:30:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Re: National Voice Platform — Billing & Porting Details",
    body: `Hi James,

Happy to clarify on both fronts:

Billing Start Date: For the Unified Communications Suite, billing begins on the service activation date — not at the end of the billing cycle. So if activation occurs on November 14th, your first invoice will include a pro-rated amount for the remainder of that month, with full monthly billing starting December 1st. I can provide a projected billing schedule once we have a confirmed activation date.

SIP Trunking / Number Porting: I've flagged your November 15th Chicago deadline with our porting team. They've confirmed they can prioritize this request. Current expected completion for number porting is November 8–10th, which should give your team a comfortable window for testing before the cutover. I'll send a porting completion notification as soon as it's done.

Let me know once you've sent the UC Suite addendum over and I'll get things moving on that end immediately.

Best,
Sarah`,
  },

  // ── fam-003: Financial Services Network (TeleCorp) ──────────────────────────────────────
  {
    id: "comm-010", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-09-20T09:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Order Family Created: Financial Services Network",
    body: `Hi Maria,

As discussed on our call last Thursday, I've bundled your three core network orders into a new order family called "Financial Services Network." This will give you a single consolidated view for tracking and communications.

Orders included:

  • ORD-2024-20187 — Private Line (OC-3), 383 Madison Ave, New York
  • ORD-2024-20190 — MPLS VPN Circuit, 383 Madison Ave, New York
  • ORD-2024-20191 — Colocation Services (Quarter Rack), 3 World Trade Center

Combined contracted value: $29,500/month

The colocation services are already active and billing. The Private Line is in implementation, and the MPLS VPN is pending confirmation. I'll be your single point of contact for all updates related to this family.

Let me know if you'd like to add or remove any orders from this grouping.

Best,
Michael Torres
Senior Account Manager`,
  },
  {
    id: "comm-011", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-09-28T14:15:00.000Z",
    fromName: "Maria Santos", fromEmail: "m.santos@telecorpsystems.com",
    toName: "Michael Torres", toEmail: "m.torres@orderco.com",
    subject: "Re: Financial Services Network — OC-3 Technical Query",
    body: `Hi Michael,

Thanks for setting this up. Quick technical question on the OC-3 Private Line before our network team finalizes the configuration on our end:

What is the guaranteed maximum latency for the OC-3 circuit between 383 Madison Ave and our disaster recovery site at 3 World Trade Center? Our trading desk requires sub-2ms round-trip, and I want to make sure we confirm this before implementation goes too far.

Also, can you confirm whether the circuit will be routed through your carrier-grade fiber infrastructure, or is there any last-mile component that could introduce variability?

Our CTO would like this in writing before we sign off on the implementation phase.

Thanks,
Maria Santos
VP Infrastructure, TeleCorp Systems`,
  },
  {
    id: "comm-012", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-05T10:30:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Re: Financial Services Network — OC-3 Private Line Specifications",
    body: `Hi Maria,

I've coordinated with our network engineering team and can confirm the following in writing:

Guaranteed Latency: The Private Line (OC-3) between 383 Madison Ave and 3 World Trade Center carries a Service Level Agreement of ≤1.2ms round-trip latency. This is well within your 2ms requirement. This SLA is backed by a financial credit mechanism detailed in Section 4.3 of your service agreement.

Routing Infrastructure: The circuit runs entirely on our owned and operated fiber infrastructure for both segments. There is no third-party last-mile component on this route — both buildings are direct on-net locations with dedicated cross-connects at our 111 Eighth Avenue hub. There is no variable last-mile element.

I'll have our network engineering lead, Patricia Huang, send a formal technical specification sheet to your CTO directly. Please send me the appropriate email address.

Let me know if you need anything else.

Best,
Michael`,
  },
  {
    id: "comm-013", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-10-15T11:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Status Update — Financial Services Network (3 Orders)",
    body: `Dear TeleCorp Systems Team,

I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "Financial Services Network" order family as of October 15, 2024.

This family currently encompasses 3 service orders with a combined contracted value of $29,500.

━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORD-2024-20187 | Private Line (OC-3)
   Status:   In Implementation
   Location: 383 Madison Ave, New York, NY 10017
   Value:    $18,500/mo

ORD-2024-20190 | MPLS VPN Circuit
   Status:   Pending Confirmation
   Location: 383 Madison Ave, New York, NY 10017
   Value:    $8,800/mo

ORD-2024-20191 | Colocation Services (Quarter Rack)
   Status:   Active & Billing
   Location: 3 World Trade Center, New York, NY 10007
   Value:    $2,200/mo

━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓  ACTIVE & BILLING (1)
   • Colocation Services (Quarter Rack) — Fully operational. Power, cooling, and cross-connect all confirmed. Your equipment is live in Cage 14B.

⟳  IMPLEMENTATION IN PROGRESS (1)
   • Private Line (OC-3) — Cross-connect installed at 111 Eighth Ave hub. Fiber splice work at 383 Madison Ave scheduled for October 22nd. On track for activation by October 31st.

◻  AWAITING CONFIRMATION (1)
   • MPLS VPN Circuit — Internal circuit path validation in progress. Expected confirmation within 5–7 business days.

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our implementation and provisioning teams are actively progressing the above orders. You can expect your next update within 5–7 business days, or sooner if there are significant status changes.

Warm regards,
Michael Torres
Account Management Team
Enterprise Services Division`,
  },
  {
    id: "comm-014", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-23T15:00:00.000Z",
    fromName: "Maria Santos", fromEmail: "m.santos@telecorpsystems.com",
    toName: "Michael Torres", toEmail: "m.torres@orderco.com",
    subject: "Re: Financial Services Network — MPLS Escalation Request",
    body: `Michael,

Thank you for the update. Good news on the colocation — our team is happy with the setup at 3 World Trade.

I need to escalate the MPLS VPN Circuit. It's been in "pending confirmation" for over two weeks now, and I have a board-level infrastructure review on November 5th where I need to present a confirmed activation date for this circuit. The VP of Engineering is asking questions.

Can you escalate internally and give me a firm commitment on when we'll have circuit confirmation? If there's a blocker, I need to understand what it is so I can assess alternatives.

This is now a priority for us.

Maria`,
  },
  {
    id: "comm-015", scope: "family", orderId: null, familyId: "fam-003", customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-28T09:45:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Re: Financial Services Network — MPLS Escalation Confirmed",
    body: `Hi Maria,

I understand the urgency and have escalated this to our Director of Network Provisioning this morning.

Here's what I can tell you: The hold on the MPLS VPN confirmation was due to a capacity constraint on a single segment of the path we had originally provisioned. Our engineering team has identified an alternate route with equivalent performance characteristics, and the redesign is being validated today.

Confirmed timeline: Circuit path confirmation will be issued by October 31st at the latest. Once confirmed, implementation is a 7–10 business day process, which puts activation around November 7–12th — ahead of your board review on November 5th for the confirmation piece, though the circuit itself will still be activating shortly after.

I'll personally send you the written circuit confirmation as soon as it's issued, and I'd be happy to join a call with your VP of Engineering if that would be helpful before your board review.

My apologies for the delay. This should have been flagged and addressed sooner.

Best,
Michael`,
  },

  // ── fam-004: Cloud Connect Suite (TeleCorp) ─────────────────────────────────────────────
  {
    id: "comm-016", scope: "family", orderId: null, familyId: "fam-004", customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-05T14:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Order Family Created: Cloud Connect Suite",
    body: `Hi Maria,

I've created a separate order family for your cloud connectivity orders, keeping them distinct from the core network infrastructure family.

"Cloud Connect Suite" includes:

  • ORD-2024-20189 — Cloud Connect (AWS Direct Connect), 101 California St, San Francisco
  • ORD-2024-20192 — SD-WAN Managed Service, 2200 Ross Ave, Dallas

Combined contracted value: $19,500/month

The SD-WAN Managed Service is moving quickly — we're targeting activation this month. The AWS Direct Connect is in the finalization stage, pending your team's BGP configuration submission.

I'll need the following from your team before we can proceed with AWS Direct Connect activation:
  1. BGP ASN (if bringing your own, or confirm you'd like us to assign one)
  2. VLAN tag preference for the VIF
  3. IP addressing for the private/public VIF interfaces

Happy to set up a technical call with our cloud connectivity team if that's easier.

Best,
Michael`,
  },
  {
    id: "comm-017", scope: "family", orderId: null, familyId: "fam-004", customerId: "cust-002", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-10-18T10:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Status Update — Cloud Connect Suite — SD-WAN Now Active",
    body: `Dear TeleCorp Systems Team,

I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "Cloud Connect Suite" order family as of October 18, 2024.

This family currently encompasses 2 service orders with a combined contracted value of $19,500.

━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORD-2024-20189 | Cloud Connect (AWS Direct Connect)
   Status:   Awaiting Finalization
   Location: 101 California St, San Francisco, CA 94111
   Value:    $14,000/mo

ORD-2024-20192 | SD-WAN Managed Service
   Status:   Ready for Activation
   Location: 2200 Ross Ave, Dallas, TX 75201
   Value:    $5,500/mo

━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◎  ACTIVATION READY (1)
   • SD-WAN Managed Service — All edge devices have been shipped to your Dallas location, vManage orchestration is configured, and zero-touch provisioning is ready to execute. Your on-site team simply needs to rack the device and connect power and WAN uplinks. Estimated go-live: within 24 hours of hardware installation.

◈  PENDING FINALIZATION (1)
   • Cloud Connect (AWS Direct Connect) — Hosted VIF provisioned on our side. Awaiting BGP configuration details from your team to complete the Direct Connect association in your AWS account. Please submit your BGP ASN, VLAN tag, and VIF IP addresses at your earliest convenience.

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We are in the final stages of bringing these services live. Your account team will reach out to coordinate the activation window and any required on-site access.

Warm regards,
Michael Torres
Account Management Team
Enterprise Services Division`,
  },
  {
    id: "comm-018", scope: "family", orderId: null, familyId: "fam-004", customerId: "cust-002", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-26T16:00:00.000Z",
    fromName: "Maria Santos", fromEmail: "m.santos@telecorpsystems.com",
    toName: "Michael Torres", toEmail: "m.torres@orderco.com",
    subject: "Re: Cloud Connect Suite — Documentation Request",
    body: `Michael,

Quick update: Dallas team confirmed the SD-WAN hardware is racked and connected. They'll be doing the zero-touch provisioning test Monday morning — I'll let you know how it goes.

On the AWS Direct Connect, I've looped in our cloud infrastructure lead, Dev Patel, to provide the BGP and VIF details. He'll reach out to your team directly by end of day Monday.

Separate request: Could you send over the as-built network diagrams and device configuration summaries for the SD-WAN deployment? Our compliance team needs these for our SOC 2 audit documentation. Standard stuff — topology diagram, device inventory, and management plane access controls summary.

Thanks,
Maria`,
  },
  {
    id: "comm-019", scope: "family", orderId: null, familyId: "fam-004", customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-11-01T09:30:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Re: Cloud Connect Suite — Documentation Package",
    body: `Hi Maria,

Glad to hear Dallas is moving forward — looking forward to the go-live confirmation Monday.

On the SOC 2 documentation: I've coordinated with our network operations team and a full documentation package has been sent separately to your compliance contact via our secure document portal (you should receive a portal access link from docs@orderco.com within the hour). The package includes:

  • As-built network topology diagram (Visio + PDF)
  • SD-WAN device inventory and serial numbers
  • vManage access control summary and audit log export capability documentation
  • Data retention policy for management plane logs

If your auditors need anything additional — configuration templates, change management procedures, or SLA documentation — let me know and I'll coordinate with our compliance team.

Also, I've confirmed that Dev Patel's BGP details were received by our cloud team this morning. We're targeting AWS Direct Connect finalization by end of next week.

Best,
Michael`,
  },

  // ── fam-005: Midwest Core Network (Vertex) ──────────────────────────────────────────────
  {
    id: "comm-020", scope: "family", orderId: null, familyId: "fam-005", customerId: "cust-004", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-08T09:00:00.000Z",
    fromName: "David Okafor — Account Manager", fromEmail: "d.okafor@orderco.com",
    toName: "Robert Chen", toEmail: "r.chen@vertextelecom.com",
    subject: "Order Family Created: Midwest Core Network",
    body: `Hi Robert,

As promised in our kickoff call, I've created the "Midwest Core Network" order family to consolidate your three major Midwest infrastructure orders. This is your largest active project and I want to make sure you have clear, regular visibility into all of it.

Orders included:

  • ORD-2024-40231 — Dark Fiber IRU, 500 Woodward Ave, Detroit ($85,000/mo)
  • ORD-2024-40232 — MPLS VPN Circuit, 127 Public Square, Cleveland ($9,600/mo)
  • ORD-2024-40233 — Dedicated Internet Access (DIA), 600 Grant St, Pittsburgh ($7,800/mo)

Combined contracted value: $102,400/month

The Dark Fiber IRU is your anchor project and is currently in the finalization stage — we're working through the IRU agreement details and route survey scheduling. The MPLS VPN is in confirmation, and the DIA is actively being implemented in Pittsburgh.

I'll be sending monthly status updates for this family given its scale, with ad-hoc updates any time there's a significant development on the dark fiber project.

Please don't hesitate to reach out at any time.

Best,
David Okafor
Senior Account Manager`,
  },
  {
    id: "comm-021", scope: "family", orderId: null, familyId: "fam-005", customerId: "cust-004", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-17T14:30:00.000Z",
    fromName: "Robert Chen", fromEmail: "r.chen@vertextelecom.com",
    toName: "David Okafor", toEmail: "d.okafor@orderco.com",
    subject: "Re: Midwest Core Network — Dark Fiber Route Inquiry",
    body: `David,

Thanks for the organized overview. The family structure is very helpful for our internal tracking.

I have some questions on the Dark Fiber IRU that I need answered before we can proceed to execution:

1. Route Map: Can you share the proposed fiber route map between Detroit and our interconnect points? We have existing conduit easements along certain corridors and want to check for any conflicts before the IRU agreement is finalized.

2. Span Length & Splice Points: What is the total span length and estimated number of splice enclosures? Our network team needs this to model dispersion and plan amplifier placement.

3. IRU Term: The order indicates a standard term, but our board approved a 20-year IRU specifically. Can you confirm the agreement will reflect 20 years?

4. Survey Timeline: When is the route survey scheduled? We'd like to have a representative present.

I know this is a lot — happy to set up a call with our network engineering team if that's easier.

Robert Chen
CTO, Vertex Telecom Group`,
  },
  {
    id: "comm-022", scope: "family", orderId: null, familyId: "fam-005", customerId: "cust-004", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-25T10:00:00.000Z",
    fromName: "David Okafor — Account Manager", fromEmail: "d.okafor@orderco.com",
    toName: "Robert Chen", toEmail: "r.chen@vertextelecom.com",
    subject: "Re: Midwest Core Network — Fiber Route & IRU Details",
    body: `Hi Robert,

Excellent questions. I've coordinated with our dark fiber team and legal to address each one:

1. Route Map: I'm attaching the proposed route GIS data (KMZ file) and a PDF overview. The primary route runs along the I-75 corridor from Detroit to Toledo, then northeast via the Ohio Turnpike to Cleveland. Our legal team has confirmed there are no conflicting easement claims along this corridor, but please have your team review against your existing assets and flag anything by November 8th.

2. Span Length & Splice Points: Total span is approximately 187 route miles. We're planning 94 splice enclosures (one per ~2 route miles average), with underground handholes at each. I'll have our fiber engineering team send a detailed OTDR-ready splice schedule within the week.

3. IRU Term: Confirmed — the IRU agreement will be drafted for 20 years, consistent with your board authorization. I've flagged this specifically with our contracts team. The draft agreement will reflect the 20-year term with standard renewal options.

4. Route Survey: The survey is scheduled for November 14–15th. I've added your preferred representative to the attendee list — please send me their name and contact details. Our survey lead is Elena Vasquez (e.vasquez@orderco.com) and she'll be in touch with logistics.

Let me know if a call would still be useful after your team has reviewed the route data.

Best,
David`,
  },
  {
    id: "comm-023", scope: "family", orderId: null, familyId: "fam-005", customerId: "cust-004", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-11-01T11:00:00.000Z",
    fromName: "David Okafor — Account Manager", fromEmail: "d.okafor@orderco.com",
    toName: "Robert Chen", toEmail: "r.chen@vertextelecom.com",
    subject: "Status Update — Midwest Core Network (3 Orders)",
    body: `Dear Vertex Telecom Group Team,

I hope this message finds you well. I'm writing to provide you with a comprehensive status update on your "Midwest Core Network" order family as of November 1, 2024.

This family currently encompasses 3 service orders with a combined contracted value of $102,400.

━━━ ORDER STATUS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORD-2024-40231 | Dark Fiber IRU
   Status:   Awaiting Finalization
   Location: 500 Woodward Ave, Detroit, MI 48226
   Value:    $85,000/mo

ORD-2024-40232 | MPLS VPN Circuit
   Status:   Pending Confirmation
   Location: 127 Public Square, Cleveland, OH 44114
   Value:    $9,600/mo

ORD-2024-40233 | Dedicated Internet Access (DIA)
   Status:   In Implementation
   Location: 600 Grant St, Pittsburgh, PA 15219
   Value:    $7,800/mo

━━━ PROGRESS HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⟳  IMPLEMENTATION IN PROGRESS (1)
   • Dedicated Internet Access (DIA) — Installation crew completed structured cabling at 600 Grant St on October 30th. CPE configuration is underway; service testing scheduled for November 5th.

◈  PENDING FINALIZATION (1)
   • Dark Fiber IRU — Route GIS data shared with your team on October 25th. IRU agreement drafted for 20-year term per your board authorization and under final legal review. Route survey scheduled November 14–15th. Awaiting your team's route easement review by November 8th.

◻  AWAITING CONFIRMATION (1)
   • MPLS VPN Circuit — Circuit path validation in progress. Expected confirmation within 5 business days.

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our implementation and provisioning teams are actively progressing the above orders. You can expect your next update within 5–7 business days, or sooner if there are significant status changes.

Should you have any questions or require clarification on any aspect of this update, please don't hesitate to reach out directly to your account manager or reply to this message.

We appreciate your continued partnership and look forward to delivering the full "Midwest Core Network" portfolio.

Warm regards,
David Okafor
Account Management Team
Enterprise Services Division`,
  },

  // ── Customer-scope comms ─────────────────────────────────────────────────────────────────
  {
    id: "comm-024", scope: "customer", orderId: null, familyId: null, customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-09-30T09:00:00.000Z",
    fromName: "Sarah Chen — Account Manager", fromEmail: "s.chen@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "Q4 Account Review — Acme Communications Inc.",
    body: `Hi James,

As we head into Q4, I wanted to reach out with a consolidated overview of your account and kick off our quarterly review process.

CURRENT ACCOUNT STANDING
  Account Number: ACM-10042
  Industry:       Media & Broadcasting
  Active Orders:  6 (across 2 order families + 1 standalone)
  Monthly Committed Value: $37,700

ORDER FAMILIES IN PROGRESS
  1. NY Metro Infrastructure (3 orders, $21,400/mo)
     Focus: DIA, MPLS VPN, and Metro Ethernet across your New York footprint
  2. National Voice Platform (2 orders, $12,700/mo)
     Focus: SIP Trunking and Unified Communications Suite

STANDALONE
  • SD-WAN Managed Service — Miami, FL ($3,600/mo) — Active & Billing

UPCOMING MILESTONES
  • DIA implementation at 1221 Avenue of the Americas (targeting end of October)
  • National Voice Platform UC Suite finalization — pending addendum signature
  • SIP Trunking number porting — Chicago cutover deadline November 15th

I'd love to schedule a 30-minute review call to walk through everything and discuss any expansion plans for 2025. Would any time the week of October 14th work for you?

Best,
Sarah Chen
Enterprise Account Manager`,
  },
  {
    id: "comm-025", scope: "customer", orderId: null, familyId: null, customerId: "cust-001", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-03T11:20:00.000Z",
    fromName: "James Whitfield", fromEmail: "j.whitfield@acmecommunications.com",
    toName: "Sarah Chen", toEmail: "s.chen@orderco.com",
    subject: "Re: Q4 Account Review — Expansion Discussion",
    body: `Sarah,

Great timing on this. Happy to do a Q4 review — October 16th at 2pm ET works for me.

Also, I wanted to flag something ahead of our call: we're likely going to need Dark Fiber capacity between our New York and Philadelphia broadcast facilities by mid-2025. This is for a new distribution partnership we're finalizing. I'd like to get a preliminary quote and feasibility assessment on the agenda.

Additionally, our CTO is asking about colocation options in the New York metro area. We currently have nothing in colo, but with the DIA and Metro Ethernet coming online, it makes sense to evaluate a rack or two near our main interconnect.

Can you add both of those to the agenda for October 16th?

Thanks,
James`,
  },
  {
    id: "comm-026", scope: "customer", orderId: null, familyId: null, customerId: "cust-002", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-09-05T10:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Welcome — TeleCorp Systems Account Overview",
    body: `Hi Maria,

Following our introduction last month, I wanted to send a formal account overview as I take on your account management responsibilities from Tom Reeves.

ACCOUNT PROFILE
  Account Number: TCS-20187
  Industry:       Financial Services

ACTIVE SERVICES
  Existing:
  • Colocation (Quarter Rack) at 3 World Trade Center — Billing since September 2024

  In Flight (7 orders across 2 families):
  • Financial Services Network — Private Line, MPLS VPN, Colocation
  • Cloud Connect Suite — AWS Direct Connect, SD-WAN

I'm committed to providing you with clear, proactive communication on all your orders. Please don't hesitate to contact me directly any time.

Best,
Michael Torres
Senior Account Manager`,
  },

  // ── Order-scope comms ────────────────────────────────────────────────────────────────────
  {
    id: "comm-027", scope: "order", orderId: "ord-001", familyId: "fam-001", customerId: "cust-001", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-29T14:00:00.000Z",
    fromName: "Marcus Webb — Field Engineer", fromEmail: "m.webb@orderco.com",
    toName: "James Whitfield", toEmail: "j.whitfield@acmecommunications.com",
    subject: "ORD-2024-10042 — DIA On-Site Update: Day 1 Complete",
    body: `Hi James,

Quick field update on your Dedicated Internet Access (DIA) order at 1221 Avenue of the Americas.

ORDER: ORD-2024-10042
SERVICE: Dedicated Internet Access (DIA)
LOCATION: 1221 Avenue of the Americas, New York, NY 10020

DAY 1 SUMMARY (October 29th)
Our crew completed the following today:
  ✓ Structured cabling from the DMARC to your IDF on floor 32
  ✓ CPE (Cisco ASR 1001-X) racked and powered in comms room 32-B
  ✓ Initial WAN interface configuration loaded
  ✓ Fiber tested from street entry point to DMARC — signal levels clean

TOMORROW (October 30th)
  • BGP session establishment with our backbone
  • End-to-end throughput testing (1Gbps committed, 10Gbps burst)
  • Customer handoff testing — I'll coordinate with your IT team directly

Please have your IT director available between 10am–12pm for the handoff test.

Marcus Webb
Senior Field Engineer`,
  },
  {
    id: "comm-028", scope: "order", orderId: "ord-001", familyId: "fam-001", customerId: "cust-001", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-30T08:15:00.000Z",
    fromName: "James Whitfield", fromEmail: "j.whitfield@acmecommunications.com",
    toName: "Marcus Webb", toEmail: "m.webb@orderco.com",
    subject: "Re: ORD-2024-10042 — DIA: Ready for Handoff Test",
    body: `Marcus,

Good to hear things went smoothly on Day 1. Our IT director, Kevin Park, will be available from 10am as requested.

One question: will the BGP peer IP and ASN details be provided in the handoff documentation, or do we need to pre-configure anything on our core router before the test?

Also, can you confirm the committed information rate (CIR) being tested? The order is for 1Gbps committed — I just want Kevin to have that in front of him.

Thanks,
James`,
  },
  {
    id: "comm-029", scope: "order", orderId: "ord-019", familyId: "fam-005", customerId: "cust-004", direction: "outbound", isAiGenerated: false,
    sentAt: "2024-10-14T09:30:00.000Z",
    fromName: "Elena Vasquez — Fiber Projects", fromEmail: "e.vasquez@orderco.com",
    toName: "Robert Chen", toEmail: "r.chen@vertextelecom.com",
    subject: "ORD-2024-40231 — Dark Fiber IRU: Route Survey Logistics",
    body: `Hi Robert,

I'm the lead surveyor assigned to your Dark Fiber IRU project (ORD-2024-40231). David Okafor asked me to reach out directly regarding the November 14–15th route survey.

SURVEY SCOPE
  Day 1 (Nov 14): Detroit origin to Toledo interchange — ~94 route miles
  Day 2 (Nov 15): Toledo to Cleveland terminus — ~93 route miles

YOUR REPRESENTATIVE
  • Meeting point: 500 Woodward Ave, Detroit lobby — 7:30 AM both days
  • Hard hat and hi-vis vest required (we can provide)
  • Estimated daily duration: 9–10 hours including driving

Please confirm your representative's name and contact number by November 8th for site access manifests.

Elena Vasquez
Senior Fiber Survey Engineer`,
  },
  {
    id: "comm-030", scope: "order", orderId: "ord-019", familyId: "fam-005", customerId: "cust-004", direction: "inbound", isAiGenerated: false,
    sentAt: "2024-10-15T16:00:00.000Z",
    fromName: "Robert Chen", fromEmail: "r.chen@vertextelecom.com",
    toName: "Elena Vasquez", toEmail: "e.vasquez@orderco.com",
    subject: "Re: ORD-2024-40231 — Survey Confirmed, Rep Details",
    body: `Elena,

Our representative will be:
  Name:   Thomas Osei, P.E.
  Title:  Director of Network Infrastructure
  Mobile: +1 313-555-0287

Thomas is a licensed PE and has participated in several IRU surveys. He's confirmed for both days.

One request: could you share the OTDR test plan ahead of time? Thomas would like to review it against our dispersion modeling assumptions for the 100G coherent optics we're planning to deploy over this IRU.

Also please send GIS coordinates for the Day 1 and Day 2 start/end points so he can pre-load them.

Robert`,
  },
  {
    id: "comm-031", scope: "order", orderId: "ord-009", familyId: "fam-004", customerId: "cust-002", direction: "outbound", isAiGenerated: true,
    sentAt: "2024-10-28T10:00:00.000Z",
    fromName: "Michael Torres — Account Manager", fromEmail: "m.torres@orderco.com",
    toName: "Maria Santos", toEmail: "m.santos@telecorpsystems.com",
    subject: "Status Update — ORD-2024-20189: Cloud Connect (AWS Direct Connect)",
    body: `Dear TeleCorp Systems Team,

This message provides a focused status update on a single service order.

ORDER DETAILS
  Order Number: ORD-2024-20189
  Product:      Cloud Connect (AWS Direct Connect)
  Location:     101 California St, San Francisco, CA 94111
  Value:        $14,000/mo
  Submitted:    October 30, 2024
  Current Status: Awaiting Finalization

STATUS UPDATE
Your AWS Direct Connect order is progressing well. Our hosted Virtual Interface (VIF) has been provisioned on our side and is awaiting BGP configuration details from your cloud infrastructure team.

WHAT WE NEED FROM YOU
  1. BGP Autonomous System Number (ASN)
  2. VLAN tag for the VIF
  3. VIF interface IP addresses (customer-side and provider-side)

Once received, final provisioning and testing is estimated at 3–5 business days.

Warm regards,
Michael Torres
Account Management Team`,
  },
];
