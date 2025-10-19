import { useCallback, useEffect, useState } from "react";
import { getCategories } from "@core/lib";
import { useTranslation } from 'react-i18next';

const CatalogCategories = ({
    categoriesMenu,
    setCategoriesMenu,
    categoryId,
    setCategoryId
}) => {

    let closeTimeout;

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(undefined);
    const [categoryParent, setCategoryParent] = useState([])
    const [listingType, setListingType] = useState("product");

    const { t } = useTranslation('categories')
    
    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch(e) {
                console.error(e);
            }
        }

        loadCategories();
    }, [])

    const children = (id) => {
        const childrenList = categories[listingType]?.filter(category => category.parentId === id);

        return childrenList;
    }

    const rootCategories = (type) => {
        if (!type) return [];
        return categories[type]?.filter(category => category.parentId === null) || [];
    }

    const findCategory = useCallback((categoryId) => {
        const cat = categories[listingType]?.find(cat => categoryId === cat.id);
        setSelectedCategory(cat);
    }, [categories, listingType]);

    useEffect(() => {
        findCategory(categoryId)
    }, [categoryId, findCategory])

    const handleMouseLeave = () => {
        closeTimeout = setTimeout(() => {
            setCategoriesMenu(false);
        }, 500);
    };

    const handleMouseEnter = () => {
        clearTimeout(closeTimeout);
    };

    return (
        <div 
            className={`categories-menu ${categoriesMenu ? "active" : ""}`} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <div className="category-types">
                <button
                    className="hover"
                    value={"service"}
                    onClick={(e) => setListingType(e.target.value)}
                >
                    {t(`listingType.SERVICES`, { ns: 'categories' })}
                    <div className={`indicator ${listingType === "service" ? "active" : ""}`}><i className="fa-solid fa-angle-down"></i></div>
                </button>
                <button
                    className="hover"
                    value={"product"}
                    onClick={(e) => setListingType(e.target.value)}
                >
                    {t(`listingType.PRODUCT_SALE`, { ns: 'categories' })}
                    <div className={`indicator ${listingType === "product" ? "active" : ""}`}><i className="fa-solid fa-angle-down"></i></div>
                </button>
            </div>
            <div className="categories-container">
                <div className="categories-sidebar-container">
                    <div className="categories-list">
                    {rootCategories(listingType).map((rootCategory) => (
                        <button
                            key={rootCategory.id}
                            type="button"
                            className="category-item hover"
                            onClick={() => {
                                if (rootCategory.id === categoryId) {
                                    setCategoryId(null);
                                    setCategoryParent(null);
                                } else {
                                    setCategoryId(rootCategory.id);
                                    setCategoryParent(rootCategory);
                                };
                            }}
                        >
                            {t(`category.${listingType}.${rootCategory.name}`, { ns: 'categories' })}
                            <div className={`indicator ${categoryId === rootCategory.id ? "active" : ""}`}><i className="fa-solid fa-angle-right"></i></div>
                        </button>
                    ))}
                    </div>
                </div>
                <div className="subcategories-container">
                    {(categoryParent && children(categoryParent.id) != null) && (
                        <div className="categories-list">
                            {children(categoryParent.id).map((child) =>
                                <button
                                    key={child.id}
                                    className={`sub-category-item hover ${categoryId === child.id ? "active" : ""}`}
                                    onClick={() => {
                                        if (child.id === categoryId) {
                                            setCategoryId(null);
                                        } else {
                                            setCategoryId(child.id);
                                        };
                                    }}
                                >
                                    {t(`category.${listingType}.${child.name}`, { ns: 'categories' })}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {selectedCategory && (
                <span className="selected-category-label">
                    <span>{t(`catalog.selectedCategory`, { ns: 'tooltips' })}: </span>
                    <span className="selected-category">{t(`category.${listingType}.${selectedCategory?.name}`, { ns: 'categories' })}</span>
                </span>
            )}
        </div>
    );
};

export default CatalogCategories;