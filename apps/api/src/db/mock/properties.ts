import type { PropertySummary } from "@asset-hub/shared";
import { mockProperties } from "./data/locations.js";
import { mockAssets } from "./data/assets.js";

export const mockPropertyProvider = {
  async getProperties(customerID: number): Promise<PropertySummary[]> {
    const customerProps = mockProperties.filter(
      (p) => p.customerID === customerID && p.isActive
    );

    // Count active assets per property
    const activeAssets = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );

    return customerProps
      .map((p) => ({
        id: p.propertyID,
        name: p.propertyName,
        address: p.propertyAddress,
        city: p.propertyCity,
        state: p.propertyState,
        assetCount: activeAssets.filter((a) => a.propertyID === p.propertyID)
          .length,
        isActive: p.isActive,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};
