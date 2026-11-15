// src/features/agendamentos/fotos-ajustes/schema.ts
import { z } from 'zod';

export const FOTO_TIPOS = ['antes', 'depois'] as const;
export const FOTO_TAMANHO_MAX_MB = 2;
export const FOTO_MAX_POR_ITEM = 10; // total (antes + depois) por item

// Upload = multipart/form-data: tipo + arquivo(s)
export const fotoUploadSchema = z.object({
    ind_tipo_foto: z.enum(FOTO_TIPOS, { error: 'Selecione o tipo da foto' }),
    arquivos: z
        .array(z.instanceof(File))
        .min(1, 'Selecione ao menos uma imagem')
        .refine((files) => files.every((f) => f.type.startsWith('image/')), {
            message: 'Apenas arquivos de imagem são permitidos',
        })
        .refine(
            (files) => files.every((f) => f.size <= FOTO_TAMANHO_MAX_MB * 1024 * 1024),
            { message: `Cada imagem deve ter no máximo ${FOTO_TAMANHO_MAX_MB} MB` }
        ),
});
export type FotoUploadInput = z.infer<typeof fotoUploadSchema>;
