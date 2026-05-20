import { ReactNode } from "react";
import "@/css/main.scss";
import Layout from "@/components/layout/Layout/Layout";
import { headers } from "next/headers";
import { I18nProvider } from "@core/lib/contexts/I18nContext";
import { parseLocale } from "@core/lib/constants/languages";
import { getDictionary } from "@/lib/i18n";
import { ActivePageProvider } from "@core/lib/providers/ActivePageProvider";
import { AppProviders } from "@core/lib/providers/AppProviders";

export const metadata = {
    title: "WorkSwap Dashboard",
};

export function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'ru' },
        { locale: 'fi' }
    ];
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }>;}) {

    const { locale } = await params;
    const parsed = parseLocale(locale)
    const dict = await getDictionary(parsed);

    const loadedHeaders = await headers()
    const theme = loadedHeaders.get("x-theme") || "light";

    return (
        <html lang={parsed || "ru"} data-theme={theme} data-scroll-behavior="smooth">
            <body>
                <I18nProvider locale={parsed} dict={dict}>
                    <AppProviders>
                        <Layout theme={theme}>
                            {children}
                        </Layout>
                    </AppProviders>
                </I18nProvider>
            </body>
        </html>
    );
}