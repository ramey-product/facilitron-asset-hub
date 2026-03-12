"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  assets as rrAssets,
  properties as rrProperties,
  recentWorkOrders as rrWorkOrders,
  dashboardStats as rrStats,
  conditionDistribution as rrCondition,
  maintenanceCostByMonth as rrCostByMonth,
  assetsByCategory as rrByCategory,
  topPropertiesByMaintenance as rrTopProperties,
  type Asset,
  type Property,
  type WorkOrder,
} from "@/data/sample-data";
import {
  ocpsAssets,
  ocpsProperties,
  ocpsRecentWorkOrders,
  ocpsDashboardStats,
  ocpsConditionDistribution,
  ocpsMaintenanceCostByMonth,
  ocpsAssetsByCategory,
  ocpsTopPropertiesByMaintenance,
} from "@/data/ocps-data";

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  sector: "commercial" | "education" | "municipal";
  propertyLabel: string; // "Properties", "Schools", "Facilities"
  propertyCount: number;
  logo?: string;
}

export const organizations: Organization[] = [
  {
    id: "rotten-robbie",
    name: "Rotten Robbie",
    shortName: "RRC",
    sector: "commercial",
    propertyLabel: "Properties",
    propertyCount: 63,
  },
  {
    id: "ocps",
    name: "Orange County Public Schools",
    shortName: "OCPS",
    sector: "education",
    propertyLabel: "Schools & Facilities",
    propertyCount: 254,
  },
];

interface OrgData {
  assets: Asset[];
  properties: Property[];
  recentWorkOrders: WorkOrder[];
  dashboardStats: typeof rrStats;
  conditionDistribution: typeof rrCondition;
  maintenanceCostByMonth: typeof rrCostByMonth;
  assetsByCategory: typeof rrByCategory;
  topPropertiesByMaintenance: typeof rrTopProperties;
  categories: string[];
}

const orgDataMap: Record<string, OrgData> = {
  "rotten-robbie": {
    assets: rrAssets,
    properties: rrProperties,
    recentWorkOrders: rrWorkOrders,
    dashboardStats: rrStats,
    conditionDistribution: rrCondition,
    maintenanceCostByMonth: rrCostByMonth,
    assetsByCategory: rrByCategory,
    topPropertiesByMaintenance: rrTopProperties,
    categories: ["Fuel System", "HVAC", "Refrigeration", "POS & IT", "Lighting", "Signage", "Safety", "Plumbing", "Electrical"],
  },
  ocps: {
    assets: ocpsAssets,
    properties: ocpsProperties,
    recentWorkOrders: ocpsRecentWorkOrders,
    dashboardStats: ocpsDashboardStats,
    conditionDistribution: ocpsConditionDistribution,
    maintenanceCostByMonth: ocpsMaintenanceCostByMonth,
    assetsByCategory: ocpsAssetsByCategory,
    topPropertiesByMaintenance: ocpsTopPropertiesByMaintenance,
    categories: ["HVAC", "Electrical", "Plumbing", "Roofing", "Flooring", "Fire & Life Safety", "IT & Network", "Kitchen Equipment", "Playground & Athletic", "Furniture & Fixtures", "Portables & Relocatables", "Elevator & Accessibility"],
  },
};

interface OrgContextValue {
  currentOrg: Organization;
  orgData: OrgData;
  switchOrg: (orgId: string) => void;
  addAsset: (asset: Asset) => void;
  allOrgs: Organization[];
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgId] = useState("rotten-robbie");
  // Track user-added assets per org (layered on top of static data)
  const [addedAssets, setAddedAssets] = useState<Record<string, Asset[]>>({});

  const currentOrg = organizations.find((o) => o.id === currentOrgId) ?? organizations[0]!;
  const baseData = orgDataMap[currentOrgId] ?? orgDataMap["rotten-robbie"]!;

  // Merge static + user-added assets
  const orgData: OrgData = {
    ...baseData!,
    assets: [...(addedAssets[currentOrgId] ?? []), ...baseData!.assets],
  };

  const switchOrg = (orgId: string) => {
    setCurrentOrgId(orgId);
  };

  const addAsset = (asset: Asset) => {
    setAddedAssets((prev) => ({
      ...prev,
      [currentOrgId]: [asset, ...(prev[currentOrgId] ?? [])],
    }));
  };

  return (
    <OrgContext.Provider value={{ currentOrg, orgData, switchOrg, addAsset, allOrgs: organizations }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
