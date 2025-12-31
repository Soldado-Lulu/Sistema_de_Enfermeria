// backend/src/modules/nurse/medicos/medicos.routes.js
import { Router } from "express";
import * as Ctrl from "./medicos.controller.js";

const r = Router();

// ✅ GET /api/nurse/medicos?idest=8
r.get("/", Ctrl.getMedicosConEspecialidad);

export default r;
