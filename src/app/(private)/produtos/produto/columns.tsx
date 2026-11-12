// src/app/(private)/produtos/produto/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Produto } from '@/features/produtos/produto/types';
import { formatarData } from '@/lib/utils/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function SortableHeader({ label, column }: { label: string; column: any }) {
    return (
        <Button
            variant="ghost"
            className="p-0 h-auto font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
    );
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const columns: ColumnDef<Produto>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader label="ID" column={column} />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_produto',
        header: ({ column }) => <SortableHeader label="Nome" column={column} />,
        meta: { label: 'Nome' },
    },
    {
        id: 'preview',
        header: 'Imagem',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            const url = meta?.imagemPrincipalMap?.[row.original.id];

            if (!url) {
                return (
                    <div className="h-12 w-12 rounded border bg-muted/30 flex items-center justify-center text-muted-foreground text-xs">
                        N/A
                    </div>
                );
            }

            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={`${BASE_URL}/uploads/${url}`}
                    alt="Imagem do produto"
                    className="h-12 w-12 rounded object-cover border"
                />
            );
        },
        meta: { label: 'Imagem' },
        enableSorting: false,

    },
    {
        accessorKey: 'categoria',
        header: 'Categoria',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            const categoria = meta?.categoriasMap?.[row.original.id_categoria];

            return (<span>{categoria}</span>)
        },
        meta: { label: 'Categoria' },
        enableSorting: true,
    },
    {
        accessorKey: 'num_sku',
        header: ({ column }) => <SortableHeader label="SKU" column={column} />,
        meta: { label: 'SKU' },
        cell: ({ row }) => row.original.num_sku ?? '-',
    },
    {
        accessorKey: 'ref_produto',
        header: ({ column }) => <SortableHeader label="Referência" column={column} />,
        meta: { label: 'Referência' },
        cell: ({ row }) => row.original.ref_produto ?? '-',
    },
    {
        accessorKey: 'val_preco_base',
        header: ({ column }) => <SortableHeader label="Preço Base" column={column} />,
        meta: { label: 'Preço Base' },
        cell: ({ row }) => {
            const valor = Number(row.original.val_preco_base);
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        },
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader label="Status" column={column} />,
        meta: { label: 'Status' },
        cell: ({ row }) =>
            row.original.ind_ativo === 1 ? (
                <Badge variant="default">Ativo</Badge>
            ) : (
                <Badge variant="secondary">Inativo</Badge>
            ),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader label="Criado em" column={column} />,
        meta: { label: 'Criado em' },
        cell: ({ row }) => formatarData(row.original.created_at),
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader label="Atualizado em" column={column} />,
        meta: { label: 'Atualizado em' },
        cell: ({ row }) =>
            row.original.updated_at ? formatarData(row.original.updated_at) : '-',
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
