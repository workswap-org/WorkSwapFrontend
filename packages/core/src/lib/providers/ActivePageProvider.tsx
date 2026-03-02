"use client";

import { ReactNode, useMemo } from 'react';
import { ActivePageContext } from "../contexts/ActivePageContext";
import { usePathname } from "next/navigation";

export const ActivePageProvider = ({ children }: {children: ReactNode}) => {

    const pathname = usePathname(); // заменяем useLocation
    const activePage = useMemo(() => getSectionFromPath(pathname) ?? "none", [pathname]);

    function getSectionFromPath(pathname: string): string | undefined {
        const mapping: Record<string, string> = {
            "/catalog": "catalog",
            "/listing": "listing",
            "/event": "event",
            "/resume": "resumes",
            "/news": "news",

            "/account/account": "account",
            "/account/my-listings": "my-listings",
            "/account/favorites": "favorites",
            "/account/messenger": "messenger",
            "/account/resume": "resume",
            "/account/settings": "settings",
            "/account/security": "security",

            "/dashboard": "dashboard",
            "/listings": "listings",
            "/resumes": "resumes",
            "/users": "users",
            "/locations": "locations",
            "/categories": "categories",
            "/tasks": "tasks",
            "/localization": "localization",
            "/permissions": "permissions",
        };

        return Object.entries(mapping).find(([prefix]) => pathname.startsWith(prefix))?.[1];
    }

    return (
        <ActivePageContext.Provider value={activePage}>
            {children}
        </ActivePageContext.Provider>
    );
};