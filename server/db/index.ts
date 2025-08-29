import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

function getTursoConfig() {
  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_DB_AUTH_TOKEN;
  if (!url) {
    throw new Error("TURSO_DB_URL is not set");
  }
  return { url, authToken };
}

const client = createClient(getTursoConfig());
export const db = drizzle(client, { schema });
export type DB = typeof db;
