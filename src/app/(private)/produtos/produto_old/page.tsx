// app/(private)/produtos/produto/page.tsx
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
    useProdutos,
    useCriarProduto,
    useAtualizarProduto,
    useDeletarProduto,
} from '@/features/produtos/produto/hooks';
import { useCategorias } from '@/features/produtos/categoria/hooks';
import { produtoSchema, ProdutoInput } from '@/features/produtos/produto/schema';
import { Produto } from '@/features/produtos/produto/types';
import { produtoColumns } from './columns';
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
import { formatarData, formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

const SEM_CATEGORIA = 'null';

const DEFAULT_FORM: ProdutoInput = {
    id_categoria: null,
    nom_produto: '',
    num_sku: '',
    des_produto: '',
    ref_produto: '',
    val_preco_base: 0,
    ind_ativo: true,
};

// --- Formulário reutilizado para criar/editar ---
function ProdutoForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    opcoesCategorias,
}: {
    defaultValues: ProdutoInput;
    onSubmit: (data: ProdutoInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
    opcoesCategorias: { id: number; nom_categoria: string }[];
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProdutoInput>({
        resolver: zodResolver(produtoSchema),
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
                <Label>Nome do Produto</Label>
                <Controller
                    name="nom_produto"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Ex: Bermuda de cintura alta" />}
                />
                {errors.nom_produto && (
                    <p className="text-sm text-destructive">{errors.nom_produto.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Categoria</Label>
                <Controller
                    name="id_categoria"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesCategorias.find((c) => c.id === field.value)?.nom_categoria
                            : 'Sem categoria';

                        return (
                            <Select
                                value={field.value ? String(field.value) : SEM_CATEGORIA}
                                onValueChange={(value) =>
                                    field.onChange(value === SEM_CATEGORIA ? null : Number(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a categoria">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SEM_CATEGORIA}>Sem categoria</SelectItem>
                                    {opcoesCategorias.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.nom_categoria}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
                {errors.id_categoria && (
                    <p className="text-sm text-destructive">{errors.id_categoria.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>SKU</Label>
                    <Controller
                        name="num_sku"
                        control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Ex: BOOD110" />}
                    />
                    {errors.num_sku && (
                        <p className="text-sm text-destructive">{errors.num_sku.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Referência</Label>
                    <Controller
                        name="ref_produto"
                        control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Ex: Bermuda cintura alta" />}
                    />
                    {errors.ref_produto && (
                        <p className="text-sm text-destructive">{errors.ref_produto.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label>Descrição</Label>
                <Controller
                    name="des_produto"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Descrição do produto" />
                    )}
                />
                {errors.des_produto && (
                    <p className="text-sm text-destructive">{errors.des_produto.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Preço Base</Label>
                    <Controller
                        name="val_preco_base"
                        control={control}
                        render={({ field }) => (
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
                        <p className="text-sm text-destructive">{errors.val_preco_base.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Status</Label>
                    <Controller
                        name="ind_ativo"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center h-9">
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                        )}
                    />
                </div>
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

export default function ProdutoPage() {
    const { data: produtosRaw, isLoading, error } = useProdutos();
    const { data: categoriasRaw } = useCategorias();

    const produtos = useMemo(
        () => (Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : []).filter(produtos => produtos.deleted_at === null),
        [produtosRaw]
    );

    const categorias = useMemo(
        () => (Array.isArray(categoriasRaw?.dados) ? categoriasRaw.dados : []),
        [categoriasRaw]
    );

    const categoriasMap = useMemo(() => {
        return categorias.reduce<Record<number, string>>((acc, c) => {
            acc[c.id] = c.nom_categoria;
            return acc;
        }, {});
    }, [categorias]);

    const criarMutation = useCriarProduto();
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const atualizarMutation = useAtualizarProduto(produtoSelecionado?.id ?? 0);
    const deletarMutation = useDeletarProduto();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return produtoColumns
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
        data: produtos,
        columns: produtoColumns,
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
            categoriasMap,
            onView: (produto: Produto) => {
                setProdutoSelecionado(produto);
                setDialogVisualizarAberto(true);
            },
            onEdit: (produto: Produto) => {
                setProdutoSelecionado(produto);
                setDialogEditarAberto(true);
            },
            onDelete: (produto: Produto) => {
                setProdutoParaDeletar(produto);
            },
        },
    });

    const handleCriar = (data: ProdutoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Produto cadastrado com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar o produto.');
                }
            },
        });
    };

    const handleAtualizar = (data: ProdutoInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setProdutoSelecionado(null);
                toast.success('Produto atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar o produto.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!produtoParaDeletar) return;
        deletarMutation.mutate(produtoParaDeletar.id, {
            onSuccess: () => {
                setProdutoParaDeletar(null);
                toast.success('Produto deletado com sucesso!');
            },
            onError: (error) => {
                setProdutoParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o produto.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar produtos.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Produtos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Produto
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo produto.
                            </DialogDescription>
                        </DialogHeader>

                        <ProdutoForm
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
                                    <TableSkeleton columnsCount={produtoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={produtoColumns.length} className="text-center py-4">
                                            Nenhum produto encontrado.
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
                    if (!open) setProdutoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Produto</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o produto.
                        </DialogDescription>
                    </DialogHeader>
                    {produtoSelecionado && (
                        <ProdutoForm
                            defaultValues={{
                                id_categoria: produtoSelecionado.id_categoria,
                                nom_produto: produtoSelecionado.nom_produto,
                                num_sku: produtoSelecionado.num_sku,
                                des_produto: produtoSelecionado.des_produto,
                                ref_produto: produtoSelecionado.ref_produto,
                                val_preco_base: Number(produtoSelecionado.val_preco_base),
                                ind_ativo: !!produtoSelecionado.ind_ativo,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={produtoSelecionado.id}
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
                    if (!open) setProdutoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Produto</DialogTitle>
                        <DialogDescription>Detalhes do produto selecionado.</DialogDescription>
                    </DialogHeader>
                    {produtoSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={produtoSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Categoria</Label>
                                    <Input
                                        value={
                                            produtoSelecionado.id_categoria
                                                ? categoriasMap[produtoSelecionado.id_categoria] ?? produtoSelecionado.id_categoria
                                                : 'Sem categoria'
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Nome do Produto</Label>
                                <Input value={produtoSelecionado.nom_produto} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>SKU</Label>
                                    <Input value={produtoSelecionado.num_sku ?? '-'} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Referência</Label>
                                    <Input value={produtoSelecionado.ref_produto ?? '-'} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Descrição</Label>
                                <Input value={produtoSelecionado.des_produto ?? '-'} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Preço Base</Label>
                                    <Input
                                        value={Number(produtoSelecionado.val_preco_base).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <Input value={produtoSelecionado.ind_ativo ? 'Ativo' : 'Inativo'} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            produtoSelecionado.created_at
                                                ? formatarData(produtoSelecionado.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            produtoSelecionado.updated_at
                                                ? formatarData(produtoSelecionado.updated_at)
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
            <AlertDialog open={!!produtoParaDeletar} onOpenChange={(open) => !open && setProdutoParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar produto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este produto? Essa ação não pode ser desfeita.
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
