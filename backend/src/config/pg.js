// src/config/pg.js
import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DB_SSL_BOOL ? { rejectUnauthorized: false } : false,
});

export async function pgQuery(text, params = []) {
  return pgPool.query(text, params);
}
