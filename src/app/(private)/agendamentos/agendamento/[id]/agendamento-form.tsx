// src/app/(private)/agendamento/[id]/agendamento-form.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

import {
    agendamentoSchema,
    agendamentoEdicaoSchema,
    AgendamentoInput,
} from '@/features/agendamentos/agendamento/schema';
import type { Pessoa } from '@/features/pessoas/types';

interface AgendamentoFormProps {
    defaultValues: AgendamentoInput;
    onSubmit: (values: AgendamentoInput) => void;
    submitting?: boolean;
    opcoesPacientes: Pessoa[];
    opcoesCostureiras: Pessoa[];
    /** Modo edição: data original ("YYYY-MM-DD HH:mm:ss"). Só valida "futura" se a data mudar. */
    dataOriginal?: string;
}

// API: "YYYY-MM-DD HH:mm:ss"  <->  input datetime-local: "YYYY-MM-DDTHH:mm"
const paraInput = (v: string) => (v ? v.replace(' ', 'T').slice(0, 16) : '');
const daInput = (v: string) => (v ? `${v.replace('T', ' ')}:00` : '');

function Campo({ label, erro, children }: { label: string; erro?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>
    );
}

export function AgendamentoForm({
    defaultValues,
    onSubmit,
    submitting,
    opcoesPacientes,
    opcoesCostureiras,
    dataOriginal,
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
        formState: { errors },
    } = useForm<AgendamentoInput>({
        resolver: zodResolver(schema) as Resolver<AgendamentoInput>,
        defaultValues,
    });

    // O dialog reaproveita o componente: ressincroniza quando data/costureira vêm do clique na agenda
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Campo label="Paciente" erro={errors.id_paciente?.message}>
                <Controller
                    control={control}
                    name="id_paciente"
                    render={({ field }) => (
                        <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                        >
                            <SelectTrigger className="w-full">
                                {opcoesPacientes.find((p) => p.id === field.value)?.nom_completo ??
                                    'Selecione o paciente'}
                            </SelectTrigger>
                            <SelectContent>
                                {opcoesPacientes.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.nom_completo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Campo>

            <Campo label="Costureira" erro={errors.id_costureira?.message}>
                <Controller
                    control={control}
                    name="id_costureira"
                    render={({ field }) => (
                        <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                        >
                            <SelectTrigger className="w-full">
                                {opcoesCostureiras.find((c) => c.id === field.value)?.nom_completo ??
                                    'Selecione a costureira'}
                            </SelectTrigger>
                            <SelectContent>
                                {opcoesCostureiras.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.nom_completo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Campo>

            <Campo label="Data e hora" erro={errors.dta_agendamento?.message}>
                <Controller
                    control={control}
                    name="dta_agendamento"
                    render={({ field }) => (
                        <Input
                            type="datetime-local"
                            step={1800} // passos de 30 min, igual à duração do slot
                            value={paraInput(field.value)}
                            onChange={(e) => field.onChange(daInput(e.target.value))}
                        />
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

            <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
