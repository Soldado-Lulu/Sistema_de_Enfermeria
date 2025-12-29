import NurseLayout from "../../layouts/NurseLayout";

export default function NurseHospitalObreroPage() {
  return (
    <NurseLayout title="Enfermería (Hospital Obrero Nro 2)">
      <p>🏥 Esta es la interfaz ESPECIAL para el establecimiento 112.</p>

      {/* Aquí irá tu lógica especial: */}
      <ul>
        <li>Triage especial</li>
        <li>Flujo propio del Hospital Obrero</li>
        <li>Campos extra / reglas distintas</li>
      </ul>
    </NurseLayout>
  );
}
