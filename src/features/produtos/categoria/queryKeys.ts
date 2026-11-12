//src/features/produtos/categoria/queryKeys.ts

export const categoriaKeys = {
    all: ['categorias'] as const,
    detail: (id: number) => ['categorias', id] as const,
};
