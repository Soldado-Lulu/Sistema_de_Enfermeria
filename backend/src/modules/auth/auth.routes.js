import { Router } from "express";
import * as Ctrl from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.js";

const r = Router();

r.post("/register", Ctrl.register);
r.post("/login", Ctrl.login);

// nuevo
r.get("/me", requireAuth, Ctrl.me);

export default r;
