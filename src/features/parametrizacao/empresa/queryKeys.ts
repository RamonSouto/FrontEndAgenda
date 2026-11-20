// features/parametrizacao/empresa/queryKeys.ts

export const empresaKeys = {
    all: ['empresas'] as const,
    lists: () => ['empresas', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['empresas', 'list', params ?? {}] as const,
    details: () => ['empresas', 'detail'] as const,
    detail: (id: number) => ['empresas', 'detail', id] as const,
    horarios: (idEmpresa: number) => ['empresas', idEmpresa, 'horarios'] as const,
};