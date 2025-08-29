import { useEffect, useState } from "react";
import { apiFetch } from "@/components/functions/apiClient";

const CategorySelector = ({category, setCategory}) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadRootCategories() {
            try {
                const data = await apiFetch("/api/categories/root");
                setCategories(data.rootCategories || []);
            } catch(e) {
                console.error(e);
            }
        }

        loadRootCategories();
    }, [])

    return (
        <div className="catalog-header py-3">
            <div className="container">
                <div className="catalog-search-mobile">
                    <form id="searchForm" method="get" action="/catalog">
                        <div className="input-group">
                            <input
                                type="text"
                                className="search-input"
                                name="searchQuery"
                                placeholder="Поиск..."
                            />
                            <input type="hidden" name="category" />
                            <input type="hidden" name="sortBy" />
                            <button className="btn btn-search" type="submit">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>

                <ul className="nav nav-pills justify-content-center" id="categoryMenu">
                    {categories.map((rootCategory) => (
                        <li key={rootCategory.id} className="nav-item dropdown">
                            {/* Корневая категория с подкатегориями */}
                            {rootCategory.children && rootCategory.children.length > 0 ? (
                                <>
                                    <button
                                        type="button"
                                        className="category-link nav-link dropdown-toggle"
                                        onClick={() => {
                                            setCategory(rootCategory.name)
                                        }}
                                        /* data-bs-toggle="dropdown" */
                                        aria-expanded="false"
                                    >
                                        <i className="fa-solid fa-handshake me-2"></i>
                                        <span>{rootCategory.translate}</span>
                                    </button>
                                    {/* <ul className="dropdown-menu">
                                        {rootCategory.children.map((child) => (
                                            <li key={child.id}>
                                                <button
                                                    className="category-link dropdown-item"
                                                    data-category={child.name}
                                                    onClick={() => {
                                                        setCategory(child.name)
                                                    }}
                                                >
                                                    {child.displayName || child.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul> */}
                                </>
                            ) : (
                                // Корневая категория без подкатегорий
                                <button
                                    className={`category-link nav-link ${category === rootCategory.name ? "active" : ""}`}
                                    onClick={() => {
                                            if (rootCategory.name === category) {
                                                setCategory(null);
                                            } else {
                                                setCategory(rootCategory.name);
                                            };
                                        }}
                                    data-category={rootCategory.name}
                                >
                                    <i className="fa-solid fa-suitcase me-2"></i>
                                    <span>{rootCategory.translate}</span>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

                <button id="mobileFilterButton" className="btn btn-filter-sidebar" type="button">
                    <i className="fa-solid fa-filter"></i>
                </button>
            </div>
        </div>
    );
};

export default CategorySelector;