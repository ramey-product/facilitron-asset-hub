import type {
  ListAlertsQuery,
  CreateReorderRuleInput,
  UpdateReorderRuleInput,
} from "@asset-hub/shared";
import {
  listReorderRules,
  getReorderRule,
  createReorderRule,
  updateReorderRule,
  deleteReorderRule,
  listAlerts,
  dismissAlert,
  convertAlertToPO,
  checkAndGenerateAlerts,
} from "../db/mock/alerts.js";

export const alertsService = {
  // Rules
  async listRules(customerID: number) {
    return listReorderRules(customerID);
  },

  async getRule(customerID: number, id: number) {
    return getReorderRule(customerID, id);
  },

  async createRule(customerID: number, input: CreateReorderRuleInput) {
    return createReorderRule(customerID, input);
  },

  async updateRule(customerID: number, id: number, input: UpdateReorderRuleInput) {
    return updateReorderRule(customerID, id, input);
  },

  async deleteRule(customerID: number, id: number) {
    return deleteReorderRule(customerID, id);
  },

  // Alerts
  async listAlerts(customerID: number, query: ListAlertsQuery) {
    return listAlerts(customerID, query);
  },

  async dismissAlert(customerID: number, id: number, dismissedBy: number) {
    return dismissAlert(customerID, id, dismissedBy);
  },

  async convertToPO(customerID: number, alertId: number) {
    return convertAlertToPO(customerID, alertId);
  },

  async checkAndGenerate(customerID: number) {
    return checkAndGenerateAlerts(customerID);
  },
};
