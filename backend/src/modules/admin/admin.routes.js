// backend/src/modules/admin/admin.routes.js
import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import { requireEstablishment } from "../../middlewares/establishment.js";

import * as Ctrl from "./admin.controller.js";

const r = Router();

r.use(requireAuth);
r.use(requireRole("ADMIN", "SUPERADMIN"));
r.use(requireEstablishment);

r.get("/users/pending", Ctrl.listPending);
r.patch("/users/:id/approve", Ctrl.approve);
r.patch("/users/:id/disable", Ctrl.disable);

r.get("/users/approved", Ctrl.listApproved);
r.patch("/users/:id", Ctrl.updateUser);

// ✅ NUEVO: tags del usuario
r.get("/users/:id/establecimientos", Ctrl.getUserEstablishments);

export default r;
