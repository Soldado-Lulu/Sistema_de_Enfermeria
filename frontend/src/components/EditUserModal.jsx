import React, { useEffect, useState } from "react";

export default function EditUserModal({ open, user, roles, ests, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fk_rol: "",
    fk_establecimiento: "",
  });

  useEffect(() => {
    if (open && user) {
      setForm({
        nombre: user.nombre ?? "",
        apellido: user.apellido ?? "",
        telefono: user.telefono ?? "",
        fk_rol: user.fk_rol ?? "",
        fk_establecimiento: user.fk_establecimiento ?? "",
      });
    }
  }, [open, user]);

  if (!open) return null;

  const submit = () => {
    // normalizamos
    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim() || null,
      fk_rol: form.fk_rol ? Number(form.fk_rol) : null,
      fk_establecimiento: form.fk_establecimiento ? Number(form.fk_establecimiento) : null,
    };
    onSave(payload);
  };

  return (
    <div className="modal__backdrop" onMouseDown={onClose}>
      <div className="modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Editar usuario</h3>

        <div className="grid2">
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
              onChange={(e) => setForm((p) => ({ ...p, fk_rol: e.target.value }))}
            >
              <option value="">Seleccionar</option>
              {roles.map((r) => (
                <option key={r.id_role} value={r.id_role}>
                  {r.rol}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Establecimiento</label>
            <select
              className="input"
              value={form.fk_establecimiento}
              onChange={(e) => setForm((p) => ({ ...p, fk_establecimiento: e.target.value }))}
            >
              <option value="">Seleccionar</option>
              {ests.map((es) => (
                <option key={es.id_establecimiento} value={es.id_establecimiento}>
                  {es.nombre_establecimiento}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
          <button className="btn btn--dark" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn--primary" onClick={submit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
