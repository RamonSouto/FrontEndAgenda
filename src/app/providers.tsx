//src/app/providers.tsx
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { createQueryClient } from '@/lib/query/queryClient'
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(createQueryClient);
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}