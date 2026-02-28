// app/layout.tsx
import "./globals.css";
import Script from "next/script";

export const metadata = {
    title: "WorkSwap",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
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

                {children}

                {/* Порталы как в старом React */}
                <div id="modal-root"></div>
                <div id="mobile-menu"></div>
            </body>
        </html>
    );
}