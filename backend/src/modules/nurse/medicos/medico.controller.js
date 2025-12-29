import * as svc from "./medicos.service.js";

function getEstId(req) {
  // si viene query usarla, sino usar del usuario
  const q = req.query.idestablecimiento;
  const fromQuery = q ? Number(q) : null;
  const fromUser = req.user?.fk_establecimiento ? Number(req.user.fk_establecimiento) : null;
  return fromQuery ?? fromUser;
}

export async function medicosConEspecialidad(req, res, next) {
  try {
    const idest = getEstId(req);
    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });

    const data = await svc.getMedicosConEspecialidad(idest);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function medicosConsultorios(req, res, next) {
  try {
    const idest = getEstId(req);
    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });

    const data = await svc.getMedicosConsultorios(idest);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function medicosByCuaderno(req, res, next) {
  try {
    const idest = getEstId(req);
    const idcuaderno = Number(req.params.idcuaderno);

    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });
    if (!idcuaderno) return res.status(400).json({ ok: false, error: "idcuaderno inválido" });

    const data = await svc.getMedicosByCuaderno(idest, idcuaderno);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function especialidadesConMedicos(req, res, next) {
  try {
    const idest = getEstId(req);
    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });

    const data = await svc.getEspecialidadesConMedicos(idest);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}
