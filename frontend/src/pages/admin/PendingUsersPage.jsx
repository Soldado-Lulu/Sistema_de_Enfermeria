import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/base.scss";
import "../../styles/components.scss";
import { http } from "../../api/http";

export default function PendingUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [ests, setEsts] = useState([]);
  const [err, setErr] = useState(null);

  const load = async () => {
    setErr(null);
    const [u, r, e] = await Promise.all([
      http.get("/api/admin/users/pending"),
      http.get("/api/catalog/roles"),
      http.get("/api/catalog/establecimientos"),
    ]);
    setUsers(u.data.data || []);
    setRoles(r.data.data || []);
    setEsts(e.data.data || []);
  };

  useEffect(() => { load().catch((e)=>setErr(e?.response?.data?.error || "Error")); }, []);

  const approve = async (id_user, fk_rol, fk_establecimiento) => {
    await http.patch(`/api/admin/users/${id_user}/approve`, { fk_rol, fk_establecimiento });
    await load();
  };

  return (
    <AdminLayout title="Usuarios pendientes">
      {err && <div className="alert alert--error">{err}</div>}

      <div className="table">
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Establecimiento</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <Row key={u.id_user} u={u} roles={roles} ests={ests} onApprove={approve} />
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 14, color: "#64748b" }}>No hay usuarios pendientes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function Row({ u, roles, ests, onApprove }) {
  const defaultRole = roles.find((x) => x.rol === "USER")?.id_role || roles[0]?.id_role || "";
  const defaultEst = ests[0]?.id_establecimiento || "";
  const [fk_rol, setRol] = useState(defaultRole);
  const [fk_est, setEst] = useState(defaultEst);

  useEffect(() => { if (!fk_rol && roles.length) setRol(defaultRole); }, [roles]);
  useEffect(() => { if (!fk_est && ests.length) setEst(defaultEst); }, [ests]);

  return (
    <tr>
      <td>{u.nombre} {u.apellido}</td>
      <td>{u.correo}</td>
      <td>
        <select className="input" value={fk_rol} onChange={(e)=>setRol(Number(e.target.value))}>
          {roles.map((r) => <option key={r.id_role} value={r.id_role}>{r.rol}</option>)}
        </select>
      </td>
      <td>
        <select className="input" value={fk_est} onChange={(e)=>setEst(Number(e.target.value))}>
          {ests.map((es) => <option key={es.id_establecimiento} value={es.id_establecimiento}>{es.nombre_establecimiento}</option>)}
        </select>
      </td>
      <td>
        <button className="btn btn--primary" onClick={() => onApprove(u.id_user, Number(fk_rol), Number(fk_est))}>
          Aprobar
        </button>
      </td>
    </tr>
  );
}
