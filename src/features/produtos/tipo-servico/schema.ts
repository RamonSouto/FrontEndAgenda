// src/features/produtos/tipo-servico/schema.ts
import { z } from 'zod';

export const tipoServicoSchema = z.object({
    des_tipo_ajuste: z
        .string()
        .min(1, 'Descrição é obrigatória')
        .max(100, 'Máximo de 100 caracteres'),
    ind_ativo: z.boolean(),
});

export type TipoServicoInput = z.infer<typeof tipoServicoSchema>;
