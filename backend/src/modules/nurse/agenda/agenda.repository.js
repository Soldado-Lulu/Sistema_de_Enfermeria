import { getSqlPool } from "../../../config/sql.js";

export async function getDias({
  idest,
  desde,
  hasta,
  idcuaderno,
  idpersonalmedico,
  estados = [],
}) {
  const pool = await getSqlPool();
  const req = pool.request();

  req.input("idest", Number(idest));
  req.input("desde", String(desde));
  req.input("hasta", String(hasta));

  let where = `
    WHERE idestablecimiento = @idest
      AND fecha >= TRY_CONVERT(date, @desde, 23)
      AND fecha <= TRY_CONVERT(date, @hasta, 23)
  `;

  if (idcuaderno) {
    req.input("idcuaderno", Number(idcuaderno));
    where += ` AND idcuaderno = @idcuaderno `;
  }

  if (idpersonalmedico) {
    req.input("idpersonalmedico", Number(idpersonalmedico));
    where += ` AND idpersonal = @idpersonalmedico `;
  }

  if (estados.length) {
    const params = estados.map((_, i) => `@e${i}`);
    estados.forEach((e, i) => req.input(`e${i}`, String(e)));
    where += ` AND fip_estado IN (${params.join(",")}) `;
  }

  const sql = `
    SELECT fecha AS dia, COUNT(*) AS total
    FROM bdfichas.dbo.fic_fichas_programadas_pantalla
    ${where}
    GROUP BY fecha
    ORDER BY fecha
  `;

  const rs = await req.query(sql);
  return rs.recordset;
}

export async function getCitas({
  idest,
  fecha,
  idcuaderno,
  idpersonalmedico,
  estados = [],
}) {
  const pool = await getSqlPool();
  const req = pool.request();

  req.input("idest", Number(idest));
  req.input("fecha", String(fecha));

  let where = `
    WHERE idestablecimiento = @idest
      AND fecha = TRY_CONVERT(date, @fecha, 23)
  `;

  if (idcuaderno) {
    req.input("idcuaderno", Number(idcuaderno));
    where += ` AND idcuaderno = @idcuaderno `;
  }

  if (idpersonalmedico) {
    req.input("idpersonalmedico", Number(idpersonalmedico));
    where += ` AND idpersonal = @idpersonalmedico `;
  }

  if (estados.length) {
    const params = estados.map((_, i) => `@e${i}`);
    estados.forEach((e, i) => req.input(`e${i}`, String(e)));
    where += ` AND fip_estado IN (${params.join(",")}) `;
  }

  const sql = `
    SELECT *
    FROM bdfichas.dbo.fic_fichas_programadas_pantalla
    ${where}
    ORDER BY fip_fecha_ini
  `;

  const rs = await req.query(sql);
  return rs.recordset;
}
