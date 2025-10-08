import CatalogSidebar from "./CatalogSidebar";
import CatalogHeader from "./CatalogHeader";
import CatalogContent from "./CatalogContent";
import { useEffect, useState } from "react";
import { listingTypes } from "@core/lib"
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const CatalogPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { t } = useTranslation('categories')

    const [categoryId, setCategoryId] = useState(params.get("categoryId") || "");
    const [searchQuery, setSearchQuery] = useState(params.get("searchQuery") || "");
    const [hasReviews, setHasReviews] = useState(params.get("hasReviews") || false);
    const [activeSort, setActiveSort] = useState(params.get("sortBy") || "date");
    const [listingType, setListingType] = useState(params.get("type") || "");

    const [sidebarOpened, setSidebarOpened] = useState(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

    const [searchParams, setSearchParams] = useState({});

    useEffect(() => {
        function initParams() {
            const newParams = {};

            if (categoryId) newParams.categoryId = categoryId;
            if (activeSort) newParams.sortBy = activeSort;
            if (searchQuery) newParams.searchQuery = searchQuery;
            if (hasReviews) newParams.hasReviews = "on";
            if (listingType) newParams.type = listingType;

            setSearchParams(newParams);

            const newUrlParams = new URLSearchParams(newParams);
            const newUrl = window.location.pathname + "?" + newUrlParams.toString();
            window.history.replaceState({}, "", newUrl);
        }

        initParams();
    }, [categoryId, searchQuery, hasReviews, activeSort, listingType])

    return(
        <>
            <CatalogHeader 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryId={categoryId} 
                setCategoryId={setCategoryId}
            />
            {/* Основной контент */}
            <div className="catalog-layout">
                {/* Сайдбар сортировки */}
                <CatalogSidebar
                    hasReviews={hasReviews} 
                    setHasReviews={setHasReviews}
                    activeSort={activeSort}
                    setActiveSort={setActiveSort}
                    sidebarOpened={sidebarOpened}
                    toggleSidebar={toggleSidebar}
                />
                <main className="catalog-main">
                    <div className="listing-types-list">
                        {listingTypes.map((type) => (
                            <button
                                key={type.key}
                                type="button"
                                className={`listing-type-item hover ${listingType === type.key ? "active" : ""}`}
                                onClick={() => {
                                    if (type.key === listingType) {
                                        setListingType(null);
                                    } else {
                                        setListingType(type.key);
                                    };
                                }}
                            >
                                {t(`listingType.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                    <CatalogContent params={searchParams}/>
                </main>
            </div>
        </>
    );
};

export default CatalogPage;