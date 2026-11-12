//src/components/shared/Can.tsx
'use client';
import { useAuth } from "@/features/auth/hooks";
import type { Papel } from "@/lib/auth/permissions";
import React from "react";

interface CanProps {
    roles: Papel[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
    const { data: usuario } = useAuth();
    if (!usuario || !roles.includes(usuario.papel)) return <>{fallback}</>;
    return <>{children}</>
}