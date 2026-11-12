//src/features/auth/api.ts
import { httpClient } from "@/lib/http/client";
import { usuarioSchema, type Usuario, type LoginInput, type AlterarSenhaInput } from "./schema";

interface LoginResponse {
    token: string;
    usuario: Usuario;
}

export const authApi = {
    login: (payload: LoginInput) => httpClient.post<LoginResponse>('/api/auth/login', payload, { skipAuth: true }),
    logout: () => httpClient.post<void>('/api/auth/logout'),
    verificarToken: () => httpClient.get<{ valido: boolean }>('/api/auth/verificar'),
    perfil: async (): Promise<Usuario> => {
        const data = await httpClient.get<{ sucesso: boolean; dados: any }>('/api/auth/perfil');
        const raw = data.dados;
        const mapped: Usuario = {
            id_usuario: raw.id,
            nome: raw.nom_completo,
            email: raw.des_email_1,
            ativo: raw.ind_status === 'ativo',
            papel: raw.ind_administrador ? 'admin'
                : raw.ind_secretaria ? 'secretaria'
                    : raw.ind_costureira ? 'costureira'
                        : 'paciente',
        }
        return usuarioSchema.parse(mapped);
    },
    alterarSenha: (payload: AlterarSenhaInput) => httpClient.put<void>('/api/auth/alterar-senha', payload),
    resetarSenha: (idUsuario: number, novaSenha: string) => httpClient.post<void>('/api/auth/resetar-senha', { id_usuario: idUsuario, senha_nova: novaSenha })
}