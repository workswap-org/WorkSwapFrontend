import { AppProviders } from "@core/lib/providers/AppProviders";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n";
import { parseLocale } from '@core/lib/constants/languages'
import { I18nProvider } from "@core/lib/contexts/I18nContext";
import Header from "@/components/layout/header/Header";

import "@/css/main.scss";
import "@/css/components/layout.scss";

export const metadata = {
    title: "WorkSwap",
};

export function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'ru' },
        { locale: 'fi' }
    ];
}

export default async function RootLayout({ 
    children, 
    params 
}: { 
    children: ReactNode; 
    params: Promise<{ locale: string }>;
}) {

    const { locale } = await params;
    const parsed = parseLocale(locale)
    const dict = await getDictionary(parsed);

    const loadedHeaders = await headers()
    const theme = loadedHeaders.get("x-theme") || "light";

    return (
        <html lang={locale} data-theme={theme}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v7.0.0/css/all.css"
                />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body>
                <I18nProvider locale={parsed} dict={dict}>
                    <AppProviders>
                    <div id="root">
                        <Header />
                        {children}

                        {/* <LanguageSelectModal /> */}
                    </div>

                    <div id="modal-root"></div>
                    <div id="mobile-menu"></div>
                    </AppProviders>
                </I18nProvider>
            </body>
        </html>
    );
}