import { mockInventoryReportProvider } from "../db/mock/inventory-reports.js";
import type {
  ReportFilter,
  CreateReportTemplateInput,
  ListReportTemplatesQuery,
} from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleInventoryReportProvider;
  return mockInventoryReportProvider;
};

export const inventoryReportService = {
  async generateReport(customerID: number, filter: ReportFilter) {
    return getProvider().generateReport(customerID, filter);
  },

  async listTemplates(customerID: number, query: ListReportTemplatesQuery) {
    return getProvider().listTemplates(customerID, query);
  },

  async getTemplate(customerID: number, id: number) {
    return getProvider().getTemplate(customerID, id);
  },

  async createTemplate(customerID: number, input: CreateReportTemplateInput) {
    return getProvider().createTemplate(customerID, input);
  },

  async updateTemplate(customerID: number, id: number, input: Partial<CreateReportTemplateInput>) {
    return getProvider().updateTemplate(customerID, id, input);
  },

  async deleteTemplate(customerID: number, id: number) {
    return getProvider().deleteTemplate(customerID, id);
  },
};
