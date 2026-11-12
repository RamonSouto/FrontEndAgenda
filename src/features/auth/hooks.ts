//src/features/auth/hooks.ts
'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { setCookie, destroyCookie } from "nookies"
import { useRouter } from "next/navigation"
import { authApi } from "./api"
import type { LoginInput, AlterarSenhaInput } from "./schema"

const TOKEN_COOKIE = 'agenda.token';

export const authKeys = { perfil: ['auth', 'perfil'] as const };

export function useAuth() {
    return useQuery({
        queryKey: authKeys.perfil,
        queryFn: authApi.perfil,
        retry: false,
        staleTime: 24 * 60 * 60 * 1000 //24hrs
    })
}

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginInput) => authApi.login(payload),
        onSuccess: (response) => {
            const { token } = response.dados;


            setCookie(null, TOKEN_COOKIE, token, {
                maxAge: 8 * 60 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            // queryClient.setQueryData(authKeys.perfil, usuario);
            router.push('/dashboard');
        }
    })
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            destroyCookie(null, TOKEN_COOKIE, { path: '/' });
            queryClient.clear();
            router.push('/login');
        }
    })
}

export function useAlterarSenha() {
    return useMutation({ mutationFn: (payload: AlterarSenhaInput) => authApi.alterarSenha(payload) })
}