import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';

const CatalogHeader = ({
    searchQuery,
    setSearchQuery,
    categoryId, 
    setCategoryId
}) => {

    const { t } = useTranslation('categories')

    const [categories, setCategories] = useState([]);
    const [categoriesMenu, setCategoriesMenu] = useState(false);

    function toggleCategoriesMenu() {
        setCategoriesMenu(!categoriesMenu);
    }

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
            <div className="catalog-header-content">
                <div className="catalog-search-mobile">
                    <div className="listings-search">
                        <input
                            type="text"
                            className="search-input"
                            name="searchQuery"
                            placeholder="Поиск..."
                        />
                        <button className="btn btn-search" type="submit">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                <button className="btn btn-primary categories-btn" onClick={() => toggleCategoriesMenu()}>
                    <div><i class="fa-solid fa-list fa-lg perm-light"></i></div>
                    <span>Все категории</span>
                </button>

                <div className={`categories-container ${categoriesMenu ? "active" : ""}`}>
                    <ul className="nav-pills" id="categoryMenu">
                        {rootCategories().map((rootCategory) => (

                            <li key={rootCategory.id} className="nav-item dropdown">
                                {/* Корневая категория с подкатегориями */}
                                <>
                                    <button
                                        type="button"
                                        className={`category-link nav-link ${categoryId === rootCategory.id ? "active" : ""}`}
                                        onClick={() => {
                                            if (rootCategory.id === categoryId) {
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

                <div className="sorting-search">
                    <div className="listings-search">
                        <input 
                            type="text" 
                            className="search-input" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            name="searchQuery"
                            placeholder={t('placeholders.search', { ns: 'common' })}
                        />
                        <input type="hidden" name="category"/>
                        <input type="hidden" name="sortBy"/>
                        <button className="btn btn-search" type="button">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogHeader;