import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireEstablishment } from "../../middlewares/establishment.js";

import medicosRoutes from "./medicos/medicos.routes.js";
import agendaRoutes from "./agenda/agenda.routes.js";

const r = Router();

r.use(requireAuth);
r.use(requireEstablishment);

r.use("/medicos", medicosRoutes);
r.use("/agenda", agendaRoutes);

export default r;
