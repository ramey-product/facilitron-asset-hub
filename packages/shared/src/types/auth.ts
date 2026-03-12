/**
 * Auth context types shared between API and web app.
 */

export interface AuthContext {
  customerID: number;
  contactId: number;
  username: string;
  roles: string[];
}

export type UserRole =
  | "OrderAdministrator"
  | "OrderProcessor"
  | "OrderApprover"
  | "OrderOriginator"
  | "MaintenanceTechnician"
  | "PlantManager"
  | "ReadOnly";
