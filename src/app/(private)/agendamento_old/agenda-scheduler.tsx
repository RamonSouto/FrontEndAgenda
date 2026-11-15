// src/app/(private)/agendamentos/agendamento/agenda-scheduler.tsx
'use client';

import { useMemo, useState } from 'react';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import {
    ScheduleComponent,
    ViewsDirective,
    ViewDirective,
    ResourcesDirective,
    ResourceDirective,
    Day,
    Week,
    Month,
    Inject,
    DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import type {
    ActionEventArgs,
    EventClickArgs,
    PopupOpenEventArgs,
} from '@syncfusion/ej2-react-schedule';
// Confirme o caminho do tema na versão instalada
import '@/styles/syncfusion/tailwind3.css';

import { AgendamentoResumo } from '@/features/agendamentos/agendamento/types';

const licenca = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE;
if (licenca) registerLicense(licenca);

// Rótulos em português sobre a cultura padrão (en-US), que não exige loadCldr.
// Meses/dias continuam em inglês até carregar o CLDR 'pt'.
L10n.load({
    'en-US': {
        schedule: {
            day: 'Dia',
            week: 'Semana',
            month: 'Mês',
            today: 'Hoje',
            noEvents: 'Sem agendamentos',
            allDay: 'Dia todo',
        },
    },
});

const DURACAO_MINUTOS = 30; // a API não tem hora final: slot fixo de 30 min

// Props estáticas fora do componente: objetos inline novos a cada render
// fazem o Syncfusion reprocessar o layout e podem deixar a grade vazia.
const WORK_HOURS = { highlight: true, start: '08:00', end: '18:00' };
const TIME_SCALE = { enable: true, interval: 60, slotCount: 4 };
const GROUP = { resources: ['Costureiras'] };

export interface CostureiraRecurso {
    id: number;
    nome: string;
    cor: string; // '#RRGGBB'
}

interface AgendaSchedulerProps {
    agendamentos: AgendamentoResumo[];
    costureiras: CostureiraRecurso[];
    onNovo: (inicio: Date, idCostureira?: number) => void;
    onSelecionar: (idAgendamento: number) => void;
    onMover: (idAgendamento: number, inicio: Date, idCostureira: number) => void;
}

export function AgendaScheduler({
    agendamentos,
    costureiras,
    onNovo,
    onSelecionar,
    onMover,
}: AgendaSchedulerProps) {
    // Data fixa: passar `new Date()` direto reiniciaria a navegação a cada render
    const [hoje] = useState(() => new Date());

    // Converte o payload da API no formato que o Scheduler entende
    const eventSettings = useMemo(
        () => ({
            dataSource: agendamentos
                .filter((a) => a.ind_status !== 'cancelado') // cancelado libera o slot
                .map((a) => {
                    const inicio = new Date(a.dta_agendamento);
                    return {
                        Id: a.id,
                        Subject: a.nom_paciente,
                        StartTime: inicio,
                        EndTime: a.dta_agendamento_to
                            ? new Date(a.dta_agendamento_to)
                            : new Date(inicio.getTime() + DURACAO_MINUTOS * 60_000),
                        IdCostureira: a.id_costureira,
                        Status: a.ind_status,
                    };
                }),
        }),
        [agendamentos]
    );

    // Drag & drop: cancelamos a alteração local e delegamos a API.
    // O Scheduler só muda quando o refetch do React Query trouxer o dado novo.
    function handleActionBegin(args: ActionEventArgs) {
        if (args.requestType !== 'eventChange') return;
        args.cancel = true;
        const alterado = (args.changedRecords?.[0] ?? args.data) as
            | Record<string, any>
            | undefined;
        if (!alterado) return;
        onMover(alterado.Id, new Date(alterado.StartTime), alterado.IdCostureira);
    }

    // Bloqueia o editor/quick-info nativos; duplo clique em célula vazia abre nosso dialog
    function handlePopupOpen(args: PopupOpenEventArgs) {
        if (args.type !== 'Editor' && args.type !== 'QuickInfo') return;
        args.cancel = true;
        const d = args.data as Record<string, any> | undefined;
        if (d && !d.Id) onNovo(new Date(d.StartTime), d.IdCostureira);
    }

    function handleEventClick(args: EventClickArgs) {
        args.cancel = true;
        onSelecionar((args.event as Record<string, any>).Id);
    }

    // Grupo por recurso com dataSource vazio deixa a grade em branco.
    const recursos = useMemo(() => {
        if (costureiras.length) return costureiras;
        const mapa = new Map<number, CostureiraRecurso>();
        agendamentos.forEach((a) => {
            if (!mapa.has(a.id_costureira)) {
                mapa.set(a.id_costureira, {
                    id: a.id_costureira,
                    nome: a.nom_costureira,
                    cor: a.val_cor_costureira ? `#${a.val_cor_costureira}` : '#94a3b8',
                });
            }
        });
        return [...mapa.values()];
    }, [costureiras, agendamentos]);

    if (!recursos.length) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                Nenhuma costureira disponível para exibir a agenda.
            </div>
        );
    }

    return (
        <ScheduleComponent
            key={recursos.map((r) => r.id).join('-')}
            height="720px"
            width="100%"
            currentView="Day"
            selectedDate={hoje}
            startHour="07:00"
            endHour="20:00"
            workHours={WORK_HOURS}
            timeScale={TIME_SCALE}
            showQuickInfo={false}
            eventSettings={eventSettings}
            group={GROUP}
            actionFailure={(e) => console.error('[Scheduler] actionFailure', e)}
            actionBegin={handleActionBegin}
            popupOpen={handlePopupOpen}
            eventClick={handleEventClick}
        >
            <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="Month" />
            </ViewsDirective>
            <ResourcesDirective>
                <ResourceDirective
                    field="IdCostureira"
                    title="Costureira"
                    name="Costureiras"
                    dataSource={recursos}
                    textField="nome"
                    idField="id"
                    colorField="cor"
                />
            </ResourcesDirective>
            {/* Resize fica fora de propósito: a duração é fixa */}
            <Inject services={[Day, Week, Month, DragAndDrop]} />
        </ScheduleComponent>
    );
}
