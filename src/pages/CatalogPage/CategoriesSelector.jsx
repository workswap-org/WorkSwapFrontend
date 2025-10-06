import { useCallback, useEffect, useState } from "react";
import { getCategories } from "@core/lib";
import { useTranslation } from 'react-i18next';

const CategoriesSelector = ({
    categoriesMenu,
    categoryId,
    setCategoryId
}) => {

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(undefined);
    const [categoryParent, setCategoryParent] = useState([])
    const [subCategory, setSubCategory] = useState(undefined);

    const { t } = useTranslation('categories')
    
    useEffect(() => {
        async function loadRootCategories() {
            try {
                const data = await getCategories();
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

    const selectSubcategory = (category) => {
        const hasChildren = categories.some(c => c.parentId === category.id);

        if (hasChildren) {
            setSubCategory(category);
            setCategoryParent(category);
        }
    }

    const rootCategories = () => {
        return categories.filter(category => category.parentId === null);
    }

    const selectParentCategory = (category) => {
        const parent = categories.find(cat => category.parentId === cat.id);
        setCategoryParent(parent);
        setSubCategory(null);
    }

    const findCategory = useCallback((categoryId) => {
        const cat = categories.find(cat => categoryId === cat.id);
        setSelectedCategory(cat);
    }, [categories]);

    useEffect(() => {
        findCategory(categoryId)
    }, [categoryId, findCategory])

    return (
       <div className={`categories-menu ${categoriesMenu ? "active" : ""}`}>
            <div className="categories-container">
                <div className="categories-sidebar-container">
                    {rootCategories().map((rootCategory) => (
                        <div key={rootCategory.id}>
                            <button
                                type="button"
                                className={`root-category-item hover ${categoryId === rootCategory.id ? "active" : ""}`}
                                onClick={() => {
                                    if (rootCategory.id === categoryId) {
                                        setCategoryId(null);
                                    } else {
                                        setCategoryId(rootCategory.id);
                                    };
                                }}
                            >
                                <i className="fa-solid fa-handshake me-2"></i>
                                <span>{t(`category.${rootCategory.name}`, { ns: 'categories' })}</span>
                            </button>
                            <div className="categories-list">
                                {children(rootCategory.id).map((child) =>
                                    <div key={child.id}>
                                        <button
                                            className={`category-item hover ${categoryId === child.id ? "active" : ""}`}
                                            onClick={() => {
                                                if (child.id === categoryId) {
                                                    setCategoryId(null);
                                                    setCategoryParent(null);
                                                } else {
                                                    setCategoryId(child.id);
                                                    setCategoryParent(child);
                                                };
                                            }}
                                        >
                                            {t(`category.${child.name}`, { ns: 'categories' })}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="subcategories-container">
                    {subCategory && (
                        <div  
                            className={`selected-subcategory`}
                        >
                            {t(`category.${subCategory.name}`, { ns: 'categories' })}
                            <button
                                type="button"
                                className={`list-button hover`}
                                onClick={() => {
                                    selectParentCategory(subCategory);
                                }}
                            >
                                <i className="fa-solid fa-angle-up"></i>
                            </button>
                        </div>
                    )}
                    {(categoryParent && children(categoryParent.id) != null) && (
                            <div className="categories-list">
                                {children(categoryParent.id).map((child) =>
                                    <div key={child.id}>
                                        <button
                                            className={`category-item hover ${categoryId === child.id ? "active" : ""}`}
                                            onClick={() => {
                                                if (child.id === categoryId) {
                                                    setCategoryId(null);
                                                } else {
                                                    setCategoryId(child.id);
                                                    selectSubcategory(child)
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
            </div>
            {selectedCategory && (
                <span className="selected-category-label">
                    <span>{t(`catalog.selectedCategory`, { ns: 'tooltips' })}: </span>
                    <span className="selected-category">{t(`category.${selectedCategory?.name}`, { ns: 'categories' })}</span>
                </span>
            )}
        </div>
    );
};

export default CategoriesSelector;