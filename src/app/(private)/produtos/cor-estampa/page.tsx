// app/(private)/produtos/cor-estampa/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    useCorEstampas,
    useCriarCorEstampa,
    useAtualizarCorEstampa,
    useDeletarCorEstampa,
} from '@/features/produtos/cor-estampa/hooks';
import {
    corEstampaSchema,
    CorEstampaInput,
} from '@/features/produtos/cor-estampa/schema';
import { CorEstampa } from '@/features/produtos/cor-estampa/types';
import { corEstampaColumns } from './columns';
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

const DEFAULT_FORM: CorEstampaInput = {
    nom_cor_estampa: '',
    ind_tipo: 'cor',
    val_codigo_hex: null,
    des_imagem_url: null,
    num_ordem_exibicao: 0,
};

// --- Formulário reutilizado para criar/editar ---
function CorEstampaForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: CorEstampaInput;
    onSubmit: (data: CorEstampaInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CorEstampaInput>({
        resolver: zodResolver(corEstampaSchema),
        defaultValues,
    });

    const tipoSelecionado = watch('ind_tipo');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {readOnlyId !== undefined && (
                <div className="space-y-1">
                    <Label>ID</Label>
                    <Input value={readOnlyId} disabled />
                </div>
            )}

            <div className="space-y-1">
                <Label>Nome</Label>
                <Controller
                    name="nom_cor_estampa"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Ex: Azul Marinho" />}
                />
                {errors.nom_cor_estampa && (
                    <p className="text-sm text-destructive">{errors.nom_cor_estampa.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Tipo</Label>
                <Controller
                    name="ind_tipo"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cor">Cor</SelectItem>
                                <SelectItem value="estampa">Estampa</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.ind_tipo && (
                    <p className="text-sm text-destructive">{errors.ind_tipo.message}</p>
                )}
            </div>

            {tipoSelecionado === 'cor' && (
                <div className="space-y-1">
                    <Label>Código Hexadecimal</Label>
                    <Controller
                        name="val_codigo_hex"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="#000000"
                                    maxLength={7}
                                />
                                <input
                                    type="color"
                                    value={field.value || '#000000'}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="h-9 w-9 cursor-pointer rounded border"
                                />
                            </div>
                        )}
                    />
                    {errors.val_codigo_hex && (
                        <p className="text-sm text-destructive">{errors.val_codigo_hex.message}</p>
                    )}
                </div>
            )}

            {tipoSelecionado === 'estampa' && (
                <div className="space-y-1">
                    <Label>URL da Imagem</Label>
                    <Controller
                        name="des_imagem_url"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                placeholder="https://..."
                            />
                        )}
                    />
                    {errors.des_imagem_url && (
                        <p className="text-sm text-destructive">{errors.des_imagem_url.message}</p>
                    )}
                </div>
            )}

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem_exibicao"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
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

export default function CorEstampaPage() {
    const { data: corEstampasRaw, isLoading, error } = useCorEstampas();

    const corEstampas = useMemo(
        () => (Array.isArray(corEstampasRaw?.dados) ? corEstampasRaw.dados : []).filter(corEstampas => corEstampas.deleted_at === null),
        [corEstampasRaw]
    );

    const criarMutation = useCriarCorEstampa();
    const [registroSelecionado, setRegistroSelecionado] = useState<CorEstampa | null>(null);
    const atualizarMutation = useAtualizarCorEstampa(registroSelecionado?.id ?? 0);
    const deletarMutation = useDeletarCorEstampa();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [registroParaDeletar, setRegistroParaDeletar] = useState<CorEstampa | null>(null);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return corEstampaColumns
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
        data: corEstampas,
        columns: corEstampaColumns,
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
            onView: (registro: CorEstampa) => {
                setRegistroSelecionado(registro);
                setDialogVisualizarAberto(true);
            },
            onEdit: (registro: CorEstampa) => {
                setRegistroSelecionado(registro);
                setDialogEditarAberto(true);
            },
            onDelete: (registro: CorEstampa) => {
                setRegistroParaDeletar(registro);
            },
        },
    });

    const handleCriar = (data: CorEstampaInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Cor/Estampa cadastrada com sucesso');
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

    const handleAtualizar = (data: CorEstampaInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setRegistroSelecionado(null);
                toast.success('Cor/Estampa atualizada com sucesso!');
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
        if (!registroParaDeletar) return;
        deletarMutation.mutate(registroParaDeletar.id, {
            onSuccess: () => {
                setRegistroParaDeletar(null);
                toast.success('Cor/Estampa deletada com sucesso!');
            },
            onError: (error) => {
                setRegistroParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar o registro.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar cores/estampas.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Cores e Estampas</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Cor/Estampa
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cor / Estampa</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova cor ou estampa.
                            </DialogDescription>
                        </DialogHeader>

                        <CorEstampaForm
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
                                    <TableSkeleton columnsCount={corEstampaColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={corEstampaColumns.length} className="text-center py-4">
                                            Nenhum registro encontrado.
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
                    if (!open) setRegistroSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cor / Estampa</DialogTitle>
                        <DialogDescription>
                            Preencha os campos corretamente para editar o registro.
                        </DialogDescription>
                    </DialogHeader>
                    {registroSelecionado && (
                        <CorEstampaForm
                            defaultValues={{
                                nom_cor_estampa: registroSelecionado.nom_cor_estampa,
                                ind_tipo: registroSelecionado.ind_tipo,
                                val_codigo_hex: registroSelecionado.val_codigo_hex,
                                des_imagem_url: registroSelecionado.des_imagem_url,
                                num_ordem_exibicao: registroSelecionado.num_ordem_exibicao,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={registroSelecionado.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setRegistroSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cor / Estampa</DialogTitle>
                        <DialogDescription>Detalhes do registro selecionado.</DialogDescription>
                    </DialogHeader>
                    {registroSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={registroSelecionado.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Tipo</Label>
                                    <Input
                                        value={registroSelecionado.ind_tipo === 'cor' ? 'Cor' : 'Estampa'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Nome</Label>
                                <Input value={registroSelecionado.nom_cor_estampa} disabled />
                            </div>
                            {registroSelecionado.val_codigo_hex && (
                                <div className="space-y-1">
                                    <Label>Código Hexadecimal</Label>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-6 w-6 rounded-full border"
                                            style={{ backgroundColor: registroSelecionado.val_codigo_hex }}
                                        />
                                        <Input value={registroSelecionado.val_codigo_hex} disabled />
                                    </div>
                                </div>
                            )}
                            {registroSelecionado.des_imagem_url && (
                                <div className="space-y-1">
                                    <Label>Imagem</Label>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={registroSelecionado.des_imagem_url}
                                        alt="Estampa"
                                        className="h-20 w-20 rounded object-cover border"
                                    />
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label>Ordem de Exibição</Label>
                                <Input value={registroSelecionado.num_ordem_exibicao} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={
                                            registroSelecionado.created_at
                                                ? formatarData(registroSelecionado.created_at)
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={
                                            registroSelecionado.updated_at
                                                ? formatarData(registroSelecionado.updated_at)
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
            <AlertDialog open={!!registroParaDeletar} onOpenChange={(open) => !open && setRegistroParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar registro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta cor/estampa? Essa ação não pode ser desfeita.
                            <span className="block mt-2 text-destructive-foreground/80">
                                Atenção: se houver produtos vinculados a este registro, a exclusão pode ser
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
        </div >
    );
}
