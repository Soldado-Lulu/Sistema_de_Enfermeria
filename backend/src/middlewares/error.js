// src/middlewares/error.js
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);
  return res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message || "Error interno",
  });
}
