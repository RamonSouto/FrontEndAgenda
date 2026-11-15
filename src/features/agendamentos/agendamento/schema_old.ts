// src/features/agendamentos/agendamento/schema.ts
import { z } from 'zod';

// Formato aceito pela API: "YYYY-MM-DD HH:mm:ss" (horário local)
const DATA_HORA_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const dataHora = (msg = 'Data/hora inválida (yyyy-MM-dd HH:mm:ss)') =>
    z.string().regex(DATA_HORA_REGEX, msg);

// Espelha a CHECK chk_data_futura (dta_agendamento > created_at)
const ehFutura = (valor: string) =>
    new Date(valor.replace(' ', 'T')).getTime() > Date.now();

const MSG_FUTURA = 'O agendamento deve ser em uma data/hora futura';

export const AGENDAMENTO_STATUS = [
    'agendado',
    'confirmado',
    'concluido',
    'cancelado',
    'falta',
] as const;

// Objeto base (sem refine, para permitir .partial())
const agendamentoBase = z.object({
    id_paciente: z
        .number({ error: 'Selecione o paciente' })
        .int()
        .positive('Selecione o paciente'),
    id_costureira: z
        .number({ error: 'Selecione a costureira' })
        .int()
        .positive('Selecione a costureira'),
    id_secretaria: z.number().int().positive().nullable().optional(),
    dta_agendamento: dataHora(),
    des_observacoes_geral: z.string().nullable().optional(),
    des_observacoes_costureira: z.string().nullable().optional(),
});

// POST /api/agendamentos
export const agendamentoSchema = agendamentoBase.refine(
    (d) => ehFutura(d.dta_agendamento),
    { message: MSG_FUTURA, path: ['dta_agendamento'] }
);
export type AgendamentoInput = z.infer<typeof agendamentoSchema>;

// PUT /api/agendamentos/{id} – parcial + campos de ciclo de vida
export const agendamentoUpdateSchema = agendamentoBase
    .partial()
    .extend({
        ind_status: z.enum(AGENDAMENTO_STATUS).optional(),
        ind_paciente_compareceu: z.boolean().nullable().optional(),
        dta_confirmacao: dataHora().nullable().optional(),
        dta_conclusao: dataHora().nullable().optional(),
        dta_cancelamento: dataHora().nullable().optional(),
    })
    .refine((d) => !d.dta_agendamento || ehFutura(d.dta_agendamento), {
        message: MSG_FUTURA,
        path: ['dta_agendamento'],
    });
export type AgendamentoUpdateInput = z.infer<typeof agendamentoUpdateSchema>;
