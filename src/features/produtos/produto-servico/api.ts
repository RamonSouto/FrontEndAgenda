// src/features/produtos/produto-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ProdutoServicoListResponse,
    ProdutoServicoResponse,
    ProdutoServicoCreateResponse,
    ProdutoServicoDeleteResponse,
} from './types';
import { ProdutoServicoInput } from './schema';

export const ProdutoServicos = {
    listar: () =>
        httpClient.get<ProdutoServicoListResponse>('/api/produtos/produtoServico'),

    buscar: (id: number) =>
        httpClient.get<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`),

    criar: (data: ProdutoServicoInput) =>
        httpClient.post<ProdutoServicoCreateResponse>('/api/produtos/produtoServico', data),

    atualizar: (id: number, data: ProdutoServicoInput) =>
        httpClient.put<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoServicoDeleteResponse>(`/api/produtos/produtoServico/${id}`),
};
