import * as repo from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { signToken } from "../../utils/jwt.js";

export async function registerPendingUser(payload) {
  const exists = await repo.findByEmail(payload.correo);
  if (exists) {
    const err = new Error("El correo ya está registrado");
    err.statusCode = 409;
    throw err;
  }

  const password_hash = await hashPassword(payload.password);

  const created = await repo.createPendingUser({
    ...payload,
    password_hash,
    fecha_nacimiento: payload.fecha_nacimiento || null,
    telefono: payload.telefono || null,
  });

  return created;
}

export async function login({ correo, password }) {
  const user = await repo.findByEmail(correo);
  if (!user) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  // REGLA: solo ACTIVO y enabled
  if (!user.is_enabled || user.status !== "ACTIVO") {
    const err = new Error("Tu cuenta aún no está activa. Espera aprobación del administrador.");
    err.statusCode = 403;
    throw err;
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({
    id_user: user.id_user,
    fk_rol: user.fk_rol,
    fk_establecimiento: user.fk_establecimiento,
  });

  return { token };
}
