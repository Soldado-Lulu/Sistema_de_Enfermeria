// backend/src/modules/nurse/especialidades/especialidades.repository.js
import { getSqlPool } from "../../../config/sql.js";

const medicoNombreSql = `
  LTRIM(RTRIM(ps.per_nombre)) + ' ' +
  LTRIM(RTRIM(ps.per_campo1)) + ' ' +
  LTRIM(RTRIM(ps.per_campo2))
`;

export async function getMedicosConEspecialidadRepo(idestablecimiento) {
  const pool = await getSqlPool();

  const rs = await pool
    .request()
    .input("idestablecimiento", idestablecimiento)
    .query(`
      SELECT 
        cp.idestablecimiento,
        cp.idcuaderno,
        LTRIM(RTRIM(cu.cua_nombre)) AS especialidad,
        ps.idpersonalmedico AS idpersonalmedico,
        ${medicoNombreSql} AS medico_nombre,
        LTRIM(RTRIM(cu.cua_nombre)) + ' - ' + ${medicoNombreSql} AS label
      FROM bdhistoriasclinicas.dbo.hcl_cuaderno_personal cp
      INNER JOIN bdhistoriasclinicas.dbo.hcl_cuaderno cu
        ON cu.idcuaderno = cp.idcuaderno
      INNER JOIN bdhistoriasclinicas.dbo.hcl_personal_salud ps
        ON ps.idpersonalmedico = cp.idpersonal
      WHERE cp.idestablecimiento = @idestablecimiento
      ORDER BY LTRIM(RTRIM(cu.cua_nombre)), ${medicoNombreSql}
    `);

  return rs.recordset;
}
