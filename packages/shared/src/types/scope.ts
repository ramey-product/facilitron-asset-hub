/**
 * Scope / Property types shared between API and web app.
 */

export interface PropertySummary {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  assetCount: number;
  isActive: boolean;
}
