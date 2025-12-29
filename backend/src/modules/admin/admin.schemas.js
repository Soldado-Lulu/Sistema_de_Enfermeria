import { z } from "zod";

export const ApproveSchema = z.object({
  fk_rol: z.number().int().positive(),
  fk_establecimiento: z.number().int().positive(),
});
