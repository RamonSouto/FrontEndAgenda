// src/features/agendamentos/produto-agendamento/schema.ts
import { z } from 'zod';

export const AGENDAMENTO_ITEM_STATUS = [
    'pendente',
    'producao',
    'concluido',
    'cancelado',
] as const;

// POST /api/agendamentos/{id}/itens
// id_agendamento vem da URL; preço e status são definidos pelo servidor.
export const agendamentoItemSchema = z.object({
    id_tipo_agendamento: z
        .number({ error: 'Selecione o tipo de agendamento' })
        .int()
        .positive('Selecione o tipo de agendamento'),
    id_produto_grade: z
        .number({ error: 'Selecione o produto (grade)' })
        .int()
        .positive('Selecione o produto (grade)'),
    id_produto_servico: z
        .number({ error: 'Selecione o serviço' })
        .int()
        .positive('Selecione o serviço'),
    des_ajuste_produto: z.string().nullable().optional(),
    val_desconto_servico: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O desconto não pode ser negativo')
        .optional(),
});
export type AgendamentoItemInput = z.infer<typeof agendamentoItemSchema>;

// PATCH /api/agendamentos/{id}/itens/{idItem} – parcial
export const agendamentoItemUpdateSchema = agendamentoItemSchema.partial().extend({
    val_preco_servico: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),
    ind_status: z.enum(AGENDAMENTO_ITEM_STATUS).optional(),
});
export type AgendamentoItemUpdateInput = z.infer<typeof agendamentoItemUpdateSchema>;
