import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import "../styles/base.scss";
import "../styles/components.scss";
import { http } from "../api/http";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "", apellido: "", carnet: "", telefono: "",
    fecha_nacimiento: "", correo: "", password: ""
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    try {
      await http.post("/api/auth/register", form);
      setMsg("✅ Registro enviado. Espera aprobación del administrador.");
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <AuthLayout
      title="Registro"
      footer={<span>¿Ya tienes cuenta? <Link to="/login">Login</Link></span>}
    >
      <form className="grid1" onSubmit={onSubmit}>
        <div className="grid2">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={form.nombre} onChange={set("nombre")} />
          </div>
          <div>
            <label className="label">Apellido</label>
            <input className="input" value={form.apellido} onChange={set("apellido")} />
          </div>
        </div>

        <div className="grid2">
          <div>
            <label className="label">Carnet</label>
            <input className="input" value={form.carnet} onChange={set("carnet")} />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" value={form.telefono} onChange={set("telefono")} />
          </div>
        </div>

        <div>
          <label className="label">Fecha nacimiento</label>
          <input className="input" type="date" value={form.fecha_nacimiento} onChange={set("fecha_nacimiento")} />
        </div>

        <div>
          <label className="label">Correo</label>
          <input className="input" value={form.correo} onChange={set("correo")} />
        </div>

        <div>
          <label className="label">Contraseña</label>
          <input className="input" type="password" value={form.password} onChange={set("password")} />
        </div>

        {msg && <div className="alert alert--ok">{msg}</div>}
        {err && <div className="alert alert--error">{err}</div>}

        <button className="btn btn--primary" type="submit">Registrarme</button>
      </form>
    </AuthLayout>
  );
}
