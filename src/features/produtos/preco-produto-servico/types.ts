// src/features/produtos/preco-produto-servico/types.ts

export interface PrecoProdutoServico {
    id: number;
    id_produto_servico: number;
    val_preco: string;          // decimal(7,2) unsigned -> vem como string
    dta_inicio: string;         // date -> vem como ISO datetime (com hora zerada em UTC)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface PrecoProdutoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: PrecoProdutoServico[];
}

export interface PrecoProdutoServicoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: PrecoProdutoServico;
}

// A criação retorna só o { id }, diferente do padrão de horario (que retorna o objeto todo)
export interface PrecoProdutoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: { id: number };
}

export interface PrecoProdutoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
