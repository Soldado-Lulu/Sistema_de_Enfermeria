import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.scss";

export default function NurseLayout({ title, children }) {
  const { logout } = useAuth();

  // ✅ sidebar visible/oculto
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("nurse_sidebar_open");
    return saved ? saved === "1" : true; // default: abierto
  });

  useEffect(() => {
    localStorage.setItem("nurse_sidebar_open", sidebarOpen ? "1" : "0");
  }, [sidebarOpen]);

  return (
    <div className={`admin ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <aside className="admin__sidebar">
        <div className="admin__brand">Enfermería</div>

        <nav className="admin__nav">
          <NavLink className="admin__link" to="/nurse">
            Inicio
          </NavLink>
          <NavLink className="admin__link" to="/nurse/medicos">
            Médicos
          </NavLink>
          <NavLink className="admin__link" to="/nurse/pacientes">
            Pacientes
          </NavLink>
          <NavLink className="admin__link" to="/nurse/agenda">Agenda</NavLink>

        </nav>

        <button className="btn btn--dark" onClick={logout}>
          Salir
        </button>
      </aside>

      <main className="admin__main">
        {/* ✅ header compact + botón toggle */}
        <header
          className="admin__header"
          style={{
            padding: "10px 14px",
            marginBottom: 10,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="btn btn--dark"
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              style={{ padding: "8px 12px", borderRadius: 10 }}
              aria-label="Mostrar/Ocultar menú"
              title="Mostrar/Ocultar menú"
            >
              ☰
            </button>

            <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.2 }}>
              {title}
            </h2>
          </div>
        </header>

        <section className="admin__content">{children}</section>
      </main>
    </div>
  );
}
