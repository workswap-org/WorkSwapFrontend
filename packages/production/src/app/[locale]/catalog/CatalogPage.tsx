"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@core/lib/contexts/I18nContext";

import { listingPublicTypes } from "@core/lib/constants/listingTypes"
import Pagination from "@/components/ui/Pagination/Pagination";
import styles from "./CatalogPage.module.scss"
import CatalogHeader from "@/components/pages/catalog/CatalogHeader/CatalogHeader";
import CatalogSidebar from "@/components/pages/catalog/CatalogSidebar/CatalogSidebar";
import CatalogContent from "@/components/pages/catalog/CatalogContent/CatalogContent";
import clsx from "clsx";
import Checkbox from "@core/components/common/checkbox/Checkbox/Checkbox"
import { useCatalogFilters } from "@core/lib/providers/local/CatalogFiltersProvider";

export default function CatalogPage() {

    const { dict } = useI18n();

    const [sidebarOpened, setSidebarOpened] = useState<boolean>(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

    const contentRef = useRef<HTMLDivElement>(null);

    const { filters, updateFilter } = useCatalogFilters();
    
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
                                className={clsx(styles.type, filters.type === type.key ? styles.active : "")}
                                onClick={() => updateFilter("type", type.key != filters.type ? type.key : null)}
                            >
                                {dict.categories.listingType[type.key]}
                            </button>
                        ))}
                    </div>
                    
                    <Checkbox
                        id="translationsCheckbox"
                        onChange={(e) => updateFilter("translationsFilter", e.target.checked)}
                        checked={!!filters.translationsFilter}
                        className="media-only-block"
                    >{dict.common.catalog.sidebar.translationsFilter}</Checkbox>

                    <CatalogContent />

                    <Pagination />
                </main>
            </div>
        </>
    );
};