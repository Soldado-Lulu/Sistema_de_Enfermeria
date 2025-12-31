import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import "../styles/base.scss";
import "../styles/components.scss";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      const me = await login({ correo, password });
      console.log("👤 Usuario (me):", me);

      if (me?.rol === "ADMIN" || me?.rol === "SUPERADMIN") {
        nav("/admin/pending", { replace: true });
        return;
      }

      if (me?.rol === "NURSE") {
        nav("/nurse", { replace: true });
        return;
      }

      nav("/no-autorizado", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      footer={<span>¿No tienes cuenta? <Link to="/register">Registrarse</Link></span>}
    >
      <form className="grid1" onSubmit={onSubmit}>
        <div>
          <label className="label">Correo</label>
          <input
            className="input"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {err && <div className="alert alert--error">{err}</div>}
        <button className="btn btn--primary" type="submit">Entrar</button>
      </form>
    </AuthLayout>
  );
}
