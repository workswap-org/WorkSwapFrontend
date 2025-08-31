import Avatar from "@/components/small-components/Avatar";
import { useAuth } from "@/contexts/auth/AuthContext";

const UserInfoSidebar = ( {author} ) => {

    const {user} = useAuth();
    const isAuthenticated = !!user;
    
    return (
        <aside className="listing-sidebar">
            <div className="seller-card" th:if="${user != null}">
                <Avatar
                    user={author}
                    size='100'
                    className='seller-avatar'
                />
                <div className="seller-info">
                    <h4>{author.name}</h4>
                    <div className="seller-rating">
                        <span>Рейтинг: </span>
                        <span>{author.rating}</span> ★
                    </div>
                </div>
                <div className="seller-actions">

                    {isAuthenticated && (
                        <>
                            <div th:unless="${isOwner}">
                                <form action="/secure/messenger/chat" method="get">
                                    <input type="hidden" name="sellerId" th:value="${user.id}"/>
                                    <input th:if="${activePage == 'listing'}" type="hidden" name="listingId" th:value="${listing.id}"/>
                                    <button type="submit" className="btn btn-primary" th:text="#{listing.write}">Написать сообщение</button>
                                </form>
                                {/* <form th:if="${activePage == 'listing'}" th:action="'/proxy/secure/api/listing/' + ${listing.id} + '/favorite'" method="POST">
                                    <input type="hidden" name="sellerId" th:value="${user.id}">
                                    <input type="hidden" name="_csrf" th:value="${_csrf.token}">
                                    <button th:if="${isFavorite}" type="submit" className="btn btn-outline-primary" th:text="#{listing.favorite.remove}">Убрать из избранного</button>
                                    <button th:if="${!isFavorite}" type="submit" className="btn btn-outline-primary" th:text="#{listing.favorite.add}">Добавить в избраннное</button>
                                </form> */}
                                <div id="favorite-container"></div>
                                <script src="/js/components/favorite.js" th:inline="javascript"></script>
                            </div>

                            <a th:if="${isOwner and activePage == 'listing'}" th:text="#{listing.edit}"
                                th:href="@{'/secure/listing/edit/' + ${listing.id}}"
                                className="btn btn-primary"
                            ></a>
                        </>
                    )}

                    {!isAuthenticated && (
                        <a href="/login" className="btn btn-primary" th:text="#{login.to.write}">Войти, чтобы написать</a>
                    )}
                </div>
            </div>

            <div className="contact-card" th:if="${user != null}">
                <h3 th:text="#{listing.author.contacts}">Контактная информация</h3>
                <div className="contact-methods">
                    <div className="contact-item" th:if="${user.phoneVisible and user.phone != null}">
                        <span className="contact-icon">📱</span>
                        <span th:text="${user.phone}"></span>
                    </div>
                    <div className="contact-item" th:if="${user.emailVisible and user.email != null}">
                        <span className="contact-icon">✉️</span>
                        <span th:text="${user.email}"></span>
                    </div>
                    <span th:if="${!(user.phoneVisible and user.phone != null) and !(user.emailVisible and user.email != null)}" th:text="#{no.contacts}"></span>
                </div>
            </div>
            
            <div className="resume-card hover-animation-card" th:if="${resume != null and resume.published and activePage == 'profile'}" th:onclick="window.location.href = '/resume/' + [[${resume.id}]]">
                {/* <img th:replace="~{fragments/small-components :: avatar(user=${user}, size='70', className='')}"></img> */}
                <div className="resume-info">
                    <h3 th:text="${resume.profession}">Специальность</h3>
                    <div className="resume-meta">
                        <span className="resume-education" th:text="#{'education.' + ${resume.education}}">Образование</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default UserInfoSidebar;