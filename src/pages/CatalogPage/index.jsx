import CatalogSidebar from "./CatalogSidebar";
import CatalogHeader from "./CatalogHeader";
import CatalogContent from "./CatalogContent";
import { useEffect, useMemo, useRef, useState } from "react";
import { listingPublicTypes } from "@core/lib"
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Pagination } from "@/components";

const CatalogPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { t } = useTranslation('categories')

    const [filters, setFilters] = useState({
        categoryId: params.get("categoryId") || null,
        searchQuery: params.get("searchQuery") || null,
        hasReviews: params.get("hasReviews") === "on",
        translationsFilter: params.get("translationsFilter") === "on",
        sortBy: params.get("sortBy") || "date",
        type: params.get("type") || null,
        page: Number(params.get("page")) || 0
    });

    console.log(filters);

    const cleanFilters = useMemo(() => {
        const clean = {}
        Object.entries(filters).forEach(([key, value]) => {
            if (
                value !== "" &&
                value !== null &&
                value !== false &&
                value !== undefined
            ) {
                clean[key] = value;
            }
        });

        return clean
    }, [filters])

    const [totalPages, setTotalPages] = useState(1);
    const [sidebarOpened, setSidebarOpened] = useState(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

    function updateFilter(key, value) {
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        function initParams() {
            const newUrlParams = new URLSearchParams(cleanFilters);
            const newUrl = window.location.pathname + "?" + newUrlParams.toString();
            window.history.replaceState({}, "", newUrl);
        }

        initParams();
    }, [cleanFilters])

    const contentRef = useRef(null);

    useEffect(() => {
        contentRef?.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [contentRef, filters.page])

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
                    <CatalogContent params={cleanFilters} setTotalPages={setTotalPages}/>
                    <Pagination
                        page={filters.page} 
                        totalPages={totalPages} 
                        selectPage={(page) => updateFilter("page", page)}
                    />
                </main>
            </div>
        </>
    );
};

export default CatalogPage;