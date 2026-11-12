//src/features/produtos/categoria/types.ts

export interface Categoria {
    id: number;
    nom_categoria: string;
    id_pai: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface CategoriaComFilhos extends Categoria {
    subRows?: CategoriaComFilhos[];
}

export interface CategoriaListResponse {
    sucesso: boolean;
    total?: number;
    dados: Categoria[];
}

export interface CategoriaResponse {
    sucesso: boolean;
    dados: Categoria;
}

export interface CategoriaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Categoria;
}

export interface CategoriaUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Categoria;
}

export interface CategoriaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
