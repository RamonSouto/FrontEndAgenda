//src/features/parametrizacao/horario/queryKeys.ts

export const smtpKeys = {
    all: ['empresa-smtp'] as const,
    detail: (idEmpresa: number) => ['empresa-smtp', idEmpresa] as const,
};