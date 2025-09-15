import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';

const SortCategorySelector = ({categoryId, setCategoryId}) => {

    const { t } = useTranslation('categories')

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadRootCategories() {
            try {
                const data = await apiFetch("/api/categories");
                setCategories(data.categories || []);
            } catch(e) {
                console.error(e);
            }
        }

        loadRootCategories();
    }, [])

    const children = (id) => {
        const childrenList = categories
            .filter(category => category.parentId === id);

        return childrenList;
    }

    const rootCategories = () => {
        return categories.filter(category => category.parentId === null);
    }

    return (
        <div className="catalog-header">
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
                    {rootCategories().map((rootCategory) => (

                        <li key={rootCategory.id} className="nav-item dropdown">
                            {/* Корневая категория с подкатегориями */}
                            <>
                                <button
                                    type="button"
                                    className={`category-link nav-link ${categoryId === rootCategory.id ? "active" : ""}`}
                                    onClick={() => {
                                        if (rootCategory.name === categoryId) {
                                            setCategoryId(null);
                                        } else {
                                            setCategoryId(rootCategory.id);
                                        };
                                    }}
                                    aria-expanded="false"
                                >
                                    <i className="fa-solid fa-handshake me-2"></i>
                                    <span>{t(`category.${rootCategory.name}`, { ns: 'categories' })}</span>
                                </button>

                                {children(rootCategory.id).length != 0 && (
                                    <ul className="dropdown-menu">
                                        {children(rootCategory.id).map((child) =>
                                            <li key={child.id}>
                                                <button
                                                    className={`category-link dropdown-item ${categoryId === child.id ? "active" : ""}`}
                                                    onClick={() => {
                                                        if (child.id === categoryId) {
                                                            setCategoryId(null);
                                                        } else {
                                                            setCategoryId(child.id);
                                                        };
                                                    }}
                                                >
                                                    {t(`category.${child.name}`, { ns: 'categories' })}
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SortCategorySelector;