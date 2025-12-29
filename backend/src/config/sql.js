// src/config/sql.js
import sql from "mssql";
import { env } from "./env.js";

const pools = {
  db1: null,
  db2: null,
};

function buildConfig(databaseName) {
  const cfg = env.SQL;

  if (!cfg.host || !cfg.user || !cfg.password || !databaseName) {
    throw new Error("Faltan variables SQL Server en .env (SQL_HOST/USER/PASSWORD/DB)");
  }

  return {
    user: cfg.user,
    password: cfg.password,
    server: cfg.host,
    port: cfg.port,
    database: databaseName,
    options: {
      encrypt: cfg.encrypt,
      trustServerCertificate: cfg.trustCert,
      instanceName: cfg.instance || undefined,
      // OJO: esto ayuda en redes internas con TLS viejo (como ya venías usando)
      cryptoCredentialsDetails: { minVersion: "TLSv1" },
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
}

/**
 * Obtiene pool de SQL Server.
 * @param {"db1"|"db2"} which - db1=bdfichas, db2=bdhistoriasclinicas
 */
export async function getSqlPool(which = "db1") {
  const dbName = which === "db2" ? env.SQL.db2 : env.SQL.db1;

  if (pools[which] && pools[which].connected) return pools[which];

  const config = buildConfig(dbName);

  // si existe pero está roto, cerramos
  if (pools[which]) {
    try {
      await pools[which].close();
    } catch (_) {}
  }

  pools[which] = await new sql.ConnectionPool(config).connect();
  return pools[which];
}

// helper para consultas rápidas
export async function sqlQuery(which, queryText, params = {}) {
  const pool = await getSqlPool(which);
  const req = pool.request();

  for (const [key, val] of Object.entries(params)) {
    req.input(key, val);
  }

  const result = await req.query(queryText);
  return result;
}

export { sql };
