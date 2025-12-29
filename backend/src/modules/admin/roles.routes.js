import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/roles.js";
import * as Ctrl from "./roles.controller.js";

const r = Router();

r.use(requireAuth);
r.use(requireRole("ADMIN", "SUPERADMIN"));

r.get("/", Ctrl.list);
r.post("/", Ctrl.create);

export default r;
