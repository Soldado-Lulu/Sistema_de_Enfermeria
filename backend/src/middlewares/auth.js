import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      const err = new Error("No autenticado");
      err.statusCode = 401;
      throw err;
    }
    req.user = verifyToken(token); // {id_user, fk_rol, fk_establecimiento}
    next();
  } catch (e) {
    e.statusCode = e.statusCode || 401;
    next(e);
  }
}
