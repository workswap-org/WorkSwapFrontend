"use client";

import { useEffect, useRef, useState } from "react";
import { CatalogFiltersProvider } from "@core/lib/providers/local/CatalogFiltersProvider"
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext";
import { listingPublicTypes } from "@core/lib/constants/listingTypes"
import Pagination from "@/components/ui/Pagination/Pagination";
import styles from "./CatalogPage.module.scss"
import CatalogHeader from "@/components/pages/catalog/CatalogHeader/CatalogHeader";
import CatalogSidebar from "@/components/pages/catalog/CatalogSidebar/CatalogSidebar";
import CatalogContent from "@/components/pages/catalog/CatalogContent/CatalogContent";

export default function CatalogPageWrapper() {

    return (
        <CatalogFiltersProvider>
            <CatalogPage />
        </CatalogFiltersProvider>
    )
}

function CatalogPage() {

    const { dict } = useI18n();

    const [sidebarOpened, setSidebarOpened] = useState<boolean>(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

    const contentRef = useRef<HTMLDivElement>(null);

    const { filters, updateFilter, totalPages } = useCatalogFilters();
    
    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    return(
        <>
            <CatalogHeader />
            <div className={styles.layout}>
                <CatalogSidebar
                    sidebarOpened={sidebarOpened}
                    toggleSidebar={toggleSidebar}
                />
                <main className={styles.main} ref={contentRef}>
                    <div className={styles.typesList}>
                        {listingPublicTypes.map((type) => (
                            <button
                                key={type.key}
                                type="button"
                                className={`${styles.type} hover ${filters.type === type.key ? styles.active : ""}`}
                                onClick={() => {
                                    if (type.key === filters.type) {
                                        updateFilter("type", null);
                                    } else {
                                        updateFilter("type", type.key);
                                    };
                                }}
                            >
                                {dict.categories.listingType[type.key]}
                            </button>
                        ))}
                    </div>
                    <div 
                        className={`checkbox hover media-only-block`}
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
                            <span>{dict.common.catalog.sidebar.translationsFilter}</span>
                        </label>
                    </div>
                    <CatalogContent />
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