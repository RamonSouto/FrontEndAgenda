// app/(private)/produtos/produto/[id]/sections/grade-section.tsx
'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, Minus } from 'lucide-react';

import {
    useGradesProduto,
    useCriarGradeProduto,
    useDeletarGradeProduto,
} from '@/features/produtos/grade/hooks';
import { gradeProdutoSchema, GradeProdutoInput } from '@/features/produtos/grade/schema';
import { useTamanhos } from '@/features/produtos/tamanho/hooks';
import { useCorEstampas } from '@/features/produtos/cor-estampa/hooks';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Badge } from '@/components/ui/badge';
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


interface GradeSectionProps {
    idProduto: number;
}

export function GradeSection({ idProduto }: GradeSectionProps) {
    const [mostrarForm, setMostrarForm] = useState(false);
    const [gradeParaDeletar, setGradeParaDeletar] = useState<typeof grades[number] | null>(null);

    const { data, isLoading } = useGradesProduto();
    const { data: tamanhosData } = useTamanhos();
    const { data: corEstampasData } = useCorEstampas();

    const criarMutation = useCriarGradeProduto();
    const deletarMutation = useDeletarGradeProduto();

    const tamanhos = useMemo(
        () => (Array.isArray(tamanhosData?.dados) ? tamanhosData.dados : []).filter((t) => t.deleted_at === null),
        [tamanhosData]
    );

    const corEstampas = useMemo(
        () => (Array.isArray(corEstampasData?.dados) ? corEstampasData.dados : []).filter((c) => c.deleted_at === null),
        [corEstampasData]
    );

    // Descrição do tamanho: "cod - descrição" (ex.: "M - Médio")
    const tamanhosMap = useMemo(
        () => tamanhos.reduce<Record<number, string>>((acc, t: any) => {
            acc[t.id] = t.des_tamanho ? `${t.cod_tamanho} - ${t.des_tamanho}` : t.cod_tamanho;
            return acc;
        }, {}),
        [tamanhos]
    );

    // Descrição da cor/estampa: "nome (tipo)" (ex.: "Azul (cor)")
    const corEstampasMap = useMemo(
        () => corEstampas.reduce<Record<number, string>>((acc, c: any) => {
            acc[c.id] = `${c.nom_cor_estampa} (${c.ind_tipo})`;
            return acc;
        }, {}),
        [corEstampas]
    );

    const grades = useMemo(
        () => (data?.dados ?? []).filter((g) => g.id_produto === idProduto).filter(grades => grades.deleted_at === null),
        [data, idProduto]
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<GradeProdutoInput>({
        resolver: zodResolver(gradeProdutoSchema),
        defaultValues: {
            id_produto: idProduto,
            id_variacao_cor_estampa: null,
            id_tamanho: 0,
            num_sku: null,
            val_preco_variacao: null,
            ind_ativo: true,
            num_codigo_barras: null,
        },
    });

    const precoAtual = watch('val_preco_variacao');
    const ativoAtual = watch('ind_ativo');

    async function onSubmit(values: GradeProdutoInput) {
        await criarMutation.mutateAsync({ ...values, id_produto: idProduto });
        reset({
            id_produto: idProduto,
            id_variacao_cor_estampa: null,
            id_tamanho: 0,
            num_sku: null,
            val_preco_variacao: null,
            ind_ativo: true,
            num_codigo_barras: null,
        });
        setMostrarForm(false);
    }

    async function handleConfirmarDelete() {
        if (!gradeParaDeletar) return;
        await deletarMutation.mutateAsync(gradeParaDeletar.id);
        setGradeParaDeletar(null);
    }

    return (
        <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Grade do produto (cor/estampa x tamanho)</h3>
                <Button size="sm" variant="outline" onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? <Minus className='h-4 w-4 mr-1' /> : <Plus className="h-4 w-4 mr-1" />}
                    Adicionar item
                </Button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <Label>Tamanho</Label>
                        <Controller
                            control={control}
                            name="id_tamanho"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione">
                                            {tamanhosMap[field.value]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tamanhos.map((t: any) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {tamanhosMap[t.id]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.id_tamanho && (
                            <p className="text-sm text-destructive">{errors.id_tamanho.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Cor/estampa</Label>
                        <Controller
                            control={control}
                            name="id_variacao_cor_estampa"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : undefined}
                                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione">
                                            {field.value ? corEstampasMap[field.value] : undefined}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {corEstampas.map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {corEstampasMap[c.id]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>SKU</Label>
                        <Input {...register('num_sku')} />
                    </div>

                    <div className="space-y-1">
                        <Label>Código de barras</Label>
                        <Input {...register('num_codigo_barras')} />
                    </div>

                    <div className="space-y-1">
                        <Label>Preço da variação (R$)</Label>
                        <Controller
                            name="val_preco_variacao"
                            control={control}
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>R$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="0,00"
                                        inputMode="numeric"
                                        value={formatarMoedaInput(precoAtual ?? 0)}
                                        onChange={(e) =>
                                            setValue('val_preco_variacao', parseMoedaInput(e.target.value))
                                        }
                                    />
                                </InputGroup>
                            )}
                        />
                        {errors.val_preco_variacao && (
                            <p className="text-sm text-destructive">{errors.val_preco_variacao.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={ativoAtual}
                            onCheckedChange={(checked) => setValue('ind_ativo', checked)}
                        />
                        <Label>Ativo</Label>
                    </div>

                    <div className="col-span-4 flex justify-end">
                        <Button type="submit" size="sm" disabled={criarMutation.isPending}>
                            {criarMutation.isPending ? 'Salvando...' : 'Salvar item'}
                        </Button>
                    </div>
                </form>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Cor/estampa</TableHead>
                        <TableHead>Preço variação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : grades.length ? (
                        grades.map((g) => (
                            <TableRow key={g.id}>
                                <TableCell>{g.id}</TableCell>
                                <TableCell>{g.num_sku ?? '-'}</TableCell>
                                <TableCell>{tamanhosMap[g.id_tamanho] ?? g.id_tamanho}</TableCell>
                                <TableCell>
                                    {g.id_variacao_cor_estampa
                                        ? corEstampasMap[g.id_variacao_cor_estampa] ?? g.id_variacao_cor_estampa
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    {g.val_preco_variacao
                                        ? `R$ ${formatarMoedaInput(Number(g.val_preco_variacao))}`
                                        : '-'}
                                </TableCell>
                                <TableCell>{g.ind_ativo === 1 ? <Badge variant="default">Ativo</Badge> : <Badge variant="destructive">Inativo</Badge>}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setGradeParaDeletar(g)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                Nenhum item de grade cadastrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AlertDialog
                open={!!gradeParaDeletar}
                onOpenChange={(open) => {
                    if (!open) setGradeParaDeletar(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar item da grade</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar o item{' '}
                            <strong>{gradeParaDeletar?.num_sku ?? `#${gradeParaDeletar?.id}`}</strong>? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmarDelete}
                            disabled={deletarMutation.isPending}
                        >
                            {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div >
    );
}
