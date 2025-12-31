// backend/src/modules/nurse/medicos/medicos.service.js
import * as repo from "./medicos.repository.js";

export async function getMedicosConEspecialidad(idest) {
  return repo.getMedicosConEspecialidadRepo(idest);
}
