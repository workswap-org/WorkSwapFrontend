import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Пропускаем статику и api
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return;
    }

    // Если это корень — редиректим на /en
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/en', request.url));
    }

    // Читаем тему из cookie
    const theme = request.cookies.get('theme')?.value || 'light';

    // Добавляем заголовок для RootLayout
    const response = NextResponse.next();
    response.headers.set('x-theme', theme);

    return response;
}

export const config = {
    matcher: ['/:path*']
};