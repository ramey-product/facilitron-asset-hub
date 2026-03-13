import { mockNotificationProvider } from "../db/mock/notifications.js";
import type { UpdatePreferencesInput, ListEmailLogQuery } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleNotificationProvider;
  return mockNotificationProvider;
};

export const notificationService = {
  async getPreferences(customerID: number, userId: number) {
    return getProvider().getPreferences(customerID, userId);
  },

  async updatePreferences(customerID: number, userId: number, input: UpdatePreferencesInput) {
    return getProvider().updatePreferences(customerID, userId, input);
  },

  async listEmailLog(customerID: number, query: ListEmailLogQuery) {
    return getProvider().listEmailLog(customerID, query);
  },

  async getTemplates() {
    return getProvider().getTemplates();
  },
};
