import CatalogCategories from "../CatalogCategories/CatalogCategories";
import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext"
import { useI18n } from "@core/lib/contexts/I18nContext"
import SearchIcon from "@core/components/common/icons/SearchIcon"
import styles from "./CatalogHeader.module.scss"

const CatalogHeader = () => {

    const { filters, updateFilter } = useCatalogFilters();
    const { dict } = useI18n();

    return (
        <div className={styles.header}>
            <div className={styles.content}>

                <CatalogCategories />

                <div className={styles.search}>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        value={filters.searchQuery ?? ""}
                        onChange={(e) => updateFilter("searchQuery", e.target.value)}
                        name="searchQuery"
                        placeholder={dict.common.placeholders.search}
                    />
                    
                    <input type="hidden" name="category"/>
                    <input type="hidden" name="sortBy"/>
                    <button className={`btn ${styles.btnSearch}`} type="button">
                        <SearchIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CatalogHeader;