import { useEffect } from "react";
import AccountSidebarLinks from "./AccountSidebarLinks";
import Avatar from "@/components/small-components/Avatar";
import { useAuth } from "@/contexts/auth/AuthContext";

const AccountSidebar = () => {

    const { user } = useAuth();

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

                <Avatar 
                    user={user}
                    size={100}
                    className='profile-avatar'
                />
                <h4 className="profile-name">{user.name}</h4>
                <p className="profile-rating">
                    {Array.from({ length: 5 }, (_, i) => {
                        const starValue = i + 1;

                        if (user.rating >= starValue) {
                            return <i className="fa-solid fa-star" key={starValue} ></i>;
                        } else if (user.rating >= starValue - 0.5) {
                            return <i className="fa-solid fa-star-half-stroke" key={starValue} ></i>;
                        } else {
                            return <i className="fa-regular fa-star" key={starValue} ></i>;
                        }
                    })}
                    (<span>{user.rating}</span>)
                </p>
                <a href="/secure/settings" className="btn btn-outline-primary btn-sm" th:text="#{profile.edit}">Редактировать профиль</a>
            </div>

            <AccountSidebarLinks/>

            {!user.telegramConnected ? (
                <button th:if="${!user.telegramConnected}" className="telegram-button" id="connectTelegram" th:text="#{telegramm.connect}">Подключить Telegram</button>
            ) : null}
        </aside>
    );
};

export default AccountSidebar;