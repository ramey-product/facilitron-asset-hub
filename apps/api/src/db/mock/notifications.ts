/**
 * Mock notification provider for P1-28.
 * In-memory notification preferences and email log with seed data.
 */

import type {
  NotificationPreference,
  EmailLog,
  NotificationTemplate,
  UpdatePreferencesInput,
  ListEmailLogQuery,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import {
  mockNotificationPreferences,
  mockEmailLog,
  mockNotificationTemplates,
} from "./data/notifications.js";

// Working copies for in-memory mutations
const preferences = [...mockNotificationPreferences];
const emailLog = [...mockEmailLog];
const templates = [...mockNotificationTemplates];

export const mockNotificationProvider = {
  async getPreferences(
    customerID: number,
    userId: number
  ): Promise<NotificationPreference[]> {
    return preferences.filter(
      (p) => p.customerID === customerID && p.userId === userId
    );
  },

  async updatePreferences(
    customerID: number,
    userId: number,
    input: UpdatePreferencesInput
  ): Promise<NotificationPreference[]> {
    const now = new Date().toISOString();
    for (const pref of input.preferences) {
      const existing = preferences.find(
        (p) =>
          p.customerID === customerID &&
          p.userId === userId &&
          p.notificationType === pref.notificationType
      );
      if (existing) {
        existing.frequency = pref.frequency;
        existing.enabled = pref.enabled;
        existing.updatedAt = now;
      }
    }
    return preferences.filter(
      (p) => p.customerID === customerID && p.userId === userId
    );
  },

  async listEmailLog(
    customerID: number,
    query: ListEmailLogQuery
  ): Promise<PaginatedResult<EmailLog>> {
    let items = emailLog.filter((e) => e.customerID === customerID);

    // Filter by notification type
    if (query.notificationType) {
      items = items.filter(
        (e) => e.notificationType === query.notificationType
      );
    }

    // Filter by status
    if (query.status) {
      items = items.filter((e) => e.status === query.status);
    }

    // Sort by most recent first
    items.sort(
      (a, b) =>
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    const total = items.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getTemplates(): Promise<NotificationTemplate[]> {
    return [...templates];
  },
};
