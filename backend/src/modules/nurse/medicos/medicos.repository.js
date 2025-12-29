import { getSqlPool } from "../../../config/sql.js";

const medicoNombreSql = `
  LTRIM(RTRIM(ps.per_nombre)) + ' ' +
  LTRIM(RTRIM(ps.per_campo1)) + ' ' +
  LTRIM(RTRIM(ps.per_campo2))
`;

export async function getMedicosConsultoriosByEstRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cp.idpersonal       AS idpersonal,
        ps.idpersonalmedico AS idpersonalmedico,
        ${medicoNombreSql}  AS medico_nombre,
        cp.idcuaderno       AS idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS especialidad,
        LTRIM(RTRIM(cu.cua_nombre)) + ' - ' + ${medicoNombreSql} AS label
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_personal_salud ps
        ON ps.idpersonalmedico = cp.idpersonal
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      WHERE cp.idestablecimiento = @idestablecimiento
        AND cu.cua_nombre LIKE 'CONSULTORIO%'
        AND ps.idpersonalmedico <> 0
      ORDER BY LTRIM(RTRIM(cu.cua_nombre)), ${medicoNombreSql};
    `);

  return rs.recordset ?? [];
}

export async function getMedicosConEspecialidadByEstRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cp.idpersonal       AS idpersonal,
        ps.idpersonalmedico AS idpersonalmedico,
        ${medicoNombreSql}  AS medico_nombre,
        cp.idcuaderno       AS idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS especialidad,
        LTRIM(RTRIM(cu.cua_nombre)) + ' - ' + ${medicoNombreSql} AS label
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_personal_salud ps
        ON ps.idpersonalmedico = cp.idpersonal
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      WHERE cp.idestablecimiento = @idestablecimiento
        AND ps.idpersonalmedico <> 0
      ORDER BY LTRIM(RTRIM(cu.cua_nombre)), ${medicoNombreSql};
    `);

  return rs.recordset ?? [];
}

export async function getMedicosByEstAndCuadernoRepo(idestablecimiento, idcuaderno) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .input("idcuaderno", idcuaderno)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cp.idcuaderno,
        cp.idpersonal       AS idpersonal,
        ps.idpersonalmedico AS idpersonalmedico,
        ${medicoNombreSql}  AS medico_nombre
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_personal_salud ps
        ON ps.idpersonalmedico = cp.idpersonal
      WHERE cp.idestablecimiento = @idestablecimiento
        AND cp.idcuaderno = @idcuaderno
        AND ps.idpersonalmedico <> 0
      ORDER BY ${medicoNombreSql};
    `);

  return rs.recordset ?? [];
}

export async function getEspecialidadesConMedicosByEstRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cp.idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS especialidad,
        ps.idpersonalmedico,
        cp.idpersonal AS idpersonal,
        ${medicoNombreSql} AS medico_nombre
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      INNER JOIN bdhistoriasclinicas.dbo.hcl_personal_salud ps
        ON ps.idpersonalmedico = cp.idpersonal
      WHERE cp.idestablecimiento = @idestablecimiento
        AND ps.idpersonalmedico <> 0
      ORDER BY LTRIM(RTRIM(cu.cua_nombre)), ${medicoNombreSql};
    `);

  return rs.recordset ?? [];
}
