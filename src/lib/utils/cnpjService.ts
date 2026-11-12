// src/lib/utils/cnpjService.ts

import { BrasilApiCnpjResponse, CnpjResult } from "./typeCNPJ";

/**
 * Busca informações de um CNPJ utilizando a BrasilAPI
 * Retorna um objeto padronizado com os principais campos
 */
const BRASIL_API_CNPJ_URL = 'https://brasilapi.com.br/api/cnpj/v1';

export async function buscarCnpj(cnpj: string): Promise<CnpjResult | null> {
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
    }

    try {
        const response = await fetch(`${BRASIL_API_CNPJ_URL}/${cnpjLimpo}`);
        if (!response.ok) return null;
        const data: BrasilApiCnpjResponse = await response.json();

        return {
            razao_social: data.razao_social || '',
            nome_fantasia: data.nome_fantasia || '',
            cnpj: data.cnpj || '',
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            municipio: data.municipio || '',
            uf: data.uf || '',
            dta_abertura: data.data_inicio_atividade || '',
            email: data.email || null,
            telefone_1: data.ddd_telefone_1 || '',
        };
    } catch (_) {
        return null;
    }
}