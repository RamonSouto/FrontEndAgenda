// src/features/produtos/produto-servico/schema.ts
import { z } from 'zod';

export const produtoServicoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione um produto' })
        .int()
        .positive('Selecione um produto'),
    id_tipo_servico: z
        .number({ error: 'Selecione um tipo de serviço' })
        .int()
        .positive('Selecione um tipo de serviço'),
    ind_ativo: z.boolean(),
});

export type ProdutoServicoInput = z.infer<typeof produtoServicoSchema>;
