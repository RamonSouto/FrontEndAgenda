// features/parametrizacao/empresa/api.ts
import { httpClient } from '@/lib/http/client';
import { Empresa, EmpresaListResponse, ParametrizacaoListResponse } from './types';
import { EmpresaFormValues } from './schema';

const CAMPOS_IMAGEM = [
    'des_url_logo_vertical',
    'des_url_logo_horizontal',
    'des_url_logo_vertical_negativa',
    'des_url_logo_horizontal_negativa',
] as const;

const CAMPOS_VIRTUAIS = ['nom_estado'] as const;

function removerCamposVirtuais(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    CAMPOS_VIRTUAIS.forEach((campo) => delete resultado[campo]);
    return resultado;
}

function normalizarCorPrincipal(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    if (typeof resultado.val_cor_principal === 'string') {
        resultado.val_cor_principal = resultado.val_cor_principal.replace('#', '');
    }
    return resultado;
}

function montarFormData(payload: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (CAMPOS_IMAGEM.includes(key as any)) {
            // Só envia se for um File novo. Se for string (url existente), não reenvia.
            if (value instanceof File) {
                formData.append(key, value);
            }
            return;
        }

        if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}

function possuiNovaImagem(payload: Record<string, any>): boolean {
    return CAMPOS_IMAGEM.some((campo) => payload[campo] instanceof File);
}

export const empresaApi = {
    listar: () => httpClient.get<EmpresaListResponse>('/api/sistema/empresa'),
    buscarPorId: (id: number) => httpClient.get<{ dados: Empresa }>(`/api/sistema/empresa/${id}`),
    criar: (payload: EmpresaFormValues) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.post<Empresa>('/api/sistema/empresa', montarFormData(dadosLimpos));
        }

        return httpClient.post<Empresa>('/api/sistema/empresa', dadosLimpos);
    },
    atualizar: (id: number, payload: Partial<EmpresaFormValues>) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, montarFormData(payload));
        }

        return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, dadosLimpos);
    },
    deletar: (id: number) => httpClient.delete(`/api/sistema/empresa/${id}`),
    listarHorarios: (idEmpresa: number) => httpClient.get<ParametrizacaoListResponse>(`/api/sistema/parametrizacao`),
};
