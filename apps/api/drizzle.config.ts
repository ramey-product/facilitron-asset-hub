import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*.ts",
  out: "./src/db/migrations",
  dialect: "mssql",
  dbCredentials: {
    server: process.env["DB_SERVER"] ?? "localhost",
    port: Number(process.env["DB_PORT"] ?? 1433),
    database: process.env["DB_NAME"] ?? "asset_hub",
    user: process.env["DB_USER"] ?? "sa",
    password: process.env["DB_PASSWORD"] ?? "",
  },
} satisfies Config;
