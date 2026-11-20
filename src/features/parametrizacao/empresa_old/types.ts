// features/parametrizacao/empresa/types.ts

export interface Empresa {
    id: number;
    id_cidade: number;
    nom_fantasia: string;
    nom_razao_social: string;
    num_cnpj: string;
    num_inscricao_estadual: string | null;
    dta_abertura: string; // ISO date
    des_logradouro: string;
    num_endereco: string | null;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: 0 | 1;
    num_celular_2: string | null;
    ind_whatsapp_2: 0 | 1;
    des_email_1: string;
    des_email_2: string | null;
    val_cor_principal: string | null;
    des_url_logo_vertical: string | null;
    des_url_logo_horizontal: string | null;
    des_url_logo_vertical_negativa: string | null;
    des_url_logo_horizontal_negativa: string | null;
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos derivados vindos do JOIN com cidade/estado (somente leitura na listagem)
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface EmpresaListResponse {
    dados: Empresa[];
    total?: number;
}

export interface ParametrizacaoHorario {
    id: number;
    id_empresa: number; // assunção - ver nota no topo da resposta
    des_tipo_dia: 'UTIL' | 'SABADO';
    hra_inicio: string; // HH:mm:ss
    hra_fim: string; // HH:mm:ss
    qtd_minutos_intervalo: string; // HH:mm:ss
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
}

export interface ParametrizacaoListResponse {
    dados: ParametrizacaoHorario[];
}
