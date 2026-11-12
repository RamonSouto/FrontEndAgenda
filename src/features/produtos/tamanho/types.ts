// src/features/produtos/tamanho/types.ts

export type CategoriaTamanho = 'vestuario' | 'calcados' | 'acessorios' | 'outros';

export interface Tamanho {
    id: number;
    cod_tamanho: string;
    des_tamanho: string | null;
    des_categoria_tamanho: CategoriaTamanho | null;
    num_ordem_exibicao: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface TamanhoListResponse {
    sucesso: boolean;
    total?: number;
    dados: Tamanho[];
}

export interface TamanhoResponse {
    sucesso: boolean;
    dados: Tamanho;
}

// A API retorna um objeto aninhado incomum no create: dados.id contém o registro completo.
export interface TamanhoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: {
        id: Tamanho;
    };
}

export interface TamanhoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Tamanho;
}

export interface TamanhoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
