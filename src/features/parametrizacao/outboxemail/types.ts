//src/features/parametrizacao/outboxemail/types.ts

export type EmailStatus = 'pendente' | 'processando' | 'enviado' | 'falha';

// Item da LISTAGEM (payload enxuto retornado por GET /api/sistema/email-outbox)
export interface EmailOutboxResumo {
    id: number;
    id_agendamento: number | null;
    ind_evento: string; // ex.: "agendamento_cadastrado"
    des_destinatario: string;
    des_assunto: string;
    ind_status: EmailStatus;
    num_tentativas: number;
    dta_proxima_tentativa: string; // ISO UTC
    des_ultimo_erro: string | null;
    dta_envio: string | null; // ISO UTC
    created_at: string; // ISO UTC
}

// Registro completo (espelha tab_email_outbox)
export interface EmailOutbox extends EmailOutboxResumo {
    id_empresa: number;
    des_chave_idempotencia: string;
    des_corpo_html: string;
    des_corpo_texto: string;
    des_lock_token: string | null;
    dta_lock: string | null;
    des_message_id: string | null;
    updated_at: string | null;
}

// Filtros aceitos pela listagem (query string)
export interface EmailOutboxListParams {
    ind_status?: EmailStatus;
    id_agendamento?: number;
    pagina?: number;
    limite?: number;
}

export interface EmailOutboxListResponse {
    sucesso: boolean;
    total: number;
    dados: EmailOutboxResumo[];
}

export interface EmailOutboxReprocessarResponse {
    sucesso: boolean;
    mensagem: string;
}