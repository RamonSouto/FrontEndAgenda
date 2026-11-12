// src/app/(private)/produtos/produto/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useProduto, useAtualizarProduto } from '@/features/produtos/produto/hooks';
import { ProdutoInput } from '@/features/produtos/produto/schema';
import { ProdutoForm } from '@/app/(private)/produtos/produto/produto-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { GradeSection } from '@/app/(private)/produtos/produto/[id]/sections/grade-section';
import { ProdutoServicoSection } from '@/app/(private)/produtos/produto/[id]/sections/produto-servico-section';
import { useCategorias } from '@/features/produtos/categoria/hooks';
import { useMemo } from 'react';
import { PrecoProdutoServicoSection } from './sections/preco-produto-servico-section';
import { Card, CardContent } from '@/components/ui/card';
import { GaleriaSection } from './sections/galeria/galeria-section';

export default function EditarProdutoPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);

    const { data, isLoading } = useProduto(id);
    const atualizarMutation = useAtualizarProduto(id);

    const { data: categoriaRaw, isLoading: isLoadingCategoria } = useCategorias();
    const cateogrias = useMemo(() => (Array.isArray(categoriaRaw?.dados) ? categoriaRaw?.dados : []).filter(categorias => categorias.deleted_at === null), [categoriaRaw]);

    if (isLoading || !data) return <div className="p-6">Carregando...</div>;

    const produto = data.dados;

    const initialValues: ProdutoInput = {
        id_categoria: produto.id_categoria,
        nom_produto: produto.nom_produto,
        num_sku: produto.num_sku,
        des_produto: produto.des_produto,
        ref_produto: produto.ref_produto,
        val_preco_base: Number(produto.val_preco_base),
        ind_ativo: produto.ind_ativo === 1,
    };

    function handleAtualizar(values: ProdutoInput) {
        atualizarMutation.mutate(values);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="text-2xl font-bold">{produto.nom_produto}</div>
            <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg p-6`} >
                <CardContent className="p-0">
                    <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary`}>
                        <ProdutoForm
                            defaultValues={initialValues}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            opcoesCategorias={cateogrias}
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="dados">
                <TabsList>
                    <TabsTrigger value="grade">Grade</TabsTrigger>
                    <TabsTrigger value="servico">Produto/Serviço</TabsTrigger>
                    <TabsTrigger value="preco">Produto/Serviço/Preço</TabsTrigger>
                    <TabsTrigger value="galeria">Galeria</TabsTrigger>
                </TabsList>

                <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg p-6`} >
                    <CardContent className="p-0">
                        <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary`}>

                            <TabsContent value="grade">
                                <GradeSection idProduto={id} />
                            </TabsContent>

                            <TabsContent value="servico">
                                <ProdutoServicoSection idProduto={id} />
                            </TabsContent>

                            <TabsContent value="preco">
                                <PrecoProdutoServicoSection idProduto={id} />
                            </TabsContent>
                            <TabsContent value="galeria">
                                <GaleriaSection idProduto={id} nomProduto={produto.nom_produto} />
                            </TabsContent>
                        </div>
                    </CardContent>
                </Card>

            </Tabs>
        </div>
    );
}
