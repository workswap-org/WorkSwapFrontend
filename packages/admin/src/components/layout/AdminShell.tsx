"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AppProviders } from "@core/lib/providers/AppProviders";

export function AdminShell({ children, theme }: any) {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return (
        <>
            <div className="admin-layout">
                <Sidebar
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                />

                <main className="admin-main">
                    <Header toggleSidebar={() => setSidebarVisible(v => !v)} />
                    {children}
                </main>
            </div>

            <div id="modal-root" />
            <div id="mobile-menu" />
        </>
    );
}