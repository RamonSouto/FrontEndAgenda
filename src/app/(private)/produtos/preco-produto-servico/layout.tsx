// src/app/(private)/produtos/preco-produto-servico/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preço do Serviço por Produto",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
