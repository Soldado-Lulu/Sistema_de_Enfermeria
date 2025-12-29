import * as repo from "./especialidades.repository.js";

export async function getEspecialidades(idestablecimiento) {
  return repo.getEspecialidadesByEstRepo(idestablecimiento);
}

export async function getConsultorios(idestablecimiento) {
  return repo.getConsultoriosByEstRepo(idestablecimiento);
}
