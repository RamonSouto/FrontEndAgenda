// src/app/(private)/agendamentos/agendamento/[id]/botao-relatorio.tsx
'use client';

import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { AgendamentoDetalhe } from '@/features/agendamentos/agendamento/types';
import { useRelatorioAgendamento } from '@/features/agendamentos/agendamento/pdf/use-relatorio-agendamento';

export function BotaoRelatorioAgendamento({ agendamento }: { agendamento: AgendamentoDetalhe }) {
    const { gerar, gerando, pronto } = useRelatorioAgendamento(agendamento);

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={!pronto || gerando}
            onClick={() => gerar().catch(() => toast.error('Não foi possível gerar o PDF'))}
        >
            <FileDown className="h-4 w-4" />
            {gerando ? 'Gerando...' : 'Gerar PDF'}
        </Button>
    );
}
