import CatalogSidebar from "./CatalogSidebar";
import "@/css/pages/catalog-page.css"
import SortCategorySelector from "./SortCategorySelector";
import CatalogContent from "./CatalogContent";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CatalogPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const [categoryId, setCategoryId] = useState(params.get("categoryId") || "");
    const [searchQuery, setSearchQuery] = useState(params.get("searchQuery") || "");
    const [hasReviews, setHasReviews] = useState(params.get("hasReviews") || false);
    const [activeSort, setActiveSort] = useState(params.get("sortBy") || "date");

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

            setSearchParams(newParams);

            const newUrlParams = new URLSearchParams(newParams);
            const newUrl = window.location.pathname + "?" + newUrlParams.toString();
            window.history.replaceState({}, "", newUrl);
        }

        initParams();
    }, [categoryId, searchQuery, hasReviews, activeSort])

    return(
        <>
            <SortCategorySelector 
                categoryId={categoryId} 
                setCategoryId={setCategoryId}
            />
            {/* Основной контент */}
            <div className="catalog-container">
                <div className="catalog-layout">
                    {/* Сайдбар сортировки */}
                    <CatalogSidebar 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery}
                        hasReviews={hasReviews} 
                        setHasReviews={setHasReviews}
                        activeSort={activeSort}
                        setActiveSort={setActiveSort}
                        sidebarOpened={sidebarOpened}
                        toggleSidebar={toggleSidebar}
                    />
                    <main className="catalog-main">
                        <CatalogContent params={searchParams}/>
                    </main>
                </div>
            </div>
        </>
    );
};

export default CatalogPage;