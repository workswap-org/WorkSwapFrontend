const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useSwipeable } from 'react-swipeable';
import { useAuth, useCatalogFilters, useI18n } from '@core/lib';

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
            className={`catalog-sidebar ${sidebarOpened ? 'active' : ''}`}
        >
            <button onClick={() => toggleSidebar()} className="btn btn-filter-sidebar" type="button">
                <i className="fa-solid fa-filter"></i>
            </button>

            <div className="sorting-sidebar">
                <section>
                    <h5>{dict.common.catalog.sidebar.sort}</h5>
                    <div className="list-group">
                        {sorts.map(sort => (
                            <button
                                key={sort.key}
                                className={`list-group-item ${filters.sortBy === sort.key ? "active" : ""}`}
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
                <div className="sorting-sidebar sidebar-links">
                    <section>
                        <h5>{dict.common.catalog.sidebar.usefulLinks}</h5>
                        <div className="list-group">
                            {/* <Link to="/info" className="catalog-sidebar-btn">{t('catalogSidebar.links.about', { ns: 'navigation' })}</Link> */}
                            {/* <Link to="/account/account" className="catalog-sidebar-btn">{t('catalogSidebar.links.account', { ns: 'navigation' })}</Link> */}
                            <a href="/account/listing/create" className="list-group-item">{dict.navigation.catalogSidebar.links.createListing}</a>
                            <a href="/account/my-listings" className="list-group-item">{dict.navigation.catalogSidebar.links.myListings}</a>
                            <a href="/account/messenger" className="list-group-item">{dict.navigation.catalogSidebar.links.messenger}</a>
                        </div>
                    </section>
                </div>
            )}
        </aside>
    );
};

export default CatalogSidebar;