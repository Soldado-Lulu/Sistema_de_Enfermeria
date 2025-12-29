import NurseLayout from "../../layouts/NurseLayout";

export default function NurseStandardPage() {
  return (
    <NurseLayout title="Enfermería (Estándar)">
      <p>✅ Esta es la interfaz para TODOS los establecimientos excepto el Hospital Obrero 112.</p>

      {/* Aquí irá tu lógica estándar: */}
      <ul>
        <li>Pacientes</li>
        <li>Signos vitales</li>
        <li>Turnos</li>
        <li>Citas del día</li>
      </ul>
    </NurseLayout>
  );
}
