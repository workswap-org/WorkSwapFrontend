import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext";
import { useCallback, useEffect, useState, useRef, useMemo, ReactNode } from "react";
import { ICategory } from "@core/lib/types/models/category"
import { ListingType, ListingTypeValue } from "@core/lib/constants/listingTypes";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { categoryService } from "@core/lib/services/categoriesService"
import styles from "./CatalogCategories.module.scss"

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
                className={`btn btn-primary ${styles.categoriesBtn}`} 
                onClick={() => setCategoriesMenu(prev => !prev)}
            >
                <div><i className="fa-solid fa-list fa-lg perm-light"></i></div>
                <span className="normal-only">{dict.categories.category['all-categories']}</span>
            </button>
            <div
                className={`${styles.menu} ${categoriesMenu ? styles.active : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles.types}>
                    {[ListingType.SERVICE, ListingType.PRODUCT].map(type =>
                        <button
                            key={type}
                            className="hover"
                            value={type}
                            onClick={() => setListingType(type)}
                        >
                            {dict.categories.listingType[type.toUpperCase()]}
                            <div className={`${styles.indicator} ${listingType == type ? styles.active : ""}`}>
                                <i className="fa-solid fa-angle-down"></i>
                            </div>
                        </button>
                    )}
                </div>
                <div className={styles.container}>
                    <div className={styles.sidebarContainer}>
                        <div className={styles.categoriesList}>
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
                    <div className={styles.subcategories}>
                        {filters.categoryId && children(filters.categoryId).length > 0 && (
                            <div className={styles.categoriesList}>
                                {children(filters.categoryId).map(child =>
                                    <SubCategoryButton
                                        active={filters.categoryId === child.id}
                                        onClick={() =>
                                            filters.categoryId === child.id
                                            ? updateFilter("categoryId", null)
                                            : updateFilter("categoryId", child.id)
                                        }
                                    >
                                        {dict.categories.category[listingType][child.name]}
                                    </SubCategoryButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {selectedCategory && (
                    <span className={styles.selectedCategoryLabel}>
                        <span>{dict.tooltips.catalog.selectedCategory}: </span>
                        <span className={styles.selectedCategory}>{dict.categories.category[listingType][selectedCategory.name]}</span>
                    </span>
                )}
            </div>
        </>
    );
};

const CategoryButton = ({ active, onClick, children }: {active: boolean, onClick: () => void, children: ReactNode}) => (
    <button
        type="button"
        className={`${styles.category} hover ${active ? styles.active : ""}`}
        onClick={onClick}
    >
        {children}
        <div className={`${styles.indicator} ${active ? styles.active : ""}`}>
            <i className="fa-solid fa-angle-right"></i>
        </div>
    </button>
);

const SubCategoryButton = ({ active, onClick, children }: {active: boolean, onClick: () => void, children: ReactNode}) => (
    <button
        type="button"
        className={`${styles.subCategory} hover ${active ? styles.active : ""}`}
        onClick={onClick}
    >
        {children}
    </button>
);

export default CatalogCategories;
