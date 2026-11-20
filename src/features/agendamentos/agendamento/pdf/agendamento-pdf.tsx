// src/features/agendamentos/agendamento/pdf/agendamento-pdf.tsx
import { Document, Page, View, Text, Image, Svg, Path, StyleSheet } from '@react-pdf/renderer';

export interface RelatorioItem {
    produto: string;
    sku: string | null;
    ajuste: string | null;
    servico: string;
    tipoAgendamento: string;
    variacao: string; // "Cor/Estampa - Tamanho"
    preco: number;
    desconto: number;
    total: number;
}

export interface RelatorioAgendamento {
    id: number;
    titulo: string; // "Atendimento agendado para 16/11/2026 às 10:00"
    logo: string | null; // data URL PNG
    empresa: string;
    corPrincipal: string; // '#RRGGBB'
    paciente: {
        nome: string;
        cpf: string;
        telefone: string;
        whatsapp: string;
        email: string;
        endereco: string;
    };
    tipoAgendamento: string;
    costureira: string;
    medico: string;
    secretaria: string;
    itens: RelatorioItem[];
    totalGeral: number;
}

// Acima disso, cada via ocupa uma página inteira
const LIMITE_ITENS_DUAS_VIAS = 6;

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const s = StyleSheet.create({
    page: { padding: 24, paddingBottom: 24, fontSize: 9, fontFamily: 'Helvetica', color: '#1f2937' },
    pageCompleta: { paddingBottom: 48 },

    // Via
    via: {},
    viaMetade: { flex: 1, overflow: 'hidden' },
    corte: {
        borderTopWidth: 1,
        borderTopColor: '#9ca3af',
        borderTopStyle: 'dashed',
        marginVertical: 8,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 0,
        borderBottomWidth: 2,
    },
    logo: { width: 140, height: 40, objectFit: 'contain', objectPosition: 'left' },
    empresa: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
    headerDireita: { alignItems: 'flex-end' },
    titulo: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
    subtitulo: { fontSize: 8, marginTop: 3 },
    viaLabel: { fontSize: 7, color: '#6b7280', marginTop: 2 },

    secao: { marginTop: 4 },
    linha: { flexDirection: 'row', flexWrap: 'wrap' },
    campo: { marginBottom: 6, paddingRight: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
    label: { fontSize: 6, fontWeight: 'bold', color: '#000', textTransform: 'uppercase', marginBottom: 1 },
    valor: { fontSize: 8 },

    thead: {
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 4,
        color: '#ffffff',
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
    },
    tr: {
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        fontSize: 8,
    },
    cProduto: { flex: 3, paddingRight: 4 },
    cVariacao: { flex: 2, paddingRight: 4 },
    cServico: { flex: 2.2, paddingRight: 4 },
    cTipo: { flex: 1.6, paddingRight: 4 },
    cNum: { flex: 1.3, textAlign: 'right' },
    pequeno: { fontSize: 7, color: '#6b7280', marginTop: 1 },
    vazio: { padding: 8, color: '#6b7280' },

    totalBox: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
    totalTexto: { fontSize: 11, fontFamily: 'Helvetica-Bold' },

    assinaturas: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 60 },
    assinaturasCompactas: { marginTop: 30 },
    assinatura: { width: '30%', alignItems: 'center' },
    assinaturaLinha: { width: '100%', borderTopWidth: 1, borderTopColor: '#111827', marginBottom: 3 },
    assinaturaPapel: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
    assinaturaNome: { fontSize: 8, color: '#4b5563', marginTop: 1, textAlign: 'center' },

    rodape: {
        position: 'absolute',
        bottom: 20,
        left: 32,
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 7,
        color: '#9ca3af',
    },
});

function WhatsappIcon() {
    return (
        <Svg viewBox="0 0 24 24" style={{ width: 10, height: 10, marginRight: 3 }}>
            <Path
                fill="#25D366"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
        </Svg>
    );
}

function Campo({
    label,
    valor,
    largura,
    whatsapp = false,
}: {
    label: string;
    valor: string;
    largura: string;
    whatsapp?: boolean;
}) {
    return (
        <View style={[s.campo, { width: largura }]}>
            <Text style={s.label}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {whatsapp && valor ? <WhatsappIcon /> : null}
                <Text style={s.valor}>{valor || '-'}</Text>
            </View>
        </View>
    );
}

function Assinatura({ papel, nome }: { papel: string; nome: string }) {
    return (
        <View style={s.assinatura}>
            <View style={s.assinaturaLinha} />
            {nome ? <Text style={s.assinaturaNome}>{nome}</Text> : <Text style={s.assinaturaPapel}>{papel}</Text>}
        </View>
    );
}

