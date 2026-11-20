//src/features/parametrizacao/log/types.ts

export type LogDetalhes = Record<string, unknown>;

export interface Log {
    id: number;
    id_usuario: number | null;
    des_acao: string;
    des_tabela: string;
    num_registro_id: number | null;
    des_detalhes: LogDetalhes | null;
    num_ip_address: string | null;
    des_user_agent: string | null;
    created_at: string;
    // Campos vindos do JOIN com tab_pessoas
    usuario_nome: string | null;
    usuario_administrador: number;
    usuario_costureira: number;
    usuario_secretaria: number;
    usuario_medico: number;
    usuario_paciente: number;
}

export interface LogPorUsuario {
    nome: string;
    total: number;
}

export interface LogRelatorio {
    total_logs: number;
    periodo: Record<string, unknown>;
    por_acao: Record<string, number>;
    por_usuario: LogPorUsuario[];
    por_tabela: Record<string, number>;
    logs_detalhados: Log[];
}

export interface LogListResponse {
    sucesso: boolean;
    dados: LogRelatorio;
}

// Filtros enviados como query params (já normalizados: sem strings vazias)
export interface LogFiltros {
    id_usuario?: number;
    des_acao?: string;
    des_tabela?: string;
    data_inicio?: string; // YYYY-MM-DD
    data_fim?: string;    // YYYY-MM-DD
}
