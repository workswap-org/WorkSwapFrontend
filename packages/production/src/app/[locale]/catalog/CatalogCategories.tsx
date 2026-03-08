import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext";
import { useCallback, useEffect, useState, useRef, useMemo, ReactNode } from "react";
import { ICategory } from "@core/lib/types/models/category"
import { ListingType, ListingTypeValue } from "@core/lib/constants/listingTypes";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { categoryService } from "@core/lib/services/categoriesService"

const CatalogCategories = () => {
    
    const { filters, updateFilter } = useCatalogFilters();
    
    const [categoriesMenu, setCategoriesMenu] = useState<boolean>(false);
    const [categories, setCategories] = useState<Record<string, ICategory[]> | null>(null);
    const [listingType, setListingType] = useState<ListingTypeValue>(ListingType.PRODUCT);
    const { dict } = useI18n();

    const timeoutRef = useRef<number>(0);

    useEffect(() => {
        categoryService.getAllCategories().then(setCategories)
    }, []);

    const rootCategories = useMemo(() => {
        if (!categories) return [];
        return categories[listingType]?.filter(cat => cat.parentId == null) || []
    }, [categories, listingType]);

    const children = useCallback((parentId: number) => {
        if (!categories) return [];
        return categories[listingType]?.filter(cat => cat.parentId === parentId) || []
    }, [categories, listingType]);

    const selectedCategory = useMemo<ICategory | null>(() => {
        if (!categories) return null;
        return categories[listingType]?.find(cat => cat.id === filters.categoryId) || null
    }, [categories, listingType, filters]);

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => setCategoriesMenu(false), 500);
    };
    const handleMouseEnter = () => clearTimeout(timeoutRef.current);

    return (
        <>
            <button 
                className="btn btn-primary categories-btn" 
                onClick={() => setCategoriesMenu(prev => !prev)}
            >
                <div><i className="fa-solid fa-list fa-lg perm-light"></i></div>
                <span className="normal-only">{dict.categories.category['all-categories']}</span>
            </button>
            <div
                className={`categories-menu ${categoriesMenu ? "active" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="category-types">
                    {[ListingType.SERVICE, ListingType.PRODUCT].map(type =>
                        <button
                            key={type}
                            className="hover"
                            value={type}
                            onClick={() => setListingType(type)}
                        >
                            {dict.categories.listingType[type.toUpperCase()]}
                            <div className={`indicator ${listingType == type ? "active" : ""}`}>
                                <i className="fa-solid fa-angle-down"></i>
                            </div>
                        </button>
                    )}
                </div>
                <div className="categories-container">
                    <div className="categories-sidebar-container">
                        <div className="categories-list">
                            {rootCategories.map((cat) =>
                                <CategoryButton
                                    key={cat.id}
                                    active={filters.categoryId === cat.id}
                                    onClick={() =>
                                    filters.categoryId === cat.id
                                        ? updateFilter("categoryId", null)
                                        : updateFilter("categoryId", cat.id)
                                    }
                                >
                                    {dict.categories.category[listingType][cat.name]}
                                </CategoryButton>
                            )}
                        </div>
                    </div>
                    <div className="subcategories-container">
                        {filters.categoryId && children(filters.categoryId).length > 0 && (
                            <div className="categories-list">
                                {children(filters.categoryId).map(child =>
                                    <button
                                        key={child.id}
                                        className={`sub-category-item hover ${filters.categoryId === child.id ? "active" : ""}`}
                                        onClick={() =>
                                            filters.categoryId === child.id
                                            ? updateFilter("categoryId", null)
                                            : updateFilter("categoryId", child.id)
                                        }
                                    >
                                        {dict.categories.category[listingType][child.name]}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {selectedCategory && (
                    <span className="selected-category-label">
                        <span>{dict.tooltips.catalog.selectedCategory}: </span>
                        <span className="selected-category">{dict.categories.category[listingType][selectedCategory.name]}</span>
                    </span>
                )}
            </div>
        </>
    );
};

const CategoryButton = ({ active, onClick, children }: {active: boolean, onClick: () => void, children: ReactNode}) => (
    <button
        type="button"
        className={`category-item hover ${active ? "active" : ""}`}
        onClick={onClick}
    >
        {children}
        <div className={`indicator ${active ? "active" : ""}`}>
        <i className="fa-solid fa-angle-right"></i>
        </div>
    </button>
);

export default CatalogCategories;
