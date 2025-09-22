const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CatalogSidebar = ({
    searchQuery,
    setSearchQuery,
    hasReviews,
    setHasReviews,
    activeSort,
    setActiveSort,
    sidebarOpened,
    toggleSidebar
}) => {

    const { t } = useTranslation(['common', 'navigation'])
    
    return (
        <aside className={`catalog-sidebar ${sidebarOpened ? 'active' : ''}`}>
            <button onClick={() => toggleSidebar()} className="btn btn-filter-sidebar" type="button">
                <i className="fa-solid fa-filter"></i>
            </button>

            <div className="sorting-sidebar">
                <div className="sorting-search">
                    <h5>{t(`catalog.sidebar.search`, { ns: 'common' })}</h5>
                    <div className="input-group">
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
                <h5>{t(`catalog.sidebar.sort`, { ns: 'common' })}</h5>
                <div className="list-group list-group-flush">
                    {sorts.map(sort => (
                        <a
                            key={sort.key}
                            className={`list-group-item ${activeSort === sort.key ? "active" : ""}`}
                            onClick={() => setActiveSort(sort.key)}
                        >
                            {t(`sorts.${sort.key}`, { ns: 'common' })}
                        </a>
                    ))}
                </div>

                <h5>{t(`catalog.sidebar.filters`, { ns: 'common' })}</h5>
                <div className="form-check custom-checkbox">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter2"
                        name="hasReviews"
                        checked={hasReviews}
                        onChange={(e) => setHasReviews(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="filter2">
                        <span className="checkmark"></span>
                        <span>{t(`catalog.sidebar.hasReviews`, { ns: 'common' })}</span>
                    </label>
                </div>
            </div>
            <div className="sorting-sidebar sidebar-links">
                <h5>{t(`catalog.sidebar.usefulLinks`, { ns: 'common' })}</h5>
                {/* <Link to="/info" className="catalog-sidebar-btn">{t('catalogSidebar.links.about', { ns: 'navigation' })}</Link> */}
                <Link to="/secure/account" className="catalog-sidebar-btn">{t('catalogSidebar.links.account', { ns: 'navigation' })}</Link>
                <Link to="/secure/listing/create" className="catalog-sidebar-btn">{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</Link>
                <Link to="/secure/my-listings" className="catalog-sidebar-btn">{t('catalogSidebar.links.myListings', { ns: 'navigation' })}</Link>
                <Link to="/secure/messenger" className="catalog-sidebar-btn">{t('catalogSidebar.links.messenger', { ns: 'navigation' })}</Link>
            </div>
        </aside>
    );
};

export default CatalogSidebar;