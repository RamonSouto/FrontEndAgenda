// src/app/(private)/dev/pdf/mock.ts
import type { RelatorioAgendamento, RelatorioItem } from '@/features/agendamentos/agendamento/pdf/agendamento-pdf';

// Dados reais do agendamento #22 (já no formato que o hook monta)
export const mockData: RelatorioAgendamento = {
    id: 22,
    titulo: 'Atendimento agendado para 16/11/2026 às 08:30',
    logo: 'http://locahost:3000/uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg', // coloque um PNG em /public; use null para testar o fallback (nome da empresa)
    empresa: 'Bood Accessoria',
    corPrincipal: '#6e2aa7',
    paciente: {
        nome: 'Paciente 1',
        cpf: '301.349.781-53',
        telefone: '(62) 78945-6123',
        whatsapp: 'Sim',
        email: 'jennifer.crooks43@ethereal.email',
        endereco: 'Avenida Ipanema, 0 - Setor Faiçalville - Goiânia/GO - CEP 74350-575',
    },
    tipoAgendamento: '24 HORAS',
    costureira: 'Costureira 1',
    medico: 'Médico 1',
    secretaria: 'Secretaria 1',
    itens: [
        {
            produto: 'Cintura alta com colchetes',
            sku: 'BOOD109PB',
            ajuste: null,
            servico: 'Ajuste pc grande 3º',
            tipoAgendamento: '24 HORAS',
            variacao: 'Branco - P',
            preco: 100.01,
            desconto: 0,
            total: 100.01,
        },
        {
            produto: 'Cintura alta com colchetes',
            sku: 'BOOD109PB',
            ajuste: null,
            servico: 'Ajuste pc grande 3º',
            tipoAgendamento: '24 HORAS',
            variacao: 'Branco - P',
            preco: 100.01,
            desconto: 0,
            total: 100.01,
        },
    ],
    totalGeral: 200.02,
};

// Variante para testar layout: muitos itens, textos longos, quebra de página
const base: Omit<RelatorioItem, 'total'>[] = [
    {
        produto: 'Cintura alta com colchetes',
        sku: 'BOOD109PB',
        ajuste: 'Ajustar a cintura 2 cm e reforçar os colchetes',
        servico: 'Ajuste pc grande 3º',
        tipoAgendamento: '24 HORAS',
        variacao: 'Branco - P',
        preco: 100.01,
        desconto: 0,
    },
    {
        produto: 'Corpete com bojo (com elástico interno)',
        sku: 'BOOD213',
        ajuste: null,
        servico: 'Ajuste na largura de pç pequena Bood',
        tipoAgendamento: 'Primeiro Ajuste',
        variacao: 'Onça - M',
        preco: 85.5,
        desconto: 10,
    },
    {
        produto: 'Corselet',
        sku: 'BOOD211',
        ajuste: 'Cliente pediu acabamento reforçado nas laterais',
        servico: 'Ajuste na largura de pç grande Bood',
        tipoAgendamento: 'Reajuste',
        variacao: 'Preto - GG',
        preco: 120,
        desconto: 5.25,
    },
    {
        produto: 'Cintura baixa com colchetes',
        sku: 'BOOD111',
        ajuste: null,
        servico: 'Ajuste pc pequena 3º',
        tipoAgendamento: '24 HORAS',
        variacao: 'Sem cor - G',
        preco: 60,
        desconto: 0,
    },
];

const itensLongos: RelatorioItem[] = Array.from({ length: 14 }, (_, i) => {
    const b = base[i % base.length];
    return { ...b, total: Math.max(0, b.preco - b.desconto) };
});

export const mockDataLongo: RelatorioAgendamento = {
    ...mockData,
    paciente: {
        ...mockData.paciente,
        nome: 'Maria Aparecida de Souza Albuquerque Santos',
        endereco:
            'Avenida Ipanema, 1250, Quadra 12 Lote 8 Apto 302 - Setor Faiçalville - Goiânia/GO - CEP 74350-575',
    },
    tipoAgendamento: '24 HORAS, Primeiro Ajuste, Reajuste',
    secretaria: 'Fernanda Lima',
    itens: itensLongos,
    totalGeral: itensLongos.reduce((soma, i) => soma + i.total, 0),
};
