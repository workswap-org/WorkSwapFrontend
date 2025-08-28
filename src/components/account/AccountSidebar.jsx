import { useEffect } from "react";

const AccountSidebar = () => {

    useEffect(() => {
        document.getElementById('connectTelegram').addEventListener('click', async () => {
            try {
                const response = await fetch('/proxy/secure/api/user/telegram/connect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
                    }
                });

                if (response.ok) {
                    const linkUrl = await response.text(); // Получаем URL как строку
                    window.open(linkUrl, '_blank'); // Открываем в новой вкладке
                } else {
                    const errorText = await response.text();
                    alert('Ошибка: ' + errorText);
                }
            } catch (error) {
                console.error('Ошибка запроса:', error);
                alert('Ошибка запроса');
            }
        });
    }, []);

    return(
        <aside className="account-sidebar" th:fragment="sidebar">
            <div className="profile-card">
                <img th:replace="~{fragments/small-components :: avatar(user=${user}, size='100', className='profile-avatar')}"></img>
                <h4 className="profile-name" th:text="${user.name}">Иван Иванов</h4>
                <p className="profile-rating">
                    <span th:each="i : ${#numbers.sequence(1,5)}">
                        <i className="fa"
                            th:classappend="${user.rating >= i} ? 'fa-star' :
                            (${user.rating >= i - 0.5} ? 'fa-star-half-o' : 'fa-star-o')"></i>
                    </span>
                    (<span th:text="${#numbers.formatDecimal(user.rating, 1, 1)}">0.0</span>)
                </p>
                <a href="/secure/settings" className="btn btn-outline-primary btn-sm" th:text="#{profile.edit}">Редактировать профиль</a>
            </div>

            <nav th:replace="~{fragments/account/account-sidebar :: sidebarLinks}"></nav>

            <button th:if="${!user.telegramConnected}" className="telegram-button" id="connectTelegram" th:text="#{telegramm.connect}">Подключить Telegram</button>
        </aside>
    );
};

export default AccountSidebar;