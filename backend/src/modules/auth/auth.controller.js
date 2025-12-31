// backend/src/modules/auth/auth.controller.js
import { RegisterSchema, LoginSchema } from "./auth.schemas.js";
import * as svc from "./auth.service.js";
import * as authRepo from "./auth.repository.js";

export async function register(req, res, next) {
  try {
    const data = RegisterSchema.parse(req.body);
    const created = await svc.registerPendingUser(data);
    return res.status(201).json({ ok: true, data: created });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const data = LoginSchema.parse(req.body);
    const result = await svc.login(data);
    return res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
}
export async function me(req, res, next) {
  try {
    const id_user = req.user?.id_user;
    if (!id_user) {
      return res.status(401).json({ ok: false, error: "No autorizado" });
    }

    // ✅ traer datos del usuario
    const user = await authRepo.getMeById(id_user);
    if (!user) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    // ✅ traer establecimientos (tags)
    const ests = await authRepo.getUserEstablishments(id_user);

    return res.json({
      ok: true,
      data: {
        ...user,
        establecimientos: ests,
      },
    });
  } catch (e) {
    next(e);
  }
}
