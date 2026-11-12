// src/features/pessoas/components/pessoa-papel-page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger,
} from '@/components/ui/select';
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    usePessoasPorPapel,
    useCriarPessoa,
    useAtualizarPessoa,
    useDeletarPessoa,
    useAtivarPessoa,
    useDesativarPessoa,
} from '@/features/pessoas/hooks';
import { PessoaInput } from '@/features/pessoas/schema';
import { Pessoa, TipoPapelPessoa } from '@/features/pessoas/types';
import {
    ColumnDef,
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
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { PessoaForm } from '@/components/pessoa-form';
import { buildDefaultForm } from '@/features/pessoas/components/default-form';

type PapelKey = 'ind_medico' | 'ind_secretaria' | 'ind_costureira' | 'ind_paciente' | 'ind_administrador';

interface Props {
    tipo: TipoPapelPessoa;
    papelKey: PapelKey;
    titulo: string; // ex: "Médicos"
    columns: ColumnDef<Pessoa>[];
}

export function PessoaPapelPage({ tipo, papelKey, titulo, columns }: Props) {
    const { data: pessoasResp, isLoading, error } = usePessoasPorPapel(tipo);
    const pessoas = useMemo(() => pessoasResp?.dados ?? [], [pessoasResp]);

    const criarMutation = useCriarPessoa();
    const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
    const atualizarMutation = useAtualizarPessoa(pessoaSelecionada?.id ?? 0);
    const deletarMutation = useDeletarPessoa();
    const ativarMutation = useAtivarPessoa();
    const desativarMutation = useDesativarPessoa();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    // Opções de filtro baseadas nas colunas visíveis (exceto id e ações)
    const filterOptions = useMemo(() => {
        return columns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));
    }, [columns]);

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
        data: pessoas,
        columns,
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
            onEdit: (pessoa: Pessoa) => {
                setPessoaSelecionada(pessoa);
                setDialogEditarAberto(true);
            },
            onDelete: (pessoa: Pessoa) => setPessoaParaDeletar(pessoa),
            onAtivar: (pessoa: Pessoa) => {
                ativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa ativada com sucesso!'),
                    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Erro ao ativar pessoa.'),
                });
            },
            onDesativar: (pessoa: Pessoa) => {
                desativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa desativada com sucesso!'),
                    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Erro ao desativar pessoa.'),
                });
            },
        },
    });

    const handleCriar = (data: PessoaInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Pessoa cadastrada com sucesso');
            },
            onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Erro inesperado ao cadastrar a pessoa.'),
        });
    };

    const handleAtualizar = (data: PessoaInput) => {
        const payload = { ...data };
        if (!payload.des_senha) delete payload.des_senha;

        atualizarMutation.mutate(payload, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setPessoaSelecionada(null);
                toast.success('Pessoa atualizada com sucesso!');
            },
            onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Erro inesperado ao atualizar a pessoa.'),
        });
    };

    const confirmarDelecao = () => {
        if (!pessoaParaDeletar) return;
        deletarMutation.mutate(pessoaParaDeletar.id, {
            onSuccess: () => {
                setPessoaParaDeletar(null);
                toast.success('Pessoa deletada com sucesso!');
            },
            onError: (e) => {
                setPessoaParaDeletar(null);
                toast.error(e instanceof ApiError ? e.message : 'Erro inesperado ao deletar a pessoa.');
            },
        });
    };

    if (error) return <div>Erro ao carregar {titulo.toLowerCase()}.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Pessoa</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova {titulo.replace(/s$/, '')}
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Pessoa</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova pessoa.
                            </DialogDescription>
                        </DialogHeader>
                        <PessoaForm
                            defaultValues={buildDefaultForm(papelKey)}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            papelFixo={papelKey}
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
                        <Select
                            value={filterField}
                            onValueChange={(value) => {
                                setFilterField(value);
                                setFilterValue('');
                                setColumnFilters([]);
                            }}
                        >
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
                                    <TableSkeleton columnsCount={columns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4">
                                            Nenhum(a) {titulo.toLowerCase()} encontrado(a).
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
                    if (!open) setPessoaSelecionada(null);
                }}
            >
                <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Pessoa</DialogTitle>
                        <DialogDescription>Preencha os campos corretamente para editar a pessoa.</DialogDescription>
                    </DialogHeader>
                    {pessoaSelecionada && (
                        <PessoaForm
                            defaultValues={{
                                id_cidade: pessoaSelecionada.id_cidade,
                                ind_status: pessoaSelecionada.ind_status,
                                nom_completo: pessoaSelecionada.nom_completo,
                                num_cpf: pessoaSelecionada.num_cpf,
                                num_rg: pessoaSelecionada.num_rg,
                                dta_nascimento: pessoaSelecionada.dta_nascimento?.slice(0, 10) ?? '',
                                des_logradouro: pessoaSelecionada.des_logradouro,
                                num_endereco: pessoaSelecionada.num_endereco,
                                des_complemento: pessoaSelecionada.des_complemento,
                                num_cep: pessoaSelecionada.num_cep,
                                nom_bairro: pessoaSelecionada.nom_bairro,
                                num_celular_1: pessoaSelecionada.num_celular_1,
                                ind_whatsapp_1: !!pessoaSelecionada.ind_whatsapp_1,
                                num_celular_2: pessoaSelecionada.num_celular_2,
                                ind_whatsapp_2: !!pessoaSelecionada.ind_whatsapp_2,
                                des_email_1: pessoaSelecionada.des_email_1,
                                des_email_2: pessoaSelecionada.des_email_2,
                                des_senha: '',
                                ind_medico: !!pessoaSelecionada.ind_medico,
                                ind_secretaria: !!pessoaSelecionada.ind_secretaria,
                                ind_costureira: !!pessoaSelecionada.ind_costureira,
                                ind_paciente: !!pessoaSelecionada.ind_paciente,
                                ind_administrador: !!pessoaSelecionada.ind_administrador,
                                val_cor_hex: pessoaSelecionada.val_cor_hex,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={pessoaSelecionada.id}
                            papelFixo={papelKey}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de deleção */}
            <AlertDialog open={!!pessoaParaDeletar} onOpenChange={(open) => !open && setPessoaParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar pessoa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta pessoa? Essa ação não pode ser desfeita.
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
