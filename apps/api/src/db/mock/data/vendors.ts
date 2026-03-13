import type { VendorRecord, VendorPerformance } from "@asset-hub/shared";

/**
 * 18 mock vendors: mix of parts suppliers, service providers, and both.
 * Realistic industrial/facility-management companies.
 */
export const mockVendors: VendorRecord[] = [
  {
    id: 1, customerID: 1, name: "Grainger", contactName: "Mike Reynolds",
    email: "mreynolds@grainger.com", phone: "(800) 472-4643",
    address: "100 Grainger Pkwy, Lake Forest, IL 60045", website: "https://www.grainger.com",
    category: "parts", rating: 5, notes: "Primary MRO supplier. Net-30 terms.",
    contractExpiry: "2027-06-30T00:00:00.000Z", isActive: true,
    createdAt: "2024-01-15T00:00:00.000Z", updatedAt: "2025-11-01T00:00:00.000Z",
  },
  {
    id: 2, customerID: 1, name: "McMaster-Carr", contactName: null,
    email: "sales@mcmaster.com", phone: "(630) 833-0300",
    address: "600 County Line Rd, Elmhurst, IL 60126", website: "https://www.mcmaster.com",
    category: "parts", rating: 5, notes: "Same-day shipping on most items. No net terms — credit card only.",
    contractExpiry: null, isActive: true,
    createdAt: "2024-01-15T00:00:00.000Z", updatedAt: "2025-06-10T00:00:00.000Z",
  },
  {
    id: 3, customerID: 1, name: "HD Supply Facilities Maintenance", contactName: "Sarah Chen",
    email: "schen@hdsupply.com", phone: "(800) 431-3000",
    address: "3400 Cumberland Blvd, Atlanta, GA 30339", website: "https://www.hdsupplysolutions.com",
    category: "parts", rating: 4, notes: "Good pricing on bulk janitorial and plumbing supplies.",
    contractExpiry: "2026-12-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-02-01T00:00:00.000Z", updatedAt: "2025-09-15T00:00:00.000Z",
  },
  {
    id: 4, customerID: 1, name: "Ferguson Enterprises", contactName: "David Martinez",
    email: "dmartinez@ferguson.com", phone: "(888) 334-0004",
    address: "12500 Jefferson Ave, Newport News, VA 23602", website: "https://www.ferguson.com",
    category: "parts", rating: 4, notes: "Preferred plumbing and HVAC parts supplier.",
    contractExpiry: "2026-09-30T00:00:00.000Z", isActive: true,
    createdAt: "2024-03-10T00:00:00.000Z", updatedAt: "2025-10-20T00:00:00.000Z",
  },
  {
    id: 5, customerID: 1, name: "Carrier Commercial Service", contactName: "Jim Whitfield",
    email: "jwhitfield@carrier.com", phone: "(800) 227-7437",
    address: "13995 Pasteur Blvd, Palm Beach Gardens, FL 33418", website: "https://www.carrier.com",
    category: "service", rating: 4, notes: "OEM service for all Carrier HVAC units. Quarterly PM contract.",
    contractExpiry: "2026-06-30T00:00:00.000Z", isActive: true,
    createdAt: "2024-01-20T00:00:00.000Z", updatedAt: "2025-12-01T00:00:00.000Z",
  },
  {
    id: 6, customerID: 1, name: "Trane Technologies", contactName: "Lisa Park",
    email: "lpark@trane.com", phone: "(800) 872-6310",
    address: "800-E Beaty St, Davidson, NC 28036", website: "https://www.trane.com",
    category: "both", rating: 5, notes: "Full-service HVAC: parts + labor. Annual maintenance agreement.",
    contractExpiry: "2027-03-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-02-15T00:00:00.000Z", updatedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: 7, customerID: 1, name: "SimplexGrinnell (Johnson Controls)", contactName: "Robert Kim",
    email: "rkim@jci.com", phone: "(800) 746-7539",
    address: "5757 N Green Bay Ave, Milwaukee, WI 53209", website: "https://www.johnsoncontrols.com",
    category: "service", rating: 3, notes: "Fire alarm inspection and sprinkler service. Slow response times recently.",
    contractExpiry: "2026-04-30T00:00:00.000Z", isActive: true,
    createdAt: "2024-03-01T00:00:00.000Z", updatedAt: "2025-11-15T00:00:00.000Z",
  },
  {
    id: 8, customerID: 1, name: "OTIS Elevator Company", contactName: "Angela Torres",
    email: "atorres@otis.com", phone: "(800) 233-6847",
    address: "1 Carrier Pl, Farmington, CT 06032", website: "https://www.otis.com",
    category: "service", rating: 4, notes: "Full-service elevator maintenance contract for both passenger elevators.",
    contractExpiry: "2027-01-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-01-10T00:00:00.000Z", updatedAt: "2025-07-20T00:00:00.000Z",
  },
  {
    id: 9, customerID: 1, name: "Cummins Power Systems", contactName: "Tom Blackwell",
    email: "tblackwell@cummins.com", phone: "(800) 286-6467",
    address: "500 Jackson St, Columbus, IN 47201", website: "https://www.cummins.com",
    category: "both", rating: 4, notes: "Generator PM and parts. Annual service contract with 4-hour emergency response.",
    contractExpiry: "2026-12-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-04-01T00:00:00.000Z", updatedAt: "2025-12-15T00:00:00.000Z",
  },
  {
    id: 10, customerID: 1, name: "Honeywell Building Technologies", contactName: "Patricia Nguyen",
    email: "pnguyen@honeywell.com", phone: "(800) 328-5111",
    address: "715 Peachtree St NE, Atlanta, GA 30308", website: "https://www.honeywell.com",
    category: "both", rating: 4, notes: "BAS controls and integration. Software updates included in contract.",
    contractExpiry: "2026-08-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-05-01T00:00:00.000Z", updatedAt: "2025-10-01T00:00:00.000Z",
  },
  {
    id: 11, customerID: 1, name: "Rain Bird Corporation", contactName: "Carlos Vega",
    email: "cvega@rainbird.com", phone: "(800) 247-3782",
    address: "6991 E Southpoint Rd, Tucson, AZ 85756", website: "https://www.rainbird.com",
    category: "parts", rating: 3, notes: "Irrigation parts and controllers. Lead times can be 2-3 weeks.",
    contractExpiry: null, isActive: true,
    createdAt: "2024-06-01T00:00:00.000Z", updatedAt: "2025-08-10T00:00:00.000Z",
  },
  {
    id: 12, customerID: 1, name: "Eaton Electrical", contactName: "Karen Williams",
    email: "kwilliams@eaton.com", phone: "(800) 356-5794",
    address: "1000 Eaton Blvd, Cleveland, OH 44122", website: "https://www.eaton.com",
    category: "parts", rating: 4, notes: "UPS batteries and electrical distribution components.",
    contractExpiry: "2026-10-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-03-15T00:00:00.000Z", updatedAt: "2025-11-01T00:00:00.000Z",
  },
  {
    id: 13, customerID: 1, name: "Bay Area Plumbing Solutions", contactName: "Mark Johnson",
    email: "mjohnson@bayareaplumbing.com", phone: "(408) 555-0192",
    address: "2400 Industrial Pkwy, Santa Clara, CA 95051", website: "https://www.bayareaplumbing.com",
    category: "service", rating: 2, notes: "Local plumber. Pricing has increased. Evaluating alternatives.",
    contractExpiry: "2025-12-31T00:00:00.000Z", isActive: true,
    createdAt: "2024-07-01T00:00:00.000Z", updatedAt: "2025-09-20T00:00:00.000Z",
  },
  {
    id: 14, customerID: 1, name: "National Fire Protection Inc.", contactName: "Steve Adams",
    email: "sadams@nfpinc.com", phone: "(510) 555-0234",
    address: "1800 Harrison St, Oakland, CA 94612", website: "https://www.nfpinc.com",
    category: "service", rating: 5, notes: "Fire suppression inspection and testing. Excellent documentation.",
    contractExpiry: "2027-02-28T00:00:00.000Z", isActive: true,
    createdAt: "2024-04-15T00:00:00.000Z", updatedAt: "2025-08-01T00:00:00.000Z",
  },
  {
    id: 15, customerID: 1, name: "Pacific Coast HVAC Supply", contactName: "Jenny Liu",
    email: "jliu@pchvacsupply.com", phone: "(650) 555-0178",
    address: "900 El Camino Real, Redwood City, CA 94063", website: null,
    category: "parts", rating: 3, notes: "Local HVAC parts distributor. Good for emergency same-day pickup.",
    contractExpiry: null, isActive: true,
    createdAt: "2024-08-01T00:00:00.000Z", updatedAt: "2025-07-15T00:00:00.000Z",
  },
  {
    id: 16, customerID: 1, name: "AllState Electric", contactName: "Frank DeLuca",
    email: "fdeluca@allstateelectric.com", phone: "(415) 555-0311",
    address: "500 Brannan St, San Francisco, CA 94107", website: "https://www.allstateelectric.com",
    category: "service", rating: null, notes: "New vendor — evaluating for panel work.",
    contractExpiry: null, isActive: true,
    createdAt: "2026-01-10T00:00:00.000Z", updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: 17, customerID: 1, name: "Valley Mechanical Contractors", contactName: "Dennis Brown",
    email: "dbrown@valleymech.com", phone: "(408) 555-0455",
    address: "3200 Scott Blvd, Santa Clara, CA 95054", website: "https://www.valleymech.com",
    category: "both", rating: 3, notes: "General mechanical contractor. Contract expired — renewal pending.",
    contractExpiry: "2025-06-30T00:00:00.000Z", isActive: false,
    createdAt: "2024-02-20T00:00:00.000Z", updatedAt: "2025-07-01T00:00:00.000Z",
  },
  {
    id: 18, customerID: 1, name: "Surplus Industrial Supply", contactName: null,
    email: "orders@surplusindustrial.com", phone: "(800) 555-0999",
    address: "4500 Industrial Way, Sacramento, CA 95838", website: "https://www.surplusindustrial.com",
    category: "parts", rating: 2, notes: "Discontinued. Quality issues on last order.",
    contractExpiry: null, isActive: false,
    createdAt: "2024-09-01T00:00:00.000Z", updatedAt: "2025-03-01T00:00:00.000Z",
  },
];

