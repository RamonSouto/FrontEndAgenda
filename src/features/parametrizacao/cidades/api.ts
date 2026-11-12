//src/features/parametrizacao/cidades/api.ts

import { httpClient } from '@/lib/http/client';
import { CidadeResponse } from './types';

export const Cidades = {
    listar: () => httpClient.get<CidadeResponse>('/api/sistema/cidades'),
}