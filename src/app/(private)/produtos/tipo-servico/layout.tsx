// src/app/(private)/produtos/tipo-servico/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tipo de Serviço",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
