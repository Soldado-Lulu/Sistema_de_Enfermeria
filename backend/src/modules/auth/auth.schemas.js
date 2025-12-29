import { z } from "zod";

export const RegisterSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  carnet: z.string().min(3),
  telefono: z.string().optional().nullable(),
  fecha_nacimiento: z.string().optional().nullable(), // la parseamos a DATE en SQL
  correo: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(1),
});
