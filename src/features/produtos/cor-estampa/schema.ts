//src/features/produtos/cor-estampa/schema.ts
import { z } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// Objeto base — reutilizado tanto no schema de criação quanto no de atualização
const corEstampaBaseSchema = z.object({
    nom_cor_estampa: z
        .string()
        .min(1, 'Nome é obrigatório')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    ind_tipo: z.enum(['cor', 'estampa'], {
        message: 'Selecione um tipo válido (cor ou estampa)',
    }),
    val_codigo_hex: z
        .string()
        .regex(hexColorRegex, 'Código hexadecimal inválido (ex: #000000)')
        .nullable()
        .optional(),
    des_imagem_url: z
        .string()
        .url('URL da imagem inválida')
        .max(500, 'URL deve ter no máximo 500 caracteres')
        .nullable()
        .optional(),
    num_ordem_exibicao: z.coerce
        .number({ message: 'Ordem de exibição deve ser um número' })
        .int('Ordem de exibição deve ser um número inteiro')
        .min(0, 'Ordem de exibição não pode ser negativa'),
});

// Schema completo (criação) — com regra de negócio condicional
export const corEstampaSchema = corEstampaBaseSchema.superRefine((data, ctx) => {
    if (data.ind_tipo === 'cor' && !data.val_codigo_hex) {
        ctx.addIssue({
            code: 'custom',
            path: ['val_codigo_hex'],
            message: 'Código hexadecimal é obrigatório quando o tipo for "cor"',
        });
    }
    if (data.ind_tipo === 'estampa' && !data.des_imagem_url) {
        ctx.addIssue({
            code: 'custom',
            path: ['des_imagem_url'],
            message: 'URL da imagem é obrigatória quando o tipo for "estampa"',
        });
    }
});

// Schema para atualização parcial (PUT permite enviar apenas os campos alterados)
export const corEstampaUpdateSchema = corEstampaBaseSchema.partial();

export type CorEstampaInput = z.infer<typeof corEstampaSchema>;
export type CorEstampaUpdateInput = z.infer<typeof corEstampaUpdateSchema>;
