import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/base.scss";
import "../../styles/components.scss";
import { http } from "../../api/http";
import EditUserModal from "../../components/EditUserModal";

export default function ApprovedUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [ests, setEsts] = useState([]);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  // modal edición
  const [editing, setEditing] = useState(null);

  // filtros
  const [rol, setRol] = useState(""); // por nombre: "USER", "ADMIN"...
  const [establecimiento, setEstablecimiento] = useState(""); // id

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (rol) params.set("rol", rol);
    if (establecimiento) params.set("establecimiento", establecimiento);
    const q = params.toString();
    return q ? `?${q}` : "";
  }, [rol, establecimiento]);

  const loadCatalogs = async () => {
    const [r, e] = await Promise.all([
      http.get("/api/catalog/roles"),
      http.get("/api/catalog/establecimientos"),
    ]);
    setRoles(r.data.data || []);
    setEsts(e.data.data || []);
  };

  const loadUsers = async () => {
    setErr(null);
    const r = await http.get(`/api/admin/users/approved${query}`);
    setUsers(r.data.data || []);
  };

  useEffect(() => {
    loadCatalogs().catch((e) => setErr(e?.response?.data?.error || "Error catálogos"));
  }, []);

  useEffect(() => {
    loadUsers().catch((e) => setErr(e?.response?.data?.error || "Error listando usuarios"));
  }, [query]);

  const clearFilters = () => {
    setRol("");
    setEstablecimiento("");
  };

  const onEdit = (u) => {
    // guardamos usuario y campos útiles para el modal
    setEditing({
      ...u,
      // por si no viene fk_* en tu endpoint, el modal igual funciona
      fk_rol: u.fk_rol ?? null,
      fk_establecimiento: u.fk_establecimiento ?? u.id_establecimiento ?? null,
    });
  };

  const onDisable = async (u) => {
    setMsg(null);
    setErr(null);

    const ok = confirm(`¿Deshabilitar a ${u.nombre} ${u.apellido}?`);
    if (!ok) return;

    try {
      await http.patch(`/api/admin/users/${u.id_user}/disable`);
      setMsg("✅ Usuario deshabilitado");
      await loadUsers();
    } catch (e) {
      setErr(e?.response?.data?.error || "Error deshabilitando usuario");
    }
  };

  const onSaveEdit = async (payload) => {
    setMsg(null);
    setErr(null);

    try {
      // payload trae: nombre, apellido, telefono, fk_rol, fk_establecimiento
      await http.patch(`/api/admin/users/${editing.id_user}`, payload);
      setEditing(null);
      setMsg("✅ Usuario actualizado");
      await loadUsers();
    } catch (e) {
      setErr(e?.response?.data?.error || "Error actualizando usuario");
    }
  };

  return (
    <AdminLayout title="Usuarios aprobados">
      {msg && <div className="alert alert--ok">{msg}</div>}
      {err && <div className="alert alert--error">{err}</div>}

      <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
        <div className="grid2">
          <div>
            <label className="label">Filtrar por rol</label>
            <select className="input" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos</option>
              {roles.map((r) => (
                <option key={r.id_role} value={r.rol}>
                  {r.rol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Filtrar por establecimiento</label>
            <select
              className="input"
              value={establecimiento}
              onChange={(e) => setEstablecimiento(e.target.value)}
            >
              <option value="">Todos</option>
              {ests.map((es) => (
                <option key={es.id_establecimiento} value={es.id_establecimiento}>
                  {es.nombre_establecimiento}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn--primary" onClick={loadUsers}>
            Aplicar
          </button>
          <button className="btn btn--dark" onClick={clearFilters}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="table">
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Establecimiento</th>
              <th>Teléfono</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id_user}>
                <td>{u.id_user}</td>
                <td>
                  {u.nombre} {u.apellido}
                </td>
                <td>{u.correo}</td>
                <td>{u.rol || "-"}</td>
                <td>{u.nombre_establecimiento || "-"}</td>
                <td>{u.telefono || "-"}</td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>

                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn--dark" onClick={() => onEdit(u)}>
                      Editar
                    </button>
                    <button className="btn btn--danger" onClick={() => onDisable(u)}>
                      Deshabilitar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 14, color: "#64748b" }}>
                  No hay usuarios aprobados con esos filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal editar */}
      <EditUserModal
        open={!!editing}
        user={editing}
        roles={roles}
        ests={ests}
        onClose={() => setEditing(null)}
        onSave={onSaveEdit}
      />
    </AdminLayout>
  );
}
