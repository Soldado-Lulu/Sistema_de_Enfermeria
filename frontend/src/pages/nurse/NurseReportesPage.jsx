import React from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { useNurseEstablishment } from "../../hooks/userNurseEstablishment";

export default function NurseReportesPage() {
  const { isHospitalObrero } = useNurseEstablishment();

  return (
    <NurseLayout title="Reportes">
      <div className="card">
        <p style={{ marginBottom: 10 }}>
          {isHospitalObrero
            ? "Reportes (modo Hospital Obrero)"
            : "Reportes (modo estándar)"}
        </p>

        <p style={{ color: "#64748b" }}>
          Aquí luego pondremos los reportes. Por ahora es una página placeholder
          para que el router funcione.
        </p>
      </div>
    </NurseLayout>
  );
}
