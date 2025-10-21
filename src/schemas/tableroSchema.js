import { z } from "zod";

export const tableroSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "El color debe ser un código hexadecimal válido")
    .default("#3B82F6"),
});

export const listaSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres"),
  orden: z.number().int().min(0).optional(),
});
