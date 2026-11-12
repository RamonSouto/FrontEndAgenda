// src/features/parametrizacao/parametros/schema.ts

import { z } from 'zod';

export const parametroSchema = z.object({
    id: z.number().optional(),

    des_tipo_dia: z.enum(['UTIL', 'SABADO'], {
        error: (issue) =>
            issue.input === undefined
                ? 'Tipo de dia é obrigatório'
                : 'Valor deve ser "UTIL" ou "SABADO"',
    }),

    hra_inicio: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Horário inválido (formato HH:mm:ss)'),

    hra_fim: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Horário inválido (formato HH:mm:ss)'),

    qtd_minutos_intervalo: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? 'Quantidade de minutos é obrigatória'
                    : 'Deve ser um número inteiro',
        })
        .int()
        .min(0, 'Minutos não podem ser negativos')
        .max(180, 'Máximo de 180 minutos'),

    ind_ativo: z
        .boolean({
            error: (issue) =>
                issue.input === undefined
                    ? 'Indicador de ativo é obrigatório'
                    : 'Valor deve ser verdadeiro ou falso',
        }),

    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});

// Schema para criação (omite campos gerados pelo servidor)
export const parametroCreateSchema = parametroSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
});

// Schema para atualização (todos os campos opcionais, exceto id que vem da URL)
export const parametroUpdateSchema = parametroCreateSchema.partial();

// Tipos inferidos
export type ParametroInput = z.infer<typeof parametroSchema>;
export type ParametroCreateInput = z.infer<typeof parametroCreateSchema>;
export type ParametroUpdateInput = z.infer<typeof parametroUpdateSchema>;