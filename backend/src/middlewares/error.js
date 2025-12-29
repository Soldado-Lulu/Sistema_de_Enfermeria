// src/middlewares/error.js
export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const msg = err.message || "Error interno";
  return res.status(status).json({ ok: false, error: msg });
}
