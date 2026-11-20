//src/features/parametrizacao/log/schema.ts
import { z } from 'zod';
import { LogFiltros } from './types';

// ---------- Schema do registro (mesmos campos da tab_log) ----------
export const logSchema = z.object({
    id: z.number().int(),
    id_usuario: z.number().int().nullable(),
    des_acao: z.string().max(100),
    des_tabela: z.string().max(50),
    num_registro_id: z.number().int().nullable(),
    des_detalhes: z.record(z.string(), z.unknown()).nullable(),
    num_ip_address: z.string().max(45).nullable(),
    des_user_agent: z.string().nullable(),
    created_at: z.string(),
});

export type LogInput = z.infer<typeof logSchema>;

// ---------- Schema do formulário de filtros ----------
// Inputs HTML sempre devolvem string, então o formulário trabalha com strings
const dataOpcional = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .or(z.literal(''));

export const logFiltroSchema = z
    .object({
        id_usuario: z.string().regex(/^\d*$/, 'Informe apenas números'),
        des_acao: z.string(),
        des_tabela: z.string(),
        data_inicio: dataOpcional,
        data_fim: dataOpcional,
    })
    .refine(
        (f) => !f.data_inicio || !f.data_fim || f.data_inicio <= f.data_fim,
        { message: 'A data inicial não pode ser maior que a final', path: ['data_fim'] }
    );

export type LogFiltroForm = z.infer<typeof logFiltroSchema>;

export const FILTRO_VAZIO: LogFiltroForm = {
    id_usuario: '',
    des_acao: '',
    des_tabela: '',
    data_inicio: '',
    data_fim: '',
};

// Converte o form (strings) em filtros da API (tipados, sem vazios)
export const paraFiltros = (f: LogFiltroForm): LogFiltros => ({
    id_usuario: f.id_usuario ? Number(f.id_usuario) : undefined,
    des_acao: f.des_acao.trim() || undefined,
    des_tabela: f.des_tabela.trim() || undefined,
    data_inicio: f.data_inicio || undefined,
    data_fim: f.data_fim || undefined,
});
