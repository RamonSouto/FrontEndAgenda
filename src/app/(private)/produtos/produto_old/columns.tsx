// app/(private)/produtos/produto/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { Produto } from '@/features/produtos/produto/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
        categoriasMap?: Record<number, string>;
    }
}

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export const produtoColumns: ColumnDef<Produto>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_produto',
        header: ({ column }) => <SortableHeader column={column} label="Produto" />,
        meta: { label: 'Produto' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'num_sku',
        header: ({ column }) => <SortableHeader column={column} label="SKU" />,
        cell: ({ row }) => row.original.num_sku ?? '-',
        meta: { label: 'SKU' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'ref_produto',
        header: ({ column }) => <SortableHeader column={column} label="Referência" />,
        cell: ({ row }) => row.original.ref_produto ?? '-',
        meta: { label: 'Referência' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'id_categoria',
        header: ({ column }) => <SortableHeader column={column} label="Categoria" />,
        cell: ({ row, table }) => {
            const idCategoria = row.original.id_categoria;
            if (!idCategoria) return <Badge variant="secondary">Sem categoria</Badge>;
            const nome = table.options.meta?.categoriasMap?.[idCategoria];
            return nome ?? idCategoria;
        },
        meta: { label: 'Categoria' },
    },
    {
        accessorKey: 'val_preco_base',
        header: ({ column }) => <SortableHeader column={column} label="Preço Base" />,
        cell: ({ row }) => {
            const valor = Number(row.original.val_preco_base);
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        meta: { label: 'Preço Base' },
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) =>
            row.original.ind_ativo ? (
                <Badge>Ativo</Badge>
            ) : (
                <Badge variant="destructive">Inativo</Badge>
            ),
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => row.original.created_at ? formatarData(row.original.created_at) : '-',
        meta: { label: 'Criado' },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader column={column} label="Editado" />,
        cell: ({ row }) => row.original.updated_at ? formatarData(row.original.updated_at) : '-',
        meta: { label: 'Editado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const produto = row.original;
            const meta = table.options.meta;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => meta?.onView?.(produto)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(produto)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(produto)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
