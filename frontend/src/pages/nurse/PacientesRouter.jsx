import React from "react";
import { useNurseEstablishment } from "../../hooks/userNurseEstablishment";
import NurseHospitalObreroPage from "./NurseHospitalObreroPage";
import NurseStandardPage from "./NurseStandardPage";

export default function PacientesRouter() {
  const { isHospitalObrero } = useNurseEstablishment();
  return isHospitalObrero ? <NurseHospitalObreroPage /> : <NurseStandardPage />;
}
