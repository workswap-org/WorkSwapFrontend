import CatalogCategories from "./CatalogCategories";
import { useCatalogFilters, useI18n } from "@core/lib";

const CatalogHeader = () => {

    const { filters, updateFilter } = useCatalogFilters();
    const { dict } = useI18n();

    return (
        <div className="catalog-header">
            <div className="catalog-header-content">

                <CatalogCategories />

                <div className="listings-search">
                    <input 
                        type="text" 
                        className="search-input" 
                        value={filters.searchQuery ?? ""}
                        onChange={(e) => updateFilter("searchQuery", e.target.value)}
                        name="searchQuery"
                        placeholder={dict.common.placeholders.search}
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