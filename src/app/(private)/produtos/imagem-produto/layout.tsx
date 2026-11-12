// src/app/(private)/produtos/imagem-produto/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Imagem do",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
