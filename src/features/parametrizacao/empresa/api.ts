// features/parametrizacao/empresa/api.ts

import { httpClient } from '@/lib/http/client';
import type {
    EmpresaListResponse,
    EmpresaResponse,
    EmpresaCreateResponse,
    EmpresaDeleteResponse,
    ParametrizacaoListResponse,
} from './types';
import type { EmpresaFormValues } from './schema';

const BASE_URL = '/api/sistema/empresa';

const CAMPOS_IMAGEM = [
    'des_url_logo_vertical',
    'des_url_logo_horizontal',
    'des_url_logo_vertical_negativa',
    'des_url_logo_horizontal_negativa',
] as const;

const CAMPOS_VIRTUAIS = ['nom_estado'] as const;

type Payload = Partial<EmpresaFormValues>;
type Dados = Record<string, unknown>;

function prepararPayload(payload: Payload): Dados {
    const dados: Dados = { ...payload };
    CAMPOS_VIRTUAIS.forEach((campo) => delete dados[campo]);
    if (typeof dados.val_cor_principal === 'string') {
        dados.val_cor_principal = dados.val_cor_principal.replace('#', '');
    }
    return dados;
}

const ehImagem = (key: string) => (CAMPOS_IMAGEM as readonly string[]).includes(key);

const possuiNovaImagem = (dados: Dados) => CAMPOS_IMAGEM.some((c) => dados[c] instanceof File);

/** JSON: remove imagens (URL existente ou null não deve ser reenviada). */
function omitirImagens(dados: Dados): Dados {
    return Object.fromEntries(Object.entries(dados).filter(([k]) => !ehImagem(k)));
}

function montarFormData(dados: Dados): FormData {
    const formData = new FormData();
    Object.entries(dados).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (ehImagem(key)) {
            if (value instanceof File) formData.append(key, value);
            return;
        }
        formData.append(key, String(value)); // booleans => "true"/"false"
    });
    return formData;
}

function montarBody(payload: Payload): Dados | FormData {
    const dados = prepararPayload(payload);
    return possuiNovaImagem(dados) ? montarFormData(dados) : omitirImagens(dados);
}

export const empresaApi = {
    listar: () => httpClient.get<EmpresaListResponse>(BASE_URL),

    buscarPorId: (id: number) => httpClient.get<EmpresaResponse>(`${BASE_URL}/${id}`),

    criar: (payload: EmpresaFormValues) =>
        httpClient.post<EmpresaCreateResponse>(BASE_URL, montarBody(payload)),

    atualizar: (id: number, payload: Payload) =>
        httpClient.put<EmpresaResponse>(`${BASE_URL}/${id}`, montarBody(payload)),

    deletar: (id: number) => httpClient.delete<EmpresaDeleteResponse>(`${BASE_URL}/${id}`),

    listarHorarios: (_idEmpresa: number) =>
        httpClient.get<ParametrizacaoListResponse>('/api/sistema/parametrizacao'),
};