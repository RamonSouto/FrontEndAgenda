//src/features/produtos/cor-estampa/api.ts

import { httpClient } from '@/lib/http/client';
import {
    CorEstampaListResponse,
    CorEstampaResponse,
    CorEstampaCreateResponse,
    CorEstampaDeleteResponse,
} from './types';
import { CorEstampaInput, CorEstampaUpdateInput } from './schema';

export const CorEstampa = {
    listar: () =>
        httpClient.get<CorEstampaListResponse>('/api/produtos/cor_estampa'),

    buscar: (id: number) =>
        httpClient.get<CorEstampaResponse>(`/api/produtos/cor_estampa/${id}`),

    criar: (data: CorEstampaInput) =>
        httpClient.post<CorEstampaCreateResponse>('/api/produtos/cor_estampa', data),

    atualizar: (id: number, data: CorEstampaUpdateInput) =>
        httpClient.put<CorEstampaResponse>(`/api/produtos/cor_estampa/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<CorEstampaDeleteResponse>(`/api/produtos/cor_estampa/${id}`),
};
