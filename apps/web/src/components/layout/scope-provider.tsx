"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProperties } from "@/hooks/use-properties";
import type { PropertySummary } from "@asset-hub/shared";

interface ScopeContextValue {
  /** Current customer (tenant) ID — hardcoded 1 for mock auth */
  customerID: number;
  /** Selected property ID, or null for "All Properties" */
  propertyID: number | null;
  /** Resolved property object for the current selection, or null */
  selectedProperty: PropertySummary | null;
  /** All properties available for the current customer */
  properties: PropertySummary[];
  /** Change property scope. Pass null for "All Properties". */
  setPropertyScope: (id: number | null) => void;
  /** True while the properties list is loading from the API */
  isLoading: boolean;
}

const ScopeContext = createContext<ScopeContextValue | null>(null);

// Mock auth — will be replaced by real auth bridge
const MOCK_CUSTOMER_ID = 1;

export function ScopeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse initial propertyId from URL
  const urlPropertyId = searchParams.get("propertyId");
  const [propertyID, setPropertyID] = useState<number | null>(() => {
    if (urlPropertyId) {
      const parsed = Number(urlPropertyId);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  });

  // Fetch properties from API
  const { data, isLoading } = useProperties();
  const properties = data?.data ?? [];

  // Validate that the selected propertyID exists in the list once loaded
  useEffect(() => {
    if (!isLoading && properties.length > 0 && propertyID !== null) {
      const exists = properties.some((p) => p.id === propertyID);
      if (!exists) {
        setPropertyID(null);
        // Clean invalid propertyId from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("propertyId");
        const qs = params.toString();
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
      }
    }
  }, [isLoading, properties, propertyID, searchParams, router, pathname]);

  const selectedProperty =
    propertyID !== null
      ? properties.find((p) => p.id === propertyID) ?? null
      : null;

  const setPropertyScope = useCallback(
    (id: number | null) => {
      setPropertyID(id);

      // Update URL search params (shallow — no full page reload)
      const params = new URLSearchParams(searchParams.toString());
      if (id !== null) {
        params.set("propertyId", String(id));
      } else {
        params.delete("propertyId");
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return (
    <ScopeContext.Provider
      value={{
        customerID: MOCK_CUSTOMER_ID,
        propertyID,
        selectedProperty,
        properties,
        setPropertyScope,
        isLoading,
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within ScopeProvider");
  return ctx;
}
