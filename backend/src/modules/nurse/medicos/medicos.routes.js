import { Router } from "express";
import * as Ctrl from "./medicos.controller.js";
import { requireAuth } from "../../../middlewares/auth.js";
import { requireRole } from "../../../middlewares/roles.js";

const r = Router();

// solo enfermería (y si quieres admin también, lo agregas)
r.use(requireAuth);
r.use(requireRole("NURSE", "ADMIN", "SUPERADMIN"));

// GET /api/nurse/medicos/establecimiento/112
r.get("/establecimiento/:idestablecimiento", Ctrl.getByEst);

// GET /api/nurse/medicos/establecimiento/112/consultorios
r.get("/establecimiento/:idestablecimiento/consultorios", Ctrl.getConsultorios);

// GET /api/nurse/medicos/establecimiento/112/especialidades-con-medicos
r.get("/establecimiento/:idestablecimiento/especialidades-con-medicos", Ctrl.getEspecialidadesConMedicos);

// GET /api/nurse/medicos/establecimiento/112/cuaderno/123
r.get("/establecimiento/:idestablecimiento/cuaderno/:idcuaderno", Ctrl.getByEstAndCuaderno);

export default r;
