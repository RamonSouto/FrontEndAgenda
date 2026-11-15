// src/features/agendamentos/fotos-ajustes/api.ts

import { parseCookies } from 'nookies';
import { httpClient } from '@/lib/http/client';
import { ApiError } from '@/lib/http/errors';
import {
    AgendamentoItemFotoListResponse,
    AgendamentoItemFotoResponse,
    AgendamentoItemFotoCreateResponse,
    AgendamentoItemFotoDeleteResponse,
} from './types';
import { FotoUploadInput } from './schema';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Nome do campo de arquivo esperado pelo multer no backend (confirme!)
const CAMPO_ARQUIVOS = 'fotos';

function montarFormData(data: FotoUploadInput): FormData {
    const fd = new FormData();
    // campos de texto ANTES dos arquivos (o multer só enxerga o que já foi lido)
    fd.append('ind_tipo_foto', data.ind_tipo_foto);
    data.arquivos.forEach((arquivo) => fd.append(CAMPO_ARQUIVOS, arquivo));
    return fd;
}

export const AgendamentoItemFotos = {
    listar: (idAgendamento: number, idItem: number) =>
        httpClient.get<AgendamentoItemFotoListResponse>(
            `/api/agendamentos/${idAgendamento}/itens/${idItem}/fotos`
        ),

    buscar: (id: number) =>
        httpClient.get<AgendamentoItemFotoResponse>(`/api/agendamentos/fotos/${id}`),

    criar: (idAgendamento: number, idItem: number, data: FotoUploadInput) =>
        httpClient.upload<AgendamentoItemFotoCreateResponse>(
            `/api/agendamentos/${idAgendamento}/itens/${idItem}/fotos`,
            montarFormData(data)
        ),

    deletar: (id: number) =>
        httpClient.delete<AgendamentoItemFotoDeleteResponse>(`/api/agendamentos/fotos/${id}`),

    // A resposta é binária (imagem) e o httpClient só trata JSON,
    // por isso este método usa fetch direto, com o mesmo token do cookie.
    baixarArquivo: async (id: number): Promise<Blob> => {
        const token = parseCookies()['agenda.token'];
        const response = await fetch(`${BASE_URL}/api/agendamentos/fotos/${id}/arquivo`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
            throw new ApiError({
                status: response.status,
                message: 'Não foi possível carregar a imagem',
            });
        }
        return response.blob();
    },
};
