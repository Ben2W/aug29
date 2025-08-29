import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

let sqlite: Database.Database | null = null;

export function getDatabaseFilePath() {
  return process.env.DATABASE_PATH || ".data/app.db";
}

export function createSqlite(): Database.Database {
  if (!sqlite) {
    sqlite = new Database(getDatabaseFilePath());
  }
  return sqlite;
}

export const db = drizzle(createSqlite(), { schema });

export type DB = typeof db;
