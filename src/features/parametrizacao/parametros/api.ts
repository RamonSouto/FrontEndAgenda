// src/features/parametrizacao/parametros/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ParametroListResponse,
    ParametroDetailResponse,
    ParametroCreateResponse,
    ParametroDeleteResponse,
    ParametroPayload,
} from './types';

export const Parametros = {
    // Listar todos os registros
    listar: () => httpClient.get<ParametroListResponse>('/api/parametrizacao'),

    // Buscar por ID
    buscar: (id: number) =>
        httpClient.get<ParametroDetailResponse>(`/api/parametrizacao/${id}`),

    // Criar novo registro
    criar: (data: ParametroPayload) =>
        httpClient.post<ParametroCreateResponse>('/api/parametrizacao', data),

    // Atualizar registro existente
    atualizar: (id: number, data: Partial<ParametroPayload>) =>
        httpClient.put<ParametroDetailResponse>(`/api/parametrizacao/${id}`, data),

    // Deletar registro
    deletar: (id: number) =>
        httpClient.delete<ParametroDeleteResponse>(`/api/parametrizacao/${id}`),
};