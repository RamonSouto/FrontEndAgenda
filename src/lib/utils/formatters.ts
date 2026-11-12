// src/lib/utils/formatters.ts
// Formatação de dados para exibição e manipulação

export const formatarCNPJ = (cnpj: string): string => {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) return cnpj;
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatarCPF = (cpf: string): string => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const formatarCEP = (cep: string): string => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return cep;
    return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const formatarTelefone = (telefone: string): string => {
    const clean = telefone.replace(/\D/g, '');
    if (clean.length === 10) {
        return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (clean.length === 11) {
        return clean.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
    }
    return telefone;
};

export const toDate = (data?: string | Date | null): Date | null => {
    if (!data) return null;
    const d = data instanceof Date ? data : new Date(data);
    return isNaN(d.getTime()) ? null : d;
};

export const formatarData = (data: string | Date): string => {
    const d = toDate(data);
    if (!d) return '-';
    return `${d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })} ${d.toLocaleTimeString('pt-BR', { timeZone: 'UTC' })}`;
};

export const formatarDataInput = (data?: string | Date | null): string => {
    const d = toDate(data);
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const minutosParaHHMM = (minutos: string | number): string => {
    const total = Number(minutos) || 0;
    const h = Math.floor(total / 60).toString().padStart(2, '0');
    const m = (total % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

export const hhmmParaMinutos = (hhmm: string): string => {
    const [h, m] = hhmm.split(':').map(Number);
    return String((h || 0) * 60 + (m || 0));
};

export const formatarDataBR = (data?: string | Date | null): string => {
    const d = toDate(data);
    return d ? d.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
};


// Formata um número para string monetária de exibição (ex: 1234.5 -> "1.234,50")
export function formatarMoedaInput(valor: number): string {
    if (isNaN(valor)) return '';
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Converte a string digitada (com máscara) para number puro
// Estratégia: mantém apenas dígitos e trata os 2 últimos como centavos
export function parseMoedaInput(texto: string): number {
    const somenteDigitos = texto.replace(/\D/g, '');
    if (!somenteDigitos) return 0;
    return Number(somenteDigitos) / 100;
};

export const somenteDigitos = (valor: string): string => valor.replace(/\D/g, '');

export function formatarDataParaAPI(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
}
