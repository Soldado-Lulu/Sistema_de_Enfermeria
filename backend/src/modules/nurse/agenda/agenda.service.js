import * as Repo from "./agenda.repository.js";

function parseEstados(estados) {
  if (!estados) return [];
  if (Array.isArray(estados)) return estados.map(String);
  if (typeof estados === "string") {
    return estados.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export async function getDias(filters) {
  const estados = parseEstados(filters.estados);
  return Repo.getDias({ ...filters, estados });
}

export async function getCitas(filters) {
  const estados = parseEstados(filters.estados);
  return Repo.getCitas({ ...filters, estados });
}
