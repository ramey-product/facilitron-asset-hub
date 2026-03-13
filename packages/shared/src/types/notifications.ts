/**
 * Notification types shared between API and web app.
 * P1-28: Notifications & Alerts
 */

export type NotificationType = "new-request" | "approved" | "fulfilled" | "rejected" | "low-stock";

export type NotificationFrequency = "instant" | "daily" | "weekly" | "none";

export type EmailStatus = "sent" | "failed" | "pending";

export interface NotificationPreference {
  id: number;
  customerID: number;
  userId: number;
  notificationType: NotificationType;
  frequency: NotificationFrequency;
  enabled: boolean;
  updatedAt: string;
}

export interface EmailLog {
  id: number;
  customerID: number;
  recipient: string;
  recipientName: string;
  templateName: string;
  notificationType: NotificationType;
  subject: string;
  status: EmailStatus;
  sentAt: string;
  reference: string | null;
  referenceType: string | null;
}

export interface NotificationTemplate {
  id: string;
  notificationType: NotificationType;
  name: string;
  subject: string;
  description: string;
  variables: string[];
}

export interface UpdatePreferencesInput {
  preferences: {
    notificationType: NotificationType;
    frequency: NotificationFrequency;
    enabled: boolean;
  }[];
}

export interface ListEmailLogQuery {
  page?: number;
  limit?: number;
  notificationType?: NotificationType;
  status?: EmailStatus;
}
