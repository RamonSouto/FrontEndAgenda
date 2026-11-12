//src/features/produtos/imagem-produto/schema.ts
import { z } from 'zod';

const isBrowser = typeof window !== 'undefined';

// Em SSR o objeto File não existe — evita erro de referência no build
const arquivoSchema = isBrowser
    ? z.instanceof(File, { message: 'Selecione uma imagem' }).nullable()
    : z.any().nullable();

export const TIPO_VINCULO = {
    PRODUTO: 'produto',
    GRADE: 'grade',
} as const;

export type TipoVinculo = (typeof TIPO_VINCULO)[keyof typeof TIPO_VINCULO];

// Payload do formulário de criação (antes de virar FormData)
export const imagemProdutoCreateSchema = z
    .object({
        tipo_vinculo: z.enum([TIPO_VINCULO.PRODUTO, TIPO_VINCULO.GRADE]),
        id_produto: z.number().int().positive().nullable(),
        id_produto_grade: z.number().int().positive().nullable(),
        des_titulo_imagem: z.string().max(50, 'Máximo de 50 caracteres').nullable().optional(),
        des_imagem: z.string().max(255, 'Máximo de 255 caracteres').nullable().optional(),
        num_ordem: z.coerce.number().int().min(0, 'Ordem não pode ser negativa').default(0),
        ind_principal: z.boolean().default(false),
        arquivo: arquivoSchema,
    })
    // Regra do CHECK constraint: só produto OU só grade, nunca os dois nem nenhum
    .refine(
        (data) =>
            data.tipo_vinculo === TIPO_VINCULO.PRODUTO ? !!data.id_produto : !!data.id_produto_grade,
        {
            message: 'Selecione o produto ou a grade correspondente',
            path: ['id_produto'],
        }
    )
    .refine((data) => !!data.arquivo, {
        message: 'Selecione um arquivo de imagem',
        path: ['arquivo'],
    });

export type ImagemProdutoCreateInput = z.infer<typeof imagemProdutoCreateSchema>;

// Payload de atualização — só 2 campos, conforme contrato da API
// ---------------------------------------------------------------------------
// Schema de validação - Atualização de Imagem do Produto
// ---------------------------------------------------------------------------
export const imagemProdutoUpdateSchema = z
    .object({
        tipo_vinculo: z.enum([TIPO_VINCULO.PRODUTO, TIPO_VINCULO.GRADE]),
        id_produto: z.number().nullable().optional(),
        id_produto_grade: z.number().nullable().optional(),
        des_titulo_imagem: z
            .string()
            .max(255, 'O título deve ter no máximo 255 caracteres')
            .nullable()
            .optional(),
        des_imagem: z
            .string()
            .max(500, 'A descrição deve ter no máximo 500 caracteres')
            .nullable()
            .optional(),
        num_ordem: z
            .number({ invalid_type_error: 'Informe um número válido' })
            .int('A ordem deve ser um número inteiro')
            .min(0, 'A ordem não pode ser negativa'),
        ind_principal: z.boolean(),
        arquivo: z
            .instanceof(File, { message: 'Selecione um arquivo válido' })
            .nullable()
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.tipo_vinculo === TIPO_VINCULO.PRODUTO && !data.id_produto) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Selecione um produto',
                path: ['id_produto'],
            });
        }

        if (data.tipo_vinculo === TIPO_VINCULO.GRADE && !data.id_produto_grade) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Selecione uma grade',
                path: ['id_produto_grade'],
            });
        }
    });

export type ImagemProdutoUpdateInput = z.infer<typeof imagemProdutoUpdateSchema>;
