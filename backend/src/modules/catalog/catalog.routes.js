import { Router } from "express";
import { pgQuery } from "../../config/pg.js";

const r = Router();

r.get("/roles", async (_req, res, next) => {
  try {
    const rta = await pgQuery(`SELECT id_role, rol, descripcion FROM roles ORDER BY id_role`);
    res.json({ ok: true, data: rta.rows });
  } catch (e) {
    next(e);
  }
});

r.get("/establecimientos", async (_req, res, next) => {
  try {
    const rta = await pgQuery(
      `SELECT id_establecimiento, nombre_establecimiento
       FROM establecimientos ORDER BY id_establecimiento`
    );
    res.json({ ok: true, data: rta.rows });
  } catch (e) {
    next(e);
  }
});

export default r;
