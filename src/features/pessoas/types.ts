//src/features/pessoas/types.ts

export type StatusPessoa = 'ativo' | 'inativo';

export type TipoPapelPessoa = 'administrador' | 'medico' | 'paciente' | 'costureira' | 'secretaria';

export interface Pessoa {
    id: number;
    id_cidade: number;
    ind_status: StatusPessoa;
    nom_completo: string;
    num_cpf: string;
    num_rg: string;
    dta_nascimento: string;
    des_logradouro: string;
    num_endereco: string;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: number;
    num_celular_2: string | null;
    ind_whatsapp_2: number;
    des_email_1: string;
    des_email_2: string | null;
    // des_senha nunca deveria voltar em respostas de listagem/detalhe,
    // mas deixamos tipado como opcional por segurança/contrato.
    des_senha?: string;
    num_tentativas_login: number;
    dta_ultimo_login: string | null;
    dta_bloqueio_login: string | null;
    ind_medico: number;
    ind_secretaria: number;
    ind_costureira: number;
    ind_paciente: number;
    ind_administrador: number;
    val_cor_hex: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos vindos de JOIN com tab_cidade / tab_estado
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface PessoaListResponse {
    sucesso: boolean;
    total: number;
    dados: Pessoa[];
}

export interface PessoaResponse {
    sucesso: boolean;
    dados: Pessoa;
}

export interface PessoaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaAtivarResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaDesativarResponse {
    sucesso: boolean;
    mensagem: string;
}
