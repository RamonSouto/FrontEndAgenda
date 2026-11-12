// app/(private)/agendamento/tipo-agendamento/page.tsx
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
    useTiposAgendamento,
    useCriarTipoAgendamento,
    useAtualizarTipoAgendamento,
    useDeletarTipoAgendamento,
} from '@/features/agendamento/tipo-agendamento/hooks';
import {
    tipoAgendamentoSchema,
    TipoAgendamentoInput,
} from '@/features/agendamento/tipo-agendamento/schema';
import { TipoAgendamento } from '@/features/agendamento/tipo-agendamento/types';
import { tipoAgendamentoColumns } from './columns';
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

const DEFAULT_FORM: TipoAgendamentoInput = {
    des_tipo_agendamento: '',
    ind_ativo: true,
};

// --- Formulário reutilizado para criar/editar ---
function TipoAgendamentoForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: TipoAgendamentoInput;
    onSubmit: (data: TipoAgendamentoInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TipoAgendamentoInput>({
        resolver: zodResolver(tipoAgendamentoSchema),
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
                <Label>Tipo de Agendamento</Label>
                <Controller
                    name="des_tipo_agendamento"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Ex: Reajuste" />}
                />
                {errors.des_tipo_agendamento && (
                    <p className="text-sm text-destructive">{errors.des_tipo_agendamento.message}</p>
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

export default function TipoAgendamentoPage() {
    const { data: tiposRaw, isLoading, error } = useTiposAgendamento();

    const tipos = useMemo(
        () => (Array.isArray(tiposRaw?.dados) ? tiposRaw.dados : []).filter(tipoAgenamentos => tipoAgenamentos.deleted_at === null),
        [tiposRaw]
    );

    const criarMutation = useCriarTipoAgendamento();
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoAgendamento | null>(null);
    const atualizarMutation = useAtualizarTipoAgendamento(tipoSelecionado?.id ?? 0);
    const deletarMutation = useDeletarTipoAgendamento();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [tipoParaDeletar, setTipoParaDeletar] = useState<TipoAgendamento | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return tipoAgendamentoColumns
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
        data: tipos,
        columns: tipoAgendamentoColumns,
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
            onView: (tipo: TipoAgendamento) => {
                setTipoSelecionado(tipo);
                setDialogVisualizarAberto(true);
            },
            onEdit: (tipo: TipoAgendamento) => {
                setTipoSelecionado(tipo);
                setDialogEditarAberto(true);
            },
            onDelete: (tipo: TipoAgendamento) => {
                setTipoParaDeletar(tipo);
            },
        },
    });

    const handleCriar = (data: TipoAgendamentoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Tipo de agendamento cadastrado com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar o tipo de agendamento.');
                }
            },
        });
    };

    const handleAtualizar = (data: TipoAgendamentoInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setTipoSelecionado(null);
                toast.success('Tipo de agendamento atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar o tipo de agendamento.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!tipoParaDeletar) return;
        deletarMutation.mutate(tipoParaDeletar.id, {
            onSuccess: () => {
                setTipoParaDeletar(null);
                toast.success('Tipo de agendamento deletado com sucesso!');
            },
            onError: (error) => {
                setTipoParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o tipo de agendamento.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar tipos de agendamento.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Tipos de Agendamento</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Tipo de Agendamento
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tipo de Agendamento</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo tipo de agendamento.
                            </DialogDescription>
                        </DialogHeader>

                        <TipoAgendamentoForm
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
                                    <TableSkeleton columnsCount={tipoAgendamentoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={tipoAgendamentoColumns.length} className="text-center py-4">
                                            Nenhum tipo de agendamento encontrado.
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
                    if (!open) setTipoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tipo de Agendamento</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o tipo de agendamento.
                        </DialogDescription>
                    </DialogHeader>
                    {tipoSelecionado && (
                        <TipoAgendamentoForm
                            defaultValues={{
                                des_tipo_agendamento: tipoSelecionado.des_tipo_agendamento,
                                ind_ativo: !!tipoSelecionado.ind_ativo,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={tipoSelecionado.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setTipoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tipo de Agendamento</DialogTitle>
                        <DialogDescription>Detalhes do tipo de agendamento selecionado.</DialogDescription>
                    </DialogHeader>
                    {tipoSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={tipoSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <Input value={tipoSelecionado.ind_ativo ? 'Ativo' : 'Inativo'} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Tipo de Agendamento</Label>
                                <Input value={tipoSelecionado.des_tipo_agendamento} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            tipoSelecionado.created_at ? formatarData(tipoSelecionado.created_at) : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            tipoSelecionado.updated_at ? formatarData(tipoSelecionado.updated_at) : '-'
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
            <AlertDialog open={!!tipoParaDeletar} onOpenChange={(open) => !open && setTipoParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar tipo de agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este tipo de agendamento? Essa ação não pode ser desfeita.
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
