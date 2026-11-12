//src/features/produtos/cor-estampa/queryKeys.ts

export const corEstampaKeys = {
    all: ['cor-estampa'] as const,
    detail: (id: number) => ['cor-estampa', id] as const,
};
