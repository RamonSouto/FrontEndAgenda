// src/components/imagem-produto-update-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';

import {
    imagemProdutoUpdateSchema,
    ImagemProdutoUpdateInput,
    TIPO_VINCULO,
} from '@/features/produtos/imagem-produto/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ImagemProdutoUpdateFormProps {
    defaultValues: ImagemProdutoUpdateInput;
    onSubmit: (data: ImagemProdutoUpdateInput) => void;
    submitting?: boolean;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
    imagemAtualUrl?: string | null;
}

export function ImagemProdutoUpdateForm({
    defaultValues,
    onSubmit,
    submitting,
    produtos,
    grades,
    imagemAtualUrl,
}: ImagemProdutoUpdateFormProps) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ImagemProdutoUpdateInput>({
        resolver: zodResolver(imagemProdutoUpdateSchema),
        defaultValues,
    });

    const tipoVinculo = watch('tipo_vinculo');
    const arquivo = watch('arquivo');
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!arquivo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(arquivo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [arquivo]);

    const handleTipoVinculoChange = (tipo: string) => {
        setValue('tipo_vinculo', tipo as ImagemProdutoUpdateInput['tipo_vinculo']);
        if (tipo === TIPO_VINCULO.PRODUTO) {
            setValue('id_produto_grade', null);
        } else {
            setValue('id_produto', null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <Controller
                    name="tipo_vinculo"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={handleTipoVinculoChange}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.PRODUTO} id="edit-vinculo-produto" />
                                <Label htmlFor="edit-vinculo-produto">Produto</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.GRADE} id="edit-vinculo-grade" />
                                <Label htmlFor="edit-vinculo-grade">Grade</Label>
                            </div>
                        </RadioGroup>
                    )}
                />

                <div className="flex items-center gap-2">
                    <Label htmlFor="edit-ind_principal">Imagem principal</Label>
                    <Controller
                        name="ind_principal"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="edit-ind_principal"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <Label>{tipoVinculo === TIPO_VINCULO.PRODUTO ? 'Produto' : 'Grade (Produto - Tamanho)'}</Label>
                {tipoVinculo === TIPO_VINCULO.PRODUTO ? (
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => {
                            const labelSelecionado = produtos.find((p) => p.id === field.value)?.nom_produto;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o produto">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produtos.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nom_produto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                ) : (
                    <Controller
                        name="id_produto_grade"
                        control={control}
                        render={({ field }) => {
                            const labelSelecionado = grades.find((g) => g.id === field.value)?.label;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a grade">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((g) => (
                                            <SelectItem key={g.id} value={String(g.id)}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                )}
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Arquivo da Imagem</Label>
                <Controller
                    name="arquivo"
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="edit-arquivo-imagem"
                                    className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed bg-muted/30"
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : imagemAtualUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={`${BASE_URL}/uploads/${imagemAtualUrl}`}
                                            alt="Imagem atual"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </label>
                                <Input
                                    id="edit-arquivo-imagem"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                />
                            </div>
                            <div className="min-w-0">
                                <span
                                    className="block text-sm text-muted-foreground truncate"
                                    title={field.value?.name ?? undefined}
                                >
                                    {field.value?.name ?? 'Manter arquivo atual'}
                                </span>
                            </div>
                        </>
                    )}
                />
                {errors.arquivo && (
                    <p className="text-sm text-destructive">{errors.arquivo.message as string}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Título da Imagem</Label>
                <Controller
                    name="des_titulo_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Estampa de onça" />
                    )}
                />
                {errors.des_titulo_imagem && (
                    <p className="text-sm text-destructive">{errors.des_titulo_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Descrição da Imagem</Label>
                <Controller
                    name="des_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Ex: Bermuda de cintura alta com estampa de onça"
                        />
                    )}
                />
                {errors.des_imagem && (
                    <p className="text-sm text-destructive">{errors.des_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={0}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.num_ordem && (
                    <p className="text-sm text-destructive">{errors.num_ordem.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}
