import { AppProviders } from "@core/lib/providers/AppProviders";
import "@/css/main.scss";
import Script from "next/script";
import { ReactNode } from "react";
import { Header } from "@/components";

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

    return (
        <html lang={locale}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v7.0.0/css/all.css"
                />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body>
                {/* Theme initializer before hydration */}
                <Script id="theme-init" strategy="beforeInteractive">
                    {`
                        (function() {
                            const savedTheme = localStorage.getItem('theme');
                            let theme = 'light';
                            
                            if (savedTheme) {
                                theme = savedTheme;
                            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                theme = 'dark';
                            }

                            document.documentElement.setAttribute('data-theme', theme);
                        })();
                    `}
                </Script>

                <AppProviders>
                <div id="root">
                    <Header />
                    {children}

                    {/* <LanguageSelectModal /> */}
                </div>

                <div id="modal-root"></div>
                <div id="mobile-menu"></div>
                </AppProviders>
            </body>
        </html>
    );
}