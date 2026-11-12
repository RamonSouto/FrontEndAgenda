// app/(private)/parametros/horario/page.tsx
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
    useHorarios,
    useCriarHorario,
    useAtualizarHorario,
    useDeletarHorario,
} from '@/features/parametrizacao/horario/hooks';
import { horarioSchema, HorarioInput } from '@/features/parametrizacao/horario/schema';
import { Horario } from '@/features/parametrizacao/horario/types';
import { horarioColumns } from './columns';
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
import { formatarData, formatarDataBR, hhmmParaMinutos, minutosParaHHMM } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';

const TIPOS_DIA = [
    { value: 'UTIL', label: 'Dia Útil' },
    { value: 'SABADO', label: 'Sábado' },
];

const DEFAULT_FORM: HorarioInput = {
    des_tipo_dia: 'UTIL',
    hra_inicio: '08:00:00',
    hra_fim: '17:00:00',
    qtd_minutos_intervalo: '0',
    ind_ativo: true,
};

// --- Formulário reutilizado para criar/editar ---
function HorarioForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: HorarioInput;
    onSubmit: (data: HorarioInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<HorarioInput>({
        resolver: zodResolver(horarioSchema),
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
                <Label>Dia</Label>
                <Controller
                    name="des_tipo_dia"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o dia" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS_DIA.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.des_tipo_dia && (
                    <p className="text-sm text-destructive">{errors.des_tipo_dia.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Horário Inicial</Label>
                    <Controller
                        name="hra_inicio"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="time"
                                value={field.value?.slice(0, 5)}
                                onChange={(e) => field.onChange(`${e.target.value}:00`)}
                            />
                        )}
                    />
                    {errors.hra_inicio && (
                        <p className="text-sm text-destructive">{errors.hra_inicio.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Horário Final</Label>
                    <Controller
                        name="hra_fim"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="time"
                                value={field.value?.slice(0, 5)}
                                onChange={(e) => field.onChange(`${e.target.value}:00`)}
                            />
                        )}
                    />
                    {errors.hra_fim && (
                        <p className="text-sm text-destructive">{errors.hra_fim.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label>Tempo de Intervalo</Label>
                <Controller
                    name="qtd_minutos_intervalo"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="time"
                            value={minutosParaHHMM(field.value)}
                            onChange={(e) => field.onChange(hhmmParaMinutos(e.target.value))}
                        />
                    )}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Controller
                    name="ind_ativo"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Criado</Label>
                    <Input value={formatarData((defaultValues as unknown as Horario).created_at ?? null)} disabled />
                </div>
                <div className="space-y-1">
                    <Label>Editado</Label>
                    <Input value={formatarData((defaultValues as unknown as Horario).updated_at ?? null)} disabled />
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

export default function HorarioPage() {
    const { data: horariosRaw, isLoading, error } = useHorarios();
    const horarios = useMemo(
        () => (Array.isArray(horariosRaw?.dados) ? horariosRaw.dados : []),
        [horariosRaw]
    );

    const criarMutation = useCriarHorario();
    const [horarioSelecionado, setHorarioSelecionado] = useState<Horario | null>(null);
    const atualizarMutation = useAtualizarHorario(horarioSelecionado?.id ?? 0);
    const deletarMutation = useDeletarHorario();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [horarioParaDeletar, setHorarioParaDeletar] = useState<Horario | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return horarioColumns
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
        data: horarios,
        columns: horarioColumns,
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
            onView: (horario: Horario) => {
                setHorarioSelecionado(horario);
                setDialogVisualizarAberto(true);
            },
            onEdit: (horario: Horario) => {
                setHorarioSelecionado(horario);
                setDialogEditarAberto(true);
            },
            onDelete: (horario: Horario) => {
                setHorarioParaDeletar(horario);
            },
        },
    });

    const handleCriar = (data: HorarioInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false),
                    toast.success("Horário cadastrado com sucesso")
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar o horário.');
                }
            },
        });
    };

    const handleAtualizar = (data: HorarioInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setHorarioSelecionado(null);
                toast.success('Horário atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar o horário.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!horarioParaDeletar) return;
        deletarMutation.mutate(horarioParaDeletar.id, {
            onSuccess: () => {
                setHorarioParaDeletar(null);
                toast.success("Registro de horário deletado com sucesso!")
            },
            onError: (error) => {
                setHorarioParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o horário.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar horários.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Horário de Funcionamento</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Horário
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Horario</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo horário.
                            </DialogDescription>
                        </DialogHeader>

                        <HorarioForm
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
                                    <TableSkeleton columnsCount={horarioColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={horarioColumns.length} className="text-center py-4">
                                            Nenhum horário encontrado.
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
                    if (!open) setHorarioSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Horario</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o horário.
                        </DialogDescription>
                    </DialogHeader>
                    {horarioSelecionado && (
                        <HorarioForm
                            defaultValues={{
                                des_tipo_dia: horarioSelecionado.des_tipo_dia,
                                hra_inicio: horarioSelecionado.hra_inicio,
                                hra_fim: horarioSelecionado.hra_fim,
                                qtd_minutos_intervalo: horarioSelecionado.qtd_minutos_intervalo,
                                ind_ativo: !!horarioSelecionado.ind_ativo,
                                created_at: horarioSelecionado.created_at,
                                updated_at: horarioSelecionado.updated_at,
                            } as unknown as HorarioInput}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={horarioSelecionado.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setHorarioSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Horario</DialogTitle>
                        <DialogDescription>Detalhes do horário selecionado.</DialogDescription>
                    </DialogHeader>
                    {horarioSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={horarioSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Dia</Label>
                                    <Input
                                        value={horarioSelecionado.des_tipo_dia === 'UTIL' ? 'Dia Útil' : 'Sábado'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Horário Inicial</Label>
                                    <Input value={horarioSelecionado.hra_inicio?.slice(0, 5)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Horário Final</Label>
                                    <Input value={horarioSelecionado.hra_fim?.slice(0, 5)} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Tempo de Intervalo</Label>
                                <Input value={minutosParaHHMM(horarioSelecionado.qtd_minutos_intervalo)} disabled />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Status</Label>
                                <Switch checked={!!horarioSelecionado.ind_ativo} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input value={formatarData(horarioSelecionado.created_at)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input value={formatarData(horarioSelecionado.updated_at)} disabled />
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
            <AlertDialog open={!!horarioParaDeletar} onOpenChange={(open) => !open && setHorarioParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar horário</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este horário? Essa ação não pode ser desfeita.
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
