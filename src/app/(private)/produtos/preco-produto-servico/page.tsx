// app/(private)/produtos/preco-produto-servico/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    usePrecoProdutoServicos,
    useCriarPrecoProdutoServico,
    useAtualizarPrecoProdutoServico,
    useDeletarPrecoProdutoServico,
} from '@/features/produtos/preco-produto-servico/hooks';
import { useProdutoServicos } from '@/features/produtos/produto-servico/hooks';
import {
    precoProdutoServicoFormSchema,
    precoProdutoServicoUpdateSchema,
    PrecoProdutoServicoInput,
    PrecoProdutoServicoFormInput,
    PrecoProdutoServicoUpdateInput,
} from '@/features/produtos/preco-produto-servico/schema';
import { PrecoProdutoServico } from '@/features/produtos/preco-produto-servico/types';
import { precoProdutoServicoColumns, formatarMoeda } from './columns';
import {
    useReactTable, getCoreRowModel, getPaginationRowModel, flexRender,
    getSortedRowModel, getFilteredRowModel, ColumnFiltersState, SortingState, VisibilityState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus, CalendarIcon } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData, formatarDataBR, formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { cn } from '@/lib/utils';

import { useProdutos } from '@/features/produtos/produto/hooks';
import { useTiposServico } from '@/features/produtos/tipo-servico/hooks';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const DEFAULT_FORM: Partial<PrecoProdutoServicoFormInput> = {
    id_produto_servico: undefined,
    val_preco: '',
    dta_inicio: undefined,
};

