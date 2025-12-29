import * as svc from "./medicos.service.js";

export async function getByEst(req, res, next) {
  try {
    const idestablecimiento = Number(req.params.idestablecimiento);
    const data = await svc.getMedicosConEspecialidadByEst(idestablecimiento);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getByEstAndCuaderno(req, res, next) {
  try {
    const idestablecimiento = Number(req.params.idestablecimiento);
    const idcuaderno = Number(req.params.idcuaderno);
    const data = await svc.getMedicosByEstAndCuaderno(idestablecimiento, idcuaderno);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getConsultorios(req, res, next) {
  try {
    const idestablecimiento = Number(req.params.idestablecimiento);
    const data = await svc.getMedicosConsultoriosByEst(idestablecimiento);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getEspecialidadesConMedicos(req, res, next) {
  try {
    const idestablecimiento = Number(req.params.idestablecimiento);
    const data = await svc.getEspecialidadesConMedicosByEst(idestablecimiento);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}
