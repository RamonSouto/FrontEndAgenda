// app/(private)/parametros/cidades/page.tsx
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
    SelectValue,
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { cidadeColumns } from './columns';
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
import { Columns, Funnel } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CidadesPage() {
    const { data: cidadesRaw, isLoading, error } = useCidades();
    const cidades = useMemo(() => (Array.isArray(cidadesRaw?.dados) ? cidadesRaw?.dados : []), [cidadesRaw]).sort((a, b) => a.nom_cidade.localeCompare(b.nom_cidade));

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    // Gerar opções do dropdown a partir das colunas (excluindo ID)
    const filterOptions = useMemo(() => {
        return cidadeColumns
            .filter((col) => col.accessorKey && col.id !== 'id') // remove ID
            .map((col) => ({
                value: col.accessorKey as string,
                label: col.meta?.label ?? col.id
                // label: typeof col.header === 'string' ? col.header : col.id,
            }));
    }, []);

    // Estado do filtro avançado
    const [filterField, setFilterField] = useState(filterOptions[0]?.value || ''); // padrão: Cidade
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (filterField && value) {
            setColumnFilters([{ id: filterField, value }]);
        } else {
            setColumnFilters([]);
        }
    };

    // Limpa o filtro
    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    // Configuração da tabela
    const table = useReactTable({
        data: cidades,
        columns: cidadeColumns,
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

    if (error) return <div>Erro ao carregar cidades.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <h1 className="text-2xl font-bold">Cidades</h1>

            {/* Botões de ação */}
            <div className="flex justify-end flex-wrap items-center gap-4 mb-4">
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
                    )}>

                    </DropdownMenuTrigger>
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
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'
                                }`}
                            value={filterValue}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                </div>
            )
            }

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
                                    <TableSkeleton columnsCount={cidadeColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={cidadeColumns.length} className="text-center py-4">
                                            Nenhuma cidade encontrada.
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
        </div >
    );
}