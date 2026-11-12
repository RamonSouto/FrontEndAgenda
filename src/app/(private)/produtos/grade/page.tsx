// app/(private)/produtos/grade/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useGradesProduto,
    useCriarGradeProduto,
    useAtualizarGradeProduto,
    useDeletarGradeProduto,
} from '@/features/produtos/grade/hooks';
import { gradeProdutoSchema, GradeProdutoInput } from '@/features/produtos/grade/schema';
import { GradeProduto } from '@/features/produtos/grade/types';
import { gradeProdutoColumns } from './columns';

// --- Correção: importa os hooks das features relacionadas ---
import { useProdutos } from '@/features/produtos/produto/hooks';
import { useCorEstampas } from '@/features/produtos/cor-estampa/hooks';
import { useTamanhos } from '@/features/produtos/tamanho/hooks';

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';

const DEFAULT_FORM: GradeProdutoInput = {
    id_produto: 0,
    id_variacao_cor_estampa: null,
    id_tamanho: 0,
    num_sku: '',
    val_preco_variacao: null,
    ind_ativo: true,
    num_codigo_barras: '',
};

// --- Formulário reutilizado para criar/editar ---
function GradeProdutoForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    opcoesProdutos,
    opcoesTamanhos,
    opcoesVariacoes,
}: {
    defaultValues: GradeProdutoInput;
    onSubmit: (data: GradeProdutoInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
    opcoesProdutos: { id: number; nome: string }[];
    opcoesTamanhos: { id: number; nome: string }[];
    opcoesVariacoes: { id: number; nome: string }[];
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<GradeProdutoInput>({
        resolver: zodResolver(gradeProdutoSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {readOnlyId !== undefined && (
                <div className="space-y-1">
                    <Label>ID</Label>
                    <Input value={readOnlyId} disabled />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Produto</Label>
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => {
                            const labelSelecionado = opcoesProdutos.find((p) => p.id === field.value)?.nome;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o produto">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opcoesProdutos.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                    {errors.id_produto && (
                        <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Tamanho</Label>
                    <Controller
                        name="id_tamanho"
                        control={control}
                        render={({ field }) => {
                            const labelSelecionado = opcoesTamanhos.find((t) => t.id === field.value)?.nome;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tamanho">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opcoesTamanhos.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {t.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                    {errors.id_tamanho && (
                        <p className="text-sm text-destructive">{errors.id_tamanho.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label>Variação Cor/Estampa</Label>
                <Controller
                    name="id_variacao_cor_estampa"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesVariacoes.find((v) => v.id === field.value)?.nome
                            : 'Sem variação';
                        return (
                            <Select
                                value={field.value ? String(field.value) : 'null'}
                                onValueChange={(value) =>
                                    field.onChange(value === 'null' ? null : Number(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a variação">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Sem variação</SelectItem>
                                    {opcoesVariacoes.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>
                                            {v.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
                {errors.id_variacao_cor_estampa && (
                    <p className="text-sm text-destructive">
                        {errors.id_variacao_cor_estampa.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>SKU</Label>
                    <Controller
                        name="num_sku"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} value={field.value ?? ''} placeholder="Ex: BOOD109G" />
                        )}
                    />
                    {errors.num_sku && (
                        <p className="text-sm text-destructive">{errors.num_sku.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Preço</Label>
                    <Controller
                        name="val_preco_variacao"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                value={field.value ?? ''}
                                onChange={(e) =>
                                    field.onChange(e.target.value === '' ? null : Number(e.target.value))
                                }
                                placeholder="0,00"
                            />
                        )}
                    />
                    {errors.val_preco_variacao && (
                        <p className="text-sm text-destructive">
                            {errors.val_preco_variacao.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label>Código de Barras</Label>
                <Controller
                    name="num_codigo_barras"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: 1234567890123" />
                    )}
                />
                {errors.num_codigo_barras && (
                    <p className="text-sm text-destructive">{errors.num_codigo_barras.message}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Controller
                    name="ind_ativo"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <Label>Ativo</Label>
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

export default function GradeProdutoPage() {
    const { data: gradesRaw, isLoading, error } = useGradesProduto();

    // --- Correção: busca as 3 listas relacionadas ---
    const { data: produtosRaw, isLoading: isLoadingProdutos } = useProdutos();
    const { data: variacoesRaw, isLoading: isLoadingVariacoes } = useCorEstampas();
    const { data: tamanhosRaw, isLoading: isLoadingTamanhos } = useTamanhos();

    const grades = useMemo(
        () => (Array.isArray(gradesRaw?.dados) ? gradesRaw.dados : []).filter(grades => grades.deleted_at === null),
        [gradesRaw]
    );

    const produtos = useMemo(
        () => (Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : []),
        [produtosRaw]
    );

    const variacoes = useMemo(
        () => (Array.isArray(variacoesRaw?.dados) ? variacoesRaw.dados : []),
        [variacoesRaw]
    );

    const tamanhos = useMemo(
        () => (Array.isArray(tamanhosRaw?.dados) ? tamanhosRaw.dados : []),
        [tamanhosRaw]
    );

    // --- Correção: monta os maps id -> descrição para a tabela ---
    // ATENÇÃO: ajuste os nomes dos campos (nom_produto, des_cor_estampa, des_tamanho)
    // conforme os types.ts reais de cada feature.
    const produtosMap = useMemo(() => {
        return produtos.reduce<Record<number, string>>((acc, p: any) => {
            acc[p.id] = p.nom_produto;
            return acc;
        }, {});
    }, [produtos]);

    const variacoesMap = useMemo(() => {
        return variacoes.reduce<Record<number, string>>((acc, v: any) => {
            acc[v.id] = v.nom_cor_estampa;
            return acc;
        }, {});
    }, [variacoes]);

    const tamanhosMap = useMemo(() => {
        return tamanhos.reduce<Record<number, string>>((acc, t: any) => {
            acc[t.id] = t.des_tamanho;
            return acc;
        }, {});
    }, [tamanhos]);

    // --- Correção: opções para os <Select> do formulário ---
    const opcoesProdutos = useMemo(
        () => produtos.map((p: any) => ({ id: p.id, nome: p.nom_produto })),
        [produtos]
    );

    const opcoesVariacoes = useMemo(
        () => variacoes.map((v: any) => ({ id: v.id, nome: v.nom_cor_estampa })),
        [variacoes]
    );

    const opcoesTamanhos = useMemo(
        () => tamanhos.map((t: any) => ({ id: t.id, nome: t.des_tamanho })),
        [tamanhos]
    );

    const criarMutation = useCriarGradeProduto();
    const [gradeSelecionada, setGradeSelecionada] = useState<GradeProduto | null>(null);
    const atualizarMutation = useAtualizarGradeProduto(gradeSelecionada?.id ?? 0);
    const deletarMutation = useDeletarGradeProduto();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [gradeParaDeletar, setGradeParaDeletar] = useState<GradeProduto | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return gradeProdutoColumns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));
    }, []);

    const [filterField, setFilterField] = useState(filterOptions[0]?.value || '');
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (filterField && value) {
            setColumnFilters([{ id: filterField, value }]);
        } else {
            setColumnFilters([]);
        }
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: grades,
        columns: gradeProdutoColumns,
        state: { columnFilters, sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: false,
        meta: {
            // --- Correção: injeta os maps reais na tabela ---
            produtosMap,
            variacoesMap,
            tamanhosMap,
            onView: (grade: GradeProduto) => {
                setGradeSelecionada(grade);
                setDialogVisualizarAberto(true);
            },
            onEdit: (grade: GradeProduto) => {
                setGradeSelecionada(grade);
                setDialogEditarAberto(true);
            },
            onDelete: (grade: GradeProduto) => {
                setGradeParaDeletar(grade);
            },
        },
    });

    const handleCriar = (data: GradeProdutoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Grade cadastrada com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar a grade.');
                }
            },
        });
    };

    const handleAtualizar = (data: GradeProdutoInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setGradeSelecionada(null);
                toast.success('Grade atualizada com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar a grade.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!gradeParaDeletar) return;
        deletarMutation.mutate(gradeParaDeletar.id, {
            onSuccess: () => {
                setGradeParaDeletar(null);
                toast.success('Grade deletada com sucesso!');
            },
            onError: (error) => {
                setGradeParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar a grade.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar grades.</div>;

    // --- Correção: loading combinado, evita mostrar tabela "quebrada"
    // (com IDs em vez de descrições) enquanto os relacionados ainda carregam.
    const carregandoRelacionados = isLoadingProdutos || isLoadingVariacoes || isLoadingTamanhos;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Grade de Produtos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Grade
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Grade de Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova grade.
                            </DialogDescription>
                        </DialogHeader>

                        <GradeProdutoForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesProdutos={opcoesProdutos}
                            opcoesTamanhos={opcoesTamanhos}
                            opcoesVariacoes={opcoesVariacoes}
                        />
                    </DialogContent>
                </Dialog>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1">
                        <Funnel className="h-4 w-4" />
                        Filtros
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Columns className="h-4 w-4" />
                                    Colunas
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.columnDef.meta?.label ?? column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap items-end gap-2 mb-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex-1 min-w-[150px]">
                        <Select value={filterField} onValueChange={setFilterField}>
                            <SelectTrigger className="w-full">
                                {filterOptions.find((opt) => opt.value === filterField)?.label || 'Campo'}
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'}`}
                            value={filterValue}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                </div>
            )}

            <Card
                className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'
                    }`}
            >
                <CardContent className="p-0">
                    <div
                        className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters
                            ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]'
                            : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'
                            }`}
                    >
                        <Table className="overflow-x-auto">
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading || carregandoRelacionados ? (
                                    <TableSkeleton columnsCount={gradeProdutoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={gradeProdutoColumns.length} className="text-center py-4">
                                            Nenhuma grade encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            {/* Dialog de edição */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setGradeSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade de Produto</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar a grade.
                        </DialogDescription>
                    </DialogHeader>
                    {gradeSelecionada && (
                        <GradeProdutoForm
                            defaultValues={{
                                id_produto: gradeSelecionada.id_produto,
                                id_variacao_cor_estampa: gradeSelecionada.id_variacao_cor_estampa,
                                id_tamanho: gradeSelecionada.id_tamanho,
                                num_sku: gradeSelecionada.num_sku,
                                val_preco_variacao: gradeSelecionada.val_preco_variacao
                                    ? Number(gradeSelecionada.val_preco_variacao)
                                    : null,
                                ind_ativo: gradeSelecionada.ind_ativo === 1,
                                num_codigo_barras: gradeSelecionada.num_codigo_barras,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={gradeSelecionada.id}
                            opcoesProdutos={opcoesProdutos}
                            opcoesTamanhos={opcoesTamanhos}
                            opcoesVariacoes={opcoesVariacoes}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setGradeSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade de Produto</DialogTitle>
                        <DialogDescription>Detalhes da grade selecionada.</DialogDescription>
                    </DialogHeader>
                    {gradeSelecionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={gradeSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>SKU</Label>
                                    <Input value={gradeSelecionada.num_sku ?? '-'} disabled />
                                </div>
                            </div>

                            {/* --- Correção: exibe as descrições, não os IDs --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Produto</Label>
                                    <Input
                                        value={produtosMap[gradeSelecionada.id_produto] ?? `#${gradeSelecionada.id_produto}`}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Tamanho</Label>
                                    <Input
                                        value={tamanhosMap[gradeSelecionada.id_tamanho] ?? `#${gradeSelecionada.id_tamanho}`}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Cor/Estampa</Label>
                                <Input
                                    value={
                                        gradeSelecionada.id_variacao_cor_estampa
                                            ? variacoesMap[gradeSelecionada.id_variacao_cor_estampa] ??
                                            `#${gradeSelecionada.id_variacao_cor_estampa}`
                                            : 'Sem variação'
                                    }
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Preço</Label>
                                    <Input
                                        value={
                                            gradeSelecionada.val_preco_variacao
                                                ? Number(gradeSelecionada.val_preco_variacao).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Código de Barras</Label>
                                    <Input value={gradeSelecionada.num_codigo_barras ?? '-'} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Input value={gradeSelecionada.ind_ativo === 1 ? 'Ativo' : 'Inativo'} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            gradeSelecionada.created_at
                                                ? formatarData(gradeSelecionada.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            gradeSelecionada.updated_at
                                                ? formatarData(gradeSelecionada.updated_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de deleção */}
            <AlertDialog open={!!gradeParaDeletar} onOpenChange={(open) => !open && setGradeParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar grade</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este registro de grade? Essa ação não pode ser desfeita.
                            <span className="block mt-2 text-destructive/80">
                                Atenção: SKU e código de barras são únicos — deletar libera esses valores para reuso.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarDelecao} disabled={deletarMutation.isPending}>
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
