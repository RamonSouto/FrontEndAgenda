// src/features/agendamentos/agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    AgendamentoListParams,
    AgendamentoListResponse,
    AgendamentoResponse,
    AgendamentoCreateResponse,
    AgendamentoUpdateResponse,
    AgendamentoDeleteResponse,
} from './types';
import { AgendamentoInput, AgendamentoUpdateInput } from './schema';

// GET não tem body: filtros/paginação vão na query string
function toQueryString(params: AgendamentoListParams = {}): string {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') {
            qs.set(chave, String(valor));
        }
    });
    const texto = qs.toString();
    return texto ? `?${texto}` : '';
}

export const Agendamentos = {
    listar: (params?: AgendamentoListParams) =>
        httpClient.get<AgendamentoListResponse>(`/api/agendamentos${toQueryString(params)}`),

    buscar: (id: number) =>
        httpClient.get<AgendamentoResponse>(`/api/agendamentos/${id}`),

    criar: (data: AgendamentoInput) =>
        httpClient.post<AgendamentoCreateResponse>('/api/agendamentos', data),

    atualizar: (id: number, data: AgendamentoUpdateInput) =>
        httpClient.put<AgendamentoUpdateResponse>(`/api/agendamentos/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<AgendamentoDeleteResponse>(`/api/agendamentos/${id}`),
};
