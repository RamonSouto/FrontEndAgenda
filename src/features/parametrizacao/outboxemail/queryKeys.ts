//src/features/parametrizacao/outboxemail/queryKeys.ts

import { EmailOutboxListParams } from './types';

const base = ['email-outbox'] as const;

export const emailOutboxKeys = {
    all: base,
    lists: () => [...base, 'list'] as const,
    list: (params: EmailOutboxListParams = {}) => [...base, 'list', params] as const,
};