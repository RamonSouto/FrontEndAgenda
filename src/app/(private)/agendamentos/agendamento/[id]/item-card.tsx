// src/app/(private)/agendamento/[id]/item-card.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ImagePlus, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { AgendamentoItem, AgendamentoItemStatus } from '@/features/agendamentos/produto-agendamento/types';
import { agendamentoItemUpdateSchema } from '@/features/agendamentos/produto-agendamento/schema';
import {
    useAtualizarItemAgendamento,
    useDeletarItemAgendamento,
} from '@/features/agendamentos/produto-agendamento/hooks';
import { ApiError } from '@/lib/http/errors';

import { Campo, MoneyInput, SelectOpcao } from './item-form';
import { FotosItem } from './fotos-item';

export const STATUS_ITEM_LABEL: Record<AgendamentoItemStatus, string> = {
    pendente: 'Pendente',
    producao: 'Em produção',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
};

const STATUS_VARIANT: Record<AgendamentoItemStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pendente: 'secondary',
    producao: 'default',
    concluido: 'outline',
    cancelado: 'destructive',
};

// Fluxo: pendente → producao → concluido; cancelado a partir de pendente/producao
const TRANSICOES: Record<AgendamentoItemStatus, AgendamentoItemStatus[]> = {
    pendente: ['producao', 'cancelado'],
    producao: ['concluido', 'cancelado'],
    concluido: [],
    cancelado: [],
};

const ACAO_LABEL: Partial<Record<AgendamentoItemStatus, string>> = {
    producao: 'Iniciar produção',
    concluido: 'Concluir',
    cancelado: 'Cancelar item',
};

export const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const totalItem = (i: AgendamentoItem) =>
    Math.max(0, Number(i.val_preco_servico ?? 0) - Number(i.val_desconto_servico ?? 0));

const msgErro = (e: unknown, padrao: string) => (e instanceof ApiError ? e.message : padrao);

