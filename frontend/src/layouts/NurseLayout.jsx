import React from "react";
import { useAuth } from "../auth/AuthContext";
import "../styles/admin.scss"; // reutilizamos el estilo del admin (sidebar)

export default function NurseLayout({ title, children }) {
  const { logout } = useAuth();

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Enfermería</div>

        <nav className="admin__nav">
          <a className="admin__link" href="/nurse">Inicio</a>
          <a className="admin__link" href="/nurse/pacientes">Pacientes</a>
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
