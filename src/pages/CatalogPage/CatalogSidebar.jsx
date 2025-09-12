const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useTranslation } from 'react-i18next';

const CatalogSidebar = ({
    hasReviews,
    setHasReviews,
    activeSort,
    setActiveSort,
    sidebarOpened,
    setSidebarOpened
}) => {

    const { t } = useTranslation(['common', 'navigation'])
    
    return (
        <aside className={`catalog-sidebar ${sidebarOpened ? 'active' : ''}`}>
            <button onClick={() => setSidebarOpened(false)} className="close-sidebar d-lg-none">
                <i className="fa-solid fa-times"></i>
            </button>

            <div className="sorting-sidebar">
                <h5>{t(`catalog.sidebar.sort`, { ns: 'common' })}</h5>
                <div className="list-group list-group-flush">
                    {sorts.map(sort => (
                        <a
                            key={sort.key}
                            className={`list-group-item list-group-item-action sort-link ${activeSort === sort.key ? "active" : ""}`}
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
        </aside>
    );
};

export default CatalogSidebar;