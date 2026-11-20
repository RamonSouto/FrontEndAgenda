// features/parametrizacao/empresa/schema.ts

import { z } from 'zod';

const somenteDigitos = (v: string) => v.replace(/\D/g, '');

const imagemField = z.union([z.instanceof(File), z.string(), z.null()]).optional();

const emailOpcional = z
    .union([z.literal(''), z.string().email('E-mail inválido')])
    .nullish()
    .transform((v) => v || null);

const celularOpcional = z
    .string()
    .nullish()
    .transform((v) => (v ? somenteDigitos(v) : '') || null)
    .refine((v) => v === null || v.length >= 10, 'Celular inválido');

const corHex = z
    .string()
    .nullish()
    .transform((v) => (v ? v.replace('#', '') : null))
    .refine((v) => v === null || /^[0-9a-fA-F]{6}$/.test(v), 'Cor inválida');

/** Campos aceitos pela API (POST/PUT /api/empresa). */
export const empresaSchema = z.object({
    id_cidade: z.coerce
        .number({ invalid_type_error: 'Cidade é obrigatória' })
        .min(1, 'Cidade é obrigatória'),
    ind_ativo: z.boolean().default(true),
    nom_fantasia: z.string().min(1, 'Nome Fantasia é obrigatório').max(100),
    nom_razao_social: z.string().min(1, 'Razão Social é obrigatória').max(100),
    num_cnpj: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos'),
    num_inscricao_estadual: z
        .string()
        .max(20)
        .nullish()
        .transform((v) => v || null),
    dta_abertura: z.string().min(1, 'Data de abertura é obrigatória'),
    des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(45),
    num_endereco: z.string().max(255).nullish(),
    des_complemento: z.string().max(100).nullish(),
    num_cep: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos'),
    nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
    ind_whatsapp_1: z.boolean().default(false),
    num_celular_1: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length >= 10, 'Celular inválido'),
    ind_whatsapp_2: z.boolean().default(false),
    num_celular_2: celularOpcional,
    des_email_1: z.string().email('E-mail inválido').max(255),
    des_email_2: emailOpcional,
    val_cor_principal: corHex,
    des_url_logo_horizontal: imagemField,
    des_url_logo_vertical: imagemField,
    des_url_logo_vertical_negativa: imagemField,
    des_url_logo_horizontal_negativa: imagemField,
});

/** Schema do formulário: inclui o campo virtual nom_estado (nunca vai para a API). */
export const empresaFormSchema = empresaSchema.extend({
    nom_estado: z.string().min(1, 'Estado é obrigatório'),
});

export type EmpresaPayload = z.infer<typeof empresaSchema>;
export type EmpresaFormValues = z.infer<typeof empresaFormSchema>;