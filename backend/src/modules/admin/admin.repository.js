// backend/src/modules/admin/admin.repository.js
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

/**
 * ✅ NUEVO: devuelve tags/establecimientos del usuario
 */
export async function getUserEstablishmentsByUserId(id_user) {
  const r = await pgQuery(
    `
    SELECT
      ue.fk_establecimiento AS id_establecimiento,
      ue.is_default,
      ue.is_enabled
    FROM user_establecimientos ue
    WHERE ue.fk_user = $1 AND ue.is_enabled = true
    ORDER BY ue.is_default DESC, ue.created_at ASC
    `,
    [id_user]
  );
  return r.rows;
}

/**
 * ✅ NUEVO: transaccional
 * - actualiza user (rol, activo, establecimiento activo = default)
 * - sincroniza tabla puente user_establecimientos con los tags
 */
export async function approveUserWithEstablishments({
  id_user,
  fk_rol,
  establecimientos,
  default_establecimiento,
}) {
  // normalizar
  const ests = [...new Set((establecimientos || []).map(Number))].filter(Boolean);

  if (!ests.length) {
    const err = new Error("Debe asignar al menos 1 establecimiento");
    err.statusCode = 400;
    throw err;
  }

  if (!ests.includes(Number(default_establecimiento))) {
    const err = new Error("default_establecimiento debe estar dentro de establecimientos");
    err.statusCode = 400;
    throw err;
  }

  // ⚠️ Transacción: si tu pgQuery no mantiene client, esto necesitará pool.connect()
  await pgQuery("BEGIN");
  try {
    // 1) activar usuario + set default en users para compatibilidad con vistas
    const u = await pgQuery(
      `
      UPDATE users
      SET status='ACTIVO', is_enabled=true, fk_rol=$2, fk_establecimiento=$3
      WHERE id_user=$1
      RETURNING id_user, status, fk_rol, fk_establecimiento
      `,
      [id_user, fk_rol, default_establecimiento]
    );

    const updated = u.rows[0] || null;
    if (!updated) {
      await pgQuery("ROLLBACK");
      return null;
    }

    // 2) limpiar tabla puente para evitar basura (simple y seguro)
    await pgQuery(`DELETE FROM user_establecimientos WHERE fk_user=$1`, [id_user]);

    // 3) insertar tags + marcar default
    for (const estId of ests) {
      await pgQuery(
        `
        INSERT INTO user_establecimientos (fk_user, fk_establecimiento, is_default, is_enabled)
        VALUES ($1, $2, $3, true)
        `,
        [id_user, estId, Number(estId) === Number(default_establecimiento)]
      );
    }

    await pgQuery("COMMIT");
    return updated;
  } catch (e) {
    await pgQuery("ROLLBACK");
    throw e;
  }
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

export async function listUsers(scope) {
  if (scope.global) {
    return pgQuery(`SELECT * FROM users`);
  }
  return pgQuery(`SELECT * FROM users WHERE fk_establecimiento = $1`, [
    scope.fk_establecimiento,
  ]);
}

export async function listApprovedUsers(scope, { rol, establecimiento }) {
  const where = [];
  const params = [];
  let i = 1;

  where.push(`u.status = 'ACTIVO'`);
  where.push(`u.is_enabled = true`);

  if (!scope.global) {
    where.push(`u.fk_establecimiento = $${i++}`);
    params.push(scope.fk_establecimiento);
  }

  if (rol) {
    where.push(`r.rol = $${i++}`);
    params.push(rol);
  }

  // ⚠️ filtro actual usa establecimiento ACTIVO (users.fk_establecimiento)
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
      u.fk_rol,
      u.fk_establecimiento,
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

/**
 * ✅ NUEVO: updateUser que soporta tags
 * - update campos normales
 * - si viene establecimientos/default => sincroniza puente y actualiza users.fk_establecimiento
 */
export async function updateUserWithEstablishments(scope, id_user, data) {
  // 1) update campos simples (si vienen)
  const fields = [];
  const params = [];
  let i = 1;

  const allowed = ["nombre", "apellido", "telefono", "fk_rol"];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${i++}`);
      params.push(data[key]);
    }
  }

  // si vienen tags, también actualizamos fk_establecimiento al default
  const hasTags = Array.isArray(data.establecimientos);
  if (hasTags) {
    const ests = [...new Set(data.establecimientos.map(Number))].filter(Boolean);

    if (!ests.length) {
      const err = new Error("Debe asignar al menos 1 establecimiento");
      err.statusCode = 400;
      throw err;
    }

    const def = Number(data.default_establecimiento || ests[0]);
    if (!ests.includes(def)) {
      const err = new Error("default_establecimiento debe estar dentro de establecimientos");
      err.statusCode = 400;
      throw err;
    }

    // compatibilidad con vistas
    fields.push(`fk_establecimiento = $${i++}`);
    params.push(def);
  }

  if (fields.length === 0 && !hasTags) {
    const err = new Error("No hay campos para actualizar");
    err.statusCode = 400;
    throw err;
  }

  // where scope
  let where = `id_user = $${i++}`;
  params.push(id_user);

  if (!scope.global) {
    where += ` AND fk_establecimiento = $${i++}`;
    params.push(scope.fk_establecimiento);
  }

  await pgQuery("BEGIN");
  try {
    let updatedUser = null;

    if (fields.length > 0) {
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
      updatedUser = r.rows[0];
    } else {
      // no update fields, pero sí tags: validar que el usuario exista y esté autorizado
      const chk = await pgQuery(
        `SELECT id_user, fk_establecimiento FROM users WHERE ${where}`,
        params
      );
      if (!chk.rows[0]) {
        const err = new Error("Usuario no encontrado o no autorizado");
        err.statusCode = 404;
        throw err;
      }
      updatedUser = chk.rows[0];
    }

    // 2) si viene tags, sincronizar puente
    if (hasTags) {
      const ests = [...new Set(data.establecimientos.map(Number))].filter(Boolean);
      const def = Number(data.default_establecimiento || ests[0]);

      await pgQuery(`DELETE FROM user_establecimientos WHERE fk_user=$1`, [id_user]);

      for (const estId of ests) {
        await pgQuery(
          `
          INSERT INTO user_establecimientos (fk_user, fk_establecimiento, is_default, is_enabled)
          VALUES ($1, $2, $3, true)
          `,
          [id_user, estId, Number(estId) === def]
        );
      }
    }

    await pgQuery("COMMIT");
    return updatedUser;
  } catch (e) {
    await pgQuery("ROLLBACK");
    throw e;
  }
}
