// app/(private)/produtos/categoria/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
    useCategorias,
    useCriarCategoria,
    useAtualizarCategoria,
    useDeletarCategoria,
} from '@/features/produtos/categoria/hooks';
import { categoriaSchema, CategoriaInput } from '@/features/produtos/categoria/schema';
import { Categoria, CategoriaComFilhos } from '@/features/produtos/categoria/types';
import { categoriaColumns } from './columns';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    ExpandedState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';
import { montarArvore } from '@/lib/utils/tree';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';

const SEM_PAI = 'null';

const DEFAULT_FORM: CategoriaInput = {
    nom_categoria: '',
    id_pai: null,
};

// --- Formulário reutilizado para criar/editar ---
function CategoriaForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    opcoesCategorias,
}: {
    defaultValues: CategoriaInput;
    onSubmit: (data: CategoriaInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
    opcoesCategorias: Categoria[];
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoriaInput>({
        resolver: zodResolver(categoriaSchema),
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
                <Label>Nome da Categoria</Label>
                <Controller
                    name="nom_categoria"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Ex: Bermudas" />}
                />
                {errors.nom_categoria && (
                    <p className="text-sm text-destructive">{errors.nom_categoria.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Categoria Pai</Label>
                <Controller
                    name="id_pai"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesCategorias.find((c) => c.id === field.value)?.nom_categoria
                            : 'Sem categoria pai';

                        return (
                            <Select
                                value={field.value ? String(field.value) : SEM_PAI}
                                onValueChange={(value) => field.onChange(value === SEM_PAI ? null : Number(value))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a categoria pai">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SEM_PAI}>Sem categoria pai</SelectItem>
                                    {opcoesCategorias
                                        .filter((c) => c.id !== readOnlyId)
                                        .map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nom_categoria}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
                {errors.id_pai && (
                    <p className="text-sm text-destructive">{errors.id_pai.message}</p>
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

export default function CategoriaPage() {
    const { data: categoriasRaw, isLoading, error } = useCategorias();

    // Lista plana — usada para: lookup de nomes (categoriasMap) e opções do <Select> do formulário
    const categorias = useMemo(
        () => (Array.isArray(categoriasRaw?.dados) ? categoriasRaw.dados : []).filter(categorias => categorias.deleted_at === null),
        [categoriasRaw]
    );

    // Lista em árvore (subRows aninhados) — usada exclusivamente como `data` da tabela
    const categoriasArvore = useMemo(() => montarArvore(categorias), [categorias]);

    const categoriasMap = useMemo(() => {
        return categorias.reduce<Record<number, string>>((acc, c) => {
            acc[c.id] = c.nom_categoria;
            return acc;
        }, {});
    }, [categorias]);

    const criarMutation = useCriarCategoria();
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
    const atualizarMutation = useAtualizarCategoria(categoriaSelecionada?.id ?? 0);
    const deletarMutation = useDeletarCategoria();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [categoriaParaDeletar, setCategoriaParaDeletar] = useState<Categoria | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return categoriaColumns
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
        data: categoriasArvore,
        columns: categoriaColumns,
        state: { columnFilters, sorting, pagination, columnVisibility, expanded },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row: CategoriaComFilhos) => row.subRows,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onExpandedChange: setExpanded,
        manualPagination: false,
        meta: {
            categoriasMap,
            onView: (categoria: Categoria) => {
                setCategoriaSelecionada(categoria);
                setDialogVisualizarAberto(true);
            },
            onEdit: (categoria: Categoria) => {
                setCategoriaSelecionada(categoria);
                setDialogEditarAberto(true);
            },
            onDelete: (categoria: Categoria) => {
                setCategoriaParaDeletar(categoria);
            },
        },
    });

    const handleCriar = (data: CategoriaInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Categoria cadastrada com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar a categoria.');
                }
            },
        });
    };

    const handleAtualizar = (data: CategoriaInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setCategoriaSelecionada(null);
                toast.success('Categoria atualizada com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar a categoria.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!categoriaParaDeletar) return;
        deletarMutation.mutate(categoriaParaDeletar.id, {
            onSuccess: () => {
                setCategoriaParaDeletar(null);
                toast.success('Categoria deletada com sucesso!');
            },
            onError: (error) => {
                setCategoriaParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar a categoria.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar categorias.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Categorias de Produtos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Categoria
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Categoria</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova categoria.
                            </DialogDescription>
                        </DialogHeader>

                        <CategoriaForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesCategorias={categorias}
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
                                    <TableSkeleton columnsCount={categoriaColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={categoriaColumns.length} className="text-center py-4">
                                            Nenhuma categoria encontrada.
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
                    if (!open) setCategoriaSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Categoria</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar a categoria.
                        </DialogDescription>
                    </DialogHeader>
                    {categoriaSelecionada && (
                        <CategoriaForm
                            defaultValues={{
                                nom_categoria: categoriaSelecionada.nom_categoria,
                                id_pai: categoriaSelecionada.id_pai,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={categoriaSelecionada.id}
                            opcoesCategorias={categorias}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setCategoriaSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Categoria</DialogTitle>
                        <DialogDescription>Detalhes da categoria selecionada.</DialogDescription>
                    </DialogHeader>
                    {categoriaSelecionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={categoriaSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Categoria Pai</Label>
                                    <Input
                                        value={
                                            categoriaSelecionada.id_pai
                                                ? categoriasMap[categoriaSelecionada.id_pai] ?? categoriaSelecionada.id_pai
                                                : 'Sem categoria pai'
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Nome da Categoria</Label>
                                <Input value={categoriaSelecionada.nom_categoria} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            categoriaSelecionada.created_at
                                                ? formatarData(categoriaSelecionada.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            categoriaSelecionada.updated_at
                                                ? formatarData(categoriaSelecionada.updated_at)
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
            <AlertDialog open={!!categoriaParaDeletar} onOpenChange={(open) => !open && setCategoriaParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta categoria? Essa ação não pode ser desfeita.
                            <span className="block mt-2 text-destructive-foreground/80">
                                Atenção: se houver subcategorias vinculadas a este registro, a exclusão pode ser
                                bloqueada pelo servidor (restrição de chave estrangeira).
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
