//src/features/parametrizacao/template/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplatesEmail } from './api';
import { templateEmailKeys } from './queryKeys';
import {
    EventoTemplate,
    TemplateEmailListResponse,
    TemplateEmailResponse,
    TemplatePreviewResponse,
} from './types';
import { TemplateEmailInput, TemplatePreviewInput } from './schema';

const STALE_TIME = 1000 * 60 * 5; // 5 minutos

export const useTemplatesEmail = (idEmpresa: number | null) => {
    return useQuery<TemplateEmailListResponse>({
        queryKey: templateEmailKeys.list(idEmpresa ?? 0),
        queryFn: () => TemplatesEmail.listar(idEmpresa as number),
        staleTime: STALE_TIME,
        enabled: !!idEmpresa,
    });
};

export const useTemplateEmail = (idEmpresa: number | null, evento: EventoTemplate | null) => {
    return useQuery<TemplateEmailResponse>({
        queryKey: templateEmailKeys.detail(idEmpresa ?? 0, evento as EventoTemplate),
        queryFn: () => TemplatesEmail.buscar(idEmpresa as number, evento as EventoTemplate),
        staleTime: STALE_TIME,
        enabled: !!idEmpresa && !!evento,
    });
};

interface SalvarVars {
    evento: EventoTemplate;
    data: TemplateEmailInput;
}

export const useSalvarTemplateEmail = (idEmpresa: number | null) => {
    const queryClient = useQueryClient();

    return useMutation<TemplateEmailResponse, unknown, SalvarVars>({
        mutationFn: ({ evento, data }) =>
            TemplatesEmail.salvar(idEmpresa as number, evento, data),
        onSuccess: (_res, { evento }) => {
            queryClient.invalidateQueries({ queryKey: templateEmailKeys.list(idEmpresa ?? 0) });
            queryClient.invalidateQueries({
                queryKey: templateEmailKeys.detail(idEmpresa ?? 0, evento),
            });
        },
    });
};

interface PreviewVars {
    evento: EventoTemplate;
    data: TemplatePreviewInput;
}

export const usePreviewTemplateEmail = (idEmpresa: number | null) => {
    return useMutation<TemplatePreviewResponse, unknown, PreviewVars>({
        mutationFn: ({ evento, data }) =>
            TemplatesEmail.preview(idEmpresa as number, evento, data),
    });
};
