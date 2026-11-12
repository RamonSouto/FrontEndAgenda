import { PessoaInput } from '@/features/pessoas/schema';

export const buildDefaultForm = (
    papel: 'ind_medico' | 'ind_secretaria' | 'ind_costureira' | 'ind_paciente' | 'ind_administrador'
): PessoaInput => ({
    id_cidade: 0,
    ind_status: 'ativo',
    nom_completo: '',
    num_cpf: '',
    num_rg: '',
    dta_nascimento: '',
    des_logradouro: '',
    num_endereco: '',
    des_complemento: '',
    num_cep: '',
    nom_bairro: '',
    num_celular_1: '',
    ind_whatsapp_1: true,
    num_celular_2: '',
    ind_whatsapp_2: true,
    des_email_1: '',
    des_email_2: '',
    des_senha: '',
    ind_medico: papel === 'ind_medico',
    ind_secretaria: papel === 'ind_secretaria',
    ind_costureira: papel === 'ind_costureira',
    ind_paciente: papel === 'ind_paciente',
    ind_administrador: papel === 'ind_administrador',
    val_cor_hex: '',
});
