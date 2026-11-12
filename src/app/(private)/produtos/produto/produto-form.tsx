// src/features/produtos/produto/produto-form.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema, ProdutoInput } from '@/features/produtos/produto/schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';
import { useEffect, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

interface Categoria {
    id: number;
    nom_categoria: string;
}

interface ProdutoFormProps {
    defaultValues: ProdutoInput;
    onSubmit: (data: ProdutoInput) => void;
    submitting?: boolean;
    opcoesCategorias: Categoria[];
}

export function ProdutoForm({
    defaultValues,
    onSubmit,
    submitting,
    opcoesCategorias,
}: ProdutoFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProdutoInput>({
        resolver: zodResolver(produtoSchema),
        defaultValues,
    });

    const [precoTexto, setPrecoTexto] = useState(
        formatarMoedaInput(defaultValues.val_preco_base || 0)
    );

    useEffect(() => {
        setValue('val_preco_base', parseMoedaInput(precoTexto));
    }, [precoTexto, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="nom_produto">Nome do produto*</Label>
                    <Input id="nom_produto" {...register('nom_produto')} />
                    {errors.nom_produto && (
                        <p className="text-sm text-destructive">{errors.nom_produto.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="num_sku">SKU</Label>
                    <Input id="num_sku" {...register('num_sku')} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="ref_produto">Referência</Label>
                    <Input id="ref_produto" {...register('ref_produto')} />
                </div>

                <div className="space-y-1">
                    <Label>Categoria</Label>
                    <Controller
                        control={control}
                        name="id_categoria"
                        render={({ field }) => {
                            const labelSelecionado = opcoesCategorias.find((p) => p.id === field.value)?.nom_categoria;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opcoesCategorias.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nom_categoria}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )

                        }}
                    />
                </div>

                {/* <div className="space-y-1">
                    <Label htmlFor="val_preco_base">Preço base*</Label>
                    <Input
                        id="val_preco_base"
                        value={precoTexto}
                        onChange={(e) => setPrecoTexto(e.target.value)}
                        inputMode="numeric"
                    />
                    {errors.val_preco_base && (
                        <p className="text-sm text-destructive">
                            {errors.val_preco_base.message}
                        </p>
                    )}
                </div> */}
                <div className="space-y-1">
                    <Label>Preço</Label>
                    <Controller
                        name="val_preco_base"
                        control={control}
                        render={({ field }) => (
                            // <Input {...field} placeholder="Ex: 2.50" />
                            <InputGroup>
                                <InputGroupAddon>
                                    <InputGroupText>R$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="0,00"
                                    inputMode="numeric"
                                    value={formatarMoedaInput(field.value)}
                                    onChange={(e) => field.onChange(parseMoedaInput(e.target.value))}
                                />
                            </InputGroup>
                        )}
                    />
                    {errors.val_preco_base && (
                        <p className="text-sm text-destructive">{errors.val_preco.message}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-6">
                    <Controller
                        control={control}
                        name="ind_ativo"
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label>Produto ativo</Label>
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="des_produto">Descrição</Label>
                <Textarea id="des_produto" {...register('des_produto')} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
