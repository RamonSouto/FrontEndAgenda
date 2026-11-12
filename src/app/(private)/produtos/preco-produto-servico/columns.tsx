// app/(private)/produtos/preco-produto-servico/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { PrecoProdutoServico } from '@/features/produtos/produto-servico/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData, formatarDataBR } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
        produtoServicoMap?: Record<number, string>;
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

export const formatarMoeda = (valor: string | number): string => {
    const num = Number(valor);
    if (isNaN(num)) return '-';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const precoProdutoServicoColumns: ColumnDef<PrecoProdutoServico>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'id_produto_servico',
        header: ({ column }) => <SortableHeader column={column} label="Produto/Serviço" />,
        cell: ({ row, table }) => {
            const id = row.original.id_produto_servico;
            const nome = table.options.meta?.produtoServicoMap?.[id];
            return nome ?? id;
        },
        meta: { label: 'Produto/Serviço' },
    },
    {
        accessorKey: 'val_preco',
        header: ({ column }) => <SortableHeader column={column} label="Preço" />,
        cell: ({ row }) => formatarMoeda(row.original.val_preco),
        meta: { label: 'Preço' },
    },
    {
        accessorKey: 'dta_inicio',
        header: ({ column }) => <SortableHeader column={column} label="Início de Vigência" />,
        cell: ({ row }) => formatarDataBR(row.original.dta_inicio),
        meta: { label: 'Início de Vigência' },
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
            const preco = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(preco)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(preco)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(preco)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
