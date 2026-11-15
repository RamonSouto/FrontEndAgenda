// src/app/(private)/agendamento/[id]/item-form.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import {
    agendamentoItemSchema,
    AgendamentoItemInput,
} from '@/features/agendamentos/produto-agendamento/schema';
import { useOpcoesItem, Opcao } from '@/features/agendamentos/produto-agendamento/use-opcoes-item';
import { formatarMoedaInput, parseMoedaInput } from '@/lib/utils/formatters';

/* ---------- componentes reutilizados pelo ItemCard ---------- */
export function SelectOpcao({
    value,
    onChange,
    opcoes,
    placeholder,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    opcoes: Opcao[];
    placeholder: string;
    disabled?: boolean;
}) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v ?? '')} disabled={disabled}>
            <SelectTrigger className="w-full">
                {opcoes.find((o) => o.value === value)?.label ?? placeholder}
            </SelectTrigger>
            <SelectContent>
                {opcoes.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <Input
            inputMode="numeric"
            value={formatarMoedaInput(value)}
            onChange={(e) => onChange(parseMoedaInput(e.target.value))}
        />
    );
}

export function Campo({
    label,
    erro,
    children,
}: {
    label: string;
    erro?: string | null;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>
    );
}

/* ---------- formulário de novo item ---------- */
const VAZIO: AgendamentoItemInput = {
    id_tipo_agendamento: 0,
    id_produto_grade: 0,
    id_produto_servico: 0,
    des_ajuste_produto: '',
    val_desconto_servico: 0,
};

interface ItemFormProps {
    // deve lançar erro se falhar (o form só limpa quando resolve)
    onSubmit: (values: AgendamentoItemInput) => Promise<unknown>;
    submitting?: boolean;
}

export function ItemForm({ onSubmit, submitting }: ItemFormProps) {
    const [idProduto, setIdProduto] = useState(0);
    const [erroProduto, setErroProduto] = useState<string | null>(null);
    const { tipos, produtos, grades, servicos, isLoading } = useOpcoesItem(idProduto);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<AgendamentoItemInput>({
        resolver: zodResolver(agendamentoItemSchema) as Resolver<AgendamentoItemInput>,
        defaultValues: VAZIO,
    });

    async function enviar(values: AgendamentoItemInput) {
        if (!idProduto) return setErroProduto('Selecione o produto');
        try {
            await onSubmit({
                ...values,
                des_ajuste_produto: values.des_ajuste_produto?.trim() || null,
            });
            reset(VAZIO);
            setIdProduto(0);
        } catch {
            /* erro exibido pela página; mantém os dados digitados */
        }
    }

    const numero = (field: { onChange: (v: number) => void }) => (v: string) =>
        field.onChange(v ? Number(v) : 0);

    return (
        <form onSubmit={handleSubmit(enviar)} className="space-y-4 rounded-md border bg-muted/20 p-4">
            <p className="text-sm font-medium">Adicionar item</p>

            <div className="grid gap-4 md:grid-cols-2">
                <Campo label="Tipo de agendamento" erro={errors.id_tipo_agendamento?.message}>
                    <Controller
                        control={control}
                        name="id_tipo_agendamento"
                        render={({ field }) => (
                            <SelectOpcao
                                value={field.value ? String(field.value) : ''}
                                onChange={numero(field)}
                                opcoes={tipos}
                                placeholder="Selecione o tipo"
                            />
                        )}
                    />
                </Campo>

                <Campo label="Produto" erro={erroProduto}>
                    <SelectOpcao
                        value={idProduto ? String(idProduto) : ''}
                        onChange={(v) => {
                            setIdProduto(Number(v));
                            setErroProduto(null);
                            setValue('id_produto_grade', 0);
                            setValue('id_produto_servico', 0);
                        }}
                        opcoes={produtos}
                        placeholder={isLoading ? 'Carregando...' : 'Selecione o produto'}
                    />
                </Campo>

                <Campo label="Cor/estampa - Tamanho" erro={errors.id_produto_grade?.message}>
                    <Controller
                        control={control}
                        name="id_produto_grade"
                        render={({ field }) => (
                            <SelectOpcao
                                value={field.value ? String(field.value) : ''}
                                onChange={numero(field)}
                                opcoes={grades}
                                disabled={!idProduto}
                                placeholder={idProduto ? 'Selecione a grade' : 'Escolha o produto primeiro'}
                            />
                        )}
                    />
                </Campo>

                <Campo label="Tipo de serviço" erro={errors.id_produto_servico?.message}>
                    <Controller
                        control={control}
                        name="id_produto_servico"
                        render={({ field }) => (
                            <SelectOpcao
                                value={field.value ? String(field.value) : ''}
                                onChange={numero(field)}
                                opcoes={servicos}
                                disabled={!idProduto}
                                placeholder={idProduto ? 'Selecione o serviço' : 'Escolha o produto primeiro'}
                            />
                        )}
                    />
                </Campo>

                <Campo label="Desconto (R$)" erro={errors.val_desconto_servico?.message}>
                    <Controller
                        control={control}
                        name="val_desconto_servico"
                        render={({ field }) => (
                            <MoneyInput value={field.value ?? 0} onChange={field.onChange} />
                        )}
                    />
                </Campo>
            </div>

            <Campo label="Descrição do ajuste" erro={errors.des_ajuste_produto?.message}>
                <textarea
                    {...register('des_ajuste_produto')}
                    rows={2}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                />
            </Campo>

            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                    O preço é definido automaticamente pela tabela de preços do serviço.
                </p>
                <Button type="submit" size="sm" className="gap-1" disabled={submitting}>
                    <Plus className="h-4 w-4" />
                    {submitting ? 'Adicionando...' : 'Adicionar'}
                </Button>
            </div>
        </form>
    );
}
