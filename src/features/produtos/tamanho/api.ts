// src/features/produtos/tamanho/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TamanhoListResponse,
    TamanhoResponse,
    TamanhoCreateResponse,
    TamanhoUpdateResponse,
    TamanhoDeleteResponse,
} from './types';
import { TamanhoInput, TamanhoUpdateInput } from './schema';

export const Tamanhos = {
    listar: () => httpClient.get<TamanhoListResponse>('/api/produtos/tamanho'),

    buscar: (id: number) => httpClient.get<TamanhoResponse>(`/api/produtos/tamanho/${id}`),

    criar: (data: TamanhoInput) =>
        httpClient.post<TamanhoCreateResponse>('/api/produtos/tamanho', data),

    atualizar: (id: number, data: TamanhoUpdateInput) =>
        httpClient.put<TamanhoUpdateResponse>(`/api/produtos/tamanho/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<TamanhoDeleteResponse>(`/api/produtos/tamanho/${id}`),
};
