//src/features/pessoas/schema.ts
import { z } from 'zod';

// Normaliza valores que podem vir como boolean OU como 0/1 (number/string)
const booleanFlexivel = z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (val === 1 || val === '1') return true;
    if (val === 0 || val === '0') return false;
    return val;
}, z.boolean());

const stringOpcionalNullable = (schema: z.ZodString) =>
    z.preprocess((val) => (val === '' || val === undefined ? null : val), schema.nullable());

export const pessoaSchema = z
    .object({
        id_cidade: z.number({ message: 'Cidade é obrigatória' }).int().positive(),

        ind_status: z.enum(['ativo', 'inativo']).default('ativo'),

        nom_completo: z
            .string()
            .min(3, 'Nome completo deve ter ao menos 3 caracteres')
            .max(255),

        num_cpf: z
            .string()
            .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos'),

        num_rg: z.string().min(1, 'RG é obrigatório').max(20),

        dta_nascimento: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-MM-dd)'),

        des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(255),
        num_endereco: z.string().min(1, 'Número é obrigatório').max(10),
        des_complemento: z.string().max(100).optional().nullable(),

        num_cep: z
            .string()
            .regex(/^\d{8}$/, 'CEP deve conter exatamente 8 dígitos'),

        nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),

        num_celular_1: z
            .string()
            .regex(/^\d{10,11}$/, 'Celular inválido'),
        ind_whatsapp_1: booleanFlexivel.default(true),

        num_celular_2: stringOpcionalNullable(
            z.string().regex(/^\d{10,11}$/, 'Celular inválido')),
        ind_whatsapp_2: booleanFlexivel.default(true),

        des_email_1: z.string().email('E-mail inválido').max(255),
        des_email_2: stringOpcionalNullable(
            z.string().email('E-mail inválido').max(255)
        ),

        // Opcional: na edição, se vazio, o backend deve manter a senha atual
        des_senha: z
            .string()
            .min(6, 'Senha deve ter ao menos 6 caracteres')
            .optional()
            .or(z.literal('')),

        ind_medico: booleanFlexivel.default(false),
        ind_secretaria: booleanFlexivel.default(false),
        ind_costureira: booleanFlexivel.default(false),
        ind_paciente: booleanFlexivel.default(false),
        ind_administrador: booleanFlexivel.default(false),

        val_cor_hex: stringOpcionalNullable(
            z.string().regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (ex: FFFFFF)')),
    })
    // Reflete a CHECK constraint chk_tab_pessoas_ao_menos_um_papel do banco
    .refine(
        (data) =>
            data.ind_medico ||
            data.ind_secretaria ||
            data.ind_costureira ||
            data.ind_paciente ||
            data.ind_administrador,
        {
            message: 'Selecione ao menos um papel (médico, secretária, costureira, paciente ou administrador)',
            path: ['ind_medico'],
        }
    );

export type PessoaInput = z.infer<typeof pessoaSchema>;
