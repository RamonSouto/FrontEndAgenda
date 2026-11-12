//src/features/produtos/produto/schema.ts
import { z } from 'zod';

export const produtoSchema = z.object({
    id_categoria: z.number().nullable(),
    nom_produto: z.string().min(1, 'Nome do produto é obrigatório').max(200),
    num_sku: z.string().max(50).nullable().optional(),
    des_produto: z.string().nullable().optional(),
    ref_produto: z.string().max(50).nullable().optional(),
    val_preco_base: z
        .number({ error: 'Preço base é obrigatório' })
        .nonnegative('Preço não pode ser negativo'),
    ind_ativo: z.boolean(),
});

export type ProdutoInput = z.infer<typeof produtoSchema>;