/**
 * Performance metrics per vendor, with 12-month trend data.
 */
function generateTrend(baseOnTime: number, baseLeadTime: number): VendorPerformance["monthlyTrend"] {
  const months = [
    "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
    "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
  ];
  return months.map((month) => ({
    month,
    onTimePct: Math.min(100, Math.max(50, baseOnTime + (Math.random() - 0.5) * 10)),
    leadTimeDays: Math.max(1, baseLeadTime + Math.round((Math.random() - 0.5) * 4)),
  }));
}

export const mockVendorPerformance: VendorPerformance[] = [
  { vendorId: 1, onTimeDeliveryPct: 96, avgLeadTimeDays: 3, defectRatePct: 0.5, totalPOs: 48, totalSpend: 34520, monthlyTrend: generateTrend(96, 3) },
  { vendorId: 2, onTimeDeliveryPct: 99, avgLeadTimeDays: 1, defectRatePct: 0.1, totalPOs: 62, totalSpend: 18940, monthlyTrend: generateTrend(99, 1) },
  { vendorId: 3, onTimeDeliveryPct: 88, avgLeadTimeDays: 5, defectRatePct: 1.2, totalPOs: 31, totalSpend: 22150, monthlyTrend: generateTrend(88, 5) },
  { vendorId: 4, onTimeDeliveryPct: 91, avgLeadTimeDays: 4, defectRatePct: 0.8, totalPOs: 27, totalSpend: 15680, monthlyTrend: generateTrend(91, 4) },
  { vendorId: 5, onTimeDeliveryPct: 85, avgLeadTimeDays: 7, defectRatePct: 0.3, totalPOs: 12, totalSpend: 45200, monthlyTrend: generateTrend(85, 7) },
  { vendorId: 6, onTimeDeliveryPct: 94, avgLeadTimeDays: 5, defectRatePct: 0.2, totalPOs: 18, totalSpend: 67800, monthlyTrend: generateTrend(94, 5) },
  { vendorId: 7, onTimeDeliveryPct: 72, avgLeadTimeDays: 10, defectRatePct: 2.5, totalPOs: 8, totalSpend: 28400, monthlyTrend: generateTrend(72, 10) },
  { vendorId: 8, onTimeDeliveryPct: 90, avgLeadTimeDays: 0, defectRatePct: 0, totalPOs: 6, totalSpend: 52800, monthlyTrend: generateTrend(90, 0) },
  { vendorId: 9, onTimeDeliveryPct: 93, avgLeadTimeDays: 3, defectRatePct: 0.4, totalPOs: 10, totalSpend: 31500, monthlyTrend: generateTrend(93, 3) },
  { vendorId: 10, onTimeDeliveryPct: 87, avgLeadTimeDays: 8, defectRatePct: 0.6, totalPOs: 9, totalSpend: 42100, monthlyTrend: generateTrend(87, 8) },
  { vendorId: 11, onTimeDeliveryPct: 78, avgLeadTimeDays: 14, defectRatePct: 1.8, totalPOs: 5, totalSpend: 4200, monthlyTrend: generateTrend(78, 14) },
  { vendorId: 12, onTimeDeliveryPct: 92, avgLeadTimeDays: 6, defectRatePct: 0.3, totalPOs: 14, totalSpend: 19800, monthlyTrend: generateTrend(92, 6) },
  { vendorId: 13, onTimeDeliveryPct: 65, avgLeadTimeDays: 2, defectRatePct: 4.0, totalPOs: 7, totalSpend: 8900, monthlyTrend: generateTrend(65, 2) },
  { vendorId: 14, onTimeDeliveryPct: 98, avgLeadTimeDays: 0, defectRatePct: 0, totalPOs: 4, totalSpend: 12600, monthlyTrend: generateTrend(98, 0) },
  { vendorId: 15, onTimeDeliveryPct: 80, avgLeadTimeDays: 1, defectRatePct: 2.0, totalPOs: 15, totalSpend: 6800, monthlyTrend: generateTrend(80, 1) },
  { vendorId: 16, onTimeDeliveryPct: 0, avgLeadTimeDays: 0, defectRatePct: 0, totalPOs: 0, totalSpend: 0, monthlyTrend: [] },
  { vendorId: 17, onTimeDeliveryPct: 75, avgLeadTimeDays: 6, defectRatePct: 3.0, totalPOs: 11, totalSpend: 24500, monthlyTrend: generateTrend(75, 6) },
  { vendorId: 18, onTimeDeliveryPct: 60, avgLeadTimeDays: 12, defectRatePct: 8.0, totalPOs: 3, totalSpend: 2100, monthlyTrend: generateTrend(60, 12) },
];
