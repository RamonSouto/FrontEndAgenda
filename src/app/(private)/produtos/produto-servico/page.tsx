// app/(private)/produtos/produto-servico/page.tsx
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
    useProdutoServicos,
    useCriarProdutoServico,
    useAtualizarProdutoServico,
    useDeletarProdutoServico,
} from '@/features/produtos/produto-servico/hooks';
import {
    produtoServicoSchema,
    ProdutoServicoInput,
} from '@/features/produtos/produto-servico/schema';
import { ProdutoServico } from '@/features/produtos/produto-servico/types';
import { useProdutos } from '@/features/produtos/produto/hooks';
import { useTiposServico } from '@/features/produtos/tipo-servico/hooks';
import { produtoServicoColumns } from './columns';
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

const DEFAULT_FORM: ProdutoServicoInput = {
    id_produto: 0,
    id_tipo_servico: 0,
    ind_ativo: true,
};

// --- Formulário reutilizado para criar/editar ---
function ProdutoServicoForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    editando,
    opcoesProdutos,
    opcoesTiposServico,
}: {
    defaultValues: ProdutoServicoInput;
    onSubmit: (data: ProdutoServicoInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
    editando?: boolean;
    opcoesProdutos: { id: number; nom_produto: string }[];
    opcoesTiposServico: { id: number; des_tipo_ajuste: string }[];
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProdutoServicoInput>({
        resolver: zodResolver(produtoServicoSchema),
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

            <div className="space-y-1">
                <Label>Produto</Label>
                <Controller
                    name="id_produto"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesProdutos.find((p) => p.id === field.value)?.nom_produto
                            : undefined;
                        return (
                            <Select
                                value={field.value ? String(field.value) : ''}
                                onValueChange={(value) => field.onChange(Number(value))}
                                disabled={editando} // não permite alterar o produto na edição
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o produto">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {opcoesProdutos.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.nom_produto}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                    }}
                />
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Tipo de Serviço</Label>
                <Controller
                    name="id_tipo_servico"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesTiposServico.find((p) => p.id === field.value)?.des_tipo_ajuste
                            : undefined;
                        return (
                            <Select
                                value={field.value ? String(field.value) : ''}
                                onValueChange={(value) => field.onChange(Number(value))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo de serviço">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {opcoesTiposServico.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.des_tipo_ajuste}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                    }}
                />
                {errors.id_tipo_servico && (
                    <p className="text-sm text-destructive">{errors.id_tipo_servico.message}</p>
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

export default function ProdutoServicoPage() {
    const { data: produtoServicosRaw, isLoading, error } = useProdutoServicos();
    const { data: produtosRaw } = useProdutos();
    const { data: tiposServicoRaw } = useTiposServico();

    const produtoServicos = useMemo(
        () => (Array.isArray(produtoServicosRaw?.dados) ? produtoServicosRaw.dados : []).filter(produtosServico => produtosServico.deleted_at === null),
        [produtoServicosRaw]
    );

    const produtos = useMemo(
        () => (Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : []).filter(produtos => produtos.deleted_at === null),
        [produtosRaw]
    );

    const tiposServico = useMemo(
        () => (Array.isArray(tiposServicoRaw?.dados) ? tiposServicoRaw.dados : []).filter(tipoServico => tipoServico.deleted_at === null),
        [tiposServicoRaw]
    );

    const produtosMap = useMemo(() => {
        return produtos.reduce<Record<number, string>>((acc, p) => {
            acc[p.id] = p.nom_produto;
            return acc;
        }, {});
    }, [produtos]);

    const tiposServicoMap = useMemo(() => {
        return tiposServico.reduce<Record<number, string>>((acc, t) => {
            acc[t.id] = t.des_tipo_ajuste;
            return acc;
        }, {});
    }, [tiposServico]);

    const criarMutation = useCriarProdutoServico();
    const [produtoServicoSelecionado, setProdutoServicoSelecionado] = useState<ProdutoServico | null>(null);
    const atualizarMutation = useAtualizarProdutoServico(produtoServicoSelecionado?.id ?? 0);
    const deletarMutation = useDeletarProdutoServico();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [produtoServicoParaDeletar, setProdutoServicoParaDeletar] = useState<ProdutoServico | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return produtoServicoColumns
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
        data: produtoServicos,
        columns: produtoServicoColumns,
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
            produtosMap,
            tiposServicoMap,
            onView: (item: ProdutoServico) => {
                setProdutoServicoSelecionado(item);
                setDialogVisualizarAberto(true);
            },
            onEdit: (item: ProdutoServico) => {
                setProdutoServicoSelecionado(item);
                setDialogEditarAberto(true);
            },
            onDelete: (item: ProdutoServico) => {
                setProdutoServicoParaDeletar(item);
            },
        },
    });

    const handleCriar = (data: ProdutoServicoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Produto/Serviço cadastrado com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar o registro.');
                }
            },
        });
    };

    const handleAtualizar = (data: ProdutoServicoInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setProdutoServicoSelecionado(null);
                toast.success('Produto/Serviço atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar o registro.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!produtoServicoParaDeletar) return;
        deletarMutation.mutate(produtoServicoParaDeletar.id, {
            onSuccess: () => {
                setProdutoServicoParaDeletar(null);
                toast.success('Produto/Serviço deletado com sucesso!');
            },
            onError: (error) => {
                setProdutoServicoParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o registro.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar produtos/serviços.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Produto x Serviço</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Vínculo
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Produto x Serviço</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo vínculo.
                            </DialogDescription>
                        </DialogHeader>

                        <ProdutoServicoForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesProdutos={produtos}
                            opcoesTiposServico={tiposServico}
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
                                {isLoading ? (
                                    <TableSkeleton columnsCount={produtoServicoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={produtoServicoColumns.length} className="text-center py-4">
                                            Nenhum vínculo encontrado.
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
                    if (!open) setProdutoServicoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Produto x Serviço</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o vínculo.
                        </DialogDescription>
                    </DialogHeader>
                    {produtoServicoSelecionado && (
                        <ProdutoServicoForm
                            defaultValues={{
                                id_produto: produtoServicoSelecionado.id_produto,
                                id_tipo_servico: produtoServicoSelecionado.id_tipo_servico,
                                ind_ativo: !!produtoServicoSelecionado.ind_ativo,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={produtoServicoSelecionado.id}
                            editando
                            opcoesProdutos={produtos}
                            opcoesTiposServico={tiposServico}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setProdutoServicoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Produto x Serviço</DialogTitle>
                        <DialogDescription>Detalhes do vínculo selecionado.</DialogDescription>
                    </DialogHeader>
                    {produtoServicoSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={produtoServicoSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Situação</Label>
                                    <Input
                                        value={produtoServicoSelecionado.ind_ativo ? 'Ativo' : 'Inativo'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Produto</Label>
                                    <Input
                                        value={
                                            produtosMap[produtoServicoSelecionado.id_produto] ??
                                            produtoServicoSelecionado.id_produto
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Tipo de Serviço</Label>
                                    <Input
                                        value={
                                            tiposServicoMap[produtoServicoSelecionado.id_tipo_servico] ??
                                            produtoServicoSelecionado.id_tipo_servico
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            produtoServicoSelecionado.created_at
                                                ? formatarData(produtoServicoSelecionado.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            produtoServicoSelecionado.updated_at
                                                ? formatarData(produtoServicoSelecionado.updated_at)
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
            <AlertDialog
                open={!!produtoServicoParaDeletar}
                onOpenChange={(open) => !open && setProdutoServicoParaDeletar(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar vínculo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este vínculo de Produto x Serviço? Essa ação não pode
                            ser desfeita.
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
