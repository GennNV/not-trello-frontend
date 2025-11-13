import { z } from "zod";

export const tarjetaSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título no puede exceder 200 caracteres"),
  descripcion: z
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional()
    .default(""),
  prioridad: z
    .enum(["Baja", "Media", "Alta"], {
      errorMap: () => ({ message: "Seleccione una prioridad válida" }),
    })
    .default("Media"),
  listaId: z
    .number({
      required_error: "Debe seleccionar una lista",
      invalid_type_error: "ID de lista inválido",
    })
    .int()
    .positive("Debe seleccionar una lista válida"),
  fechaVencimiento: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val).toISOString() : null)),
  asignadoAId: z.number().int().positive().optional().nullable(),
  estado: z
    .enum(["Todo", "In Progress", "Done"], {
      errorMap: () => ({ message: "Seleccione un estado válido" }),
    })
    .default("Todo"),
});
