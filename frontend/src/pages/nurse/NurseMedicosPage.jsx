import React, { useEffect, useMemo, useState } from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { nurseService } from "../../services/nurse.service";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NurseMedicosPage() {
  const { user } = useAuth();
   const navigate = useNavigate();

  const ests = useMemo(() => {
    const list = user?.establecimientos || [];
    return Array.isArray(list) ? list : [];
  }, [user]);

  const defaultEst = useMemo(() => {
    const def = ests.find((x) => x.is_default)?.id_establecimiento;
    return def
      ? Number(def)
      : user?.fk_establecimiento
      ? Number(user.fk_establecimiento)
      : null;
  }, [ests, user]);

  const [idest, setIdest] = useState(defaultEst);

  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ filtros
  const [especialidad, setEspecialidad] = useState("");
  const [q, setQ] = useState("");

  // ✅ médico seleccionado (JSON)
  const [selectedMedico, setSelectedMedico] = useState(() => {
    try {
      const raw = localStorage.getItem("nurse_selected_medico");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!idest && defaultEst) setIdest(defaultEst);
  }, [defaultEst, idest]);

  useEffect(() => {
    if (!idest) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await nurseService.medicosConEspecialidad(idest);
        if (!alive) return;

        const list = res?.data?.data || [];
        setRows(Array.isArray(list) ? list : []);

        // reset filtros al cambiar establecimiento
        setEspecialidad("");
        setQ("");

        // (opcional) limpiar selección anterior si era de otro establecimiento
        setSelectedMedico((prev) => {
          if (!prev) return prev;
          if (Number(prev.idest) !== Number(idest)) return null;
          return prev;
        });
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message || e?.message || "Error cargando médicos"
        );
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [idest]);

  const estActivoNombre =
    ests.find((x) => Number(x.id_establecimiento) === Number(idest))
      ?.nombre_establecimiento ||
    user?.nombre_establecimiento ||
    "-";

  // ✅ lista única de especialidades
  const especialidades = useMemo(() => {
    const set = new Set();
    for (const r of rows) {
      const name = (r.especialidad || "").trim();
      if (name) set.add(name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  // ✅ rows filtradas
  const filteredRows = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return rows.filter((r) => {
      const esp = (r.especialidad || "").trim();
      const label = (r.label || "").toLowerCase();
      const medico = (r.medico_nombre || "").toLowerCase();

      const okEsp = !especialidad || esp === especialidad;
      const okQ = !qq || label.includes(qq) || medico.includes(qq);

      return okEsp && okQ;
    });
  }, [rows, especialidad, q]);

  function onPickMedico(r) {
    const payload = {
      idest: Number(idest),
      establecimiento: estActivoNombre,     
      idcuaderno: Number(r.idcuaderno),
      especialidad: (r.especialidad || "").trim(),
      idpersonalmedico: Number(r.idpersonalmedico),
      medico_nombre: (r.medico_nombre || "").trim(),
      label: (r.label || "").trim(),
    };

    setSelectedMedico(payload);
    console.log("✅ Médico seleccionado:", payload);

    // opcional: guardarlo para usarlo en otras pantallas/endpoints
    localStorage.setItem("nurse_selected_medico", JSON.stringify(payload));
    navigate("/nurse/agenda");
  }

  return (
    <NurseLayout title="Médicos">
      {err && <div className="alert alert--error">{err}</div>}

      {/* ===================== CONTROLES ===================== */}
      <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
        {/* Card: Establecimiento */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <label className="label" style={{ display: "block", marginBottom: 6 }}>
            Establecimiento
          </label>

          <select
            className="input"
            value={idest || ""}
            onChange={(e) => setIdest(Number(e.target.value))}
            disabled={ests.length === 0}
          >
            <option value="">— Selecciona —</option>
            {ests.map((es) => (
              <option key={es.id_establecimiento} value={es.id_establecimiento}>
                {es.nombre_establecimiento} {es.is_default ? " (default)" : ""}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
            Activo: <b>{estActivoNombre}</b> (ID: {idest || "-"})
          </div>
        </div>

        {/* Card: Filtros */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 8,
            }}
          >
            <div>
              <label
                className="label"
                style={{ display: "block", marginBottom: 6 }}
              >
                Filtrar por especialidad
              </label>
              <select
                className="input"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                disabled={loading || rows.length === 0}
              >
                <option value="">Todas</option>
                {especialidades.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="label"
                style={{ display: "block", marginBottom: 6 }}
              >
                Buscar médico
              </label>
              <input
                className="input"
                placeholder="Ej: rocha / pediatría / alfredo..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                disabled={loading || rows.length === 0}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ color: "#64748b", fontSize: 12 }}>
              Mostrando <b>{filteredRows.length}</b> de <b>{rows.length}</b>
            </div>

            <button
              className="btn btn--dark"
              type="button"
              onClick={() => {
                setEspecialidad("");
                setQ("");
              }}
              disabled={loading || (especialidad === "" && q.trim() === "")}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* (opcional) preview JSON seleccionado */}
        {selectedMedico && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 10,
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              Seleccionado (JSON)
            </div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(selectedMedico, null, 2)}
            </pre>
          </div>
        )}
      </div>
      {/* ===================== FIN CONTROLES ===================== */}

      {/* ===================== TABLA ===================== */}
      <div className="table">
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Especialidad - Médico</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={{ padding: 8 }}>Cargando...</td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td style={{ padding: 8, color: "#64748b" }}>Sin datos</td>
              </tr>
            ) : (
              filteredRows.map((r, idx) => {
                const key = `${r.idcuaderno}-${r.idpersonalmedico}-${idx}`;

                const isActive =
                  selectedMedico &&
                  Number(selectedMedico.idpersonalmedico) ===
                    Number(r.idpersonalmedico) &&
                  Number(selectedMedico.idcuaderno) === Number(r.idcuaderno);

                return (
                  <tr key={key}>
                    <td style={{ padding: 10 }}>
                      <button
                        type="button"
                        onClick={() => onPickMedico(r)}
                        className={isActive ? "btn btn--primary" : "btn btn--blue"}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 14px",
                          borderRadius: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{ fontWeight: 800 }}>
                          {(r.especialidad || "").trim()}
                        </span>
                        <span style={{ opacity: 0.92 }}>
                          {(r.medico_nombre || "").trim()}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* ===================== FIN TABLA ===================== */}
    </NurseLayout>
  );
}
