const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@core/lib';

const CatalogSidebar = ({
    hasReviews,
    setHasReviews,
    activeSort,
    setActiveSort,
    sidebarOpened,
    toggleSidebar
}) => {

    const { user } = useAuth()

    const { t } = useTranslation(['common', 'navigation'])
    
    return (
        <aside className={`catalog-sidebar ${sidebarOpened ? 'active' : ''}`}>
            <button onClick={() => toggleSidebar()} className="btn btn-filter-sidebar" type="button">
                <i className="fa-solid fa-filter"></i>
            </button>

            <div className="sorting-sidebar">
                <h5>{t(`catalog.sidebar.sort`, { ns: 'common' })}</h5>
                <div className="list-group">
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
            {user && (
                <div className="sorting-sidebar sidebar-links">
                    <h5>{t(`catalog.sidebar.usefulLinks`, { ns: 'common' })}</h5>
                    {/* <Link to="/info" className="catalog-sidebar-btn">{t('catalogSidebar.links.about', { ns: 'navigation' })}</Link> */}
                    {/* <Link to="/account/account" className="catalog-sidebar-btn">{t('catalogSidebar.links.account', { ns: 'navigation' })}</Link> */}
                    <Link to="/account/listing/create" className="catalog-sidebar-btn">{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</Link>
                    <Link to="/account/my-listings" className="catalog-sidebar-btn">{t('catalogSidebar.links.myListings', { ns: 'navigation' })}</Link>
                    <Link to="/account/messenger" className="catalog-sidebar-btn">{t('catalogSidebar.links.messenger', { ns: 'navigation' })}</Link>
                </div>
            )}
        </aside>
    );
};

export default CatalogSidebar;