import React, { useMemo, useState } from "react";

/**
 * Multi-select con tags/chips sin librerías.
 * - ests: [{ id_establecimiento, nombre_establecimiento }]
 * - value: number[] ids seleccionados
 * - onChange: (newIds:number[]) => void
 */
export default function EstablishmentsTagsSelect({ ests = [], value = [], onChange }) {
  const [q, setQ] = useState("");

  const selectedIds = useMemo(() => new Set((value || []).map(Number)), [value]);

  const selected = useMemo(() => {
    return ests.filter((e) => selectedIds.has(Number(e.id_establecimiento)));
  }, [ests, selectedIds]);

  const available = useMemo(() => {
    const filtered = ests.filter((e) => !selectedIds.has(Number(e.id_establecimiento)));
    const s = q.trim().toLowerCase();
    if (!s) return filtered;
    return filtered.filter((e) =>
      (e.nombre_establecimiento || "").toLowerCase().includes(s)
    );
  }, [ests, selectedIds, q]);

  const add = (id) => {
    const n = Number(id);
    if (!n) return;
    if (selectedIds.has(n)) return;
    onChange?.([...(value || []).map(Number), n]);
    setQ("");
  };

  const remove = (id) => {
    const n = Number(id);
    onChange?.((value || []).map(Number).filter((x) => x !== n));
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {/* Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {selected.map((es) => (
          <span
            key={es.id_establecimiento}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: "#0f172a",
              color: "white",
              fontSize: 12,
            }}
          >
            {es.nombre_establecimiento}
            <button
              type="button"
              onClick={() => remove(es.id_establecimiento)}
              style={{
                border: "none",
                background: "transparent",
                color: "white",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
              }}
              aria-label="Quitar"
              title="Quitar"
            >
              ×
            </button>
          </span>
        ))}

        {selected.length === 0 && (
          <span style={{ color: "#64748b", fontSize: 12 }}>Sin establecimientos</span>
        )}
      </div>

      {/* Buscar + Agregar */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          placeholder="Buscar establecimiento..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select className="input" value="" onChange={(e) => add(e.target.value)}>
          <option value="">Agregar…</option>
          {available.map((es) => (
            <option key={es.id_establecimiento} value={es.id_establecimiento}>
              {es.nombre_establecimiento}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
