import { Router } from "express";
import * as Ctrl from "./medicos.controller.js";

const r = Router();

/**
 * GET /api/nurse/medicos/con-especialidad?idestablecimiento=112
 */
r.get("/con-especialidad", Ctrl.medicosConEspecialidad);

/**
 * GET /api/nurse/medicos/consultorios?idestablecimiento=112
 */
r.get("/consultorios", Ctrl.medicosConsultorios);

/**
 * GET /api/nurse/medicos/cuaderno/:idcuaderno?idestablecimiento=112
 */
r.get("/cuaderno/:idcuaderno", Ctrl.medicosByCuaderno);

/**
 * GET /api/nurse/medicos/especialidades-con-medicos?idestablecimiento=112
 * (útil para armar combos y agrupar)
 */
r.get("/especialidades-con-medicos", Ctrl.especialidadesConMedicos);

export default r;
