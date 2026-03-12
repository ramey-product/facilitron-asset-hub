import type { Env } from "hono";

export interface AuthContext {
  customerID: number;
  contactId: number;
  username: string;
  roles: string[];
}

export interface AppEnv extends Env {
  Variables: {
    auth: AuthContext;
  };
}
