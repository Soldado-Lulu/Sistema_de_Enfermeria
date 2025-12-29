import { pgQuery } from "../config/pg.js";

export function requireRole(...allowed) {
  return async (req, _res, next) => {
    try {
      const { fk_rol } = req.user || {};
      if (!fk_rol) {
        const err = new Error("Sin rol asignado");
        err.statusCode = 403;
        throw err;
      }

      const r = await pgQuery(`SELECT rol FROM roles WHERE id_role = $1`, [fk_rol]);
      const rolName = r.rows[0]?.rol;

      if (!rolName || !allowed.includes(rolName)) {
        const err = new Error("No autorizado");
        err.statusCode = 403;
        throw err;
      }

      req.user.rol = rolName;
      next();
    } catch (e) {
      next(e);
    }
  };
}
