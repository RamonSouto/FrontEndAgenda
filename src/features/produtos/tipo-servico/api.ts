// src/features/produtos/tipo-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TipoServicoListResponse,
    TipoServicoResponse,
    TipoServicoCreateResponse,
    TipoServicoDeleteResponse,
} from './types';
import { TipoServicoInput } from './schema';

export const TipoServicos = {
    listar: () =>
        httpClient.get<TipoServicoListResponse>('/api/produtos/tipoServico'),

    buscar: (id: number) =>
        httpClient.get<TipoServicoResponse>(`/api/produtos/tipoServico/${id}`),

    criar: (data: TipoServicoInput) =>
        httpClient.post<TipoServicoCreateResponse>('/api/produtos/tipoServico', data),

    atualizar: (id: number, data: TipoServicoInput) =>
        httpClient.put<TipoServicoResponse>(`/api/produtos/tipoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<TipoServicoDeleteResponse>(`/api/produtos/tipoServico/${id}`),
};
