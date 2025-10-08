import { useState } from "react";
import { useTranslation } from 'react-i18next';
import CategoriesSelector from "./CategoriesSelector";

const CatalogHeader = ({
    searchQuery,
    setSearchQuery,
    categoryId, 
    setCategoryId,
    listingType,
    setListingType
}) => {

    const { t } = useTranslation('categories')

    const [categoriesMenu, setCategoriesMenu] = useState(false);

    function toggleCategoriesMenu() {
        setCategoriesMenu(!categoriesMenu);
    }

    return (
        <div className="catalog-header">
            <div className="catalog-header-content">

                <button className="btn btn-primary categories-btn" onClick={() => toggleCategoriesMenu()}>
                    <div><i className="fa-solid fa-list fa-lg perm-light"></i></div>
                    <span className="normal-only">{t('category.all-categories', { ns: 'categories' })}</span>
                </button>

                <CategoriesSelector 
                    categoriesMenu={categoriesMenu}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    listingType={listingType}
                    setListingType={setListingType}
                />

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
    );
};

export default CatalogHeader;