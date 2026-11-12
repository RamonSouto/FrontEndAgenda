//src/features/auth/schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
    user: z.string().max(11, 'O campo não pode ter no máximo 11 caracteres').min(11, 'O campo não pode ter menos que 11 caracteres'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const alterarSenhaSchema = z.object({
    senha_atual: z.string().min(6),
    senha_nova: z.string().min(6),
    confirmar_senha: z.string().min(6)
}).refine((data) => data.senha_nova === data.confirmar_senha, {
    message: 'As senhas não coincidem',
    path: ['confirmar_senha']
})

export const usuarioSchema = z.object({
    id_usuario: z.number(),
    nome: z.string(),
    email: z.string().email(),
    papel: z.enum(['admin', 'secretaria', 'costureira', 'paciente']),
    ativo: z.boolean(),
})

export const perfilSchema = z.object({
    id: z.number(),
    id_cidade: z.number(),
    ind_status: z.enum(['ativo', 'inativo', 'bloqueado']), // ou z.string()
    nom_completo: z.string(),
    num_cpf: z.string().min(11).max(11),
    num_rg: z.string().nullable().optional(),
    dta_nascimento: z.string().datetime({ offset: true }),
    des_logradouro: z.string(),
    num_endereco: z.string(),
    des_complemento: z.string().nullable().optional(),
    num_cep: z.string(),
    nom_bairro: z.string(),
    num_celular_1: z.string(),
    ind_whatsapp_1: z.number().int().min(0).max(1),
    num_celular_2: z.string().nullable().optional(),
    ind_whatsapp_2: z.number().int().min(0).max(1).nullable().optional(),
    des_email_1: z.string().email(),
    des_email_2: z.string().email().nullable().optional(),
    num_tentativas_login: z.number().int().min(0),
    dta_ultimo_login: z.string().datetime({ offset: true }),
    dta_bloqueio_login: z.string().datetime({ offset: true }).nullable().optional(),
    ind_medico: z.number().int().min(0).max(1),
    ind_secretaria: z.number().int().min(0).max(1),
    ind_costureira: z.number().int().min(0).max(1),
    ind_paciente: z.number().int().min(0).max(1),
    ind_administrador: z.number().int().min(0).max(1),
    val_cor_hex: z.string().default(''),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
    deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
    nom_cidade: z.string(),
    nom_estado: z.string(),
    sgl_estado: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>;
export type AlterarSenhaInput = z.infer<typeof alterarSenhaSchema>;
export type Usuario = z.infer<typeof usuarioSchema>;
export type Perfil = z.infer<typeof perfilSchema>;