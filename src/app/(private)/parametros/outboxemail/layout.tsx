// src/app/(private)/parametros/outbox/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Caixa de saída - Email",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
