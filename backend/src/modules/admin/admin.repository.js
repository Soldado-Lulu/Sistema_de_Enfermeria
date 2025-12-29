import { pgQuery } from "../../config/pg.js";

export async function listPendingUsers() {
  const r = await pgQuery(
    `SELECT id_user, nombre, apellido, correo, carnet, status, created_at
     FROM users
     WHERE status = 'PENDIENTE'
     ORDER BY created_at ASC`
  );
  return r.rows;
}

export async function approveUser({ id_user, fk_rol, fk_establecimiento }) {
  const r = await pgQuery(
    `UPDATE users
     SET status='ACTIVO', fk_rol=$2, fk_establecimiento=$3
     WHERE id_user=$1
     RETURNING id_user, status, fk_rol, fk_establecimiento`,
    [id_user, fk_rol, fk_establecimiento]
  );
  return r.rows[0] || null;
}

export async function disableUser(id_user) {
  const r = await pgQuery(
    `UPDATE users SET is_enabled=false, status='INACTIVO'
     WHERE id_user=$1
     RETURNING id_user, status, is_enabled`,
    [id_user]
  );
  return r.rows[0] || null;
}
// admin.repository.js
export async function listUsers(scope) {
  if (scope.global) {
    return pgQuery(`SELECT * FROM users`);
  }

  return pgQuery(
    `SELECT * FROM users WHERE fk_establecimiento = $1`,
    [scope.fk_establecimiento]
  );
}

export async function listApprovedUsers(scope, { rol, establecimiento }) {
  const where = [];
  const params = [];
  let i = 1;

  // Solo aprobados (activos)
  where.push(`u.status = 'ACTIVO'`);
  where.push(`u.is_enabled = true`);

  // ADMIN solo ve su establecimiento, SUPERADMIN ve todo
  if (!scope.global) {
    where.push(`u.fk_establecimiento = $${i++}`);
    params.push(scope.fk_establecimiento);
  }

  // Filtro por rol (por nombre: ADMIN, NURSE, USER, etc.)
  if (rol) {
    where.push(`r.rol = $${i++}`);
    params.push(rol);
  }

  // Filtro por establecimiento (id)
  if (establecimiento) {
    where.push(`u.fk_establecimiento = $${i++}`);
    params.push(establecimiento);
  }

  const sql = `
    SELECT
      u.id_user,
      u.nombre,
      u.apellido,
      u.carnet,
      u.telefono,
      u.correo,
      u.created_at,
      r.rol,
      e.id_establecimiento,
      e.nombre_establecimiento
    FROM users u
    LEFT JOIN roles r ON r.id_role = u.fk_rol
    LEFT JOIN establecimientos e ON e.id_establecimiento = u.fk_establecimiento
    WHERE ${where.join(" AND ")}
    ORDER BY u.created_at DESC
  `;

  const rta = await pgQuery(sql, params);
  return rta.rows;
}

export async function updateUserById(scope, id_user, data) {
  const fields = [];
  const params = [];
  let i = 1;

  const allowed = ["nombre", "apellido", "telefono", "fk_rol", "fk_establecimiento"];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${i++}`);
      params.push(data[key]);
    }
  }

  if (fields.length === 0) {
    const err = new Error("No hay campos para actualizar");
    err.statusCode = 400;
    throw err;
  }

  let where = `id_user = $${i++}`;
  params.push(id_user);

  // ADMIN solo puede editar usuarios de su establecimiento
  if (!scope.global) {
    where += ` AND fk_establecimiento = $${i++}`;
    params.push(scope.fk_establecimiento);
  }

  const sql = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE ${where}
    RETURNING id_user, nombre, apellido, correo, telefono, fk_rol, fk_establecimiento, status, is_enabled
  `;

  const r = await pgQuery(sql, params);

  if (!r.rows[0]) {
    const err = new Error("Usuario no encontrado o no autorizado");
    err.statusCode = 404;
    throw err;
  }

  return r.rows[0];
}
