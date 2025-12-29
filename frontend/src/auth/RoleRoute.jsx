import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { token, user, loadingMe } = useAuth();

  // si no hay token: a login
  if (!token) return <Navigate to="/login" replace />;

  // si está cargando /me: espera
  if (loadingMe || !user) return <div style={{ padding: 20 }}>Cargando...</div>;

  // soporte por si backend devuelve "rol" o "role"
  const roleName = user.rol || user.role || null;

  // si no viene rol, no autorizar
  if (!roleName) return <Navigate to="/no-autorizado" replace />;

  // validar acceso
  if (!allowedRoles.includes(roleName)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
