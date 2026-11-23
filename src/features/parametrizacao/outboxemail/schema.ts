//src/features/parametrizacao/outboxemail/schema.ts

import { z } from 'zod';

export const EMAIL_STATUS = ['pendente', 'processando', 'enviado', 'falha'] as const;

export const emailStatusSchema = z.enum(EMAIL_STATUS);

// Espelha tab_email_outbox
export const emailOutboxSchema = z.object({
    id: z.number().int().positive(),
    id_empresa: z.number().int().positive(),
    id_agendamento: z.number().int().positive().nullable(),
    ind_evento: z.string().max(50),
    des_chave_idempotencia: z.string().max(100),
    des_destinatario: z.string().max(255),
    des_assunto: z.string().max(255),
    des_corpo_html: z.string(),
    des_corpo_texto: z.string(),
    ind_status: emailStatusSchema,
    num_tentativas: z.number().int().min(0).max(255),
    dta_proxima_tentativa: z.string(),
    des_lock_token: z.string().length(36).nullable(),
    dta_lock: z.string().nullable(),
    des_ultimo_erro: z.string().max(1000).nullable(),
    des_message_id: z.string().max(255).nullable(),
    dta_envio: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
});

// Payload enxuto da listagem
export const emailOutboxResumoSchema = emailOutboxSchema.pick({
    id: true,
    id_agendamento: true,
    ind_evento: true,
    des_destinatario: true,
    des_assunto: true,
    ind_status: true,
    num_tentativas: true,
    dta_proxima_tentativa: true,
    des_ultimo_erro: true,
    dta_envio: true,
    created_at: true,
});

export const emailOutboxListResponseSchema = z.object({
    sucesso: z.boolean(),
    total: z.number().int().min(0),
    dados: z.array(emailOutboxResumoSchema),
});

export const emailOutboxReprocessarResponseSchema = z.object({
    sucesso: z.boolean(),
    mensagem: z.string(),
});

// Filtros/paginação da listagem
export const emailOutboxFiltroSchema = z.object({
    ind_status: emailStatusSchema.optional(),
    id_agendamento: z.number().int().positive().optional(),
    pagina: z.number().int().min(1).default(1),
    limite: z.number().int().min(1).max(100).default(10),
});

export type EmailOutboxInput = z.infer<typeof emailOutboxSchema>;
export type EmailOutboxFiltroInput = z.input<typeof emailOutboxFiltroSchema>;

