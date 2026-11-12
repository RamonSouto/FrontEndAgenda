// app/(private)/produtos/produto/[id]/sections/produto-servico-section.tsx
'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, Minus } from 'lucide-react';

import {
    useProdutoServicos,
    useCriarProdutoServico,
    useDeletarProdutoServico,
} from '@/features/produtos/produto-servico/hooks';
import {
    produtoServicoSchema,
    ProdutoServicoInput,
} from '@/features/produtos/produto-servico/schema';
import { useTiposServico } from '@/features/produtos/tipo-servico/hooks';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ProdutoServicoSectionProps {
    idProduto: number;
}

export function ProdutoServicoSection({ idProduto }: ProdutoServicoSectionProps) {
    const [mostrarForm, setMostrarForm] = useState(false);

    const { data, isLoading } = useProdutoServicos();
    const { data: tiposData } = useTiposServico();

    const criarMutation = useCriarProdutoServico();
    const deletarMutation = useDeletarProdutoServico();

    const tiposServico = useMemo(
        () => (Array.isArray(tiposData?.dados) ? tiposData.dados : []),
        [tiposData]
    );

    const tiposServicoMap = useMemo(
        () => tiposServico.reduce<Record<number, string>>((acc, t: any) => {
            acc[t.id] = t.des_tipo_ajuste;
            return acc;
        }, {}),
        [tiposServico]
    );

    const servicos = useMemo(
        () => (data?.dados ?? []).filter((s) => s.id_produto === idProduto).filter(servicos => servicos.deleted_at === null),
        [data, idProduto]
    );

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProdutoServicoInput>({
        resolver: zodResolver(produtoServicoSchema),
        defaultValues: {
            id_produto: idProduto,
            id_tipo_servico: 0,
            ind_ativo: true,
        },
    });

    const ativoAtual = watch('ind_ativo');

    async function onSubmit(values: ProdutoServicoInput) {
        await criarMutation.mutateAsync({ ...values, id_produto: idProduto });
        reset({ id_produto: idProduto, id_tipo_servico: 0, ind_ativo: true });
        setMostrarForm(false);
    }

    return (
        <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Serviços vinculados ao produto</h3>
                <Button size="sm" variant="outline" onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? <Minus className='h-4 w-4 mr-1' /> : <Plus className="h-4 w-4 mr-1" />}
                    Adicionar serviço
                </Button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                        <Label>Tipo de serviço</Label>
                        <Controller
                            control={control}
                            name="id_tipo_servico"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione">
                                            {tiposServicoMap[field.value]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposServico.map((t: any) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {/* {t.nom_tipo_servico} */}
                                                {tiposServicoMap[t.id]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.id_tipo_servico && (
                            <p className="text-sm text-destructive">
                                {errors.id_tipo_servico.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={ativoAtual}
                            onCheckedChange={(checked) => setValue('ind_ativo', checked)}
                        />
                        <Label>Ativo</Label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" size="sm" disabled={criarMutation.isPending}>
                            {criarMutation.isPending ? 'Salvando...' : 'Salvar serviço'}
                        </Button>
                    </div>
                </form>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo de serviço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : servicos.length ? (
                        servicos.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell>{s.id}</TableCell>
                                <TableCell>
                                    {tiposServicoMap[s.id_tipo_servico] ?? s.id_tipo_servico}
                                </TableCell>
                                <TableCell>
                                    {s.ind_ativo === 1 ? <Badge variant="default">Ativo</Badge> : <Badge variant="destructive">Inativo</Badge>}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deletarMutation.mutate(s.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                Nenhum serviço vinculado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
