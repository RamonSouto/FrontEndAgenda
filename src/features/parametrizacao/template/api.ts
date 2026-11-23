//src/features/parametrizacao/template/api.ts
import { httpClient } from '@/lib/http/client';
import {
    EventoTemplate,
    TemplateEmailListResponse,
    TemplateEmailResponse,
    TemplatePreviewResponse,
} from './types';
import { TemplateEmailInput, TemplatePreviewInput } from './schema';

const base = (idEmpresa: number) => `/api/sistema/empresa/${idEmpresa}/email-templates`;

export const TemplatesEmail = {
    listar: (idEmpresa: number) =>
        httpClient.get<TemplateEmailListResponse>(base(idEmpresa)),

    buscar: (idEmpresa: number, evento: EventoTemplate) =>
        httpClient.get<TemplateEmailResponse>(`${base(idEmpresa)}/${evento}`),

    // Cadastra ou edita (upsert por empresa + evento)
    salvar: (idEmpresa: number, evento: EventoTemplate, data: TemplateEmailInput) =>
        httpClient.put<TemplateEmailResponse>(`${base(idEmpresa)}/${evento}`, data),

    preview: (idEmpresa: number, evento: EventoTemplate, data: TemplatePreviewInput) =>
        httpClient.put<TemplatePreviewResponse>(`${base(idEmpresa)}/${evento}/preview`, data),
};
