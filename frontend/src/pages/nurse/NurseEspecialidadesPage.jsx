import React from "react";
import NurseLayout from "../../layouts/NurseLayout";
import NurseEspecialidades from "../../components/nurse/NurseEspecialidades";

export default function NurseEspecialidadesPage() {
  return (
    <NurseLayout title="Especialidades">
      <NurseEspecialidades />
    </NurseLayout>
  );
}
