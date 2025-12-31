import * as Service from "./agenda.service.js";

function mustInt(value, name) {
  const n = Number(value);
  if (!n || Number.isNaN(n)) {
    const err = new Error(`Falta o es inválido: ${name}`);
    err.statusCode = 400;
    throw err;
  }
  return n;
}
function optInt(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
function mustYMD(value, name) {
  if (!value || typeof value !== "string") {
    const err = new Error(`Falta ${name} (YYYY-MM-DD)`);
    err.statusCode = 400;
    throw err;
  }
  // validación simple de formato
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const err = new Error(`${name} debe ser YYYY-MM-DD`);
    err.statusCode = 400;
    throw err;
  }
  return value;
}

export async function getDias(req, res, next) {
  try {
    const scope = req.scope; // viene de requireEstablishment

    const idest = mustInt(req.query.idest ?? scope?.fk_establecimiento, "idest");
    const desde = mustYMD(req.query.desde, "desde");
    const hasta = mustYMD(req.query.hasta, "hasta");

    const idcuaderno = optInt(req.query.idcuaderno);
    const idpersonalmedico = optInt(req.query.idpersonalmedico);
    const estados = req.query.estados; // string "A,B" o array

    // ✅ seguridad: si no es global, solo puede consultar su establecimiento
    if (!scope?.global && idest !== Number(scope?.fk_establecimiento)) {
      const err = new Error("No autorizado para consultar otro establecimiento");
      err.statusCode = 403;
      throw err;
    }

    const data = await Service.getDias({
      idest,
      desde,
      hasta,
      idcuaderno,
      idpersonalmedico,
      estados,
    });

    return res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCitas(req, res, next) {
  try {
    const scope = req.scope;

    const idest = mustInt(req.query.idest ?? scope?.fk_establecimiento, "idest");
    const fecha = mustYMD(req.query.fecha, "fecha");

    const idcuaderno = optInt(req.query.idcuaderno);
    const idpersonalmedico = optInt(req.query.idpersonalmedico);
    const estados = req.query.estados;

    if (!scope?.global && idest !== Number(scope?.fk_establecimiento)) {
      const err = new Error("No autorizado para consultar otro establecimiento");
      err.statusCode = 403;
      throw err;
    }

    const data = await Service.getCitas({
      idest,
      fecha,
      idcuaderno,
      idpersonalmedico,
      estados,
    });

    return res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
