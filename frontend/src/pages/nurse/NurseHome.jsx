import React from "react";
import NurseLayout from "../../layouts/NurseLayout";
import { useNurseEstablishment } from "../../hooks/userNurseEstablishment";

export default function NurseHome() {
  const { isHospitalObrero } = useNurseEstablishment();

  return (
    <NurseLayout title="Inicio enfermería">
      <div className="card">
        {isHospitalObrero ? (
          <p>Estás en: Hospital Obrero Nro 2 (modo especial)</p>
        ) : (
          <p>Modo estándar para establecimientos</p>
        )}
      </div>
    </NurseLayout>
  );
}
