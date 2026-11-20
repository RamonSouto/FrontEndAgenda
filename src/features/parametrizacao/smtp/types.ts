//src/features/parametrizacao/smtp/types.ts

export interface EmpresaSmtp {
    id: number;
    nom_fantasia: string;
    num_celular_1: string;
    ind_smtp_ativo: 0 | 1;
    des_smtp_host: string | null;
    num_smtp_porta: number | null;
    ind_smtp_seguro: 0 | 1; // 1 = TLS implícito (465) | 0 = STARTTLS (587)
    des_smtp_usuario: string | null;
    des_smtp_email_remetente: string | null;
    nom_smtp_remetente: string | null;
    ind_senha_configurada: boolean; // a senha nunca é retornada
}

export interface SmtpResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: EmpresaSmtp;
}

export interface SmtpTesteResponse {
    sucesso: boolean;
    mensagem: string;
    dados: { messageId: string };
}