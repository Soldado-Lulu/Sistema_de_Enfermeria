import { getSqlPool } from "../../../config/sql.js";

export async function getEspecialidadesByEstRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cu.idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS especialidad
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      WHERE cp.idestablecimiento = @idestablecimiento
      ORDER BY LTRIM(RTRIM(cu.cua_nombre));
    `);

  return rs.recordset ?? [];
}

export async function getConsultoriosByEstRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT DISTINCT
        cp.idestablecimiento,
        cu.idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS consultorio
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      WHERE cp.idestablecimiento = @idestablecimiento
        AND cu.cua_nombre LIKE 'CONSULTORIO%'
      ORDER BY LTRIM(RTRIM(cu.cua_nombre));
    `);

  return rs.recordset ?? [];
}
