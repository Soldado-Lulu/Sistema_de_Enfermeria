// backend/src/modules/admin/admin.controller.js
import { ApproveSchema } from "./admin.schemas.js";
import * as svc from "./admin.service.js";
import { z } from "zod";

export async function listPending(req, res, next) {
  try {
    const data = await svc.listPending();
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function approve(req, res, next) {
  try {
    const id_user = Number(req.params.id);
    const payload = ApproveSchema.parse(req.body);
    const data = await svc.approve(req.scope, id_user, payload);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function disable(req, res, next) {
  try {
    const id_user = Number(req.params.id);
    const data = await svc.disable(id_user);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function listApproved(req, res, next) {
  try {
    const { rol, establecimiento } = req.query;
    const data = await svc.listApproved(req.scope, {
      rol: rol ? String(rol) : null,
      establecimiento: establecimiento ? Number(establecimiento) : null,
    });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

// ✅ ahora update soporta tags
const UpdateUserSchema = z.object({
  nombre: z.string().trim().min(1).optional(),
  apellido: z.string().trim().min(1).optional(),
  telefono: z.string().trim().optional().nullable(),
  fk_rol: z.number().int().optional().nullable(),

  // ✅ nuevo
  establecimientos: z.array(z.number().int().positive()).min(1).optional(),
  default_establecimiento: z.number().int().positive().optional(),
});

export async function updateUser(req, res, next) {
  try {
    const id_user = Number(req.params.id);
    const data = UpdateUserSchema.parse(req.body);

    const updated = await svc.updateUser(req.scope, id_user, data);
    return res.json({ ok: true, data: updated });
  } catch (e) {
    next(e);
  }
}

// ✅ NUEVO: para que el frontend cargue tags al editar
export async function getUserEstablishments(req, res, next) {
  try {
    const id_user = Number(req.params.id);
    const data = await svc.getUserEstablishments(req.scope, id_user);
    return res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}
