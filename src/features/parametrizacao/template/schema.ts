//src/features/parametrizacao/template/schema.ts
import { z } from 'zod';

export const eventoTemplateSchema = z.enum([
    'agendamento_cadastrado',
    'agendamento_concluido',
    'agendamento_cancelado',
]);

const semTags = (html: string) => html.replace(/<[^>]*>/g, '').trim();

// Campos enviados no PUT (id_empresa e ind_evento vão na URL)
export const templateEmailSchema = z.object({
    des_assunto: z
        .string()
        .trim()
        .min(1, 'Assunto é obrigatório')
        .max(200, 'Máximo de 200 caracteres'),
    des_corpo_html: z
        .string()
        .refine((v) => semTags(v).length > 0, 'O corpo do e-mail é obrigatório'),
    ind_ativo: z.boolean(),
});

export const templatePreviewSchema = templateEmailSchema.pick({
    des_assunto: true,
    des_corpo_html: true,
});

export type TemplateEmailInput = z.infer<typeof templateEmailSchema>;
export type TemplatePreviewInput = z.infer<typeof templatePreviewSchema>;
