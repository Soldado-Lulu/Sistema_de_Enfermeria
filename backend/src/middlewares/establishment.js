// src/middlewares/establishment.js

export function requireEstablishment(req, _res, next) {
  /**
   * Este middleware asume que:
   * - requireAuth ya se ejecutó
   * - req.user existe y contiene { id_user, fk_rol, fk_establecimiento, rol }
   */

  // 🔑 SUPERADMIN → acceso global
  if (req.user?.rol === 'SUPERADMIN') {
    req.scope = {
      global: true,
      fk_establecimiento: null,
    };
    return next();
  }

  // ❌ Otros roles → deben tener establecimiento
  if (!req.user?.fk_establecimiento) {
    const err = new Error(
      'Usuario sin establecimiento asignado. Contacte al administrador.'
    );
    err.statusCode = 403;
    throw err;
  }

  // ✅ Acceso limitado a su establecimiento
  req.scope = {
    global: false,
    fk_establecimiento: req.user.fk_establecimiento,
  };

  next();
}
