import { Outlet } from "react-router-dom";
import { Sidebar, Header } from "@/components";
import { useAuth, apiFetchJson } from "@core/lib";
import { useState } from "react";

export default function Layout() {
    const { user } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    function toggleSidebar() {
        setSidebarVisible(!sidebarVisible);
    }
    
    const handleLogout = () => {
        apiFetchJson("/logout", { method: "POST", credentials: "include" }).then(() => {});
    };

    return (
        <div className="admin-layout">
            <Sidebar 
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
            />
            <main className="admin-main">
                <Header
                    user={user || undefined}
                    onLogout={handleLogout}
                    toggleSidebar={toggleSidebar}
                />
                <Outlet />
            </main>
            {/* Глобальные модалки можно держать тут */}
            {/* <ErrorModal /> */}
            {/* <AdminModalPortal /> */}
        </div>
    );
}