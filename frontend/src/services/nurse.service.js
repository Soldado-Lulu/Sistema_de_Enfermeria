// frontend/src/services/nurse.service.js
import { http } from "../api/http";

export const nurseService = {
  // ✅ especialidades con médicos (SIAIS)

  // ✅ lista plana médicos (SIAIS)
  medicosConEspecialidad: (idest) =>
    http.get(`/api/nurse/medicos?idest=${idest}`),
};
