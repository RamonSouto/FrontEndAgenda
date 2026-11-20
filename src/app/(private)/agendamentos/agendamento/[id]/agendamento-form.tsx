// src/app/(private)/agendamentos/agendamento/[id]/agendamento-form.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from '@/components/ui/combobox';

import {
    agendamentoSchema,
    agendamentoEdicaoSchema,
    AgendamentoInput,
} from '@/features/agendamentos/agendamento/schema';
import { useAgendamentos } from '@/features/agendamentos/agendamento/hooks';
import {
    gerarHorarios,
    hojeLocal,
    tipoDiaDe,
    paraMinutos,
} from '@/features/agendamentos/agendamento/slots';
import { useHorarios } from '@/features/parametrizacao/horario/hooks';
import type { Pessoa } from '@/features/pessoas/types';

interface AgendamentoFormProps {
    defaultValues: AgendamentoInput;
    onSubmit: (values: AgendamentoInput) => void;
    submitting?: boolean;
    opcoesPacientes: Pessoa[];
    opcoesCostureiras: Pessoa[];
    opcoesMedicos: Pessoa[];
    /** Modo edição: data original ("YYYY-MM-DD HH:mm:ss"). Só valida "futura" se a data mudar. */
    dataOriginal?: string;
    /** Modo edição: id do agendamento atual (para não contar o próprio horário como ocupado). */
    idAtual?: number;
}

// Monta "YYYY-MM-DD HH:mm:ss" (formato da API) a partir de data + hora
const montar = (data: string, hora: string) => (data && hora ? `${data} ${hora}:00` : '');

function Campo({ label, erro, children }: { label: string; erro?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>
    );
}

interface PessoaComboboxProps {
    value: number | null | undefined;
    onChange: (id: number | null) => void;
    opcoes: Pessoa[];
    placeholder: string;
    invalid?: boolean;
}

