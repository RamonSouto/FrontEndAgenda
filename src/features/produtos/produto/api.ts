//src/features/produtos/produto/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ProdutoListResponse,
    ProdutoResponse,
    ProdutoCreateResponse,
    ProdutoDeleteResponse,
} from './types';
import { ProdutoInput } from './schema';

export const Produtos = {
    listar: () => httpClient.get<ProdutoListResponse>('/api/produtos/produto'),

    buscar: (id: number) => httpClient.get<ProdutoResponse>(`/api/produtos/produto/${id}`),

    criar: (data: ProdutoInput) =>
        httpClient.post<ProdutoCreateResponse>('/api/produtos/produto', data),

    atualizar: (id: number, data: ProdutoInput) =>
        httpClient.put<ProdutoResponse>(`/api/produtos/produto/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoDeleteResponse>(`/api/produtos/produto/${id}`),
};
