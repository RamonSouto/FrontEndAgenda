// app/(private)/produtos/tamanho/page.tsx
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
    useTamanhos,
    useCriarTamanho,
    useAtualizarTamanho,
    useDeletarTamanho,
} from '@/features/produtos/tamanho/hooks';
import { tamanhoSchema, TamanhoInput } from '@/features/produtos/tamanho/schema';
import { Tamanho } from '@/features/produtos/tamanho/types';
import { tamanhoColumns } from './columns';
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

const CATEGORIAS: { value: TamanhoInput['des_categoria_tamanho']; label: string }[] = [
    { value: 'vestuario', label: 'Vestuário' },
    { value: 'calcados', label: 'Calçados' },
    { value: 'acessorios', label: 'Acessórios' },
    { value: 'outros', label: 'Outros' },
];

const SEM_CATEGORIA = 'null';

const DEFAULT_FORM: TamanhoInput = {
    cod_tamanho: '',
    des_tamanho: '',
    des_categoria_tamanho: null,
    num_ordem_exibicao: 0,
};

// --- Formulário reutilizado para criar/editar ---
function TamanhoForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: TamanhoInput;
    onSubmit: (data: TamanhoInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TamanhoInput>({
        resolver: zodResolver(tamanhoSchema),
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
                <Label>Código</Label>
                <Controller
                    name="cod_tamanho"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Ex: G4" maxLength={10} />}
                />
                {errors.cod_tamanho && (
                    <p className="text-sm text-destructive">{errors.cod_tamanho.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Descrição</Label>
                <Controller
                    name="des_tamanho"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Tamanho G4" maxLength={50} />
                    )}
                />
                {errors.des_tamanho && (
                    <p className="text-sm text-destructive">{errors.des_tamanho.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Categoria</Label>
                <Controller
                    name="des_categoria_tamanho"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? CATEGORIAS.find((c) => c.value === field.value)?.label
                            : 'Sem categoria';

                        return (
                            <Select
                                value={field.value ?? SEM_CATEGORIA}
                                onValueChange={(value) =>
                                    field.onChange(value === SEM_CATEGORIA ? null : value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a categoria">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SEM_CATEGORIA}>Sem categoria</SelectItem>
                                    {CATEGORIAS.map((c) => (
                                        <SelectItem key={c.value} value={c.value as string}>
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
                {errors.des_categoria_tamanho && (
                    <p className="text-sm text-destructive">{errors.des_categoria_tamanho.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem_exibicao"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                    )}
                />
                {errors.num_ordem_exibicao && (
                    <p className="text-sm text-destructive">{errors.num_ordem_exibicao.message}</p>
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

export default function TamanhoPage() {
    const { data: tamanhosRaw, isLoading, error } = useTamanhos();

    const tamanhos = useMemo(
        () => (Array.isArray(tamanhosRaw?.dados) ? tamanhosRaw.dados : []).filter(tamanhos => tamanhos.deleted_at === null),
        [tamanhosRaw]
    );

    const criarMutation = useCriarTamanho();
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<Tamanho | null>(null);
    const atualizarMutation = useAtualizarTamanho(tamanhoSelecionado?.id ?? 0);
    const deletarMutation = useDeletarTamanho();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [tamanhoParaDeletar, setTamanhoParaDeletar] = useState<Tamanho | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return tamanhoColumns
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
        data: tamanhos,
        columns: tamanhoColumns,
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
            onView: (tamanho: Tamanho) => {
                setTamanhoSelecionado(tamanho);
                setDialogVisualizarAberto(true);
            },
            onEdit: (tamanho: Tamanho) => {
                setTamanhoSelecionado(tamanho);
                setDialogEditarAberto(true);
            },
            onDelete: (tamanho: Tamanho) => {
                setTamanhoParaDeletar(tamanho);
            },
        },
    });

    const handleCriar = (data: TamanhoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Tamanho cadastrado com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar o tamanho.');
                }
            },
        });
    };

    const handleAtualizar = (data: TamanhoInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setTamanhoSelecionado(null);
                toast.success('Tamanho atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar o tamanho.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!tamanhoParaDeletar) return;
        deletarMutation.mutate(tamanhoParaDeletar.id, {
            onSuccess: () => {
                setTamanhoParaDeletar(null);
                toast.success('Tamanho deletado com sucesso!');
            },
            onError: (error) => {
                setTamanhoParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o tamanho.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar tamanhos.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Tamanhos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Tamanho
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tamanho</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo tamanho.
                            </DialogDescription>
                        </DialogHeader>

                        <TamanhoForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
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
                                    <TableSkeleton columnsCount={tamanhoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={tamanhoColumns.length} className="text-center py-4">
                                            Nenhum tamanho encontrado.
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
                    if (!open) setTamanhoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tamanho</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o tamanho.
                        </DialogDescription>
                    </DialogHeader>
                    {tamanhoSelecionado && (
                        <TamanhoForm
                            defaultValues={{
                                cod_tamanho: tamanhoSelecionado.cod_tamanho,
                                des_tamanho: tamanhoSelecionado.des_tamanho,
                                des_categoria_tamanho: tamanhoSelecionado.des_categoria_tamanho,
                                num_ordem_exibicao: tamanhoSelecionado.num_ordem_exibicao,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={tamanhoSelecionado.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setTamanhoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tamanho</DialogTitle>
                        <DialogDescription>Detalhes do tamanho selecionado.</DialogDescription>
                    </DialogHeader>
                    {tamanhoSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={tamanhoSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Código</Label>
                                    <Input value={tamanhoSelecionado.cod_tamanho} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Descrição</Label>
                                <Input value={tamanhoSelecionado.des_tamanho ?? '-'} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Categoria</Label>
                                    <Input
                                        value={
                                            CATEGORIAS.find((c) => c.value === tamanhoSelecionado.des_categoria_tamanho)
                                                ?.label ?? 'Sem categoria'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Ordem de Exibição</Label>
                                    <Input value={tamanhoSelecionado.num_ordem_exibicao} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            tamanhoSelecionado.created_at
                                                ? formatarData(tamanhoSelecionado.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            tamanhoSelecionado.updated_at
                                                ? formatarData(tamanhoSelecionado.updated_at)
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
            <AlertDialog open={!!tamanhoParaDeletar} onOpenChange={(open) => !open && setTamanhoParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar tamanho</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este tamanho? Essa ação não pode ser desfeita.
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
