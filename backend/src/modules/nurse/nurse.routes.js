import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";

import medicosRoutes from "./medicos/medicos.routes.js";
import especialidadesRoutes from "./especialidades/especialidades.routes.js";

const r = Router();

// Solo logueados
r.use(requireAuth);

// Solo enfermería (si también quieres ADMIN/SUPERADMIN agrega aquí)
r.use(requireRole("NURSE", "ADMIN", "SUPERADMIN"));

// submódulos
r.use("/medicos", medicosRoutes);
r.use("/especialidades", especialidadesRoutes);

export default r;
