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

    const user = await authRepo.getMeById(id_user);
    return res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
}
