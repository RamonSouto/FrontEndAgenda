import { createCrudModule } from "@/lib/crud/createCrudModule";
import { categoriaSchema, CategoriaUpdateInput, type Categoria, type CategoriaCreateInput, type categoriaUpdateSchema } from "./schema";

export const categoriaModule = createCrudModule<Categoria, CategoriaCreateInput, CategoriaUpdateInput>({
    resourceKey: 'categoria',
    endpoint: '/api/produtos/categoria',
    entitySchema: categoriaSchema,
});

export const {
    useList: useCategorias,
    useDetail: useCategoria,
    useCreate: useCreateCategoria,
    useUpdate: useUpdateCategoria,
    useRemove: useDeleteCategoria,
} = categoriaModule;