// app/(private)/parametros/empresa/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
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
import { useEmpresas, useDeletarEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { getEmpresaColumns, empresaDefaultVisibility } from './columns';
import { EmpresaFormDialog } from './EmpresaFormDialog';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { useEstados } from '@/features/parametrizacao/estados/hooks';

export default function EmpresaPage() {
    const { data: empresasRaw, isLoading, error } = useEmpresas();
    const { data: cidadesRaw } = useCidades();
    const { data: estadosRaw } = useEstados();

    const deletarEmpresa = useDeletarEmpresa();

    const cidades = useMemo(() => (Array.isArray(cidadesRaw?.dados) ? cidadesRaw?.dados : []), [cidadesRaw]);
    const estados = useMemo(() => (Array.isArray(estadosRaw?.dados) ? estadosRaw?.dados : []), [estadosRaw]);

    const cidadesMap = useMemo(() => {
        const map = new Map<number, any>();
        cidades.forEach((c: any) => map.set(c.id, c));
        return map;
    }, [cidades]);

    const empresas = useMemo(() => {
        const lista = (Array.isArray(empresasRaw?.dados) ? empresasRaw.dados : []).filter(empresas => empresas.deleted_at === null);
        return lista.map((empresa) => {
            const cidade = cidadesMap.get(empresa.id_cidade);
            return {
                ...empresa,
                nom_cidade: cidade?.nom_cidade ?? '',
                nom_estado: cidade?.nom_estado ?? '',
                sgl_estado: cidade?.sgl_estado ?? '',
            };
        });
    }, [empresasRaw, cidadesMap]);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(empresaDefaultVisibility);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    // Dialogs
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Empresa | null>(null);

    const columns = useMemo(
        () =>
            getEmpresaColumns({
                onView: (empresa) => {
                    setSelectedEmpresa(empresa);
                    setFormMode('edit');
                    setFormOpen(true);
                },
                onEdit: (empresa) => {
                    setSelectedEmpresa(empresa);
                    setFormMode('edit');
                    setFormOpen(true);
                },
                onDelete: (empresa) => setDeleteTarget(empresa),
            }),
        []
    );

    // Opções do dropdown de filtro (exclui ID e Ação)
    const filterOptions = useMemo(() => {
        const permitidos = ['nom_razao_social', 'nom_fantasia', 'num_cnpj', 'num_inscricao_estadual', 'nom_cidade', 'nom_estado', 'sgl_estado'];
        return columns
            .filter((col: any) => col.accessorKey && permitidos.includes(col.accessorKey))
            .map((col: any) => ({
                value: col.accessorKey as string,
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
        data: empresas,
        columns,
        state: {
            columnFilters,
            sorting,
            pagination,
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    if (error) return <div>Erro ao carregar empresas.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Empresas</div>

            {/* Botões de ação */}
            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                        setSelectedEmpresa(null);
                        setFormMode('create');
                        setFormOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Nova Empresa
                </Button>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-1"
                    >
                        <Funnel className="h-4 w-4" />
                        Filtros
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger render={(
                            <Button variant="outline" size="sm" className="gap-1">
                                <Columns className="h-4 w-4" />
                                Colunas
                            </Button>
                        )} />
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

            {/* Filtro avançado (toggle) */}
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

            {/* Card com tabela */}
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
                                    <TableSkeleton columnsCount={columns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4">
                                            Nenhuma empresa encontrada.
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

            <EmpresaFormDialog
                open={formOpen}
                mode={formMode}
                empresa={selectedEmpresa}
                onOpenChange={setFormOpen}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir empresa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a empresa "{deleteTarget?.nom_fantasia}"? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (deleteTarget) {
                                    await deletarEmpresa.mutateAsync(deleteTarget.id);
                                    setDeleteTarget(null);
                                }
                            }}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
