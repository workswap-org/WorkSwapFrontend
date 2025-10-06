import { useLocation, Outlet } from "react-router-dom";
import Header from "@/components/layout/header/Header";
import LanguageSwitcher from "@core/components/layout/LanguageSwitcher";
import ActivePageContext from "@core/lib/contexts/ActivePageContext";

export default function Layout() {
    const location = useLocation();

    const activePage = (() => {
        if (location.pathname.startsWith("/catalog")) return "catalog";
        if (location.pathname.startsWith("/listing")) return "listings";
        if (location.pathname.startsWith("/resume")) return "resumes";
        if (location.pathname.startsWith("/news")) return "news";

        if (location.pathname.startsWith("/secure/account")) return "account";
        if (location.pathname.startsWith("/secure/my-listings")) return "my-listings";
        if (location.pathname.startsWith("/secure/favorites")) return "favorites";
        if (location.pathname.startsWith("/secure/messenger")) return "messenger";
        if (location.pathname.startsWith("/secure/resume")) return "resume";
        if (location.pathname.startsWith("/secure/settings")) return "settings";
        if (location.pathname.startsWith("/secure/security")) return "security";
        return "catalog";
    })();

    return (
        <ActivePageContext.Provider value={activePage}>
            <Header />

            <Outlet />

            <LanguageSwitcher/>
        </ActivePageContext.Provider>
    );
}