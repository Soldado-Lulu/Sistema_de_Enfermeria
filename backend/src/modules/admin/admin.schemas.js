// backend/src/modules/admin/admin.schemas.js
import { z } from "zod";

export const ApproveSchema = z.object({
  fk_rol: z.number().int().positive(),
  establecimientos: z.array(z.number().int().positive()).min(1),
  default_establecimiento: z.number().int().positive(),
});
