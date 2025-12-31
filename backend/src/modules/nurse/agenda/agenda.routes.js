import { Router } from "express";
import { getDias, getCitas } from "./agenda.controller.js";

const r = Router();

r.get("/dias", getDias);
r.get("/citas", getCitas);

export default r;