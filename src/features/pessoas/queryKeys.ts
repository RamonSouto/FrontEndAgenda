//src/features/pessoas/queryKeys.ts
import { TipoPapelPessoa } from './types';

export const pessoasKeys = {
    all: ['pessoas'] as const,
    detail: (id: number) => ['pessoas', id] as const,
    porPapel: (tipo: TipoPapelPessoa) => ['pessoas', 'papel', tipo] as const,
};
