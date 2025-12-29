import React from "react";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.scss";
import { NavLink } from "react-router-dom";

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth();

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Sistema Enfermería</div>
      <nav className="admin__nav">
  <NavLink className="admin__link" to="/admin/pending">Pendientes</NavLink>
  <NavLink className="admin__link" to="/admin/approved">Aprobados</NavLink>
  <NavLink className="admin__link" to="/admin/roles">Roles</NavLink>
</nav>


        <button className="btn btn--dark" onClick={logout}>Salir</button>
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
