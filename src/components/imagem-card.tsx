// src/app/(private)/produtos/produto/[id]/components/imagem-card.tsx
'use client';

import { useState } from 'react';
import { SquarePen, Trash2, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
import { TIPO_VINCULO, ImagemProdutoUpdateInput } from '@/features/produtos/imagem-produto/schema';
import { useAtualizarImagemProduto } from '@/features/produtos/imagem-produto/hooks';
import { ApiError } from '@/lib/http/errors';
import { formatarData } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

import { ImagemProdutoUpdateForm } from '@/components/imagem-produto-update-form';

interface ImagemCardProps {
    imagem: ImagemProduto;
    onDelete: (imagem: ImagemProduto) => void;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
    produtosMap?: Record<number, string>;
    gradesMap?: Record<number, string>;
}

export function ImagemCard({
    imagem,
    onDelete,
    produtos,
    grades,
    produtosMap = {},
    gradesMap = {},
}: ImagemCardProps) {
    const ehPrincipal = imagem.ind_principal === 1;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);

    const atualizarMutation = useAtualizarImagemProduto(imagem.id);

    const handleAtualizar = (data: ImagemProdutoUpdateInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                toast.success('Imagem atualizada com sucesso!');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao atualizar a imagem.');
            },
        });
    };
    return (
        <div className="flex flex-col items-center gap-2 w-28">
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className={cn(
                            'relative w-24 h-24 rounded-md overflow-hidden border group',
                            ehPrincipal && 'border-primary ring-1 ring-primary'
                        )}
                    >
                        <img
                            src={`${BASE_URL}/uploads/${imagem.des_url_imagem}`}
                            alt={imagem.des_titulo_imagem ?? 'Imagem do produto'}
                            className="absolute inset-0 w-full h-full object-contain object-center bg-primary/10"
                        />

                        <div className="absolute right-1 top-0 bottom-1 h-full flex flex-col justify-between">
                            <Button
                                size="icon-xs"
                                variant="outline"
                                className="bg-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setDialogVisualizarAberto(true)}
                            >
                                <View className="h-3 w-3 text-white" />
                            </Button>

                            <Button
                                size="icon-xs"
                                variant="outline"
                                className="bg-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setDialogEditarAberto(true)}
                            >
                                <SquarePen className="h-3 w-3 text-white" />
                            </Button>

                            <Button
                                size="icon-xs"
                                variant="outline"
                                className="bg-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDelete(imagem)}
                            >
                                <Trash2 className="h-3 w-3 text-white" />
                            </Button>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-[200px] text-xs">
                        {imagem.des_imagem || 'Sem descrição'}
                    </p>
                </TooltipContent>
            </Tooltip>

            <p className="text-xs text-center truncate w-full" title={imagem.des_titulo_imagem ?? ''}>
                {imagem.des_titulo_imagem ?? '-'}
            </p>

            {/* Dialog de Visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={setDialogVisualizarAberto}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>Detalhes da imagem selecionada</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${BASE_URL}/${imagem.des_url_imagem}`}
                            alt={imagem.des_titulo_imagem ?? 'Imagem'}
                            className="w-full max-h-64 object-contain rounded border"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>ID</Label>
                                <Input value={imagem.id} disabled />
                            </div>
                            <div className="space-y-1">
                                <Label>Vínculo</Label>
                                <Input
                                    value={
                                        imagem.id_produto
                                            ? produtosMap[imagem.id_produto] ?? `Produto #${imagem.id_produto}`
                                            : gradesMap[imagem.id_produto_grade ?? 0] ?? `Grade #${imagem.id_produto_grade}`
                                    }
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Título</Label>
                            <Input value={imagem.des_titulo_imagem ?? '-'} disabled />
                        </div>
                        <div className="space-y-1">
                            <Label>Descrição</Label>
                            <Input value={imagem.des_imagem ?? '-'} disabled />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Criado</Label>
                                <Input value={imagem.created_at ? formatarData(imagem.created_at) : '-'} disabled />
                            </div>
                            <div className="space-y-1">
                                <Label>Editado</Label>
                                <Input value={imagem.updated_at ? formatarData(imagem.updated_at) : '-'} disabled />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose variant="outline">Fechar</DialogClose>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog de Edição */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={setDialogEditarAberto}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>
                            Atualize o produto vinculado e/ou a marcação de imagem principal
                        </DialogDescription>
                    </DialogHeader>
                    <Card className="ring-0">
                        <ImagemProdutoUpdateForm
                            defaultValues={{
                                tipo_vinculo: imagem.id_produto ? TIPO_VINCULO.PRODUTO : TIPO_VINCULO.GRADE,
                                id_produto: imagem.id_produto ?? null,
                                id_produto_grade: imagem.id_produto_grade ?? null,
                                des_titulo_imagem: imagem.des_titulo_imagem ?? '',
                                des_imagem: imagem.des_imagem ?? '',
                                num_ordem: imagem.num_ordem ?? 0,
                                ind_principal: !!imagem.ind_principal,
                                arquivo: null,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            produtos={produtos}
                            grades={grades}
                            imagemAtualUrl={imagem.des_url_imagem}
                        />
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    );
}
