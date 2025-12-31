import { http } from "../api/http";

export const nurseAgendaService = {
  // días con citas (para calendario)
  dias: ({ idest, desde, hasta, idcuaderno, idpersonalmedico, estados }) => {
    const params = new URLSearchParams();
    params.set("idest", String(idest));
    params.set("desde", desde);
    params.set("hasta", hasta);
    if (idcuaderno) params.set("idcuaderno", String(idcuaderno));
    if (idpersonalmedico) params.set("idpersonalmedico", String(idpersonalmedico));
    if (estados?.length) params.set("estados", estados.join(","));
    return http.get(`/api/nurse/agenda/dias?${params.toString()}`);
  },

  // citas de un día
  citas: ({ idest, fecha, idcuaderno, idpersonalmedico, estados }) => {
    const params = new URLSearchParams();
    params.set("idest", String(idest));
    params.set("fecha", fecha);
    if (idcuaderno) params.set("idcuaderno", String(idcuaderno));
    if (idpersonalmedico) params.set("idpersonalmedico", String(idpersonalmedico));
    if (estados?.length) params.set("estados", estados.join(","));
    return http.get(`/api/nurse/agenda/citas?${params.toString()}`);
  },
};
