import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['ru', 'kk', 'en'],
    defaultLocale: 'ru',
    localePrefix: 'as-needed',
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};
