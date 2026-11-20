// src/features/agendamentos/agendamento/pdf/use-relatorio-agendamento.ts
// Reúne os dados de várias fontes e gera o PDF sob demanda (no clique).

import { useState } from 'react';
import { createElement } from 'react';

import type { AgendamentoDetalhe } from '../types';
import type { RelatorioAgendamento, RelatorioItem } from './agendamento-pdf';

import { usePessoa } from '@/features/pessoas/hooks';
import { useEmpresas } from '@/features/parametrizacao/empresa/hooks';
import { useTiposAgendamento } from '@/features/agendamentos/tipo-agendamento/hooks';
import { useGradesProduto } from '@/features/produtos/grade/hooks';
import { useCorEstampas } from '@/features/produtos/cor-estampa/hooks';
import { useTamanhos } from '@/features/produtos/tamanho/hooks';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL as string) ?? '';

/* ---------------- formatadores ---------------- */
const digitos = (v?: string | null) => (v ?? '').replace(/\D/g, '');

const formatarCpf = (v?: string | null) =>
    digitos(v).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') || '';

const formatarTelefone = (v?: string | null) => {
    const d = digitos(v);
    if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    return v ?? '';
};

const formatarCep = (v?: string | null) => digitos(v).replace(/^(\d{5})(\d{3})$/, '$1-$2');

/* ---------------- logo: qualquer imagem raster -> PNG (data URL) ---------------- */
// @react-pdf só aceita PNG/JPG; convertendo via canvas aceitamos também WebP.
// SVG não é suportado (retorna null e o PDF usa o nome da empresa).
async function logoParaPng(url?: string | null): Promise<string | null> {
    if (!url) return null;
    try {
        const src = /^(https?:|data:|blob:)/.test(url)
            ? url
            : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        const resp = await fetch(src);
        if (!resp.ok) return null;

        const bitmap = await createImageBitmap(await resp.blob());
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
        return canvas.toDataURL('image/png');
    } catch {
        return null;
    }
}

export function useRelatorioAgendamento(ag: AgendamentoDetalhe) {
    const { data: pessoaRes, isLoading: l1 } = usePessoa(ag.id_paciente);
    const { data: empresasRes, isLoading: l2 } = useEmpresas();
    const { data: tiposRes, isLoading: l3 } = useTiposAgendamento();
    const { data: gradesRes, isLoading: l4 } = useGradesProduto();
    const { data: coresRes, isLoading: l5 } = useCorEstampas();
    const { data: tamanhosRes, isLoading: l6 } = useTamanhos();

    const [gerando, setGerando] = useState(false);
    const pronto = !(l1 || l2 || l3 || l4 || l5 || l6);

    async function montar(): Promise<RelatorioAgendamento> {
        const p = pessoaRes?.dados;

        const empresas = Array.isArray(empresasRes?.dados) ? empresasRes.dados : [];
        const empresa = empresas.find((e) => e.ind_ativo === 1 && !e.deleted_at) ?? empresas[0];

        const tipos = new Map((tiposRes?.dados ?? []).map((t) => [t.id, t.des_tipo_agendamento]));
        const cores = new Map((coresRes?.dados ?? []).map((c) => [c.id, c.nom_cor_estampa]));
        const tamanhos = new Map((tamanhosRes?.dados ?? []).map((t) => [t.id, t.cod_tamanho]));
        const grades = new Map((gradesRes?.dados ?? []).map((g) => [g.id, g]));

        // Itens cancelados ficam fora da tabela e do total (igual à tela)
        const itens: RelatorioItem[] = (ag.itens ?? [])
            .filter((i) => !i.deleted_at && i.ind_status !== 'cancelado')
            .map((i) => {
                const g = grades.get(i.id_produto_grade);
                const cor = g?.id_variacao_cor_estampa
                    ? cores.get(g.id_variacao_cor_estampa) ?? '—'
                    : 'Sem cor';
                const preco = Number(i.val_preco_servico ?? 0);
                const desconto = Number(i.val_desconto_servico ?? 0);
                return {
                    produto: i.nom_produto,
                    sku: i.num_sku,
                    ajuste: i.des_ajuste_produto,
                    servico: i.des_tipo_ajuste,
                    tipoAgendamento: tipos.get(i.id_tipo_agendamento) ?? '—',
                    variacao: `${cor} - ${g ? tamanhos.get(g.id_tamanho) ?? '—' : '—'}`,
                    preco,
                    desconto,
                    total: Math.max(0, preco - desconto),
                };
            });

        const tiposDistintos = [...new Set(itens.map((i) => i.tipoAgendamento))].join(', ');

        const d = new Date(ag.dta_agendamento);
        const data = d.toLocaleDateString('pt-BR');
        const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const cidadeUf = [p?.nom_cidade, p?.sgl_estado].filter(Boolean).join('/');
        const endereco = p
            ? [
                [p.des_logradouro, p.num_endereco].filter(Boolean).join(', '),
                p.des_complemento,
                p.nom_bairro,
                cidadeUf,
                p.num_cep ? `CEP ${formatarCep(p.num_cep)}` : null,
            ]
                .filter(Boolean)
                .join(' - ')
            : '';

        return {
            id: ag.id,
            titulo: `Atendimento agendado para ${data} às ${hora}`,
            logo: await logoParaPng(empresa?.des_url_logo_horizontal),
            empresa: empresa?.nom_fantasia ?? '',
            corPrincipal: empresa?.val_cor_principal ? `#${empresa.val_cor_principal.replace('#', '')}` : '#1F3A5F',
            paciente: {
                nome: ag.nom_paciente,
                cpf: formatarCpf(p?.num_cpf),
                telefone: formatarTelefone(p?.num_celular_1 ?? ag.num_celular_paciente),
                whatsapp: p ? (p.ind_whatsapp_1 ? 'Sim' : 'Não') : '',
                email: p?.des_email_1 ?? '',
                endereco,
            },
            tipoAgendamento: tiposDistintos,
            costureira: ag.nom_costureira,
            medico: ag.nom_medico ?? '',
            secretaria: ag.nom_secretaria ?? '',
            itens,
            totalGeral: itens.reduce((soma, i) => soma + i.total, 0),
        };
    }

    async function gerar() {
        setGerando(true);
        try {
            // Imports dinâmicos: mantém @react-pdf fora do bundle inicial e do SSR
            const [{ pdf }, { AgendamentoPdf }, data] = await Promise.all([
                import('@react-pdf/renderer'),
                import('./agendamento-pdf'),
                montar(),
            ]);

            const blob = await pdf(createElement(AgendamentoPdf, { data })).toBlob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `agendamento-${ag.id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setGerando(false);
        }
    }

    return { gerar, gerando, pronto };
}
