// src/modules/admin/admin.routes.js
import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { requireEstablishment } from "../../middlewares/establishment.js";

import * as Ctrl from "./admin.controller.js";

const r = Router();

// 🔑 orden correcto de middlewares globales
r.use(requireAuth);
r.use(requireRole("ADMIN", "SUPERADMIN"));
r.use(requireEstablishment);

// rutas
r.get("/users/pending", Ctrl.listPending);
r.patch("/users/:id/approve", Ctrl.approve);
r.patch("/users/:id/disable", Ctrl.disable);
r.get("/users/approved", requireRole("ADMIN", "SUPERADMIN"), requireEstablishment, Ctrl.listApproved);
r.patch("/users/:id", requireRole("ADMIN", "SUPERADMIN"), Ctrl.updateUser);

export default r;
