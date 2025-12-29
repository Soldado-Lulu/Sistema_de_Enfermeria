import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.scss";

export default function NurseLayout({ title, children }) {
  const { logout } = useAuth();

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Enfermería</div>

        <nav className="admin__nav">
          <NavLink
            to="/nurse"
            end
            className={({ isActive }) =>
              `admin__link ${isActive ? "admin__link--active" : ""}`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/nurse/pacientes"
            className={({ isActive }) =>
              `admin__link ${isActive ? "admin__link--active" : ""}`
            }
          >
            Pacientes
          </NavLink>

          <NavLink
            to="/nurse/especialidades"
            className={({ isActive }) =>
              `admin__link ${isActive ? "admin__link--active" : ""}`
            }
          >
            Especialidades
          </NavLink>

          <NavLink
            to="/nurse/medicos"
            className={({ isActive }) =>
              `admin__link ${isActive ? "admin__link--active" : ""}`
            }
          >
            Médicos
          </NavLink>
        </nav>

        <button className="btn btn--dark" onClick={logout}>
          Salir
        </button>
      </aside>

      <main className="admin__main">
        <header className="admin__header">
          <h2>{title}</h2>
        </header>

        <section className="admin__content">{children}</section>
      </main>
    </div>
  );
}
