//src/middleware.ts
// import { redirect } from 'next/dist/server/api-utils';
// import { NextResponse, type NextRequest } from 'next/server';

// const PUBLIC_PATHS = ['/login', 'manifest.webmanifest']

// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

//     const token = request.cookies.get('agenda.token')?.value;
//     const isPublic = request.nextUrl.pathname.startsWith('/login');

//     console.log(isPublic);

//     if (!token) {
//         const loginUrl = new URL('/login', request.url);
//         loginUrl.searchParams.set('redirect', pathname);
//         return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next
// }

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.icon).*)']
// }
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('agenda.token')?.value; // ajuste conforme seu método
    const isPublic = request.nextUrl.pathname.startsWith('/login');

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (token && isPublic) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};