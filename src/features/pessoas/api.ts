//src/features/pessoas/api.ts

import { httpClient } from '@/lib/http/client';
import {
    PessoaListResponse,
    PessoaResponse,
    PessoaCreateResponse,
    PessoaUpdateResponse,
    PessoaDeleteResponse,
    PessoaAtivarResponse,
    PessoaDesativarResponse,
    TipoPapelPessoa,

} from './types';
import { PessoaInput } from './schema';

export const Pessoas = {
    listar: () => httpClient.get<PessoaListResponse>('/api/pessoas'),

    listarPorPapel: (tipo: TipoPapelPessoa) => httpClient.get<PessoaListResponse>(`/api/pessoas/papel/${tipo}`),

    buscar: (id: number) => httpClient.get<PessoaResponse>(`/api/pessoas/${id}`),

    criar: (data: PessoaInput) => httpClient.post<PessoaCreateResponse>('/api/pessoas', data),

    atualizar: (id: number, data: PessoaInput) => httpClient.put<PessoaUpdateResponse>(`/api/pessoas/${id}`, data),

    deletar: (id: number) => httpClient.delete<PessoaDeleteResponse>(`/api/pessoas/${id}`),

    ativar: (id: number) => httpClient.patch<PessoaAtivarResponse>(`/api/pessoas/${id}/ativar`),

    desativar: (id: number) => httpClient.patch<PessoaDesativarResponse>(`/api/pessoas/${id}/desativar`),
};
