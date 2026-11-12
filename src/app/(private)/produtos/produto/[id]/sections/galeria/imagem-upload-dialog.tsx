// src/app/(private)/produtos/produto/[id]/sections/galeria/imagem-upload-dialog.tsx
'use client';

import { toast } from 'sonner';

import {
    ImagemProdutoCreateInput,
    TIPO_VINCULO,
    TipoVinculo,
} from '@/features/produtos/imagem-produto/schema';
import { useCriarImagemProduto } from '@/features/produtos/imagem-produto/hooks';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

import { ImagemProdutoCreateForm } from '@/components/imagem-produto-create-form';

interface ImagemUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tipoVinculo: TipoVinculo;
    idProduto?: number | null;
    idProdutoGrade?: number | null;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
}

export function ImagemUploadDialog({
    open,
    onOpenChange,
    tipoVinculo,
    idProduto = null,
    idProdutoGrade = null,
    produtos,
    grades,
}: ImagemUploadDialogProps) {
    const criarMutation = useCriarImagemProduto();

    async function handleSubmit(values: ImagemProdutoCreateInput) {
        try {
            await criarMutation.mutateAsync(values);
            toast.success('Imagem adicionada com sucesso');
            onOpenChange(false);
        } catch {
            toast.error('Erro ao enviar a imagem');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar imagem</DialogTitle>
                    <DialogDescription>
                        Selecione o arquivo e preencha as informações da imagem.
                    </DialogDescription>
                </DialogHeader>

                <Card className="ring-0">
                    <ImagemProdutoCreateForm
                        onSubmit={handleSubmit}
                        submitting={criarMutation.isPending}
                        produtos={produtos}
                        grades={grades}
                        lockTipoVinculo
                        defaultValues={{
                            tipo_vinculo: tipoVinculo,
                            id_produto: tipoVinculo === TIPO_VINCULO.PRODUTO ? idProduto : null,
                            id_produto_grade: tipoVinculo === TIPO_VINCULO.GRADE ? idProdutoGrade : null,
                        }}
                    />
                </Card>
            </DialogContent>
        </Dialog>
    );
}
