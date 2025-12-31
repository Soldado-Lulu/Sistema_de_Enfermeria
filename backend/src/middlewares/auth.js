// backend/src/middlewares/auth.js
import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const [type, token] = h.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, error: "No autorizado" });
    }

    const payload = verifyToken(token);
    req.user = payload; 
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
}
