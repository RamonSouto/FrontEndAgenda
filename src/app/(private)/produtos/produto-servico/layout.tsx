// src/app/(private)/produtos/produto-servico/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Serviço por Produto",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
