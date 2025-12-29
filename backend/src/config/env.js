// src/config/env.js
/*
import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ,
  PORT: Number(process.env.PORT),
  CORS_ORIGIN: process.env.CORS_ORIGIN ,

  DATABASE_URL: required("DATABASE_URL"),
  DB_SSL_BOOL: String(process.env.DB_SSL || "false") === "true",

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // SQL Server (opcional, lo usamos más adelante)
  SQL: {
    host: process.env.SQL_HOST,
    instance: process.env.SQL_INSTANCE,
    port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    db1: process.env.SQL_DB1,
    db2: process.env.SQL_DB2,
    encrypt: String(process.env.SQL_ENCRYPT || "false") === "true",
    trustCert: String(process.env.SQL_TRUST_CERT || "true") === "true",
  },
};
*/
// src/config/env.js
import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ,

  // Postgres (tu app)
  DATABASE_URL: required("DATABASE_URL"),
  DB_SSL_BOOL: String(process.env.DB_SSL || "false") === "true",

  // JWT
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // SQL Server (SIAIS)
  SQL: {
    host: process.env.SQL_HOST, // 172.21.96.14
    instance: process.env.SQL_INSTANCE, // SIAIS
    port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 1433,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,

    // DBs
    db1: process.env.SQL_DB1, // bdfichas
    db2: process.env.SQL_DB2, // bdhistoriasclinicas

    encrypt: String(process.env.SQL_ENCRYPT || "false") === "true",
    trustCert: String(process.env.SQL_TRUST_CERT || "true") === "true",
  },
};
