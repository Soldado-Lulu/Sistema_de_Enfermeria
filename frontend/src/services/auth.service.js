// frontend/src/services/auth.service.js
import { http } from "../api/http";

export const authService = {
  login: (payload) => http.post("/api/auth/login", payload),
  register: (payload) => http.post("/api/auth/register", payload),
  me: () => http.get("/api/auth/me"),

  // ✅ OPCIONAL (solo si implementas multi-establecimiento en backend)
  // listar establecimientos disponibles del usuario logueado (para selector)
  myEstablishments: () => http.get("/api/auth/establecimientos"),

  // ✅ OPCIONAL (si permites cambiar establecimiento activo sin re-login)
  changeEstablishment: (id_establecimiento) =>
    http.post("/api/auth/change-establishment", { id_establecimiento }),
};
