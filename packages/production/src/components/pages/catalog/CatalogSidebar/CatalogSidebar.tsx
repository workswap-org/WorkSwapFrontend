const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useAuth } from '@core/lib/contexts/AuthContext';
import { useI18n } from '@core/lib/contexts/I18nContext';
import { useCatalogFilters } from '@core/lib/contexts/local/CatalogFiltersContext';
import { useSwipeable } from 'react-swipeable';
import styles from "./CatalogSidebar.module.scss"
import FilterIcon from "@core/components/common/icons/FilterIcon"

interface CatalogSidebarProps {
    sidebarOpened: boolean;
    toggleSidebar: () => void
}
const CatalogSidebar = ({
    sidebarOpened,
    toggleSidebar,
}: CatalogSidebarProps) => {

    const { dict } = useI18n();

    const { filters, updateFilter } = useCatalogFilters();
    const { user } = useAuth();

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (sidebarOpened) toggleSidebar();
        },
        onSwipedLeft: () => {
            if (!sidebarOpened) toggleSidebar();
        },
        delta: 30,
        trackMouse: true,
        preventScrollOnSwipe: true,
    });
    
    return (
        <aside 
            {...handlers}
            data-mb-swipe-ignore
            className={`${styles.sidebar} ${sidebarOpened ? styles.active : ''}`}
        >
            <button onClick={() => toggleSidebar()} className={`btn ${styles.btnFilter}`} type="button">
                <FilterIcon />
            </button>

            <div className={styles.sortingSidebar}>
                <section>
                    <h5>{dict.common.catalog.sidebar.sort}</h5>
                    <div className={styles.listGroup}>
                        {sorts.map(sort => (
                            <button
                                key={sort.key}
                                className={`${styles.listGroupItem} ${filters.sortBy === sort.key ? styles.active : ""}`}
                                onClick={() => updateFilter("sortBy", sort.key)}
                            >
                                {dict.common.sorts[sort.key]}
                            </button>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h5>{dict.common.catalog.sidebar.filters}</h5>
                    <div className="checkbox hover">
                        <input
                            type="checkbox"
                            id="filter2"
                            name="hasReviews"
                            checked={filters.hasReviews}
                            onChange={(e) => updateFilter("hasReviews", e.target.checked)}
                        />
                        <label htmlFor="filter2">
                            <span className="checkmark"></span>
                            <span>{dict.common.catalog.sidebar.hasReviews}</span>
                        </label>
                    </div>

                    <div 
                        className="checkbox hover"
                        id="translationsFilter"
                    >
                        <input
                            type="checkbox"
                            id="translationsCheckbox"
                            name="translationsCheckbox"
                            checked={filters.translationsFilter}
                            onChange={(e) => updateFilter("translationsFilter", e.target.checked)}
                        />
                        <label htmlFor="translationsCheckbox">
                            <span className="checkmark"></span>
                            <span>{dict.common.catalog.sidebar.translationsFilter}</span>
                        </label>
                    </div>
                </section>
            </div>
            {user && (
                <div className={`${styles.sortingSidebar} ${styles.links}`}>
                    <section>
                        <h5>{dict.common.catalog.sidebar.usefulLinks}</h5>
                        <div className={styles.listGroup}>
                            {/* <Link to="/info" className="catalog-sidebar-btn">{t('catalogSidebar.links.about', { ns: 'navigation' })}</Link> */}
                            {/* <Link to="/account/account" className="catalog-sidebar-btn">{t('catalogSidebar.links.account', { ns: 'navigation' })}</Link> */}
                            <a href="/account/listing/create" className={styles.listGroupItem}>{dict.navigation.catalogSidebar.links.createListing}</a>
                            <a href="/account/my-listings" className={styles.listGroupItem}>{dict.navigation.catalogSidebar.links.myListings}</a>
                            <a href="/account/messenger" className={styles.listGroupItem}>{dict.navigation.catalogSidebar.links.messenger}</a>
                        </div>
                    </section>
                </div>
            )}
        </aside>
    );
};

export default CatalogSidebar;