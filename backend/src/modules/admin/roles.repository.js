import { pgQuery } from "../../config/pg.js";

export async function listRoles() {
  const r = await pgQuery(
    `SELECT id_role, rol, descripcion, created_at
     FROM roles
     ORDER BY id_role ASC`
  );
  return r.rows;
}

export async function createRole({ rol, descripcion }) {
  // evita duplicados por UNIQUE
  const r = await pgQuery(
    `INSERT INTO roles (rol, descripcion)
     VALUES ($1, $2)
     RETURNING id_role, rol, descripcion, created_at`,
    [rol, descripcion ?? null]
  );
  return r.rows[0];
}
