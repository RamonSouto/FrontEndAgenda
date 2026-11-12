// app/(private)/produtos/grade/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { GradeProduto } from '@/features/produtos/grade/types';
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
        tamanhosMap?: Record<number, string>;
        variacoesMap?: Record<number, string>;
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

function formatarPreco(valor: string | null): string {
    if (!valor) return '-';
    const numero = Number(valor);
    if (isNaN(numero)) return '-';
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const gradeProdutoColumns: ColumnDef<GradeProduto>[] = [
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
    },
    {
        accessorKey: 'id_variacao_cor_estampa',
        header: ({ column }) => <SortableHeader column={column} label="Cor/Estampa" />,
        cell: ({ row, table }) => {
            const idVariacao = row.original.id_variacao_cor_estampa;
            if (!idVariacao) return <Badge variant="secondary">Sem variação</Badge>;
            const nome = table.options.meta?.variacoesMap?.[idVariacao];
            return nome ?? idVariacao;
        },
        meta: { label: 'Cor/Estampa' },
    },
    {
        accessorKey: 'id_tamanho',
        header: ({ column }) => <SortableHeader column={column} label="Tamanho" />,
        cell: ({ row, table }) => {
            const idTamanho = row.original.id_tamanho;
            const nome = table.options.meta?.tamanhosMap?.[idTamanho];
            return nome ?? idTamanho;
        },
        meta: { label: 'Tamanho' },
    },
    {
        accessorKey: 'num_sku',
        header: ({ column }) => <SortableHeader column={column} label="SKU" />,
        cell: ({ row }) => row.original.num_sku ?? '-',
        meta: { label: 'SKU' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'val_preco_variacao',
        header: ({ column }) => <SortableHeader column={column} label="Preço" />,
        cell: ({ row }) => formatarPreco(row.original.val_preco_variacao),
        meta: { label: 'Preço' },
    },
    {
        accessorKey: 'num_codigo_barras',
        header: ({ column }) => <SortableHeader column={column} label="Cód. Barras" />,
        cell: ({ row }) => row.original.num_codigo_barras ?? '-',
        meta: { label: 'Cód. Barras' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) => (
            <Badge variant={row.original.ind_ativo === 1 ? 'default' : 'destructive'}>
                {row.original.ind_ativo === 1 ? 'Ativo' : 'Inativo'}
            </Badge>
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
            const grade = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(grade)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(grade)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(grade)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
