import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';

const CategoriesSelector = ({
    categoriesMenu,
    categoryId,
    setCategoryId
}) => {

    const [categories, setCategories] = useState([]);
    const [selectedRootCategory, setRootCategory] = useState([]);

    const { t } = useTranslation('categories')
    
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
       <div className={`categories-container ${categoriesMenu ? "active" : ""}`}>
            <div className="root-categories-list">
                {rootCategories().map((rootCategory) => (
                    <button
                        key={rootCategory.id}
                        type="button"
                        className={`root-category-item hover ${categoryId === rootCategory.id ? "active" : ""}`}
                        onClick={() => {
                            if (rootCategory.id === categoryId) {
                                setRootCategory(null)
                                setCategoryId(null);
                            } else {
                                setCategoryId(rootCategory.id);
                                setRootCategory(rootCategory)
                            };
                        }}
                        aria-expanded="false"
                    >
                        <i className="fa-solid fa-handshake me-2"></i>
                        <span>{t(`category.${rootCategory.name}`, { ns: 'categories' })}</span>
                    </button>
                ))}
            </div>
            {children(selectedRootCategory?.id).length != 0 && (
                <div className="categories-list">
                    {children(selectedRootCategory.id).map((child) =>
                        <div key={child.id}>
                            <button
                                className={`category-item hover ${categoryId === child.id ? "active" : ""}`}
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriesSelector;