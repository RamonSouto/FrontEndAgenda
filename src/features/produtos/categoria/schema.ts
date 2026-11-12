//src/features/produtos/categoria/schema.ts
import { z } from 'zod';

export const categoriaSchema = z.object({
    nom_categoria: z
        .string()
        .min(1, 'Nome da categoria é obrigatório')
        .max(100, 'Nome da categoria deve ter no máximo 100 caracteres'),
    id_pai: z.number().int().positive().nullable(),
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
