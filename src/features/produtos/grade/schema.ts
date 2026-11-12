// src/features/produtos/grade/schema.ts
import { z } from 'zod';

export const gradeProdutoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione o produto' })
        .int()
        .positive('Selecione o produto'),

    id_variacao_cor_estampa: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    id_tamanho: z
        .number({ error: 'Selecione o tamanho' })
        .int()
        .positive('Selecione o tamanho'),

    num_sku: z
        .string()
        .max(50, 'SKU deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),

    val_preco_variacao: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),

    ind_ativo: z.boolean().default(true),

    num_codigo_barras: z
        .string()
        .max(100, 'Código de barras deve ter no máximo 100 caracteres')
        .nullable()
        .optional(),
});

export type GradeProdutoInput = z.infer<typeof gradeProdutoSchema>;

// Schema para atualização parcial (ex.: PUT só com num_sku, como no seu exemplo)
export const gradeProdutoUpdateSchema = gradeProdutoSchema.partial();
export type GradeProdutoUpdateInput = z.infer<typeof gradeProdutoUpdateSchema>;
