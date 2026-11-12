//src/features/parametrizacao/horario/api.ts

import { httpClient } from '@/lib/http/client';
import {
    HorarioListResponse,
    HorarioResponse,
    HorarioCreateResponse,
    HorarioDeleteResponse,
} from './types';
import { HorarioInput } from './schema';

export const Horarios = {
    listar: () => httpClient.get<HorarioListResponse>('/api/sistema/parametrizacao/'),

    buscar: (id: number) => httpClient.get<HorarioResponse>(`/api/sistema/parametrizacao/${id}`),

    criar: (data: HorarioInput) => {
        httpClient.post<HorarioCreateResponse>('/api/sistema/parametrizacao/', data);
    },
    atualizar: (id: number, data: HorarioInput) =>
        httpClient.put<HorarioResponse>(`/api/sistema/parametrizacao/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<HorarioDeleteResponse>(`/api/sistema/parametrizacao/${id}`),
};
