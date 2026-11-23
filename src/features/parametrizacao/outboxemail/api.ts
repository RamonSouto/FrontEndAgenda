//src/features/parametrizacao/outboxemail/api.ts

import { httpClient } from '@/lib/http/client';
import {
    EmailOutboxListParams,
    EmailOutboxListResponse,
    EmailOutboxReprocessarResponse,
} from './types';

// GET não tem body: filtros/paginação vão na query string
function toQueryString(params: EmailOutboxListParams = {}): string {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') {
            qs.set(chave, String(valor));
        }
    });
    const texto = qs.toString();
    return texto ? `?${texto}` : '';
}

export const EmailOutboxApi = {
    listar: (params?: EmailOutboxListParams) =>
        httpClient.get<EmailOutboxListResponse>(`/api/sistema/email-outbox${toQueryString(params)}`),

    reprocessar: (id: number) =>
        httpClient.post<EmailOutboxReprocessarResponse>(`/api/sistema/email-outbox/${id}/reprocessar`),
};
