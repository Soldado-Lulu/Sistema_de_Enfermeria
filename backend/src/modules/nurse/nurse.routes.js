import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";

import medicosRoutes from "./medicos/medicos.routes.js";
import especialidadesRoutes from "./especialidades/especialidades.routes.js";

const r = Router();

r.use(requireAuth);
r.use(requireRole("NURSE", "ADMIN", "SUPERADMIN"));

r.use("/medicos", medicosRoutes);
r.use("/especialidades", especialidadesRoutes);

export default r;
