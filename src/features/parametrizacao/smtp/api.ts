//src/features/parametrizacao/smtp/api.ts

import { httpClient } from '@/lib/http/client';
import type { SmtpResponse, SmtpTesteResponse } from './types';
import type { SmtpFormValues, SmtpTesteInput } from './schema';

const url = (idEmpresa: number) => `/api/sistema/empresa/${idEmpresa}/smtp`;

/** Senha só vai no payload se o usuário digitou; strings vazias viram null. */
export function montarPayloadSmtp(values: SmtpFormValues) {
    const { des_smtp_senha, ...rest } = values;

    const limpo = Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v]),
    );

    return des_smtp_senha ? { ...limpo, des_smtp_senha } : limpo;
}

export const smtpApi = {
    buscar: (idEmpresa: number) => httpClient.get<SmtpResponse>(url(idEmpresa)),

    salvar: (idEmpresa: number, values: SmtpFormValues) =>
        httpClient.put<SmtpResponse>(url(idEmpresa), montarPayloadSmtp(values)),

    /** O backend testa com a configuração GRAVADA, não com o formulário. */
    testar: (idEmpresa: number, data: SmtpTesteInput) =>
        httpClient.post<SmtpTesteResponse>(`${url(idEmpresa)}/teste`, data),
};