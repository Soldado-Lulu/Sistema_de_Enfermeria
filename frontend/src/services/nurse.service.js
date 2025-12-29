import { http } from "../api/http";

export const nurseService = {
  // especialidades
  getEspecialidades(idestablecimiento) {
    return http.get("/api/nurse/especialidades", {
      params: { idestablecimiento },
    });
  },

  getConsultorios(idestablecimiento) {
    return http.get("/api/nurse/especialidades/consultorios", {
      params: { idestablecimiento },
    });
  },

  // medicos
  getMedicosByEst(idestablecimiento) {
    return http.get(`/api/nurse/medicos/establecimiento/${idestablecimiento}`);
  },

  getMedicosConsultoriosByEst(idestablecimiento) {
    return http.get(
      `/api/nurse/medicos/establecimiento/${idestablecimiento}/consultorios`
    );
  },

  getEspecialidadesConMedicosByEst(idestablecimiento) {
    return http.get(
      `/api/nurse/medicos/establecimiento/${idestablecimiento}/especialidades-con-medicos`
    );
  },

  getMedicosByEstAndCuaderno(idestablecimiento, idcuaderno) {
    return http.get(
      `/api/nurse/medicos/establecimiento/${idestablecimiento}/cuaderno/${idcuaderno}`
    );
  },
};
