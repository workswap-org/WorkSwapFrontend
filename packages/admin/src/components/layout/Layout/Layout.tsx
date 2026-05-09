"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Header from "@/components/layout/Header/Header";
import { useAuth } from "@core/lib/contexts/AuthContext";

import styles from "./Layout.module.scss"
import { AUTH_BASE } from "@core/config";
import { useI18n } from "@core/lib/contexts/I18nContext";

export default function Layout({ children }: any) {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const {user, isAdmin, isAuthenticated } = useAuth();
    const [url, setUrl] = useState<string | null>(null);
    const { dict } = useI18n();

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <>
            <div className={styles.layout}>
                <Sidebar
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                />

                <main className={styles.main}>

                    {user && isAuthenticated && isAdmin && (
                        <>
                            <Header toggleSidebar={() => setSidebarVisible(v => !v)} />

                            {children}
                        </>
                    )}

                    {!isAuthenticated && (
                        <div className={styles.message}>
                            <h1 className={styles.title}>Вы не авторизированы</h1>
                            <span className={styles.subtitle}>войдите в аккаунт</span>
                            <a
                                href={`${AUTH_BASE}/auth${url ? `?redirect=${encodeURIComponent(url || "")}` : ""}`}
                                className={`btn btn-outline-primary ${styles.loginBtn}`}
                            >
                                <span>{dict.buttons.login}</span>
                            </a>
                        </div>
                    )}
                </main>
            </div>

            <div id="modal-root" className={styles.modalRoot}></div>
            <div id="mobile-menu"></div>
        </>
    );
}