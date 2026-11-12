//src/app/(public)/login/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginInput } from '@/features/auth/schema'
import { ApiError } from '@/lib/http/errors'
import logo from "../../../../public/img/logo.png"
import logoNegativa from "../../../../public/img/logo-negativa.png"
import atelie from "../../../../public/img/atelie.jpg"
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ButtonGroup } from '@/components/ui/button-group'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Metadata } from 'next'


export default function LoginPage() {
    const [form, setForm] = useState<LoginInput>({ user: '', senha: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { mutate: login, isPending } = useLogin()

    function handleSubmit(e: React.FormEvent) {

        e.preventDefault()

        const result = loginSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginInput, string>> = {}
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginInput;
                fieldErrors[field] = issue.message
            })
            setErrors(fieldErrors);
            return;
        }

        setErrors({})
        login(result.data, {
            onError: (error) => {
                const title = error instanceof ApiError ? error.message : 'Erro ao autenticar'
                const message = error instanceof ApiError ? error.details : 'Erro ao autenticar'
                toast.error(title, { description: message })
            },
            onSuccess: () => {
                toast.success('Login realizado com sucesso')
            }
        })

    }



    return (
        <main className="flex h-screen flex-col lg:flex-row">
            <div
                className="flex flex-col shrink justify-end-safe h-1/3 bg-cover bg-center bg-no-repeat lg:order-2 lg:h-screen lg:w-2/3"
                style={{
                    backgroundImage: `url(${atelie.src})`,
                    opacity: '0.3',
                    //"url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80')",
                }}
                role="img"
                aria-label="Imagem decorativa de fundo"
            >
                {/* <Image src=
                    alt=""
                    fill
                    className="flex -z-100"
                    priority /> */}
                {/* <div className='flex flex-col min-h-1/4 max-h-1/2 lg:min-h-1/6 lg:max-h-1/4 w-full inset-0 p-4 bg-black/80 dark:bg-white/80 overflow-hidden invisible  lg:visible'>
                    <div className="bottom-24 left-16 right-16 text-white dark:text-primary max-w-2xl lg:pb-3 lg:pt-3">
                        <p className="shrink truncate text-sm lg:text-2xl font-bold mb-4 drop-shadow-lg leading-tight">Soluções inteligentes para sua empresa</p>
                        <p className="shrink truncate text-xs lg:text-xl font-bold mb-4 drop-shadow-lg leading-tight">Soluções inteligentes para sua empresa</p>
                    </div>
                    <div className="flex bottom-10 left-16 space-x-3 justify-center">
                        <button aria-label="Slide 1" className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-white dark:bg-primary opacity-100 focus:outline-none"></button>
                        <button aria-label="Slide 2" className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-white dark:bg-primary opacity-50 hover:opacity-80 focus:outline-none transition-opacity"></button>
                        <button aria-label="Slide 3" className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-white dark:bg-primary opacity-50 hover:opacity-80 focus:outline-none transition-opacity"></button>
                    </div>
                </div> */}
            </div>

            <div className="flex h-2/3 items-center justify-center px-6 lg:order-1 lg:h-screen lg:w-1/3 lg:px-12 z-0">
                <div className="w-full max-w-sm">
                    {/* 1.1 — Logo horizontal centralizada */}
                    <div className="mb-0 lg:mb-8 flex justify-center">
                        <div className="flex items-center gap-2 relative h-30 w-30 lg:h-[200px] lg:w-[200px]">
                            <Image src={logo}
                                alt="Logomarca Bood Acessoria"
                                fill
                                className="object-contain"
                                priority />
                            <Image
                                src={logoNegativa}
                                alt="Logomarca Bood Acessoria"
                                fill
                                className="object-contain opacity-0 dark:opacity-100"
                                priority />
                        </div>
                    </div>



                    <Field className='mb-4'>
                        <FieldLabel className='font-semibold text-2xl'>LOGIN</FieldLabel>
                        <FieldDescription className='font-normal text-[12px]'>Entre com suas credenciais para acessar sua conta.</FieldDescription>
                    </Field>


                    {/* <h1 className="mb-1 text-left text-lg lg:text-2xl font-bold text-primary dark:text-primary-300">
                        LOGIN
                    </h1>

                    <p className="mb-6 text-left text-xs lg:text-sm text-primary dark:text-primary-300">
                        Entre com suas credenciais para acessar sua conta.
                    </p> */}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div>
                            <Field>
                                <FieldLabel>Usuário</FieldLabel>
                                <Input type='text'
                                    id="username"
                                    name="username"
                                    value={form.user}
                                    onChange={(e) => setForm((prev) => ({ ...prev, user: e.target.value }))}
                                    required
                                    placeholder='Entre com seu usário'></Input>
                                {errors.user ? <FieldDescription className='text-red-700 font-light text-[12px]'>{errors.user}</FieldDescription> : <FieldDescription className='text-red-700 font-light text-[12px]'>  </FieldDescription>}
                            </Field>
                        </div>

                        <div>
                            <Field>
                                <FieldLabel>Senha</FieldLabel>
                                <ButtonGroup>
                                    <Input type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={form.senha}
                                        onChange={(e) => setForm((prev) => ({ ...prev, senha: e.target.value }))}
                                        required
                                        placeholder='Sua senha'></Input>
                                    <Button
                                        size="icon"
                                        onClick={() => { setShowPassword(!showPassword) }}
                                        variant="outline"
                                        aria-label='Mostrar Senha'
                                        className="bg-primary-foreground">
                                        {!showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                                    </Button>
                                </ButtonGroup>
                                {errors.senha && <FieldDescription className='text-red-700 font-light text-[12px]'>{errors.senha}</FieldDescription>}
                            </Field>
                        </div>

                        <div className="flex items-center justify-between">
                            <FieldGroup>
                                <Field orientation='horizontal'>
                                    <Checkbox id='lembrar' onCheckedChange={(e) => { setRememberMe }} />
                                    <FieldLabel htmlFor="lembrar" className='font-light'>Lembrar dados</FieldLabel>
                                </Field>
                            </FieldGroup>
                            <Button variant="link" className="font-bold">Esqueceu a senha?</Button>
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full " size="lg">{isPending ? <>Entrando <Spinner data-icon="inline-start" /></> : 'Entrar'}</Button>
                    </form>
                </div>
            </div>
        </main >
    )
}