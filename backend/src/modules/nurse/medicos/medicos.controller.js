import * as svc from "./medicos.service.js";

export async function getMedicosConEspecialidad(req, res, next) {
  try {
    const idest = Number(req.query.idest ?? req.establishment?.idestablecimiento);

    if (!idest || Number.isNaN(idest)) {
      return res.status(400).json({ ok: false, message: "Falta idest (establecimiento)" });
    }

    const rows = await svc.getMedicosConEspecialidad(idest);
    return res.json({ ok: true, data: rows });
  } catch (e) {
    console.error("[getMedicosConEspecialidad] ERROR:", e);
    next(e);
  }
}
