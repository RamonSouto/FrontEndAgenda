// src/app/(private)/agendamentos/agendamento/[id]/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

import { AgendamentoForm } from './agendamento-form';
import { ItemForm } from './item-form';
import { ItemCard, moeda, totalItem } from './item-card';
import { STATUS_LABEL } from '../columns';

import {
    useAgendamento,
    useAtualizarAgendamento,
} from '@/features/agendamentos/agendamento/hooks';
import {
    AgendamentoInput,
    AgendamentoUpdateInput,
    agendamentoUpdateSchema,
} from '@/features/agendamentos/agendamento/schema';
import { AgendamentoStatus } from '@/features/agendamentos/agendamento/types';
import { useCriarItemAgendamento } from '@/features/agendamentos/produto-agendamento/hooks';
import { usePessoasPorPapel } from '@/features/pessoas/hooks';
import { ApiError } from '@/lib/http/errors';

// "YYYY-MM-DD HH:mm:ss" em horário local
function paraDataHoraAPI(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
}

const msgErro = (e: unknown, padrao: string) => (e instanceof ApiError ? e.message : padrao);

export default function AgendamentoEditPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = Number(params.id);

    const { data, isLoading } = useAgendamento(id);
    const atualizar = useAtualizarAgendamento();
    const criarItem = useCriarItemAgendamento(id);

    const { data: costureirasRaw } = usePessoasPorPapel('costureira');
    const { data: pacientesRaw } = usePessoasPorPapel('paciente');

    const costureiras = useMemo(
        () =>
            (Array.isArray(costureirasRaw?.dados) ? costureirasRaw.dados : []).filter(
                (p) => p.deleted_at === null && p.ind_status === 'ativo'
            ),
        [costureirasRaw]
    );
    const pacientes = useMemo(
        () =>
            (Array.isArray(pacientesRaw?.dados) ? pacientesRaw.dados : []).filter(
                (p) => p.deleted_at === null && p.ind_status === 'ativo'
            ),
        [pacientesRaw]
    );

    const ag = data?.dados;

    const itens = useMemo(
        () => (ag?.itens ?? []).filter((i) => !i.deleted_at),
        [ag]
    );
    const totalGeral = useMemo(
        () =>
            itens
                .filter((i) => i.ind_status !== 'cancelado')
                .reduce((soma, i) => soma + totalItem(i), 0),
        [itens]
    );

    // Data original em horário local, no mesmo formato da API
    const dataOriginal = useMemo(
        () => (ag ? paraDataHoraAPI(new Date(ag.dta_agendamento)) : ''),
        [ag]
    );

    const formInicial: AgendamentoInput | null = useMemo(
        () =>
            ag
                ? {
                    id_paciente: ag.id_paciente,
                    id_costureira: ag.id_costureira,
                    id_secretaria: ag.id_secretaria,
                    dta_agendamento: dataOriginal,
                    des_observacoes_geral: ag.des_observacoes_geral ?? '',
                    des_observacoes_costureira: ag.des_observacoes_costureira ?? '',
                }
                : null,
        [ag, dataOriginal]
    );

    function handleSalvar(values: AgendamentoInput) {
        const { dta_agendamento, ...demais } = values;

        // Só envia a data se mudou (permite editar agendamentos passados)
        const payload: AgendamentoUpdateInput = {
            ...demais,
            ...(dta_agendamento !== dataOriginal ? { dta_agendamento } : {}),
        };

        const parsed = agendamentoUpdateSchema.safeParse(payload);
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);

        atualizar.mutate(
            { id, data: parsed.data },
            {
                onSuccess: () => toast.success('Agendamento atualizado'),
                onError: (e) => toast.error(msgErro(e, 'Não foi possível salvar')),
            }
        );
    }

    // Campos de ciclo de vida preenchidos conforme o novo status
    function handleStatus(status: AgendamentoStatus) {
        if (!ag || status === ag.ind_status) return;
        const agora = paraDataHoraAPI(new Date());
        const extra: AgendamentoUpdateInput = {};

        if (status === 'confirmado') extra.dta_confirmacao = agora;
        if (status === 'concluido') {
            extra.dta_conclusao = agora;
            extra.ind_paciente_compareceu = true;
        }
        if (status === 'falta') extra.ind_paciente_compareceu = false;
        if (status === 'cancelado') extra.dta_cancelamento = agora;

        atualizar.mutate(
            { id, data: { ind_status: status, ...extra } },
            {
                onSuccess: () => toast.success(`Status: ${STATUS_LABEL[status]}`),
                onError: (e) => toast.error(msgErro(e, 'Não foi possível alterar o status')),
            }
        );
    }

    // Deve rejeitar em caso de erro: o ItemForm só limpa os campos quando resolve
    async function handleAdicionarItem(values: Parameters<typeof criarItem.mutateAsync>[0]) {
        try {
            await criarItem.mutateAsync(values);
            toast.success('Item adicionado');
        } catch (e) {
            toast.error(msgErro(e, 'Não foi possível adicionar o item'));
            throw e;
        }
    }

    if (isLoading) return <div className="p-6 text-muted-foreground">Carregando...</div>;
    if (!ag || !formInicial) return <div className="p-6">Agendamento não encontrado.</div>;

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/agendamentos/agendamento')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Agendamento #{ag.id}</h1>
                        <p className="text-sm text-muted-foreground">
                            {ag.nom_paciente} · {ag.nom_costureira}
                        </p>
                    </div>
                    <Badge variant="secondary">{STATUS_LABEL[ag.ind_status]}</Badge>
                </div>

                <div className="min-w-[180px]">
                    <Select
                        value={ag.ind_status}
                        onValueChange={(v) => v && handleStatus(v as AgendamentoStatus)}
                        disabled={atualizar.isPending}
                    >
                        <SelectTrigger className="w-full">Alterar status</SelectTrigger>
                        <SelectContent>
                            {Object.entries(STATUS_LABEL).map(([valor, label]) => (
                                <SelectItem key={valor} value={valor}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dados */}
            <Card>
                <CardHeader>
                    <CardTitle>Dados do agendamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <AgendamentoForm
                        defaultValues={formInicial}
                        dataOriginal={dataOriginal}
                        onSubmit={handleSalvar}
                        submitting={atualizar.isPending}
                        opcoesPacientes={pacientes}
                        opcoesCostureiras={costureiras}
                    />
                </CardContent>
            </Card>

            {/* Itens */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Itens ({itens.length})</CardTitle>
                    <p className="text-sm">
                        Total: <strong>{moeda(totalGeral)}</strong>
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ItemForm onSubmit={handleAdicionarItem} submitting={criarItem.isPending} />

                    {itens.length ? (
                        <ul className="space-y-2">
                            {itens.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    idAgendamento={id}
                                    item={item}
                                    onErro={(msg) => toast.error(msg)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhum item adicionado.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
