import { Router } from "express";
import * as Ctrl from "./especialidades.controller.js";

const r = Router();

// GET /api/nurse/especialidades?idestablecimiento=112
r.get("/", Ctrl.especialidades);

// GET /api/nurse/especialidades/consultorios?idestablecimiento=112
r.get("/consultorios", Ctrl.consultorios);

export default r;
