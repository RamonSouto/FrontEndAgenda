//src/features/parametrizacao/horario/schema.ts
import { z } from 'zod';

export const horarioSchema = z.object({
    des_tipo_dia: z.enum(['UTIL', 'SABADO']),
    hra_inicio: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Hora inválida (HH:mm:ss)'),
    hra_fim: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Hora inválida (HH:mm:ss)'),
    qtd_minutos_intervalo: z.string(),
    ind_ativo: z.boolean(),
});

export type HorarioInput = z.infer<typeof horarioSchema>;
