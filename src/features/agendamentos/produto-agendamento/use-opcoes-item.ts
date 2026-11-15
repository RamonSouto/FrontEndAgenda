// src/features/agendamentos/produto-agendamento/use-opcoes-item.ts
// Concentra os selects em cascata: Produto → Grade (cor/estampa - tamanho) → Serviço (tipo de ajuste)

import { useMemo } from 'react';
import { useProdutos } from '@/features/produtos/produto/hooks';
import { useGradesProduto } from '@/features/produtos/grade/hooks';
import { useCorEstampas } from '@/features/produtos/cor-estampa/hooks';
import { useTiposAgendamento } from '@/features/agendamentos/tipo-agendamento/hooks';
// ASSUMIDO: ajuste os caminhos/campos conforme seus hooks reais
import { useTamanhos } from '@/features/produtos/tamanho/hooks';
import { useProdutoServicos } from '@/features/produtos/produto-servico/hooks';
import { useTipoServico, useTiposServico } from '@/features/produtos/tipo-servico/hooks';

export interface Opcao {
    value: string;
    label: string;
}

interface Ativavel {
    ind_ativo?: number | null;
    deleted_at?: string | null;
}
interface TamanhoMin extends Ativavel {
    id: number;
    cod_tamanho: string;
}
interface ProdutoServicoMin extends Ativavel {
    id: number;
    id_produto: number;
    id_tipo_servico: number;
    des_tipo_ajuste: string; // ASSUMIDO: join com tab_tipo_servico
}

interface TipoServicoMin extends Ativavel {
    id: number;
    des_tipo_ajuste?: string | null;
}


const ativo = (x: Ativavel) => x.deleted_at == null && x.ind_ativo !== 0;

export function useOpcoesItem(idProduto: number) {
    const { data: tiposRaw, isLoading: l1 } = useTiposAgendamento();
    const { data: produtosRaw, isLoading: l2 } = useProdutos();
    const { data: gradesRaw, isLoading: l3 } = useGradesProduto();
    const { data: coresRaw } = useCorEstampas();
    const { data: tamanhosRaw } = useTamanhos();
    const { data: servicosRaw } = useProdutoServicos();
    const { data: tiposServicoRaw } = useTiposServico();


    const tipos = useMemo<Opcao[]>(
        () =>
            (tiposRaw?.dados ?? [])
                .filter(ativo)
                .map((t) => ({ value: String(t.id), label: t.des_tipo_agendamento })),
        [tiposRaw]
    );

    const produtos = useMemo<Opcao[]>(
        () =>
            (produtosRaw?.dados ?? []).filter(ativo).map((p) => ({
                value: String(p.id),
                label: p.num_sku ? `${p.nom_produto} - ${p.num_sku}` : p.nom_produto,
            })),
        [produtosRaw]
    );

    const grades = useMemo<Opcao[]>(() => {
        if (!idProduto) return [];
        const cores = new Map((coresRaw?.dados ?? []).map((c) => [c.id, c.nom_cor_estampa]));
        const tamanhos = new Map(
            ((tamanhosRaw?.dados ?? []) as unknown as TamanhoMin[]).map((t) => [t.id, t.cod_tamanho])
        );
        return (gradesRaw?.dados ?? [])
            .filter((g) => g.id_produto === idProduto && ativo(g))
            .map((g) => ({
                value: String(g.id),
                label: `${g.id_variacao_cor_estampa ? cores.get(g.id_variacao_cor_estampa) ?? '—' : 'Sem cor'
                    } - ${tamanhos.get(g.id_tamanho) ?? '—'}`,
            }));
    }, [idProduto, gradesRaw, coresRaw, tamanhosRaw]);

    // const servicos = useMemo<Opcao[]>(() => {

    //     console.log({ "idProduto": idProduto, servicosRaw: servicosRaw?.dados.filter((s) => s.id_produto === idProduto && s.ind_ativo === 1) });
    //     if (!idProduto) return [];
    //     return ((servicosRaw?.dados ?? []) as unknown as ProdutoServicoMin[])
    //         .filter((s) => s.id_produto === idProduto && ativo(s))
    //         .map((s) => ({ value: String(s.id), label: s.des_tipo_ajuste }));
    // }, [idProduto, servicosRaw]);

    const servicos = useMemo<Opcao[]>(() => {
        if (!idProduto) return [];

        const nomes = new Map(
            ((tiposServicoRaw?.dados ?? []) as unknown as TipoServicoMin[]).map((t) => [
                t.id,
                t.des_tipo_ajuste ?? '',
            ])
        );

        return ((servicosRaw?.dados ?? []) as unknown as ProdutoServicoMin[])
            .filter((s) => s.id_produto === idProduto && ativo(s))
            .map((s) => ({
                value: String(s.id), // id da associação produto_servico
                label: s.des_tipo_ajuste ?? nomes.get(s.id_tipo_servico) ?? `Serviço #${s.id_tipo_servico}`,
            }));
    }, [idProduto, servicosRaw, tiposServicoRaw]);


    return { tipos, produtos, grades, servicos, isLoading: l1 || l2 || l3 };
}
