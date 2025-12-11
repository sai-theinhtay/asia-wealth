import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _connection: mysql.Pool | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!_db) {
    _connection = mysql.createPool({
      uri: process.env.DATABASE_URL,
    });
    _db = drizzle(_connection, { schema, mode: "default" });
  }

  return _db;
}

// Export db for backward compatibility, but it will only be created when accessed
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

