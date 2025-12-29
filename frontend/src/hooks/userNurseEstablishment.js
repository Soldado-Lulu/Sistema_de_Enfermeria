// frontend/src/hooks/useNurseEstablishment.js
import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { HOSPITAL_OBRERO_ID } from "../config/establishments";

export function useNurseEstablishment() {
  const { user } = useAuth();

  const isHospitalObrero = useMemo(() => {
    if (!user?.fk_establecimiento) return false;
    return Number(user.fk_establecimiento) === Number(HOSPITAL_OBRERO_ID);
  }, [user?.fk_establecimiento]);

  return {
    isHospitalObrero,
    isStandardEstablishment: !isHospitalObrero,
    fk_establecimiento: user?.fk_establecimiento ?? null,
  };
}
