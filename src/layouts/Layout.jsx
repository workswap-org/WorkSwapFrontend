import { useLocation, Outlet } from "react-router-dom";
import Header from "@/components/header/Header";
import { useAuth } from "@/contexts/auth/useAuth";
import "#/css/public/components/base.css";
import { apiFetch } from "@/components/functions/apiClient";

export default function Layout() {
    const location = useLocation();

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Загрузка...</div>; // или скелетон/спиннер
    }

    const activePage = (() => {
        if (location.pathname.startsWith("/catalog")) return "catalog";
        if (location.pathname.startsWith("/listing")) return "listings";
        if (location.pathname.startsWith("/resume")) return "resumes";
        if (location.pathname.startsWith("/news")) return "news";
        return "catalog";
    })();

    const handleLogout = () => {
        apiFetch("/logout", { method: "POST", credentials: "include" }).then(() => {});
    };

    return (
        <>
            <Header
                activePage={activePage}
                user={user || undefined}
                onLogout={handleLogout}
            />

            <Outlet />
        </>
    );
}