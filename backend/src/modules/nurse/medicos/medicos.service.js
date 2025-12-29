import * as repo from "./medicos.repository.js";

export async function getMedicosConsultoriosByEst(idestablecimiento) {
  if (!Number.isFinite(idestablecimiento)) {
    const err = new Error("idestablecimiento inválido");
    err.statusCode = 400;
    throw err;
  }
  return repo.getMedicosConsultoriosByEstRepo(idestablecimiento);
}

export async function getMedicosConEspecialidadByEst(idestablecimiento) {
  if (!Number.isFinite(idestablecimiento)) {
    const err = new Error("idestablecimiento inválido");
    err.statusCode = 400;
    throw err;
  }
  return repo.getMedicosConEspecialidadByEstRepo(idestablecimiento);
}

export async function getMedicosByEstAndCuaderno(idestablecimiento, idcuaderno) {
  if (!Number.isFinite(idestablecimiento) || !Number.isFinite(idcuaderno)) {
    const err = new Error("Parámetros inválidos");
    err.statusCode = 400;
    throw err;
  }
  return repo.getMedicosByEstAndCuadernoRepo(idestablecimiento, idcuaderno);
}

export async function getEspecialidadesConMedicosByEst(idestablecimiento) {
  if (!Number.isFinite(idestablecimiento)) {
    const err = new Error("idestablecimiento inválido");
    err.statusCode = 400;
    throw err;
  }
  return repo.getEspecialidadesConMedicosByEstRepo(idestablecimiento);
}