// Base UI trabalha com o objeto selecionado; aqui convertemos id <-> Pessoa
function PessoaCombobox({ value, onChange, opcoes, placeholder, invalid }: PessoaComboboxProps) {
    const selecionada = opcoes.find((p) => p.id === value) ?? null;

    return (
        <Combobox
            items={opcoes}
            value={selecionada}
            onValueChange={(p: Pessoa | null) => onChange(p?.id ?? null)}
            itemToStringLabel={(p: Pessoa) => p.nom_completo}
            isItemEqualToValue={(a: Pessoa, b: Pessoa) => a.id === b.id}
        >
            <ComboboxInput
                placeholder={placeholder}
                showClear={!!selecionada}
                aria-invalid={invalid}
                className="w-full"
            />
            <ComboboxContent>
                <ComboboxEmpty>Nenhum resultado.</ComboboxEmpty>
                <ComboboxList>
                    {(p: Pessoa) => (
                        <ComboboxItem key={p.id} value={p}>
                            {p.nom_completo}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export function AgendamentoForm({
    defaultValues,
    onSubmit,
    submitting,
    opcoesPacientes,
    opcoesCostureiras,
    opcoesMedicos,
    dataOriginal,
    idAtual,
}: AgendamentoFormProps) {
    const schema = useMemo(
        () => (dataOriginal ? agendamentoEdicaoSchema(dataOriginal) : agendamentoSchema),
        [dataOriginal]
    );

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<AgendamentoInput>({
        resolver: zodResolver(schema) as Resolver<AgendamentoInput>,
        defaultValues,
    });

    // Parte "data" do campo (YYYY-MM-DD) fica separada para permitir data sem hora
    const [data, setData] = useState(defaultValues.dta_agendamento.slice(0, 10));
    const [aviso, setAviso] = useState<string | null>(null);

    // O dialog reaproveita o componente: ressincroniza quando data/costureira vêm do clique na agenda
    useEffect(() => {
        reset(defaultValues);
        setData(defaultValues.dta_agendamento.slice(0, 10));
        setAviso(null);
    }, [defaultValues, reset]);

    const dta = useWatch({ control, name: 'dta_agendamento' }) ?? '';
    const idCostureira = useWatch({ control, name: 'id_costureira' });
    const hora = dta.slice(11, 16);

    // ---- dados para montar a lista de horários ----
    const { data: horariosRes } = useHorarios();
    const { data: agendRes } = useAgendamentos({
        id_costureira: idCostureira || undefined,
        limite: 100,
    });

    const horarios = useMemo(() => {
        let lista = gerarHorarios(data, horariosRes?.dados ?? []);

        // hoje: remove horários que já passaram
        if (data === hojeLocal()) {
            const n = new Date();
            const agora = n.getHours() * 60 + n.getMinutes();
            lista = lista.filter((h) => paraMinutos(h) > agora);
        }

        // remove horários já ocupados pela costureira escolhida
        if (idCostureira && Array.isArray(agendRes?.dados)) {
            const ocupados = new Set(
                agendRes.dados
                    .filter(
                        (a) =>
                            a.id !== idAtual &&
                            (a.ind_status as string) !== 'cancelado' &&
                            a.dta_agendamento.startsWith(data)
                    )
                    .map((a) => a.dta_agendamento.slice(11, 16))
            );
            lista = lista.filter((h) => !ocupados.has(h));
        }

        // edição: mantém o horário original visível mesmo fora da parametrização
        if (dataOriginal && data === dataOriginal.slice(0, 10)) {
            const original = dataOriginal.slice(11, 16);
            if (!lista.includes(original)) lista = [...lista, original].sort();
        }

        return lista;
    }, [data, horariosRes, agendRes, idCostureira, idAtual, dataOriginal]);

    // Limpa a hora se deixou de ser válida (trocou data ou costureira).
    // Só roda depois que a parametrização carregou, para não apagar a hora vinda da agenda.
    useEffect(() => {
        if (!horariosRes) return;
        if (hora && !horarios.includes(hora)) setValue('dta_agendamento', '');
    }, [hora, horarios, horariosRes, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Campo label="Paciente" erro={errors.id_paciente?.message}>
                <Controller
                    control={control}
                    name="id_paciente"
                    render={({ field }) => (
                        <PessoaCombobox
                            value={field.value}
                            onChange={(id) => field.onChange(id ?? 0)}
                            opcoes={opcoesPacientes}
                            placeholder="Buscar paciente..."
                            invalid={!!errors.id_paciente}
                        />
                    )}
                />
            </Campo>

            <Campo label="Costureira" erro={errors.id_costureira?.message}>
                <Controller
                    control={control}
                    name="id_costureira"
                    render={({ field }) => (
                        <PessoaCombobox
                            value={field.value}
                            onChange={(id) => field.onChange(id ?? 0)}
                            opcoes={opcoesCostureiras}
                            placeholder="Buscar costureira..."
                            invalid={!!errors.id_costureira}
                        />
                    )}
                />
            </Campo>

            <Campo label="Médico(a)" erro={errors.id_medico?.message}>
                <Controller
                    control={control}
                    name="id_medico"
                    render={({ field }) => (
                        <PessoaCombobox
                            value={field.value}
                            onChange={field.onChange} // null ao limpar (campo opcional)
                            opcoes={opcoesMedicos}
                            placeholder="Buscar médico(a)..."
                            invalid={!!errors.id_medico}
                        />
                    )}
                />
            </Campo>

            <Campo label="Data e hora" erro={aviso ?? errors.dta_agendamento?.message}>
                <Controller
                    control={control}
                    name="dta_agendamento"
                    render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="date"
                                min={dataOriginal ? undefined : hojeLocal()}
                                value={data}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (v && tipoDiaDe(v) === null) {
                                        setAviso('Não há atendimento aos domingos.');
                                        setData('');
                                        field.onChange('');
                                        return;
                                    }
                                    setAviso(null);
                                    setData(v);
                                    field.onChange(montar(v, hora));
                                }}
                            />
                            <Select
                                value={hora}
                                onValueChange={(v) => field.onChange(montar(data, v ?? ''))}
                                disabled={!data || horarios.length === 0}
                            >
                                <SelectTrigger className="w-full">
                                    {hora ||
                                        (data && horarios.length === 0
                                            ? 'Sem horários livres'
                                            : 'Selecione o horário')}
                                </SelectTrigger>
                                <SelectContent>
                                    {horarios.map((h) => (
                                        <SelectItem key={h} value={h}>
                                            {h}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
            </Campo>

            <Campo label="Observações gerais" erro={errors.des_observacoes_geral?.message}>
                <textarea
                    {...register('des_observacoes_geral')}
                    rows={3}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                />
            </Campo>

            <Campo label="Observações da costureira" erro={errors.des_observacoes_costureira?.message}>
                <textarea
                    {...register('des_observacoes_costureira')}
                    rows={3}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                />
            </Campo>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
