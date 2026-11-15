// src/features/agendamento/tipo-agendamento/schema.ts
import { z } from 'zod';

export const tipoAgendamentoSchema = z.object({
    des_tipo_agendamento: z
        .string()
        .min(1, 'O nome do tipo de agendamento é obrigatório')
        .max(100, 'Máximo de 100 caracteres'),
    ind_ativo: z.boolean(),
});

export type TipoAgendamentoInput = z.infer<typeof tipoAgendamentoSchema>;
