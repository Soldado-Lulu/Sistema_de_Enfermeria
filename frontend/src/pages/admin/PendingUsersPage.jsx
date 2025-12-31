import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/base.scss";
import "../../styles/components.scss";
import { http } from "../../api/http";
import EstablishmentsTagsSelect from "../../components/EstablishmentsTagsSelect";

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

  useEffect(() => {
    load().catch((e) => setErr(e?.response?.data?.error || "Error"));
  }, []);

  const approve = async (id_user, fk_rol, establecimientos, default_establecimiento) => {
    try {
      await http.patch(`/api/admin/users/${id_user}/approve`, {
        fk_rol,
        establecimientos, // ✅ array
        default_establecimiento, // ✅ activo
      });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || "Error aprobando usuario");
    }
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
              <th>Establecimientos (tags)</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <Row key={u.id_user} u={u} roles={roles} ests={ests} onApprove={approve} />
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 14, color: "#64748b" }}>
                  No hay usuarios pendientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function Row({ u, roles, ests, onApprove }) {
  const defaultRole =
    roles.find((x) => x.rol === "USER")?.id_role || roles[0]?.id_role || "";
  const firstEst = ests[0]?.id_establecimiento ? Number(ests[0].id_establecimiento) : null;

  const [fk_rol, setRol] = useState(defaultRole);

  // ✅ tags
  const [establecimientos, setEstablecimientos] = useState(firstEst ? [firstEst] : []);
  const [defaultEstablecimiento, setDefaultEstablecimiento] = useState(firstEst);

  useEffect(() => {
    if (!fk_rol && roles.length) setRol(defaultRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  useEffect(() => {
    if (!establecimientos.length && firstEst) {
      setEstablecimientos([firstEst]);
      setDefaultEstablecimiento(firstEst);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ests]);

  // si quitaron el default, ajustar
  useEffect(() => {
    if (defaultEstablecimiento && !establecimientos.includes(Number(defaultEstablecimiento))) {
      setDefaultEstablecimiento(establecimientos[0] || null);
    }
  }, [establecimientos, defaultEstablecimiento]);

  const canApprove = Number(fk_rol) && establecimientos.length > 0 && defaultEstablecimiento;

  return (
    <tr>
      <td>
        {u.nombre} {u.apellido}
      </td>
      <td>{u.correo}</td>

      <td style={{ minWidth: 180 }}>
        <select className="input" value={fk_rol} onChange={(e) => setRol(Number(e.target.value))}>
          {roles.map((r) => (
            <option key={r.id_role} value={r.id_role}>
              {r.rol}
            </option>
          ))}
        </select>
      </td>

      <td style={{ minWidth: 420 }}>
        <EstablishmentsTagsSelect
          ests={ests}
          value={establecimientos}
          onChange={setEstablecimientos}
        />

        <div style={{ marginTop: 8 }}>
          <label className="label">Establecimiento activo (default)</label>
          <select
            className="input"
            value={defaultEstablecimiento || ""}
            onChange={(e) => setDefaultEstablecimiento(Number(e.target.value))}
          >
            <option value="">—</option>
            {establecimientos.map((id) => {
              const es = ests.find((x) => Number(x.id_establecimiento) === Number(id));
              return (
                <option key={id} value={id}>
                  {es?.nombre_establecimiento || id}
                </option>
              );
            })}
          </select>
        </div>
      </td>

      <td>
        <button
          className="btn btn--primary"
          disabled={!canApprove}
          onClick={() =>
            onApprove(u.id_user, Number(fk_rol), establecimientos, Number(defaultEstablecimiento))
          }
        >
          Aprobar
        </button>
      </td>
    </tr>
  );
}
