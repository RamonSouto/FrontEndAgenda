// src/lib/utils/typeCEP.ts
export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    regiao: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export interface BrasilApiCepResponse {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    timezoneName: string;
    location: { type: string; coordinates: {} };
    ibge: { city: string; state: string };
}

export type CepResult = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    uf: string;
};