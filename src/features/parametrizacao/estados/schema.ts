//src/features/parametrizacao/estados/schema.ts
import { z } from 'zod';

export const EstadoSchema = z.object({
    id: z.number(),
    nom_estado: z.string(),
    sgl_estado: z.string(),
});

export type Estado = z.infer<typeof EstadoSchema>;