// --- Formulário de CRIAÇÃO ---
function PrecoForm({
    onSubmit,
    submitting,
    opcoesProdutoServico,
}: {
    onSubmit: (data: PrecoProdutoServicoInput) => void;
    submitting?: boolean;
    opcoesProdutoServico: { id: number; label: string }[];
}) {
    const { control, handleSubmit, formState: { errors } } = useForm<PrecoProdutoServicoFormInput>({
        resolver: zodResolver(precoProdutoServicoFormSchema),
        defaultValues: DEFAULT_FORM,
    });

    // Converte o formulário (Date) para o formato que a API espera (dd-mm-aaaa string)
    const handleFormSubmit = (data: PrecoProdutoServicoFormInput) => {
        onSubmit({
            id_produto_servico: data.id_produto_servico,
            val_preco: data.val_preco,
            dta_inicio: format(data.dta_inicio, 'dd-MM-yyyy'),
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>Produto/Serviço</Label>
                <Controller
                    name="id_produto_servico"
                    control={control}
                    render={({ field }) => {
                        const labelSelecionado = field.value
                            ? opcoesProdutoServico.find((p) => p.id === field.value)?.label
                            : undefined;
                        return (
                            <Select
                                value={field.value ? String(field.value) : ''}
                                onValueChange={(value) => field.onChange(Number(value))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o produto/serviço" className="truncate whitespace-nowrap overflow-hidden">
                                        {labelSelecionado}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-w-[90vw] sm:max-w-md">
                                    {opcoesProdutoServico.map((op) => (
                                        <SelectItem key={op.id} value={String(op.id)} className="max-w-full">
                                            <Tooltip>
                                                <TooltipTrigger
                                                    render={
                                                        <span className="truncate block w-full">
                                                            {op.label}
                                                        </span>
                                                    }
                                                />
                                                <TooltipContent side="right" className="max-w-xs break-words">
                                                    {op.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }}
                />
                {errors.id_produto_servico && (
                    <p className="text-sm text-destructive">{errors.id_produto_servico.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Preço</Label>
                <Controller
                    name="val_preco"
                    control={control}
                    render={({ field }) => (
                        // <Input {...field} placeholder="Ex: 2.50" />
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
                {errors.val_preco && (
                    <p className="text-sm text-destructive">{errors.val_preco.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Início de Vigência</Label>
                <Controller
                    name="dta_inicio"
                    control={control}
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecione a data'}
                                    </Button>
                                }
                            />
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    locale={ptBR}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.dta_inicio && (
                    <p className="text-sm text-destructive">{errors.dta_inicio.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>Salvar</Button>
            </DialogFooter>
        </form>
    );
}

// --- Formulário de EDIÇÃO (somente val_preco editável) ---
function PrecoUpdateForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    produtoServicoLabel,
    produtoServicoId,
    dtaInicio,
}: {
    defaultValues: PrecoProdutoServicoUpdateInput;
    onSubmit: (data: PrecoProdutoServicoUpdateInput) => void;
    submitting?: boolean;
    readOnlyId: number;
    produtoServicoLabel: string;
    produtoServicoId: number;
    dtaInicio: string;
}) {
    const { control, handleSubmit, formState: { errors } } = useForm<PrecoProdutoServicoUpdateInput>({
        resolver: zodResolver(precoProdutoServicoUpdateSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>ID</Label>
                <Input value={readOnlyId} disabled />
            </div>

            <div className="space-y-1">
                <Label>Produto/Serviço</Label>
                <Select value={String(produtoServicoId)} disabled>
                    <SelectTrigger className="w-full">
                        <SelectValue className="truncate whitespace-nowrap overflow-hidden">
                            {produtoServicoLabel}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={String(produtoServicoId)} className="max-w-full">
                            <span className="truncate block w-full">{produtoServicoLabel}</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <Label>Início de Vigência</Label>
                <Input value={formatarDataBR(dtaInicio)} disabled />
            </div>

            <div className="space-y-1">
                <Label>Preço</Label>
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
                                value={formatarMoedaInput(field.value)}
                                onChange={(e) => field.onChange(parseMoedaInput(e.target.value))}
                            />
                        </InputGroup>
                    )}
                />
                {errors.val_preco && (
                    <p className="text-sm text-destructive">{errors.val_preco.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>Salvar</Button>
            </DialogFooter>
        </form>
    );
}

export default function PrecoProdutoServicoPage() {
    const { data: precosRaw, isLoading, error } = usePrecoProdutoServicos();
    const { data: produtoServicosRaw } = useProdutoServicos();
    const { data: produtosRaw } = useProdutos();
    const { data: tiposServicoRaw } = useTiposServico();

    const precos = useMemo(
        () => (Array.isArray(precosRaw?.dados) ? precosRaw.dados : []),
        [precosRaw]
    );

    const produtoMap = useMemo(() => {
        const lista = Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : [];
        return lista.reduce<Record<number, string>>((acc, p) => {
            acc[p.id] = p.nom_produto;
            return acc;
        }, {});
    }, [produtosRaw]);

    const tipoServicoMap = useMemo(() => {
        const lista = Array.isArray(tiposServicoRaw?.dados) ? tiposServicoRaw.dados : [];
        return lista.reduce<Record<number, string>>((acc, t) => {
            acc[t.id] = t.des_tipo_ajuste;
            return acc;
        }, {});
    }, [tiposServicoRaw]);

    const produtoServicoMap = useMemo(() => {
        const lista = Array.isArray(produtoServicosRaw?.dados) ? produtoServicosRaw.dados : [];
        return lista.reduce<Record<number, string>>((acc, ps) => {
            const nomeProduto = produtoMap[ps.id_produto] ?? `Produto #${ps.id_produto}`;
            const descTipo = tipoServicoMap[ps.id_tipo_servico] ?? `Tipo #${ps.id_tipo_servico}`;
            acc[ps.id] = `${nomeProduto} - ${descTipo}`;
            return acc;
        }, {});
    }, [produtoServicosRaw, produtoMap, tipoServicoMap]);

    const opcoesProdutoServico = useMemo(
        () => Object.entries(produtoServicoMap).map(([id, label]) => ({ id: Number(id), label })),
        [produtoServicoMap]
    );

    const criarMutation = useCriarPrecoProdutoServico();
    const [precoSelecionado, setPrecoSelecionado] = useState<PrecoProdutoServico | null>(null);
    const atualizarMutation = useAtualizarPrecoProdutoServico(precoSelecionado?.id ?? 0);
    const deletarMutation = useDeletarPrecoProdutoServico();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [precoParaDeletar, setPrecoParaDeletar] = useState<PrecoProdutoServico | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return precoProdutoServicoColumns
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
        setColumnFilters(filterField && value ? [{ id: filterField, value }] : []);
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: precos,
        columns: precoProdutoServicoColumns,
        state: { columnFilters, sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        meta: {
            produtoServicoMap,
            onView: (preco: PrecoProdutoServico) => {
                setPrecoSelecionado(preco);
                setDialogVisualizarAberto(true);
            },
            onEdit: (preco: PrecoProdutoServico) => {
                setPrecoSelecionado(preco);
                setDialogEditarAberto(true);
            },
            onDelete: (preco: PrecoProdutoServico) => {
                setPrecoParaDeletar(preco);
            },
        },
    });

    const handleCriar = (data: PrecoProdutoServicoInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Preço cadastrado com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) toast.error(error.message);
                else toast.error('Erro inesperado ao cadastrar o preço.');
            },
        });
    };

    const handleAtualizar = (data: PrecoProdutoServicoUpdateInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setPrecoSelecionado(null);
                toast.success('Preço atualizado com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) toast.error(error.message);
                else toast.error('Erro inesperado ao atualizar o preço.');
            },
        });
    };

    const confirmarDelecao = () => {
        if (!precoParaDeletar) return;
        deletarMutation.mutate(precoParaDeletar.id, {
            onSuccess: () => {
                setPrecoParaDeletar(null);
                toast.success('Preço deletado com sucesso!');
            },
            onError: (error) => {
                setPrecoParaDeletar(null);
                if (error instanceof ApiError) toast.error(error.message);
                else toast.error('Erro inesperado ao deletar o preço.');
            },
        });
    };

    if (error) return <div>Erro ao carregar preços.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Preço x Produto/Serviço</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Preço
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Preço Produto/Serviço</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo preço.
                            </DialogDescription>
                        </DialogHeader>
                        <PrecoForm
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesProdutoServico={opcoesProdutoServico}
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
                            {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
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
                                {filterOptions.find((o) => o.value === filterField)?.label || 'Campo'}
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar</Button>
                </div>
            )}

            <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'}`}>
                <CardContent className="p-0">
                    <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]' : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'}`}>
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
                                    <TableSkeleton columnsCount={precoProdutoServicoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={precoProdutoServicoColumns.length} className="text-center py-4">
                                            Nenhum preço encontrado.
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
                    if (!open) setPrecoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preço Produto/Serviço</DialogTitle>
                        <DialogDescription>Atualize o valor do preço.</DialogDescription>
                    </DialogHeader>
                    {precoSelecionado && (
                        <PrecoUpdateForm
                            defaultValues={{ val_preco: Number(precoSelecionado.val_preco).toFixed(2) }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={precoSelecionado.id}
                            produtoServicoId={precoSelecionado.id_produto_servico}
                            produtoServicoLabel={
                                produtoServicoMap[precoSelecionado.id_produto_servico] ??
                                String(precoSelecionado.id_produto_servico)
                            }
                            dtaInicio={precoSelecionado.dta_inicio}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setPrecoSelecionado(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preço Produto/Serviço</DialogTitle>
                        <DialogDescription>Detalhes do preço selecionado.</DialogDescription>
                    </DialogHeader>
                    {precoSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={precoSelecionado.id} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <Label>Produto/Serviço</Label>
                                    <Input
                                        value={produtoServicoMap[precoSelecionado.id_produto_servico] ?? precoSelecionado.id_produto_servico}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Preço</Label>
                                    <Input value={formatarMoeda(precoSelecionado.val_preco)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Início de Vigência</Label>
                                    <Input value={formatarDataBR(precoSelecionado.dta_inicio)} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input value={precoSelecionado.created_at ? formatarData(precoSelecionado.created_at) : '-'} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input value={precoSelecionado.updated_at ? formatarData(precoSelecionado.updated_at) : '-'} disabled />
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
            <AlertDialog open={!!precoParaDeletar} onOpenChange={(open) => !open && setPrecoParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar preço</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este registro de preço? Essa ação não pode ser desfeita.
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
