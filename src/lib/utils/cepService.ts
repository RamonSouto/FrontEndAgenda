// src/lib/utils/cepService.ts

import { BrasilApiCepResponse, CepResult, ViaCepResponse } from "./typeCEP";

const VIA_CEP_URL = 'https://viacep.com.br/ws';
const BRASIL_API_CEP_URL = 'https://brasilapi.com.br/api/cep/v2';


export async function buscarCep(cep: string): Promise<CepResult | null> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
    }

    // 1. Tentar ViaCEP
    try {
        const response = await fetch(`${VIA_CEP_URL}/${cepLimpo}/json/`);
        const data: ViaCepResponse = await response.json();

        if (!data.erro && data.cep) {
            return {
                cep: data.cep,
                logradouro: data.logradouro || '',
                complemento: data.complemento || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.estado || '',
                uf: data.uf || '',
            };
        }
    } catch (_) {
        // Falha no ViaCEP, tentar BrasilAPI
    }

    try {
        const response = await fetch(`${BRASIL_API_CEP_URL}/${cepLimpo}`);
        const data: BrasilApiCepResponse = await response.json();

        if (data.cep) {
            return {
                cep: data.cep,
                logradouro: data.street || '',
                complemento: '', // BrasilAPI não retorna complemento
                bairro: data.neighborhood || '',
                cidade: data.city || '',
                estado: '', // Não retorna nome do estado
                uf: data.state || '',
            };
        }
    } catch (_) {

    }

    return null;
}
