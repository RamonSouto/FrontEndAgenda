// src/app/(private)/produtos/produto/[id]/sections/galeria/galeria-section.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import {
    useImagensPorProduto,
    useImagensPorGrade,
    useDeletarImagemProduto,
} from '@/features/produtos/imagem-produto/hooks';
import { TIPO_VINCULO } from '@/features/produtos/imagem-produto/schema';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
import { useGradesProduto } from '@/features/produtos/grade/hooks';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { ImagemCard } from '@/components/imagem-card';
import { ImagemUploadDialog } from './imagem-upload-dialog';
import { useProdutos } from '@/features/produtos/produto/hooks';

interface GaleriaSectionProps {
    idProduto: number;
    nomProduto: string;
}

export function GaleriaSection({ idProduto, nomProduto }: GaleriaSectionProps) {
    // ---------- Galeria do Produto ----------
    const { data: imagensProdutoData, isLoading: isLoadingProduto } = useImagensPorProduto(idProduto);
    const imagensProduto = imagensProdutoData?.dados ?? [];

    const { data: produtosRaw } = useProdutos();
    const produtos = (produtosRaw?.dados ?? []).filter((p) => p.deleted_at === null);

    const [dialogProdutoAberto, setDialogProdutoAberto] = useState(false);

    // ---------- Galeria da Grade ----------
    const { data: gradesData } = useGradesProduto();
    const gradesDoProduto = (gradesData?.dados ?? []).filter(
        (g) => g.id_produto === idProduto && g.deleted_at === null
    );

    const [idGradeSelecionada, setIdGradeSelecionada] = useState<number | null>(
        gradesDoProduto[0]?.id ?? null
    );

    const { data: imagensGradeData, isLoading: isLoadingGrade } = useImagensPorGrade(
        idGradeSelecionada ?? 0
    );
    const imagensGrade = imagensGradeData?.dados ?? [];

    const [dialogGradeAberto, setDialogGradeAberto] = useState(false);

    const gradesOptions = gradesDoProduto.map((g) => ({
        id: g.id,
        label: g.num_sku ?? `Grade #${g.id}`,
    }));

    const produtosMap = produtos.reduce<Record<number, string>>((acc, p) => {
        acc[p.id] = p.nom_produto;
        return acc;
    }, {});

    const gradesMap = gradesOptions.reduce<Record<number, string>>((acc, g) => {
        acc[g.id] = g.label;
        return acc;
    }, {});

    // ---------- Deleção (compartilhada) ----------
    const deletarMutation = useDeletarImagemProduto();
    const [imagemParaDeletar, setImagemParaDeletar] = useState<ImagemProduto | null>(null);

    async function handleConfirmarDelete() {
        if (!imagemParaDeletar) return;
        try {
            await deletarMutation.mutateAsync(imagemParaDeletar.id);
            toast.success('Imagem removida');
        } catch {
            toast.error('Erro ao remover imagem');
        } finally {
            setImagemParaDeletar(null);
        }
    }

    return (
        <div className="space-y-8">
            {/* ================= GALERIA DO PRODUTO ================= */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{nomProduto}</h3>
                    <Button size="sm" onClick={() => setDialogProdutoAberto(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar imagem
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4 border rounded-md p-4 min-h-[140px]">
                    {isLoadingProduto ? (
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    ) : imagensProduto.length ? (
                        imagensProduto.map((img) => (
                            <ImagemCard
                                key={img.id}
                                imagem={img}
                                onDelete={setImagemParaDeletar}
                                produtos={produtos}
                                grades={gradesOptions}
                                produtosMap={produtosMap}
                                gradesMap={gradesMap}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Nenhuma imagem cadastrada para este produto.
                        </p>
                    )}
                </div>
            </div>

            {/* ================= GALERIA DA GRADE ================= */}
            <div className="space-y-3">
                <div className="flex justify-between items-center gap-4">
                    <h3 className="font-semibold text-lg">Descrição das grades</h3>

                    <div className="flex items-center gap-2">
                        <Select
                            value={idGradeSelecionada ? String(idGradeSelecionada) : undefined}
                            onValueChange={(v) => setIdGradeSelecionada(Number(v))}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Selecione a grade">
                                    {gradesDoProduto.find((g) => g.id === idGradeSelecionada)?.num_sku
                                        ?? (idGradeSelecionada ? `Grade #${idGradeSelecionada}` : undefined)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {gradesDoProduto.map((g) => (
                                    <SelectItem key={g.id} value={String(g.id)}>
                                        {g.num_sku ?? `Grade #${g.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            size="sm"
                            onClick={() => setDialogGradeAberto(true)}
                            disabled={!idGradeSelecionada}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar imagem
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 border rounded-md p-4 min-h-[140px]">
                    {!idGradeSelecionada ? (
                        <p className="text-sm text-muted-foreground">
                            Cadastre e selecione uma grade para gerenciar suas imagens.
                        </p>
                    ) : isLoadingGrade ? (
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    ) : imagensGrade.length ? (
                        imagensGrade.map((img) => (
                            <ImagemCard
                                key={img.id}
                                imagem={img}
                                onDelete={setImagemParaDeletar}
                                produtos={produtos}
                                grades={gradesOptions}
                                produtosMap={produtosMap}
                                gradesMap={gradesMap}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Nenhuma imagem cadastrada para esta grade.
                        </p>
                    )}
                </div>
            </div>

            {/* ================= DIALOGS DE UPLOAD ================= */}
            <ImagemUploadDialog
                open={dialogProdutoAberto}
                onOpenChange={setDialogProdutoAberto}
                tipoVinculo={TIPO_VINCULO.PRODUTO}
                idProduto={idProduto}
                produtos={produtos}
                grades={gradesOptions}
            />

            <ImagemUploadDialog
                open={dialogGradeAberto}
                onOpenChange={setDialogGradeAberto}
                tipoVinculo={TIPO_VINCULO.GRADE}
                idProdutoGrade={idGradeSelecionada}
                produtos={produtos}
                grades={gradesOptions}
            />

            {/* ================= CONFIRMAÇÃO DE DELETE ================= */}
            <AlertDialog
                open={!!imagemParaDeletar}
                onOpenChange={(open) => {
                    if (!open) setImagemParaDeletar(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover imagem</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover{' '}
                            <strong>{imagemParaDeletar?.des_titulo_imagem ?? 'esta imagem'}</strong>?
                            Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmarDelete}
                            disabled={deletarMutation.isPending}
                        >
                            {deletarMutation.isPending ? 'Removendo...' : 'Remover'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
