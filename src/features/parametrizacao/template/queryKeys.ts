//src/features/parametrizacao/template/queryKeys.ts
import { EventoTemplate } from './types';

export const templateEmailKeys = {
    all: ['templates-email'] as const,
    list: (idEmpresa: number) => ['templates-email', idEmpresa, 'list'] as const,
    detail: (idEmpresa: number, evento: EventoTemplate) =>
        ['templates-email', idEmpresa, 'detail', evento] as const,
    preview: (idEmpresa: number, evento: EventoTemplate) =>
        ['templates-email', idEmpresa, 'preview', evento] as const,
};
