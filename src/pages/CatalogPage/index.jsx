import CatalogSidebar from "./CatalogSidebar";
import "#/css/public/pages/catalog-page.css";
import CategorySelector from "./CategorySelector";
import CatalogContent from "./CatalogContent";
import { useEffect, useState } from "react";

const CatalogPage = () => {

    const [category, setCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [hasReviews, setHasReviews] = useState(false);
    const [activeSort, setActiveSort] = useState("date");

    const [params, setParams] = useState({});

    useEffect(() => {
        console.log("new category", category)
    }, [category])

    useEffect(() => {
        function initParams() {
            const newParams = {};

            if (category) newParams.category = category;
            if (activeSort) newParams.sortBy = activeSort;
            if (searchQuery) newParams.searchQuery = searchQuery;
            if (hasReviews) newParams.hasReviews = "on";

            setParams(newParams);
        }

        initParams();
    }, [category, searchQuery, hasReviews, activeSort])

    return(
        <>
            <CategorySelector category={category} setCategory={setCategory}/>
            {/* Основной контент */}
            <div className="catalog-container">
                <div className="catalog-layout">
                    {/* Сайдбар сортировки */}
                    <CatalogSidebar/>
                    <main className="catalog-main">
                        <CatalogContent params={params}/>
                    </main>
                </div>
            </div>
        </>
    );
};

export default CatalogPage;