/* ------------------------------------------------------------------ */
/* Diálogo de edição (PATCH)                                           */
/* ------------------------------------------------------------------ */
function ItemEditDialog({
    item,
    idAgendamento,
    onClose,
}: {
    item: AgendamentoItem;
    idAgendamento: number;
    onClose: () => void;
}) {
    const atualizar = useAtualizarItemAgendamento(idAgendamento);
    const precoInicial = Number(item.val_preco_servico ?? 0);
    const descontoInicial = Number(item.val_desconto_servico ?? 0);

    const [ajuste, setAjuste] = useState(item.des_ajuste_produto ?? '');
    const [preco, setPreco] = useState(precoInicial);
    const [desconto, setDesconto] = useState(descontoInicial);
    const [status, setStatus] = useState<AgendamentoItemStatus>(item.ind_status);
    const [erro, setErro] = useState<string | null>(null);

    const opcoesStatus = [item.ind_status, ...TRANSICOES[item.ind_status]].map((s) => ({
        value: s,
        label: STATUS_ITEM_LABEL[s],
    }));

    function salvar() {
        if (desconto > preco) return setErro('O desconto não pode ser maior que o preço');

        const parsed = agendamentoItemUpdateSchema.safeParse({
            des_ajuste_produto: ajuste.trim() || null,
            ...(preco !== precoInicial ? { val_preco_servico: preco } : {}),
            ...(desconto !== descontoInicial ? { val_desconto_servico: desconto } : {}),
            ...(status !== item.ind_status ? { ind_status: status } : {}),
        });
        if (!parsed.success) return setErro(parsed.error.issues[0].message);

        setErro(null);
        atualizar.mutate(
            { id: item.id, data: parsed.data },
            {
                onSuccess: onClose,
                onError: (e) => setErro(msgErro(e, 'Não foi possível salvar o item')),
            }
        );
    }

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar item</DialogTitle>
                    <DialogDescription>
                        {item.nom_produto} · {item.des_tipo_ajuste}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Campo label="Descrição do ajuste">
                        <textarea
                            value={ajuste}
                            onChange={(e) => setAjuste(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                        />
                    </Campo>
                    <div className="grid grid-cols-2 gap-4">
                        <Campo label="Preço (R$)">
                            <MoneyInput value={preco} onChange={setPreco} />
                        </Campo>
                        <Campo label="Desconto (R$)">
                            <MoneyInput value={desconto} onChange={setDesconto} />
                        </Campo>
                    </div>
                    <Campo label="Status">
                        <SelectOpcao
                            value={status}
                            onChange={(v) => setStatus(v as AgendamentoItemStatus)}
                            opcoes={opcoesStatus}
                            placeholder="Status"
                        />
                    </Campo>

                    <p className="text-sm">
                        Total: <strong>{moeda(Math.max(0, preco - desconto))}</strong>
                    </p>
                    {erro && <p className="text-sm text-destructive">{erro}</p>}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={salvar} disabled={atualizar.isPending}>
                            {atualizar.isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ------------------------------------------------------------------ */
/* Card do item                                                        */
/* ------------------------------------------------------------------ */
interface ItemCardProps {
    idAgendamento: number;
    item: AgendamentoItem;
    onErro: (msg: string) => void;
}

export function ItemCard({ idAgendamento, item, onErro }: ItemCardProps) {
    const atualizar = useAtualizarItemAgendamento(idAgendamento);
    const deletar = useDeletarItemAgendamento(idAgendamento);

    const [fotosAbertas, setFotosAbertas] = useState(false);
    const [editando, setEditando] = useState(false);
    const [confirmar, setConfirmar] = useState<'excluir' | 'cancelar' | null>(null);

    const cancelado = item.ind_status === 'cancelado';
    const podeExcluir = item.ind_status === 'pendente'; // regra: só exclui pendente
    const preco = Number(item.val_preco_servico ?? 0);
    const desconto = Number(item.val_desconto_servico ?? 0);

    function mudarStatus(status: AgendamentoItemStatus) {
        atualizar.mutate(
            { id: item.id, data: { ind_status: status } },
            { onError: (e) => onErro(msgErro(e, 'Não foi possível alterar o status do item')) }
        );
    }

    function handleConfirmar() {
        if (confirmar === 'excluir') {
            deletar.mutate(item.id, {
                onError: (e) => onErro(msgErro(e, 'Não foi possível excluir o item')),
            });
        } else if (confirmar === 'cancelar') {
            mudarStatus('cancelado');
        }
        setConfirmar(null);
    }

    return (
        <li className={`rounded-md border p-3 space-y-3 ${cancelado ? 'opacity-60' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                    <p className="font-medium">
                        {item.nom_produto}
                        {item.num_sku && (
                            <span className="ml-2 text-xs text-muted-foreground">{item.num_sku}</span>
                        )}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.des_tipo_ajuste}</p>
                    {item.des_ajuste_produto && (
                        <p className="text-sm">{item.des_ajuste_produto}</p>
                    )}
                </div>
                <Badge variant={STATUS_VARIANT[item.ind_status]}>
                    {STATUS_ITEM_LABEL[item.ind_status]}
                </Badge>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span>
                    Preço: <strong>{item.val_preco_servico ? moeda(preco) : '—'}</strong>
                </span>
                <span>
                    Desconto: <strong>{moeda(desconto)}</strong>
                </span>
                <span>
                    Total: <strong>{moeda(totalItem(item))}</strong>
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {TRANSICOES[item.ind_status].map((destino) => (
                    <Button
                        key={destino}
                        size="sm"
                        variant={destino === 'cancelado' ? 'outline' : 'default'}
                        disabled={atualizar.isPending}
                        onClick={() =>
                            destino === 'cancelado' ? setConfirmar('cancelar') : mudarStatus(destino)
                        }
                    >
                        {ACAO_LABEL[destino]}
                    </Button>
                ))}

                <div className="ml-auto flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setFotosAbertas((v) => !v)}
                    >
                        <ImagePlus className="h-4 w-4" />
                        Fotos
                        {fotosAbertas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={cancelado}
                        onClick={() => setEditando(true)}
                        title="Editar"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={!podeExcluir || deletar.isPending}
                        onClick={() => setConfirmar('excluir')}
                        title={podeExcluir ? 'Excluir' : 'Só é possível excluir itens pendentes'}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>

            {fotosAbertas && (
                <div className="border-t pt-3">
                    <FotosItem idAgendamento={idAgendamento} idItem={item.id} onErro={onErro} />
                </div>
            )}

            {editando && (
                <ItemEditDialog
                    item={item}
                    idAgendamento={idAgendamento}
                    onClose={() => setEditando(false)}
                />
            )}

            <AlertDialog open={!!confirmar} onOpenChange={(open) => !open && setConfirmar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmar === 'excluir' ? 'Excluir item' : 'Cancelar item'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmar === 'excluir'
                                ? `Excluir "${item.nom_produto}"? Use apenas para itens adicionados por engano. As fotos do item também serão removidas.`
                                : `Cancelar o ajuste de "${item.nom_produto}"? Ele deixará de entrar no total.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmar}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </li>
    );
}
