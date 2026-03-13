import { mockReportsProvider } from "../db/mock/reports.js";
import type {
  CreateReportScheduleInput,
  UpdateReportScheduleInput,
  ListReportSchedulesQuery,
  ListReportDeliveriesQuery,
} from "@asset-hub/shared";

const getProvider = () => mockReportsProvider;

export const reportsService = {
  async listSchedules(customerID: number, query: ListReportSchedulesQuery) {
    const provider = getProvider();
    return provider.listSchedules(customerID, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      isActive: query.isActive,
      reportType: query.reportType,
    });
  },

  async getSchedule(customerID: number, id: number) {
    const provider = getProvider();
    return provider.getSchedule(customerID, id);
  },

  async createSchedule(customerID: number, input: CreateReportScheduleInput) {
    const provider = getProvider();
    return provider.createSchedule(customerID, input);
  },

  async updateSchedule(customerID: number, id: number, input: UpdateReportScheduleInput) {
    const provider = getProvider();
    return provider.updateSchedule(customerID, id, input);
  },

  async deleteSchedule(customerID: number, id: number) {
    const provider = getProvider();
    return provider.deleteSchedule(customerID, id);
  },

  async listDeliveries(customerID: number, query: ListReportDeliveriesQuery) {
    const provider = getProvider();
    return provider.listDeliveries(customerID, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      scheduleId: query.scheduleId,
      status: query.status,
    });
  },

  async retryDelivery(customerID: number, deliveryId: number) {
    const provider = getProvider();
    return provider.retryDelivery(customerID, deliveryId);
  },

  async previewReport(customerID: number, scheduleId: number) {
    const provider = getProvider();
    return provider.previewReport(customerID, scheduleId);
  },
};
