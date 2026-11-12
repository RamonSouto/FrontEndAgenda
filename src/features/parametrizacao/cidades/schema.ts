//src/features/parametrizacao/cidades/schema.ts
import { z } from 'zod';

export const cidadeSchema = z.object({
    id: z.int(),
    id_estado: z.int(),
    nom_cidade: z.string(),
    cod_municipio_ibge: z.string()
})

export type CidadeInput = z.infer<typeof cidadeSchema>;