import { useEffect, useState } from "react";
import AccountSidebarLinks from "./AccountSidebarLinks";
import Avatar from "@/components/small-components/Avatar";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTranslation } from 'react-i18next';
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const AccountSidebar = () => {

    const { t } = useTranslation(['buttons', 'navigation'])
    const { user } = useAuth();
    const [telegramConnected, setTelegramConnected] = useState(true)
    const notificate = useNotification();

    async function connectTelegram() {
        try {
            const response = await apiFetch('/api/user/telegram/connect', {method: 'POST'});

            if (response.link) {
                const linkUrl = await response.link; // Получаем URL как строку
                setTelegramConnected(true);
                window.open(linkUrl, '_blank'); // Открываем в новой вкладке
                notificate("Telegram успешно подключён, теперь вам будут приходить уведомления через это приложение!", "success")
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            notificate("Ошибка подключения аккаунта Telegram", "error")
        }
    }

    useEffect(() => {

        async function checkTelegramConnected() {
            const data = await apiFetch('/api/user/telegram/check');
            setTelegramConnected(data.telegramConnected);
        }

        checkTelegramConnected();
    }, []);

    return(
        <aside className="account-sidebar" th:fragment="sidebar">
            <div className="profile-card">
                <Avatar 
                    user={user}
                    size={100}
                    className='profile-avatar'
                />
                <h4 className="profile-name">{user?.name}</h4>
                <p className="profile-rating">
                    {Array.from({ length: 5 }, (_, i) => {
                        const starValue = i + 1;

                        if (user?.rating >= starValue) {
                            return <i className="fa-solid fa-star" key={starValue} ></i>;
                        } else if (user?.rating >= starValue - 0.5) {
                            return <i className="fa-solid fa-star-half-stroke" key={starValue} ></i>;
                        } else {
                            return <i className="fa-regular fa-star" key={starValue} ></i>;
                        }
                    })}
                    (<span>{user?.rating}</span>)
                </p>
                <a href="/secure/settings" className="btn btn-outline-primary btn-sm">{t(`accountSidebar.links.editProfile`, { ns: 'navigation' })}</a>
            </div>

            <AccountSidebarLinks/>

            {!telegramConnected && (
                <button onClick={() => connectTelegram()} className="telegram-button">{t(`special.connectTelegram`, { ns: 'buttons' })}</button>
            )}
        </aside>
    );
};

export default AccountSidebar;