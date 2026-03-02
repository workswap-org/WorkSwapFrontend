"use client"

import { ReactNode, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ICatalogFilters } from "@core/lib/types/catalog";
import { CatalogFiltersContext } from "@core/lib/contexts/local/CatalogFiltersContext";

export function CatalogFiltersProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [filters, setFilters] = useState<ICatalogFilters>({
        categoryId: Number(searchParams.get("categoryId")) || undefined,
        searchQuery: searchParams.get("searchQuery") || undefined,
        hasReviews: searchParams.get("hasReviews") === "on",
        translationsFilter: searchParams.get("translationsFilter") === "on",
        sortBy: searchParams.get("sortBy") || "date",
        type: searchParams.get("type") || undefined,
        page: Number(searchParams.get("page")) || 0
    });

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

    const [totalPages, setTotalPages] = useState<number>(1);

    function updateFilter(key: string, value: string | number | boolean | null) {
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        // Создаём объект из текущих query
        const currentQuery: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            currentQuery[key] = value;
        });

        // Создаём новый объект query из cleanFilters
        const newQuery: Record<string, string> = {};
        for (const [k, v] of Object.entries(cleanFilters)) {
            if (v !== undefined && v !== null) {
                newQuery[k] = String(v);
            }
        }

        // Проверяем, есть ли реальные изменения
        const hasChanges = Object.keys(newQuery).length !== Object.keys(currentQuery).length ||
            Object.entries(newQuery).some(([k, v]) => currentQuery[k] !== v);

        if (hasChanges) {
            const paramsString = new URLSearchParams(newQuery).toString();
            router.replace(`${pathname}?${paramsString}`, { scroll: false });
        }
    }, [cleanFilters, router, pathname, searchParams]);

    return (
        <CatalogFiltersContext.Provider value={{ filters, updateFilter, totalPages, setTotalPages }}>
            {children}
        </CatalogFiltersContext.Provider>
    )
}
