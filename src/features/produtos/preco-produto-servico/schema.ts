// src/features/produtos/preco-produto-servico/schema.ts
import { z } from 'zod';

const REGEX_VALOR = /^\d+(\.\d{1,2})?$/;

const valPrecoSchema = z.preprocess(
    (v) => {
        if (typeof v === 'number') return v.toFixed(2);
        if (typeof v === 'string') return v.trim();
        return v;
    },
    z.string({ message: 'Informe o preço' })
        .regex(REGEX_VALOR, 'Valor inválido. Use o formato 0.00')
        .refine((v) => Number(v) > 0, 'O preço deve ser maior que zero'),
);

// Schema de ENVIO para a API (o que realmente vai no body do POST)
export const precoProdutoServicoSchema = z.object({
    id_produto_servico: z.number().int().positive('Selecione um produto/serviço'),
    val_preco: valPrecoSchema,
    dta_inicio: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Data inválida'),
});

// Schema do FORMULÁRIO de criação (o que o usuário digita/seleciona na UI)
// dta_inicio aqui é Date por causa do DatePicker — convertido para string no submit
export const precoProdutoServicoFormSchema = z.object({
    id_produto_servico: z.number({ message: 'Selecione um produto/serviço' })
        .int().positive('Selecione um produto/serviço'),
    val_preco: valPrecoSchema,
    dta_inicio: z.date({ message: 'Selecione a data de início' }),
});

export const precoProdutoServicoUpdateSchema = z.object({
    val_preco: valPrecoSchema,
});

export type PrecoProdutoServicoInput = z.output<typeof precoProdutoServicoSchema>;
export type PrecoProdutoServicoFormInput = z.input<typeof precoProdutoServicoFormSchema>;
export type PrecoProdutoServicoFormOutput = z.output<typeof precoProdutoServicoFormSchema>;
export type PrecoProdutoServicoUpdateInput = z.output<typeof precoProdutoServicoUpdateSchema>;

