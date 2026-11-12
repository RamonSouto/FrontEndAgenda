//src/lib/auth/permissions.ts
export type Papel = 'admin' | 'secretaria' | 'costureira'

export const ROUTE_PERMISSIONS: Record<string, Papel[]> = {
    '/produtos/categoria': ['admin'],
    '/produtos/tamanho': ['admin'],
    '/produtos/cor-estampa': ['admin'],
    '/produtos/grade': ['admin'],
    '/produtos/produto': ['admin'],
    '/pessoas': ['admin', 'secretaria'],
    '/agendamentos': ['admin', 'secretaria', 'costureira'],
    '/agendamentos/tipo': ['admin'],
    '/relatorios/dashboard': ['admin', 'secretaria', 'costureira'],
    '/relatorios/auditoria': ['admin'],
    '/relatorios/produtividade': ['admin'],
}

export function hasRole(userRole: Papel, allowed: Papel[]): boolean {
    return allowed.includes(userRole);
}

export function canAccessRoute(pathname: string, userRole: Papel): boolean {
    const rule = Object.entries(ROUTE_PERMISSIONS).find(([prefix]) => pathname.startsWith(prefix));
    if (!rule) return true;
    const [, allowed] = rule;
    return hasRole(userRole, allowed)
}