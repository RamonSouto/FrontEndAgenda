// src/features/parametrizacao/parametros/types.ts

export interface Parametro {
    id: number;
    des_tipo_dia: 'UTIL' | 'SABADO';
    hra_inicio: string;        // formato "HH:mm:ss"
    hra_fim: string;
    qtd_minutos_intervalo: number;
    ind_ativo: boolean;        // no backend é tinyint(1), convertemos para booleano
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Resposta da listagem (GET /api/parametrizacao)
export interface ParametroListResponse {
    sucesso: boolean;
    mensagem?: number;         // contagem de registros
    dados: Parametro[];
}

// Resposta do detalhe (GET /api/parametrizacao/{id})
export interface ParametroDetailResponse {
    sucesso: boolean;
    dados: Parametro;
}

// Resposta da criação (POST /api/parametrizacao)
export interface ParametroCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: number; // ID do registro criado
}

// Resposta da deleção (DELETE /api/parametrizacao/{id})
export interface ParametroDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}

// Dados para criação/atualização (payload)
export interface ParametroPayload {
    des_tipo_dia: 'UTIL' | 'SABADO';
    hra_inicio: string;
    hra_fim: string;
    qtd_minutos_intervalo: number;
    ind_ativo: boolean;
}