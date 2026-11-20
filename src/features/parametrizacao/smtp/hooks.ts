//src/features/parametrizacao/smtp/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smtpApi } from './api';
import { smtpKeys } from './queryKeys';
import type { SmtpResponse, SmtpTesteResponse } from './types';
import type { SmtpFormValues, SmtpTesteInput } from './schema';

const STALE_5_MIN = 1000 * 60 * 5;

/**
 * `enabled` permite carregar só quando a aba SMTP for aberta:
 * useSmtp(empresa.id, abaAtiva === 'smtp' && isAdmin)
 */
export const useSmtp = (idEmpresa: number | null, enabled = true) =>
    useQuery<SmtpResponse>({
        queryKey: smtpKeys.detail(idEmpresa ?? 0),
        queryFn: () => smtpApi.buscar(idEmpresa as number),
        staleTime: STALE_5_MIN,
        enabled: enabled && !!idEmpresa,
    });

export const useSalvarSmtp = (idEmpresa: number) => {
    const queryClient = useQueryClient();
    return useMutation<SmtpResponse, unknown, SmtpFormValues>({
        mutationFn: (values) => smtpApi.salvar(idEmpresa, values),
        // A resposta já traz o estado atualizado (inclui ind_senha_configurada)
        onSuccess: (res) => queryClient.setQueryData(smtpKeys.detail(idEmpresa), res),
    });
};

export const useTestarSmtp = (idEmpresa: number) =>
    useMutation<SmtpTesteResponse, unknown, SmtpTesteInput>({
        mutationFn: (data) => smtpApi.testar(idEmpresa, data),
    });