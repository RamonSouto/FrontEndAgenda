// src/features/produtos/grade/api.ts

import { httpClient } from '@/lib/http/client';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const GradeProduto = {
    listar: () =>
        httpClient.get<GradeProdutoListResponse>('/api/produtos/grade_produto'),

    buscar: (id: number) =>
        httpClient.get<GradeProdutoResponse>(`/api/produtos/grade_produto/${id}`),

    criar: (data: GradeProdutoInput) =>
        httpClient.post<GradeProdutoCreateResponse>('/api/produtos/grade_produto', data),

    atualizar: (id: number, data: GradeProdutoUpdateInput) =>
        httpClient.put<GradeProdutoUpdateResponse>(`/api/produtos/grade_produto/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<GradeProdutoDeleteResponse>(`/api/produtos/grade_produto/${id}`),
};
