//src/features/produtos/categoria/api.ts

import { httpClient } from '@/lib/http/client';
import {
    CategoriaListResponse,
    CategoriaResponse,
    CategoriaCreateResponse,
    CategoriaUpdateResponse,
    CategoriaDeleteResponse,
} from './types';
import { CategoriaInput } from './schema';

export const Categorias = {
    listar: () => httpClient.get<CategoriaListResponse>('/api/produtos/categoria'),

    buscar: (id: number) => httpClient.get<CategoriaResponse>(`/api/produtos/categoria/${id}`),

    criar: (data: CategoriaInput) =>
        httpClient.post<CategoriaCreateResponse>('/api/produtos/categoria', data),

    atualizar: (id: number, data: CategoriaInput) =>
        httpClient.put<CategoriaUpdateResponse>(`/api/produtos/categoria/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<CategoriaDeleteResponse>(`/api/produtos/categoria/${id}`),
};
