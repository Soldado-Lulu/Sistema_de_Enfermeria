import { Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "./auth/RoleRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// admin
import AdminPending from "./pages/admin/PendingUsersPage";
import ApprovedUsers from "./pages/admin/ApprovedUsersPage";
import RolesPage from "./pages/admin/RolesPage";

// nurse
import NurseHome from "./pages/nurse/NurseHome";
import PacientesRouter from "./pages/nurse/PacientesRouter";
import NurseReportesPage from "./pages/nurse/NurseReportesPage"; // ejemplo (si es común)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* admin */}
      <Route
        path="/admin/pending"
        element={
          <RoleRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
            <AdminPending />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/approved"
        element={
          <RoleRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
            <ApprovedUsers />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <RoleRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
            <RolesPage />
          </RoleRoute>
        }
      />

      {/* nurse */}
      <Route
        path="/nurse"
        element={
          <RoleRoute allowedRoles={["NURSE"]}>
            <NurseHome />
          </RoleRoute>
        }
      />

      <Route
        path="/nurse/pacientes"
        element={
          <RoleRoute allowedRoles={["NURSE"]}>
            <PacientesRouter />
          </RoleRoute>
        }
      />
  
      <Route
        path="/nurse/reportes"
        element={
          <RoleRoute allowedRoles={["NURSE"]}>
            <NurseReportesPage />
          </RoleRoute>
        }
      />

      <Route path="/no-autorizado" element={<div style={{ padding: 20 }}>No autorizado</div>} />
      <Route path="*" element={<div style={{ padding: 20 }}>404</div>} />
    </Routes>
  );
}
