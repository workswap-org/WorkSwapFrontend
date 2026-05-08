"use client";

import { ReactNode, useMemo } from 'react';
import { ActivePageContext, PageKey } from "../contexts/ActivePageContext";
import { usePathname } from "next/navigation";


export const ActivePageProvider = ({ children }: {children: ReactNode}) => {

    const pathname = usePathname(); // заменяем useLocation
        const mapping: Record<string, PageKey> = {
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

    function getSectionFromPath(pathname: string): PageKey | undefined {
        for (const key in mapping) {
            if (pathname.startsWith(key)) {
                return mapping[key];
            }
        }
    }

    const activePage = useMemo(
        () => getSectionFromPath(pathname),
        [pathname]
    );

    return (
        <ActivePageContext.Provider value={activePage}>
            {children}
        </ActivePageContext.Provider>
    );
};