function Via({
    data,
    via,
    metade,
}: {
    data: RelatorioAgendamento;
    via: string;
    metade: boolean;
}) {
    const cor = data.corPrincipal;

    return (
        <View style={metade ? s.viaMetade : s.via}>
            {/* Cabeçalho */}
            <View style={[s.header, { borderBottomColor: cor }]}>
                {data.logo ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src={data.logo} style={s.logo} />
                ) : (
                    <Text style={s.empresa}>{data.empresa}</Text>
                )}
                <View style={s.headerDireita}>
                    <Text style={s.titulo}>Agendamento #{data.id}</Text>
                    <Text style={s.subtitulo}>{data.titulo}</Text>
                    <Text style={s.viaLabel}>{via}</Text>
                </View>
            </View>

            {/* Paciente e equipe */}
            <View style={s.secao}>
                <View style={s.linha}>
                    <Campo label="Nome" valor={data.paciente.nome} largura="50%" />
                    <Campo label="CPF" valor={data.paciente.cpf} largura="25%" />
                    <Campo
                        label="Telefone"
                        valor={data.paciente.telefone}
                        largura="25%"
                        whatsapp={data.paciente.whatsapp === 'Sim'}
                    />
                    <Campo label="Endereço" valor={data.paciente.endereco} largura="60%" />
                    <Campo label="E-mail" valor={data.paciente.email} largura="40%" />
                    <Campo label="Tipo de agendamento" valor={data.tipoAgendamento} largura="50%" />
                    <Campo label="Costureira" valor={data.costureira} largura="25%" />
                    <Campo label="Médico(a)" valor={data.medico} largura="25%" />
                </View>
            </View>

            {/* Itens */}
            <View style={s.secao}>
                <View style={[s.thead, { backgroundColor: cor }]} fixed={!metade}>
                    <Text style={s.cProduto}>Produto</Text>
                    <Text style={s.cVariacao}>Cor/Estampa - Tam.</Text>
                    <Text style={s.cServico}>Serviço</Text>
                    <Text style={s.cTipo}>Tipo</Text>
                    <Text style={s.cNum}>Preço</Text>
                    <Text style={s.cNum}>Desconto</Text>
                    <Text style={s.cNum}>Total</Text>
                </View>

                {data.itens.length ? (
                    data.itens.map((i, idx) => (
                        <View key={idx} style={s.tr} wrap={false}>
                            <View style={s.cProduto}>
                                <Text>{i.produto}</Text>
                                {i.sku ? <Text style={s.pequeno}>SKU {i.sku}</Text> : null}
                                {i.ajuste ? <Text style={s.pequeno}>{i.ajuste}</Text> : null}
                            </View>
                            <Text style={s.cVariacao}>{i.variacao}</Text>
                            <Text style={s.cServico}>{i.servico}</Text>
                            <Text style={s.cTipo}>{i.tipoAgendamento}</Text>
                            <Text style={s.cNum}>{moeda(i.preco)}</Text>
                            <Text style={s.cNum}>{moeda(i.desconto)}</Text>
                            <Text style={s.cNum}>{moeda(i.total)}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={s.vazio}>Nenhum item neste agendamento.</Text>
                )}

                <View style={s.totalBox}>
                    <Text style={s.totalTexto}>Total geral: {moeda(data.totalGeral)}</Text>
                </View>
            </View>

            {/* Assinaturas */}
            <View
                style={[s.assinaturas, metade ? s.assinaturasCompactas : {}]}
                wrap={false}
                minPresenceAhead={metade ? undefined : 90}
            >
                <Assinatura papel="Cliente" nome={data.paciente.nome} />
                <Assinatura papel="Secretaria" nome={data.secretaria} />
                <Assinatura papel="Costureira" nome={data.costureira} />
            </View>
        </View>
    );
}

export function AgendamentoPdf({ data }: { data: RelatorioAgendamento }) {
    const duasViasNaMesmaPagina = data.itens.length <= LIMITE_ITENS_DUAS_VIAS;

    return (
        <Document title={`Agendamento - ${data.id}`}>
            {duasViasNaMesmaPagina ? (
                <Page size="A4" style={s.page}>
                    <Via data={data} via="1ª via" metade />
                    <View style={s.corte} />
                    <Via data={data} via="2ª via" metade />
                </Page>
            ) : (
                // Muitos itens: cada via ocupa uma página inteira
                ['1ª via', '2ª via'].map((via) => (
                    <Page key={via} size="A4" style={[s.page, s.pageCompleta]}>
                        <Via data={data} via={via} metade={false} />

                        <View style={s.rodape} fixed>
                            <Text>{data.empresa}</Text>
                            <Text
                                render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
                            />
                        </View>
                    </Page>
                ))
            )}
        </Document>
    );
}