// app/(private)/produtos/produto-servico/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { ProdutoServico } from '@/features/produtos/produto-servico/types';
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
        produtosMap?: Record<number, string>;
        tiposServicoMap?: Record<number, string>;
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

export const produtoServicoColumns: ColumnDef<ProdutoServico>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'id_produto',
        header: ({ column }) => <SortableHeader column={column} label="Produto" />,
        cell: ({ row, table }) => {
            const idProduto = row.original.id_produto;
            const nome = table.options.meta?.produtosMap?.[idProduto];
            return nome ?? idProduto;
        },
        meta: { label: 'Produto' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'id_tipo_servico',
        header: ({ column }) => <SortableHeader column={column} label="Tipo de Serviço" />,
        cell: ({ row, table }) => {
            const idTipo = row.original.id_tipo_servico;
            const nome = table.options.meta?.tiposServicoMap?.[idTipo];
            return nome ?? idTipo;
        },
        meta: { label: 'Tipo de Serviço' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader column={column} label="Situação" />,
        cell: ({ row }) =>
            row.original.ind_ativo ? (
                <Badge variant="default">Ativo</Badge>
            ) : (
                <Badge variant="destructive">Inativo</Badge>
            ),
        meta: { label: 'Situação' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => (row.original.created_at ? formatarData(row.original.created_at) : '-'),
        meta: { label: 'Criado' },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader column={column} label="Editado" />,
        cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
        meta: { label: 'Editado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const produtoServico = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(produtoServico)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(produtoServico)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(produtoServico)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
