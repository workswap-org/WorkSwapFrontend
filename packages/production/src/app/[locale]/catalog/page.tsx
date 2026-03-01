"use client";

import CatalogSidebar from "./CatalogSidebar";
import CatalogHeader from "./CatalogHeader";
import CatalogContent from "./CatalogContent";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogFilters, listingPublicTypes } from "@core/lib"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { Pagination } from "@/components";

const CatalogPage = () => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const { t } = useTranslation('categories')

    const [filters, setFilters] = useState<CatalogFilters>({
        categoryId: Number(searchParams.get("categoryId")) || undefined,
        searchQuery: searchParams.get("searchQuery") || undefined,
        hasReviews: searchParams.get("hasReviews") === "on",
        translationsFilter: searchParams.get("translationsFilter") === "on",
        sortBy: searchParams.get("sortBy") || "date",
        type: searchParams.get("type") || undefined,
        page: Number(searchParams.get("page")) || 0
    });

    console.log(filters);

    const cleanFilters = useMemo(() => {
        const clean: Partial<CatalogFilters> = {};

        (Object.entries(filters) as [keyof CatalogFilters, string | number | boolean | null | undefined][]).forEach(
            ([key, value]) => {
                if (value !== "" && value !== null && value !== false && value !== undefined) {
                    clean[key] = value as any; // здесь можно уточнить конкретные типы, если нужно
                }
            }
        );

        return clean
    }, [filters])

    const [totalPages, setTotalPages] = useState<number>(1);
    const [sidebarOpened, setSidebarOpened] = useState<boolean>(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

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

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    return(
        <>
            <CatalogHeader 
                filters={filters}
                updateFilter={updateFilter}
            />
            {/* Основной контент */}
            <div className="catalog-layout">
                {/* Сайдбар сортировки */}
                <CatalogSidebar
                    filters={filters}
                    updateFilter={updateFilter}
                    sidebarOpened={sidebarOpened}
                    toggleSidebar={toggleSidebar}
                />
                <main className="catalog-main" ref={contentRef}>
                    <div className="listing-types-list">
                        {listingPublicTypes.map((type) => (
                            <button
                                key={type.key}
                                type="button"
                                className={`listing-type-item hover ${filters.type === type.key ? "active" : ""}`}
                                onClick={() => {
                                    if (type.key === filters.type) {
                                        updateFilter("type", null);
                                    } else {
                                        updateFilter("type", type.key);
                                    };
                                }}
                            >
                                {t(`listingType.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                    <div 
                        className="checkbox hover media-only-block"
                        id="translationsFilter"
                    >
                        <input
                            type="checkbox"
                            id="translationsCheckbox"
                            name="translationsCheckbox"
                            checked={filters.translationsFilter}
                            onChange={(e) => updateFilter("translationsFilter", e.target.checked)}
                        />
                        <label htmlFor="translationsCheckbox">
                            <span className="checkmark"></span>
                            <span>{t(`catalog.sidebar.translationsFilter`, { ns: 'common' })}</span>
                        </label>
                    </div>
                    <CatalogContent filters={cleanFilters} setTotalPages={setTotalPages}/>
                    <Pagination
                        page={filters.page ?? 0} 
                        totalPages={totalPages} 
                        selectPage={(page) => updateFilter("page", page)}
                    />
                </main>
            </div>
        </>
    );
};

export default CatalogPage;