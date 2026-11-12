//src/features/produtos/cor-estampa/types.ts

export type TipoCorEstampa = 'cor' | 'estampa';

export interface CorEstampa {
    id: number;
    nom_cor_estampa: string;
    ind_tipo: TipoCorEstampa;
    val_codigo_hex: string | null;
    des_imagem_url: string | null;
    num_ordem_exibicao: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface CorEstampaListResponse {
    sucesso: boolean;
    total?: number;
    dados: CorEstampa[];
}

export interface CorEstampaResponse {
    sucesso: boolean;
    dados: CorEstampa;
}

export interface CorEstampaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: CorEstampa;
}

export interface CorEstampaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
