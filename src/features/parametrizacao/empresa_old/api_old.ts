// src/features/parametrizacao/empresa/api.ts

import { httpClient } from '@/lib/http/client';
import { Empresa, EmpresaListResponse, ParametrizacaoHorario, ParametrizacaoListResponse } from './types';
import { EmpresaFormValues } from './schema';

export const empresaApi = {
    listar: () => httpClient.get<EmpresaListResponse>('/api/empresa'),
    buscarPorId: (id: number) => httpClient.get<{ dados: Empresa }>(`/api/empresa/${id}`),
    criar: (payload: EmpresaFormValues) => httpClient.post<Empresa>('/api/empresa', payload),
    atualizar: (id: number, payload: Partial<EmpresaFormValues>) =>
        httpClient.put<Empresa>(`/api/empresa/${id}`, payload),
    deletar: (id: number) => httpClient.delete(`/api/empresa/${id}`),
    listarHorarios: (idEmpresa: number) =>
        httpClient.get<ParametrizacaoListResponse>(`/api/parametrizacao`),
}