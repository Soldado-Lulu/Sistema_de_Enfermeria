import React, { useEffect, useMemo, useState } from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { useAuth } from "../../auth/AuthContext";
import { nurseAgendaService } from "../../services/nurseAgenda.service";

// helpers
function toYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function NurseAgendaPage() {
  const { user } = useAuth();

  // 👇 aquí deberías tener el médico seleccionado (del page de Médicos)
  // Opción simple: guardarlo en localStorage cuando lo seleccionas.
  const selectedMedico = useMemo(() => {
    try {
      const raw = localStorage.getItem("nurse_selected_medico");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const idest = selectedMedico?.idest || user?.fk_establecimiento || null;
  const idcuaderno = selectedMedico?.idcuaderno || null;
  const idpersonalmedico = selectedMedico?.idpersonalmedico || null;

  const [err, setErr] = useState("");
  const [loadingDias, setLoadingDias] = useState(false);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // rango calendario (mes actual)
  const [monthRef, setMonthRef] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthStart = useMemo(() => new Date(monthRef.getFullYear(), monthRef.getMonth(), 1), [monthRef]);
  const monthEnd = useMemo(() => new Date(monthRef.getFullYear(), monthRef.getMonth() + 1, 0), [monthRef]); // último día

  const desde = useMemo(() => toYMD(monthStart), [monthStart]);
  const hasta = useMemo(() => toYMD(monthEnd), [monthEnd]);

  // días con conteo: { "2025-03-24": 12, ... }
  const [diasMap, setDiasMap] = useState({});

  // día seleccionado
  const [selectedDate, setSelectedDate] = useState(() => toYMD(new Date()));

  // lista de citas del día
  const [citas, setCitas] = useState([]);

  // carga días (calendario)
  useEffect(() => {
    if (!idest) return;

    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoadingDias(true);

        const res = await nurseAgendaService.dias({
          idest,
          desde,
          hasta,
          idcuaderno,
          idpersonalmedico,
          estados: ["OCUPADO", "RESERVADO"],
        });

        if (!alive) return;

        const rows = res?.data?.data || [];
        const map = {};
        for (const r of rows) map[r.dia] = Number(r.total || 0);
        setDiasMap(map);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || e?.message || "Error cargando días");
        setDiasMap({});
      } finally {
        if (alive) setLoadingDias(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [idest, desde, hasta, idcuaderno, idpersonalmedico]);

  // carga citas del día seleccionado
  useEffect(() => {
    if (!idest || !selectedDate) return;

    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoadingCitas(true);

        const res = await nurseAgendaService.citas({
          idest,
          fecha: selectedDate,
          idcuaderno,
          idpersonalmedico,
          estados: ["OCUPADO", "RESERVADO"],
        });

        if (!alive) return;

        const list = res?.data?.data || [];
        setCitas(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || e?.message || "Error cargando citas");
        setCitas([]);
      } finally {
        if (alive) setLoadingCitas(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [idest, selectedDate, idcuaderno, idpersonalmedico]);

  // calendario simple: lista de días del mes
  const daysInMonth = useMemo(() => {
    const days = [];
    const start = new Date(monthRef.getFullYear(), monthRef.getMonth(), 1);
    const end = new Date(monthRef.getFullYear(), monthRef.getMonth() + 1, 0);
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [monthRef]);

  const headerTitle = useMemo(() => {
    const m = monthRef.toLocaleString("es-BO", { month: "long", year: "numeric" });
    return m.charAt(0).toUpperCase() + m.slice(1);
  }, [monthRef]);

  const labelMedico = selectedMedico?.label || "— Selecciona un médico en la página Médicos —";

  return (
    <NurseLayout title="Agenda">
      {err && <div className="alert alert--error">{err}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {/* Info del filtro actual */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>Médico / Especialidad activa</div>
          <div style={{ fontWeight: 700 }}>{labelMedico}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            idest: <b>{idest ?? "-"}</b> · idcuaderno: <b>{idcuaderno ?? "-"}</b> · idpersonal: <b>{idpersonalmedico ?? "-"}</b>
          </div>
        </div>

        {/* Calendario + listado */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 12, alignItems: "start" }}>
          {/* Calendario */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <button
                className="btn btn--dark"
                type="button"
                onClick={() => setMonthRef((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              >
                ←
              </button>
              <div style={{ fontWeight: 800 }}>{headerTitle}</div>
              <button
                className="btn btn--dark"
                type="button"
                onClick={() => setMonthRef((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              >
                →
              </button>
            </div>

            {loadingDias ? (
              <div style={{ color: "#64748b", padding: 8 }}>Cargando días...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {daysInMonth.map((d) => {
                  const ymd = toYMD(d);
                  const total = diasMap[ymd] || 0;
                  const active = ymd === selectedDate;

                  return (
                    <button
                      key={ymd}
                      type="button"
                      onClick={() => setSelectedDate(ymd)}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "8px 6px",
                        background: active ? "#0f172a" : "#fff",
                        color: active ? "#fff" : "#0f172a",
                        cursor: "pointer",
                        lineHeight: 1.1,
                      }}
                      title={total ? `${total} citas` : "Sin citas"}
                    >
                      <div style={{ fontWeight: 800 }}>{d.getDate()}</div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>
                        {total ? `${total}` : "·"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Citas del día */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: 12, borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <div style={{ fontWeight: 800 }}>Citas del día: {selectedDate}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Estados: OCUPADO / RESERVADO
              </div>
            </div>

            {loadingCitas ? (
              <div style={{ padding: 12, color: "#64748b" }}>Cargando citas...</div>
            ) : citas.length === 0 ? (
              <div style={{ padding: 12, color: "#64748b" }}>Sin citas para este día</div>
            ) : (
              <div style={{ maxHeight: 520, overflow: "auto" }}>
                {citas.map((c) => (
                  <div
                    key={c.idfichaprogramada}
                    style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 800 }}>
                        {c.paciente}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {String(c.fip_estado || "")}
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      Inicio: {String(c.fip_fecha_ini)} · Fin: {String(c.fip_hora_fin)}
                    </div>

                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      idficha: <b>{c.idfichaprogramada}</b> · idcuaderno: <b>{c.idcuaderno}</b> · idpersonal: <b>{c.idpersonal}</b>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </NurseLayout>
  );
}
