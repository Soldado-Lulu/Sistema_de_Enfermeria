import React from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { useAuth } from "../../auth/AuthContext";
import { useNurseEstablishment } from "../../hooks/userNurseEstablishment";
import { Link } from "react-router-dom";

export default function NurseHome() {
  const { user } = useAuth();
  const { isHospitalObrero } = useNurseEstablishment();

  return (
    <NurseLayout title="Inicio enfermería">
      <div style={{ display: "grid", gap: 12 }}>
        <div className="card">
          <div style={{ fontSize: 14 }}>
            Estás en: <b>{user?.nombre_establecimiento || "-"}</b>{" "}
            {isHospitalObrero ? <span>(modo especial)</span> : null}
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn--primary" to="/nurse/pacientes">
            Pacientes
          </Link>
          <Link className="btn btn--dark" to="/nurse/medicos">
            Médicos
          </Link>

        </div>
      </div>
    </NurseLayout>
  );
}
