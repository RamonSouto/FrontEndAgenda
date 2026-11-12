// src/features/produtos/preco-produto-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    PrecoProdutoServicoListResponse,
    PrecoProdutoServicoResponse,
    PrecoProdutoServicoCreateResponse,
    PrecoProdutoServicoDeleteResponse,
} from './types';
import { PrecoProdutoServicoInput, PrecoProdutoServicoUpdateInput } from './schema';

export const PrecoProdutoServicos = {
    listar: () =>
        httpClient.get<PrecoProdutoServicoListResponse>('/api/produtos/precoProdutoServico'),

    buscar: (id: number) =>
        httpClient.get<PrecoProdutoServicoResponse>(`/api/produtos/precoProdutoServico/${id}`),

    criar: (data: PrecoProdutoServicoInput) =>
        httpClient.post<PrecoProdutoServicoCreateResponse>('/api/produtos/precoProdutoServico', data),

    atualizar: (id: number, data: PrecoProdutoServicoUpdateInput) =>
        httpClient.put<PrecoProdutoServicoResponse>(`/api/produtos/precoProdutoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<PrecoProdutoServicoDeleteResponse>(`/api/produtos/precoProdutoServico/${id}`),
};
