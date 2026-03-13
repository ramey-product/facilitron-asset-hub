import { mockImportProvider } from "../db/mock/import.js";
import type {
  ImportProvider,
} from "../types/providers.js";
import type { ImportColumnMapping } from "@asset-hub/shared";

const getProvider = (): ImportProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleImportProvider;
  return mockImportProvider;
};

export const importService = {
  async validateImport(
    customerID: number,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ) {
    const provider = getProvider();
    return provider.validate(customerID, rows, mapping);
  },

  async executeImport(
    customerID: number,
    contactId: number,
    filename: string,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ) {
    const provider = getProvider();
    return provider.execute(customerID, contactId, filename, rows, mapping);
  },

  async getImportHistory(customerID: number, page: number, limit: number) {
    const provider = getProvider();
    return provider.getHistory(customerID, page, limit);
  },

  getTemplate() {
    const provider = getProvider();
    return provider.getTemplate();
  },
};
