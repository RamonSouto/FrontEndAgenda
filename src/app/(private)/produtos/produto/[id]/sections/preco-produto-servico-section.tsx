// app/(private)/produtos/produto/[id]/sections/preco-produto-servico-section.tsx
'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, Minus } from 'lucide-react';

import { useProdutoServicos } from '@/features/produtos/produto-servico/hooks';
import { useTiposServico } from '@/features/produtos/tipo-servico/hooks';
import { useProdutos } from '@/features/produtos/produto/hooks';
import {
    usePrecoProdutoServicos,
    useCriarPrecoProdutoServico,
    useDeletarPrecoProdutoServico,
} from '@/features/produtos/preco-produto-servico/hooks';
import {
    precoProdutoServicoFormSchema,
    PrecoProdutoServicoFormInput,
} from '@/features/produtos/preco-produto-servico/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { formatarDataBR, formatarDataParaAPI, formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

interface PrecoProdutoServicoSectionProps {
    idProduto: number;
}

export function PrecoProdutoServicoSection({ idProduto }: PrecoProdutoServicoSectionProps) {
    const [mostrarForm, setMostrarForm] = useState(false);

    const { data: servicosData } = useProdutoServicos();
    const { data: tiposData } = useTiposServico();
    const { data: produtosData } = useProdutos();
    const { data: precosData, isLoading } = usePrecoProdutoServicos();

    const criarMutation = useCriarPrecoProdutoServico();
    const deletarMutation = useDeletarPrecoProdutoServico();

    const produtosMap = useMemo(() => {
        const lista = Array.isArray(produtosData?.dados) ? produtosData.dados : [];
        return lista.reduce<Record<number, string>>((acc, p: any) => {
            acc[p.id] = p.nom_produto;
            return acc;
        }, {});
    }, [produtosData]);

    const tiposServicoMap = useMemo(() => {
        const lista = Array.isArray(tiposData?.dados) ? tiposData.dados : [];
        return lista.reduce<Record<number, string>>((acc, t: any) => {
            acc[t.id] = t.des_tipo_ajuste;
            return acc;
        }, {});
    }, [tiposData]);

    // Serviços vinculados ao produto atual
    const servicosDoProduto = useMemo(
        () => (servicosData?.dados ?? []).filter((s) => s.id_produto === idProduto),
        [servicosData, idProduto]
    );

    // Descrição "Produto - Serviço" por id de produto_servico
    const descricaoServicoMap = useMemo(() => {
        const todosServicos = servicosData?.dados ?? [];
        return todosServicos.reduce<Record<number, string>>((acc, s) => {
            const nomeProduto = produtosMap[s.id_produto] ?? `Produto #${s.id_produto}`;
            const nomeTipo = tiposServicoMap[s.id_tipo_servico] ?? `Serviço #${s.id_tipo_servico}`;
            acc[s.id] = `${nomeProduto} - ${nomeTipo}`;
            return acc;
        }, {});
    }, [servicosData, produtosMap, tiposServicoMap]);

    const idsServicosDoProduto = useMemo(
        () => new Set(servicosDoProduto.map((s) => s.id)),
        [servicosDoProduto]
    );

    const precos = useMemo(
        () => (precosData?.dados ?? []).filter((p) => idsServicosDoProduto.has(p.id_produto_servico)).filter(p => p.deleted_at === null),
        [precosData, idsServicosDoProduto]
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<PrecoProdutoServicoFormInput>({
        resolver: zodResolver(precoProdutoServicoFormSchema),
        defaultValues: {
            id_produto_servico: 0,
            val_preco: '',
            dta_inicio: new Date(),

        },
    });

    const idServicoAtual = watch('id_produto_servico');
    const precoAtual = watch('val_preco');

    async function onSubmit(values: PrecoProdutoServicoFormInput) {
        await criarMutation.mutateAsync({
            id_produto_servico: values.id_produto_servico,
            val_preco: values.val_preco,
            dta_inicio: formatarDataParaAPI(values.dta_inicio),
        });
        reset({ id_produto_servico: 0, val_preco: '', dta_inicio: new Date() });
        setMostrarForm(false);
    }

    return (
        <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Preços dos serviços do produto</h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMostrarForm(!mostrarForm)}
                    disabled={servicosDoProduto.length === 0}
                >
                    {mostrarForm ? <Minus className='h-4 w-4 mr-1' /> : <Plus className="h-4 w-4 mr-1" />}
                    Adicionar preço
                </Button>
            </div>

            {servicosDoProduto.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Cadastre ao menos um serviço na aba &quot;Produto/Serviço&quot; antes de definir preços.
                </p>
            )}

            {mostrarForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-3 items-end">
                    <div className="space-y-1 ">
                        <Label>Produto - Serviço</Label>
                        <Controller
                            control={control}
                            name="id_produto_servico"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione">
                                            {descricaoServicoMap[field.value]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {servicosDoProduto.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {descricaoServicoMap[s.id]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.id_produto_servico && (
                            <p className="text-sm text-destructive">
                                {errors.id_produto_servico.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Preço (R$ 0,00)</Label>
                        <Controller
                            name="val_preco"
                            control={control}
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>R$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="0,00"
                                        inputMode="numeric"
                                        value={formatarMoedaInput(precoAtual ? Number(precoAtual) : 0)}
                                        onChange={(e) =>
                                            setValue('val_preco', parseMoedaInput(e.target.value).toFixed(2))
                                        }
                                    />
                                </InputGroup>
                            )}
                        />
                        {/* <Input placeholder="190,00" {...register('val_preco')} /> */}
                        {errors.val_preco && (
                            <p className="text-sm text-destructive">{errors.val_preco.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Data de início</Label>
                        <Input
                            type="date"
                            onChange={(e) =>
                                setValue('dta_inicio', e.target.value ? new Date(e.target.value) : new Date())
                            }
                        />
                        {errors.dta_inicio && (
                            <p className="text-sm text-destructive">{errors.dta_inicio.message}</p>
                        )}
                    </div>

                    <div className="col-span-3 flex justify-end">
                        <Button type="submit" size="sm" disabled={criarMutation.isPending}>
                            {criarMutation.isPending ? 'Salvando...' : 'Salvar preço'}
                        </Button>
                    </div>
                </form>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Produto - Serviço</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : precos.length ? (
                        precos.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>
                                    {descricaoServicoMap[p.id_produto_servico] ?? `#${p.id_produto_servico}`}
                                </TableCell>
                                <TableCell>{p.val_preco ? `R$ ${formatarMoedaInput(Number(p.val_preco))}` : '-'}</TableCell>
                                <TableCell>{formatarDataBR(p.dta_inicio)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deletarMutation.mutate(p.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                Nenhum preço cadastrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
