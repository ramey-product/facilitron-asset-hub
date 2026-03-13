import { mockPropertyProvider } from "../db/mock/properties.js";

const getProvider = () => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzlePropertyProvider;
  return mockPropertyProvider;
};

export const propertyService = {
  async getProperties(customerID: number) {
    return getProvider().getProperties(customerID);
  },
};
