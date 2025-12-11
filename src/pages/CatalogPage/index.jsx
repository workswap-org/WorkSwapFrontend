import CatalogSidebar from "./CatalogSidebar";
import CatalogHeader from "./CatalogHeader";
import CatalogContent from "./CatalogContent";
import { useEffect, useMemo, useState } from "react";
import { listingPublicTypes } from "@core/lib"
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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

    function getPageNumbers(page, totalPages) {
        const maxButtons = 5;

        if (totalPages <= maxButtons) {
            return Array.from({ length: totalPages }, (_, i) => i); // 0-based
        }

        const pages = [];

        // первая
        pages.push(0);

        let start = Math.max(page - 1, 1);
        let end = Math.min(page + 1, totalPages - 2);

        // если рядом с началом
        if (page <= 2) {
            start = 1;
            end = 3;
        }

        // если рядом с концом
        if (page >= totalPages - 3) {
            start = totalPages - 4;
            end = totalPages - 2;
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // последняя
        pages.push(totalPages - 1);

        return pages;
    }

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
                <main className="catalog-main">
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
                    <div className="pagination">
                        <button disabled={filters.page === 0} onClick={() => updateFilter("page", filters.page - 1)}>
                            Назад
                        </button>

                        {getPageNumbers(filters.page, totalPages).map(p => (
                            <button
                                key={p}
                                id="pageNumber"
                                className={p === filters.page ? "active" : ""}
                                onClick={() => updateFilter("page", p)}
                            >
                                {p + 1}
                            </button>
                        ))}

                        <button disabled={filters.page + 1 >= totalPages} onClick={() => updateFilter("page", filters.page + 1)}>
                            Вперёд
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default CatalogPage;