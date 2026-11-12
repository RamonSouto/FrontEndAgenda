//src/features/parametrizacao/horario/queryKeys.ts

export const horarioKeys = {
    all: ['horarios'] as const,
    detail: (id: number) => ['horarios', id] as const,
};
