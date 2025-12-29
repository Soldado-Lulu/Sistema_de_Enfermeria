import * as svc from "./especialidades.service.js";

function getEstId(req) {
  const q = req.query.idestablecimiento;
  const fromQuery = q ? Number(q) : null;
  const fromUser = req.user?.fk_establecimiento ? Number(req.user.fk_establecimiento) : null;
  return fromQuery ?? fromUser;
}

export async function especialidades(req, res, next) {
  try {
    const idest = getEstId(req);
    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });

    const data = await svc.getEspecialidades(idest);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}

export async function consultorios(req, res, next) {
  try {
    const idest = getEstId(req);
    if (!idest) return res.status(400).json({ ok: false, error: "idestablecimiento requerido" });

    const data = await svc.getConsultorios(idest);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
}
