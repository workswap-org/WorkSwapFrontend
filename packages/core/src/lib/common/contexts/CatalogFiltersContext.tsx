"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ICatalogFilters } from "@core/lib/common/types/catalog";

type CatalogFiltersContextType = {
    filters: ICatalogFilters;
    updateFilter: (key: string, value: string | boolean | number | null) => void;
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export const CatalogFiltersContext = createContext<CatalogFiltersContextType | undefined>(undefined)

export function useCatalogFilters() {
    const context = useContext(CatalogFiltersContext)
    if (!context) throw new Error("useFilters must be used inside FiltersProvider")
    return context
}

export function CatalogFiltersProvider({ initialFilters, children }: { initialFilters: ICatalogFilters; children: ReactNode }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [totalPages, setTotalPages] = useState<number>(1);
    const [filters, setFilters] = useState<ICatalogFilters>(initialFilters);

    const cleanFilters = useMemo(() => {
        const clean: Partial<ICatalogFilters> = {};

        (Object.entries(filters) as [keyof ICatalogFilters, string | number | boolean | null | undefined][]).forEach(
            ([key, value]) => {
                if (value !== "" && value !== null && value !== false && value !== undefined) {
                    clean[key] = value as any; // здесь можно уточнить конкретные типы, если нужно
                }
            }
        );

        return clean
    }, [filters])

    function updateFilter(key: string, value: string | number | boolean | null) {
        console.log("обновляем фильтр", key, value)
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        const currentQuery: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            currentQuery[key] = value;
        });

        const newQuery: Record<string, string> = {};

        for (const [k, v] of Object.entries(cleanFilters)) {
            if (v !== undefined && v !== null) {
                newQuery[k] = String(v);
            }
        }

        const hasChanges =
            Object.keys(newQuery).length !== Object.keys(currentQuery).length ||
            Object.entries(newQuery).some(([k, v]) => currentQuery[k] !== v);

        if (hasChanges) {
            const paramsString = new URLSearchParams(newQuery).toString();

            const newUrl = paramsString
                ? `${pathname}?${paramsString}`
                : pathname;

            window.history.pushState(null, "", newUrl);
        }
    }, [cleanFilters, pathname]);

    return (
        <CatalogFiltersContext.Provider value={{ filters, updateFilter, totalPages, setTotalPages }}>
            {children}
        </CatalogFiltersContext.Provider>
    )
}
