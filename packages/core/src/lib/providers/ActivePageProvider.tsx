"use client";

import { ReactNode, useMemo } from 'react';
import { ActivePageContext, PageKey } from "../contexts/ActivePageContext";
import { usePathname } from "next/navigation";


export const ActivePageProvider = ({ children }: {children: ReactNode}) => {

    const pathname = usePathname();

    const mapping: Record<string, PageKey> = {
        dashboard: "dashboard",
        listings: "listings",
        resumes: "resumes",
        users: "users",
        locations: "locations",
        categories: "categories",
        tasks: "tasks",
        localization: "localization",
        permissions: "permissions",
    };

    const activePage = useMemo<PageKey | null>(() => {
        const segments = pathname.split("/").filter(Boolean);

        const pageSegment = segments[1];

        return pageSegment && pageSegment in mapping
            ? mapping[pageSegment]
            : null;
    }, [pathname]);

    return (
        <ActivePageContext.Provider value={activePage}>
            {children}
        </ActivePageContext.Provider>
    );
};