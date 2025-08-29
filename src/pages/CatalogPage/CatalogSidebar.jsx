const sorts = [
    { key: "date", label: "По дате" },
    { key: "price", label: "По цене" },
    { key: "rating", label: "По рейтингу" },
    { key: "popularity", label: "По просмотрам" },
];

const CatalogSidebar = ({
    searchQuery,
    setSearchQuery,
    hasReviews,
    setHasReviews,
    activeSort,
    setActiveSort
}) => {
    
    return (
        <aside className="catalog-sidebar">
            <button className="close-sidebar d-lg-none">
                <i className="fa-solid fa-times"></i>
            </button>

            <div className="sorting-sidebar">
                <div className="sorting-search">
                    <h5 th:text="#{catalog.search.title}">Поиск</h5>
                    <form id="searchForm">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="search-input" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                name="searchQuery"
                                placeholder="Поиск..."
                            />
                            <input type="hidden" name="category"/>
                            <input type="hidden" name="sortBy"/>
                            <button className="btn btn-search" type="submit">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <h5 th:text="#{catalog.sorting.title}">Сортировка</h5>
                <div className="list-group list-group-flush">
                    {sorts.map(sort => (
                        <a
                            key={sort.key}
                            className={`list-group-item list-group-item-action sort-link ${activeSort === sort.key ? "active" : ""}`}
                            onClick={() => setActiveSort(sort.key)}
                        >
                            {sort.label}
                        </a>
                    ))}
                </div>

                <h5 th:text="#{catalog.sorting.filters}">Фильтры</h5>
                <div className="form-check custom-checkbox">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter2"
                        name="hasReviews"
                        checked={hasReviews}               // синхронизируем с состоянием
                        onChange={(e) => setHasReviews(e.target.checked)} // переключаем состояние
                    />
                    <label className="form-check-label" htmlFor="filter2">
                        <span className="checkmark"></span>
                        <span>С отзывами</span>
                    </label>
                </div>
            </div>
            <div className="sorting-sidebar sidebar-links">
                <h5 th:text="#{catalog.sorting.links}">Полезные ссылки</h5>
                <a href="info" className="catalog-sidebar-btn" th:text="#{links.info}">Что это за сайт?</a>
                <a href="secure/account" className="catalog-sidebar-btn" th:text="#{links.account}">Аккаунт</a>
                <a href="secure/listing/create" className="catalog-sidebar-btn" th:text="#{links.create.listing}">Создать объявление</a>
                <a href="secure/resume" className="catalog-sidebar-btn" th:text="#{links.my.resume}">Моё резюме</a>
                <a href="secure/messenger" className="catalog-sidebar-btn" th:text="#{links.create.messenger}">Мои сообщения</a>
            </div>
        </aside>
);
};

export default CatalogSidebar;