import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { nurseService } from "../../services/nurse.service";

export default function NurseEspecialidades() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const idest = user?.fk_establecimiento;

  useEffect(() => {
    if (!idest) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ este endpoint existe en tu backend (medicos.routes)
        const r = await nurseService.getEspecialidadesConMedicosByEst(idest);
        const data = r?.data?.data ?? r?.data ?? [];
        if (!alive) return;

        setRows(data || []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.error || "Error cargando especialidades con médicos");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, [idest]);

  const grouped = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const map = new Map();

    for (const r of rows) {
      const idc = r.idcuaderno;
      if (!map.has(idc)) {
        map.set(idc, { idcuaderno: idc, especialidad: r.especialidad, medicos: [] });
      }
      map.get(idc).medicos.push({
        idpersonalmedico: r.idpersonalmedico,
        medico_nombre: r.medico_nombre,
      });
    }

    let arr = Array.from(map.values());

    if (qq) {
      arr = arr.filter((g) => {
        const esp = String(g.especialidad || "").toLowerCase();
        if (esp.includes(qq)) return true;
        return g.medicos.some((m) =>
          String(m.medico_nombre || "").toLowerCase().includes(qq)
        );
      });
    }

    arr = arr.map((g) => {
      const unique = new Map();
      for (const m of g.medicos) unique.set(m.idpersonalmedico, m);
      const medicos = Array.from(unique.values()).sort((a, b) =>
        a.medico_nombre.localeCompare(b.medico_nombre)
      );
      return { ...g, medicos };
    });

    arr.sort((a, b) => a.especialidad.localeCompare(b.especialidad));
    return arr;
  }, [rows, q]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Especialidades y Médicos</h1>
          <small>Establecimiento: {user?.nombre_establecimiento || idest}</small>
        </div>

        <input
          className="input"
          style={{ maxWidth: 420 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por especialidad o médico..."
        />
      </div>

      {err ? <div className="alert alert--error">{err}</div> : null}

      <div className="table">
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Especialidad</th>
              <th>Médicos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} style={{ padding: 14 }}>Cargando...</td></tr>
            ) : grouped.length === 0 ? (
              <tr><td colSpan={2} style={{ padding: 14, color: "#64748b" }}>Sin datos</td></tr>
            ) : (
              grouped.map((g) => (
                <tr key={g.idcuaderno}>
                  <td style={{ fontWeight: 600 }}>{g.especialidad}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {g.medicos.map((m) => (
                        <span
                          key={m.idpersonalmedico}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                          }}
                        >
                          {m.medico_nombre}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
