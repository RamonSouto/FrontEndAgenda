// app/(private)/parametros/Template/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Pencil } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';
import { EVENTOS_TEMPLATE_LABEL, TemplateEmailLinha } from '@/features/parametrizacao/template/types';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onPreview?: (data: TData) => void;
        onEdit?: (data: TData) => void;
    }
    // Classes responsivas por coluna (mobile first)
    interface ColumnMeta<TData, TValue> {
        className?: string;
    }
}

export const templateColumns: ColumnDef<TemplateEmailLinha>[] = [
    {
        accessorKey: 'ind_evento',
        header: 'Evento',
        cell: ({ row }) => (
            <div className="min-w-[140px] font-medium">
                {EVENTOS_TEMPLATE_LABEL[row.original.ind_evento]}
            </div>
        ),
        meta: { label: 'Evento' },
    },
    {
        accessorKey: 'des_assunto',
        header: 'Assunto',
        cell: ({ row }) => row.original.des_assunto || '-',
        meta: { label: 'Assunto', className: 'hidden md:table-cell' },
    },
    {
        accessorKey: 'ind_ativo',
        header: 'Status',
        cell: ({ row }) => {
            const t = row.original;
            if (!t.configurado) return <Badge variant="outline">Não configurado</Badge>;
            return t.ind_ativo === 1 ? (
                <Badge>Ativo</Badge>
            ) : (
                <Badge variant="secondary">Inativo</Badge>
            );
        },
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'updated_at',
        header: 'Editado',
        cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
        meta: { label: 'Editado', className: 'hidden lg:table-cell' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const template = row.original;
            const meta = table.options.meta;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Ações">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem
                            disabled={!template.configurado}
                            onClick={() => meta?.onPreview?.(template)}
                        >
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(template)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {template.configurado ? 'Editar' : 'Cadastrar'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
