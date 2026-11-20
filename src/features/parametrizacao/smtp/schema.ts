//src/features/parametrizacao/smtp/schema.ts

import { z } from 'zod';
import type { EmpresaSmtp } from './types';

const textoOpcional = (max: number) => z.string().trim().max(max).nullish();

export const smtpBaseSchema = z.object({
    ind_smtp_ativo: z.boolean(),
    des_smtp_host: textoOpcional(255),
    num_smtp_porta: z
        .number({ invalid_type_error: 'Porta inválida' })
        .int()
        .min(1, 'Porta inválida')
        .max(65535, 'Porta inválida')
        .nullable(),
    ind_smtp_seguro: z.boolean(),
    des_smtp_usuario: textoOpcional(255),
    /** Vazio = manter a senha atual. Só é enviada se o usuário digitar. */
    des_smtp_senha: z.string().max(255).optional(),
    des_smtp_email_remetente: z
        .union([z.literal(''), z.string().trim().email('E-mail inválido').max(255)])
        .nullish(),
    nom_smtp_remetente: textoOpcional(100),
    des_smtp_senha_enc: z.boolean().optional(),
});

/** senhaConfigurada = ind_senha_configurada vindo da API. */
export const criarSmtpSchema = (senhaConfigurada: boolean) =>
    smtpBaseSchema.superRefine((v, ctx) => {
        if (!v.ind_smtp_ativo) return; // inativo: permite salvar incompleto

        const obrigatorios = [
            ['des_smtp_host', 'Servidor é obrigatório'],
            ['num_smtp_porta', 'Porta é obrigatória'],
            ['des_smtp_usuario', 'Usuário é obrigatório'],
            ['des_smtp_email_remetente', 'E-mail do remetente é obrigatório'],
        ] as const;

        obrigatorios.forEach(([campo, message]) => {
            if (!v[campo]) ctx.addIssue({ code: 'custom', path: [campo], message });
        });

        if (!senhaConfigurada && !v.des_smtp_senha) {
            ctx.addIssue({ code: 'custom', path: ['des_smtp_senha'], message: 'Senha é obrigatória' });
        }
    });

export const smtpTesteSchema = z.object({
    des_destinatario: z.string().trim().email('E-mail inválido'),
});

export type SmtpFormValues = z.infer<typeof smtpBaseSchema>;
export type SmtpTesteInput = z.infer<typeof smtpTesteSchema>;

export const smtpDefaultValues: SmtpFormValues = {
    ind_smtp_ativo: false,
    des_smtp_host: '',
    num_smtp_porta: null,
    ind_smtp_seguro: false,
    des_smtp_usuario: '',
    des_smtp_senha: '',
    des_smtp_email_remetente: '',
    nom_smtp_remetente: '',
};

/** API -> formulário. A senha sempre começa vazia. */
export function smtpParaFormValues(smtp?: EmpresaSmtp | null): SmtpFormValues {
    if (!smtp) return smtpDefaultValues;
    return {
        ind_smtp_ativo: !!smtp.ind_smtp_ativo,
        des_smtp_host: smtp.des_smtp_host ?? '',
        num_smtp_porta: smtp.num_smtp_porta ?? null,
        ind_smtp_seguro: !!smtp.ind_smtp_seguro,
        des_smtp_usuario: smtp.des_smtp_usuario ?? '',
        des_smtp_senha: '',
        des_smtp_email_remetente: smtp.des_smtp_email_remetente ?? '',
        nom_smtp_remetente: smtp.nom_smtp_remetente ?? '',
    };
}