import React, { useEffect, useState } from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { useAuth } from "../../auth/AuthContext";
import { nurseService } from "../../services/nurse.service";

export default function NurseMedicosPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.fk_establecimiento) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r = await nurseService.getMedicosConEspecialidadByEst(user.fk_establecimiento);
        setRows(r.data.data || []);
      } catch (e) {
        setErr(e?.response?.data?.error || "Error cargando médicos");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.fk_establecimiento]);

  return (
    <NurseLayout title="Médicos">
      {err ? <div className="alert alert--error">{err}</div> : null}

      <div className="table">
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Especialidad</th>
              <th>Médico</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} style={{ padding: 14 }}>Cargando...</td></tr>
            ) : rows.length ? (
              rows.map((r, idx) => (
                <tr key={`${r.idpersonalmedico}-${idx}`}>
                  <td>{r.especialidad}</td>
                  <td>{r.medico_nombre}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={2} style={{ padding: 14, color: "#64748b" }}>Sin datos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </NurseLayout>
  );
}
