import * as repo from "./medicos.repository.js";

export async function getMedicosConEspecialidad(idestablecimiento) {
  return repo.getMedicosConEspecialidadByEstRepo(idestablecimiento);
}

export async function getMedicosConsultorios(idestablecimiento) {
  return repo.getMedicosConsultoriosByEstRepo(idestablecimiento);
}

export async function getMedicosByCuaderno(idestablecimiento, idcuaderno) {
  return repo.getMedicosByEstAndCuadernoRepo(idestablecimiento, idcuaderno);
}

export async function getEspecialidadesConMedicos(idestablecimiento) {
  return repo.getEspecialidadesConMedicosByEstRepo(idestablecimiento);
}
