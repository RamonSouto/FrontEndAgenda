//src/features/parametrizacao/outboxemail/hooks.ts

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { EmailOutboxApi } from './api';
import { emailOutboxKeys } from './queryKeys';
import {
    EmailOutboxListParams,
    EmailOutboxListResponse,
    EmailOutboxReprocessarResponse,
} from './types';

export const useEmailOutbox = (params: EmailOutboxListParams = {}) => {
    return useQuery<EmailOutboxListResponse>({
        queryKey: emailOutboxKeys.list(params),
        queryFn: () => EmailOutboxApi.listar(params),
        placeholderData: keepPreviousData, // evita "piscar" ao trocar filtros/página
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useReprocessarEmail = () => {
    const queryClient = useQueryClient();

    return useMutation<EmailOutboxReprocessarResponse, unknown, number>({
        mutationFn: (id) => EmailOutboxApi.reprocessar(id),
        onSuccess: () => {
            // status/tentativas mudam após reprocessar
            queryClient.invalidateQueries({ queryKey: emailOutboxKeys.lists() });
        },
    });
};