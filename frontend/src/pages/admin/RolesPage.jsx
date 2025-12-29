import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/base.scss";
import "../../styles/components.scss";
import { http } from "../../api/http";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ rol: "", descripcion: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const load = async () => {
    setErr(null);
    const r = await http.get("/api/admin/roles");
    setRoles(r.data.data || []);
  };

  useEffect(() => {
    load().catch((e) => setErr(e?.response?.data?.error || "Error cargando roles"));
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    try {
      await http.post("/api/admin/roles", {
        rol: form.rol,
        descripcion: form.descripcion || null,
      });
      setForm({ rol: "", descripcion: "" });
      setMsg("✅ Rol creado correctamente");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Error creando rol");
    }
  };

  return (
    <AdminLayout title="Administrar roles">
      {msg && <div className="alert alert--ok">{msg}</div>}
      {err && <div className="alert alert--error">{err}</div>}

      <div style={{ display: "grid", gap: 14 }}>
        {/* Formulario */}
        <div style={{ background: "white", borderRadius: 16, padding: 14, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 10px" }}>Crear nuevo rol</h3>

          <form className="grid1" onSubmit={onCreate}>
            <div>
              <label className="label">Nombre del rol</label>
              <input
                className="input"
                placeholder="Ej: DOCTOR"
                value={form.rol}
                onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value.toUpperCase() }))}
              />
            </div>

            <div>
              <label className="label">Descripción</label>
              <input
                className="input"
                placeholder="Descripción opcional"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              />
            </div>

            <button className="btn btn--primary" type="submit">
              Crear rol
            </button>
          </form>
        </div>

        {/* Tabla */}
        <div className="table">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Rol</th>
                <th>Descripción</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id_role}>
                  <td>{r.id_role}</td>
                  <td style={{ fontWeight: 700 }}>{r.rol}</td>
                  <td>{r.descripcion || "-"}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 14, color: "#64748b" }}>
                    No hay roles registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
