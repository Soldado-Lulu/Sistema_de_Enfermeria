import React, { useEffect, useMemo, useState } from "react";
import EstablishmentsTagsSelect from "./EstablishmentsTagsSelect";

export default function EditUserModal({ open, user, roles = [], ests = [], onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fk_rol: "",
    establecimientos: [],
    default_establecimiento: null,
  });

  useEffect(() => {
    if (!open || !user) return;

    const fk_rol = user.fk_rol ?? "";
    const establecimientos = Array.isArray(user.establecimientos)
      ? user.establecimientos.map(Number)
      : (user.fk_establecimiento ? [Number(user.fk_establecimiento)] : []);

    const default_establecimiento =
      user.default_establecimiento
        ? Number(user.default_establecimiento)
        : (establecimientos[0] ?? null);

    setForm({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
      fk_rol,
      establecimientos,
      default_establecimiento,
    });
  }, [open, user]);

  // si quitan el default, ajustar
  useEffect(() => {
    if (form.default_establecimiento && !form.establecimientos.includes(Number(form.default_establecimiento))) {
      setForm((p) => ({ ...p, default_establecimiento: p.establecimientos[0] || null }));
    }
  }, [form.establecimientos, form.default_establecimiento]);

  const canSave = useMemo(() => {
    return (
      form.nombre.trim() &&
      form.apellido.trim() &&
      Number(form.fk_rol) &&
      form.establecimientos.length > 0 &&
      form.default_establecimiento
    );
  }, [form]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 60,
        padding: 16,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          background: "white",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Editar usuario</h3>
          <button className="btn btn--dark" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="grid2" style={{ marginTop: 12, gap: 12 }}>
          <div>
            <label className="label">Nombre</label>
            <input
              className="input"
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Apellido</label>
            <input
              className="input"
              value={form.apellido}
              onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Teléfono</label>
            <input
              className="input"
              value={form.telefono}
              onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Rol</label>
            <select
              className="input"
              value={form.fk_rol}
              onChange={(e) => setForm((p) => ({ ...p, fk_rol: Number(e.target.value) }))}
            >
              <option value="">—</option>
              {roles.map((r) => (
                <option key={r.id_role} value={r.id_role}>
                  {r.rol}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Establecimientos (tags)</label>
            <EstablishmentsTagsSelect
              ests={ests}
              value={form.establecimientos}
              onChange={(ids) => setForm((p) => ({ ...p, establecimientos: ids }))}
            />

            <div style={{ marginTop: 8 }}>
              <label className="label">Establecimiento activo (default)</label>
              <select
                className="input"
                value={form.default_establecimiento || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, default_establecimiento: Number(e.target.value) }))
                }
              >
                <option value="">—</option>
                {form.establecimientos.map((id) => {
                  const es = ests.find((x) => Number(x.id_establecimiento) === Number(id));
                  return (
                    <option key={id} value={id}>
                      {es?.nombre_establecimiento || id}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
          <button className="btn btn--dark" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            disabled={!canSave}
            onClick={() =>
              onSave?.({
                nombre: form.nombre,
                apellido: form.apellido,
                telefono: form.telefono || null,
                fk_rol: Number(form.fk_rol),
                establecimientos: form.establecimientos,
                default_establecimiento: Number(form.default_establecimiento),
              })
            }
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
