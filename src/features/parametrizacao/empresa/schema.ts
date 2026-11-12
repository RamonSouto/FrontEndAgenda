// features/parametrizacao/empresa/schema.ts
import { z } from 'zod';

const somenteDigitos = (v: string) => v.replace(/\D/g, '');

const imagemField = z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional();

export const empresaSchema = z.object({
    nom_fantasia: z.string().min(1, 'Nome Fantasia é obrigatório').max(100),
    nom_razao_social: z.string().min(1, 'Razão Social é obrigatória').max(100),
    num_cnpj: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos'),
    num_inscricao_estadual: z.string().max(20).optional().nullable().transform((v) => v === '' ? null : v),
    dta_abertura: z.string().min(1, 'Data de abertura é obrigatória'),
    num_cep: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos'),
    des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(45),
    num_endereco: z.string().max(255).optional().nullable(),
    des_complemento: z.string().max(100).optional().nullable(),
    nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
    num_celular_1: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length >= 10, 'Celular inválido'),
    ind_whatsapp_1: z.boolean().default(false),
    num_celular_2: z.string().optional().nullable(),
    ind_whatsapp_2: z.boolean().default(false),
    des_email_1: z.string().email('E-mail inválido'),
    des_email_2: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
    val_cor_principal: z.string().optional().nullable().transform((v) => (v ? v.replace('#', '') : v)),
    nom_estado: z.string().min(1, 'Estado é obrigatório'),
    id_cidade: z.coerce.number({ invalid_type_error: 'Cidade é obrigatória' }).min(1, 'Cidade é obrigatória'),
    ind_ativo: z.boolean().default(true),
    des_url_logo_vertical: imagemField,
    des_url_logo_horizontal: imagemField,
    des_url_logo_vertical_negativa: imagemField,
    des_url_logo_horizontal_negativa: imagemField,
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
