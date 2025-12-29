import { z } from "zod";
import * as repo from "./roles.repository.js";

const CreateRoleSchema = z.object({
  rol: z.string().trim().min(2, "Rol muy corto").max(50),
  descripcion: z.string().trim().max(200).optional().nullable(),
});

export async function list(_req, res, next) {
  try {
    const data = await repo.listRoles();
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const payload = CreateRoleSchema.parse(req.body);
    const created = await repo.createRole(payload);
    res.status(201).json({ ok: true, data: created });
  } catch (e) {
    next(e);
  }
}
