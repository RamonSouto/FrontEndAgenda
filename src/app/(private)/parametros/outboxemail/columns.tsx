// src/app/(private)/parametros/OutBox/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle2, Clock, Eye, Loader2, MoreHorizontal, RotateCw, XCircle } from 'lucide-react';
import { EmailOutboxResumo, EmailStatus } from '@/features/parametros/outboxemail/types';
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onReprocessar?: (data: TData) => void;
    }
}

// Colunas exibidas apenas em telas LG (no MD a tabela fica enxuta)
export const COLUNAS_SOMENTE_LG = ['id', 'ind_evento', 'num_tentativas', 'id_agendamento', 'created_at'];

export const podeReprocessar = (status: EmailStatus) => status === 'falha';

export const formatarEvento = (evento: string) => {
    const texto = evento.replace(/_/g, ' ');
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const STATUS_CONFIG: Record<
    EmailStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string; icon: React.ElementType }
> = {
    pendente: { label: 'Pendente', variant: 'outline', icon: Clock },
    processando: { label: 'Processando', variant: 'secondary', icon: Loader2 },
    enviado: { label: 'Enviado', variant: 'default', className: 'bg-green-600 text-white', icon: CheckCircle2 },
    falha: { label: 'Falha', variant: 'destructive', icon: XCircle },
};

export function StatusBadge({ status }: { status: EmailStatus }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <Badge variant={cfg.variant} className={`gap-1 ${cfg.className ?? ''}`}>
            <Icon className={`h-3 w-3 ${status === 'processando' ? 'animate-spin' : ''}`} />
            {cfg.label}
        </Badge>
    );
}

export const outboxColumns: ColumnDef<EmailOutboxResumo>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'des_destinatario',
        header: 'Destinatário',
        cell: ({ row }) => (
            <span className="block max-w-[220px] truncate" title={row.original.des_destinatario}>
                {row.original.des_destinatario}
            </span>
        ),
        meta: { label: 'Destinatário' },
    },
    {
        accessorKey: 'des_assunto',
        header: 'Assunto',
        cell: ({ row }) => (
            <span className="block max-w-[240px] truncate" title={row.original.des_assunto}>
                {row.original.des_assunto}
            </span>
        ),
        meta: { label: 'Assunto' },
    },
    {
        accessorKey: 'ind_evento',
        header: 'Evento',
        cell: ({ row }) => formatarEvento(row.original.ind_evento),
        meta: { label: 'Evento' },
    },
    {
        accessorKey: 'id_agendamento',
        header: 'Agendamento',
        cell: ({ row }) => row.original.id_agendamento ?? '-',
        meta: { label: 'Agendamento' },
    },
    {
        accessorKey: 'ind_status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.ind_status} />,
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'num_tentativas',
        header: 'Tentativas',
        meta: { label: 'Tentativas' },
    },
    {
        accessorKey: 'dta_envio',
        header: 'Enviado em',
        cell: ({ row }) => (row.original.dta_envio ? formatarData(row.original.dta_envio) : '-'),
        meta: { label: 'Enviado em' },
    },
    {
        accessorKey: 'created_at',
        header: 'Criado',
        cell: ({ row }) => formatarData(row.original.created_at),
        meta: { label: 'Criado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const email = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(email)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        {podeReprocessar(email.ind_status) && (
                            <DropdownMenuItem onClick={() => meta?.onReprocessar?.(email)}>
                                <RotateCw className="mr-2 h-4 w-4" /> Reprocessar
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
