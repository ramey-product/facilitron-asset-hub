/**
 * Mock seed data for P1-28 Notifications & Alerts.
 * Notification preferences and email log entries.
 */

import type { NotificationPreference, EmailLog, NotificationTemplate } from "@asset-hub/shared";

// Helper to get ISO date string N days ago
function daysAgo(n: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

export const mockNotificationPreferences: NotificationPreference[] = [
  { id: 1, customerID: 1, userId: 1, notificationType: "new-request", frequency: "instant", enabled: true, updatedAt: daysAgo(30) },
  { id: 2, customerID: 1, userId: 1, notificationType: "approved", frequency: "instant", enabled: true, updatedAt: daysAgo(30) },
  { id: 3, customerID: 1, userId: 1, notificationType: "fulfilled", frequency: "instant", enabled: true, updatedAt: daysAgo(30) },
  { id: 4, customerID: 1, userId: 1, notificationType: "rejected", frequency: "instant", enabled: true, updatedAt: daysAgo(30) },
  { id: 5, customerID: 1, userId: 1, notificationType: "low-stock", frequency: "daily", enabled: true, updatedAt: daysAgo(15) },
];

export const mockEmailLog: EmailLog[] = [
  { id: 1, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "new-request", notificationType: "new-request", subject: "New Inventory Request: 20A Circuit Breakers", status: "sent", sentAt: daysAgo(1, 10), reference: "REQ-2024-0045", referenceType: "inventory-request" },
  { id: 2, customerID: 1, recipient: "sarah.chen@facilitron.com", recipientName: "Sarah Chen", templateName: "approved", notificationType: "approved", subject: "Inventory Request Approved: MERV 8 Filters (x24)", status: "sent", sentAt: daysAgo(1, 14), reference: "REQ-2024-0044", referenceType: "inventory-request" },
  { id: 3, customerID: 1, recipient: "tom.wilson@facilitron.com", recipientName: "Tom Wilson", templateName: "fulfilled", notificationType: "fulfilled", subject: "Request Fulfilled: Flush Valve Kits (x4)", status: "sent", sentAt: daysAgo(2, 8), reference: "REQ-2024-0043", referenceType: "inventory-request" },
  { id: 4, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "low-stock", notificationType: "low-stock", subject: "Daily Low Stock Alert: 3 Items Below Reorder Point", status: "sent", sentAt: daysAgo(2, 6), reference: null, referenceType: null },
  { id: 5, customerID: 1, recipient: "sarah.chen@facilitron.com", recipientName: "Sarah Chen", templateName: "new-request", notificationType: "new-request", subject: "New Inventory Request: V-Belt A48 (x6)", status: "sent", sentAt: daysAgo(3, 11), reference: "REQ-2024-0042", referenceType: "inventory-request" },
  { id: 6, customerID: 1, recipient: "tom.wilson@facilitron.com", recipientName: "Tom Wilson", templateName: "rejected", notificationType: "rejected", subject: "Inventory Request Rejected: R-410A Refrigerant", status: "sent", sentAt: daysAgo(4, 15), reference: "REQ-2024-0041", referenceType: "inventory-request" },
  { id: 7, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "approved", notificationType: "approved", subject: "Inventory Request Approved: LED T8 Tubes (x40)", status: "failed", sentAt: daysAgo(5, 9), reference: "REQ-2024-0040", referenceType: "inventory-request" },
  { id: 8, customerID: 1, recipient: "sarah.chen@facilitron.com", recipientName: "Sarah Chen", templateName: "low-stock", notificationType: "low-stock", subject: "Daily Low Stock Alert: 5 Items Below Reorder Point", status: "sent", sentAt: daysAgo(5, 6), reference: null, referenceType: null },
  { id: 9, customerID: 1, recipient: "tom.wilson@facilitron.com", recipientName: "Tom Wilson", templateName: "fulfilled", notificationType: "fulfilled", subject: "Request Fulfilled: Fire Extinguishers (x6)", status: "sent", sentAt: daysAgo(7, 13), reference: "REQ-2024-0039", referenceType: "inventory-request" },
  { id: 10, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "new-request", notificationType: "new-request", subject: "New Inventory Request: Drywall Screws (x10 boxes)", status: "sent", sentAt: daysAgo(8, 10), reference: "REQ-2024-0038", referenceType: "inventory-request" },
  { id: 11, customerID: 1, recipient: "sarah.chen@facilitron.com", recipientName: "Sarah Chen", templateName: "low-stock", notificationType: "low-stock", subject: "Daily Low Stock Alert: 2 Items Below Reorder Point", status: "sent", sentAt: daysAgo(10, 6), reference: null, referenceType: null },
  { id: 12, customerID: 1, recipient: "tom.wilson@facilitron.com", recipientName: "Tom Wilson", templateName: "approved", notificationType: "approved", subject: "Inventory Request Approved: Concrete Anchors (x5 packs)", status: "sent", sentAt: daysAgo(12, 11), reference: "REQ-2024-0037", referenceType: "inventory-request" },
  { id: 13, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "fulfilled", notificationType: "fulfilled", subject: "Request Fulfilled: Smoke Detectors (x10)", status: "failed", sentAt: daysAgo(15, 14), reference: "REQ-2024-0036", referenceType: "inventory-request" },
  { id: 14, customerID: 1, recipient: "sarah.chen@facilitron.com", recipientName: "Sarah Chen", templateName: "new-request", notificationType: "new-request", subject: "New Inventory Request: Paper Towel Rolls (x8 cases)", status: "sent", sentAt: daysAgo(20, 9), reference: "REQ-2024-0035", referenceType: "inventory-request" },
  { id: 15, customerID: 1, recipient: "tom.wilson@facilitron.com", recipientName: "Tom Wilson", templateName: "low-stock", notificationType: "low-stock", subject: "Daily Low Stock Alert: 4 Items Below Reorder Point", status: "sent", sentAt: daysAgo(22, 6), reference: null, referenceType: null },
  { id: 16, customerID: 1, recipient: "mike.johnson@facilitron.com", recipientName: "Mike Johnson", templateName: "approved", notificationType: "approved", subject: "Inventory Request Approved: Hand Sanitizer Refills (x6)", status: "sent", sentAt: daysAgo(25, 10), reference: "REQ-2024-0034", referenceType: "inventory-request" },
];

export const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: "tpl-new-request",
    notificationType: "new-request",
    name: "New Inventory Request",
    subject: "New Inventory Request: {{partName}}",
    description: "Sent when a new inventory request is submitted and needs review.",
    variables: ["partName", "quantity", "requestedBy", "requestDate", "priority"],
  },
  {
    id: "tpl-approved",
    notificationType: "approved",
    name: "Request Approved",
    subject: "Inventory Request Approved: {{partName}} (x{{quantity}})",
    description: "Sent when an inventory request is approved by a supervisor.",
    variables: ["partName", "quantity", "approvedBy", "approvalDate", "requestId"],
  },
  {
    id: "tpl-fulfilled",
    notificationType: "fulfilled",
    name: "Request Fulfilled",
    subject: "Request Fulfilled: {{partName}} (x{{quantity}})",
    description: "Sent when parts have been issued from stock to fulfill a request.",
    variables: ["partName", "quantity", "fulfilledBy", "fulfillDate", "location"],
  },
  {
    id: "tpl-rejected",
    notificationType: "rejected",
    name: "Request Rejected",
    subject: "Inventory Request Rejected: {{partName}}",
    description: "Sent when an inventory request is rejected, with a reason.",
    variables: ["partName", "quantity", "rejectedBy", "rejectDate", "reason"],
  },
  {
    id: "tpl-low-stock",
    notificationType: "low-stock",
    name: "Low Stock Alert",
    subject: "Daily Low Stock Alert: {{count}} Items Below Reorder Point",
    description: "Daily digest of all parts that have fallen below their reorder point.",
    variables: ["count", "items", "reportDate"],
  },
];
