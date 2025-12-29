import { pgQuery } from "../../config/pg.js";

export async function findByEmail(correo) {
  const r = await pgQuery(
    `SELECT id_user, nombre, apellido, correo, password_hash, fk_rol, fk_establecimiento, status, is_enabled
     FROM users
     WHERE correo = $1`,
    [correo]
  );
  return r.rows[0] || null;
}

export async function createPendingUser(data) {
  const {
    nombre,
    apellido,
    carnet,
    telefono,
    fecha_nacimiento,
    correo,
    password_hash,
  } = data;

  const r = await pgQuery(
    `INSERT INTO users (nombre, apellido, carnet, telefono, fecha_nacimiento, correo, password_hash)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id_user, nombre, apellido, correo, status`,
    [nombre, apellido, carnet, telefono, fecha_nacimiento, correo, password_hash]
  );
  return r.rows[0];
}

export async function getMeById(id_user) {
  const r = await pgQuery(
    `
    SELECT
      u.id_user,
      u.nombre,
      u.apellido,
      u.correo,
      u.fk_rol,
      u.fk_establecimiento,
      u.status,
      u.is_enabled,
      r.rol AS rol,
      e.nombre_establecimiento
    FROM users u
    LEFT JOIN roles r ON r.id_role = u.fk_rol
    LEFT JOIN establecimientos e ON e.id_establecimiento = u.fk_establecimiento
    WHERE u.id_user = $1
    `,
    [id_user]
  );

  return r.rows[0] || null;
}

