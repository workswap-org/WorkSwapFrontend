import { useState } from "react";
import { useTranslation } from 'react-i18next';
import CatalogCategories from "./CatalogCategories";
import { CatalogFilters } from "@core/lib";

const CatalogHeader = ({
    filters,
    updateFilter,
}: {
    filters: CatalogFilters;
    updateFilter: (key: string, value: string | boolean | number | null) => void;
}) => {

    const { t } = useTranslation('categories')

    const [categoriesMenu, setCategoriesMenu] = useState<boolean>(false);

    return (
        <div className="catalog-header">
            <div className="catalog-header-content">

                <button 
                    className="btn btn-primary categories-btn" 
                    onClick={() => setCategoriesMenu(prev => !prev)}
                >
                    <div><i className="fa-solid fa-list fa-lg perm-light"></i></div>
                    <span className="normal-only">{t('category.all-categories')}</span>
                </button>

                <CatalogCategories 
                    categoriesMenu={categoriesMenu}
                    setCategoriesMenu={setCategoriesMenu}
                    filters={filters}
                    updateFilter={updateFilter}
                />

                <div className="listings-search">
                    <input 
                        type="text" 
                        className="search-input" 
                        value={filters.searchQuery ?? ""}
                        onChange={(e) => updateFilter("searchQuery", e.target.value)}
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
    );
};

export default CatalogHeader;