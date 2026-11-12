// src/features/produtos/tamanho/schema.ts
import { z } from 'zod';

const categoriasTamanho = ['vestuario', 'calcados', 'acessorios', 'outros'] as const;

export const tamanhoSchema = z.object({
    cod_tamanho: z
        .string()
        .min(1, 'Código é obrigatório')
        .max(10, 'Código deve ter no máximo 10 caracteres'),
    des_tamanho: z
        .string()
        .max(50, 'Descrição deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),
    des_categoria_tamanho: z.enum(categoriasTamanho).nullable().optional(),
    num_ordem_exibicao: z.number().int('Ordem deve ser um número inteiro'),
});

export type TamanhoInput = z.infer<typeof tamanhoSchema>;

// Schema para atualização parcial (permite enviar apenas alguns campos, ex.: só num_ordem_exibicao)
export const tamanhoUpdateSchema = tamanhoSchema.partial();

export type TamanhoUpdateInput = z.infer<typeof tamanhoUpdateSchema>;
