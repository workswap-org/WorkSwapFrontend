"use client"

import Avatar from "@core/components/common/Avatar";
import RatingStars from "@core/components/common/RatingStars";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { userService } from "@core/lib/services/user";
import { useEffect, useState } from "react";
import AccountSidebarLinks from "./AccountSidebarLinks";
import ContactModal from "@/components/ui/modal/ContactModal";
import { useI18n } from "@core/lib/contexts/I18nContext";

const AccountSidebar = () => {

    const { dict } = useI18n();
    const { user } = useAuth();
    const [telegramConnected, setTelegramConnected] = useState(true)
    const { notificate } = useNotification();

    async function connectTelegram() {
        try {
            const linkUrl: string = await userService.connectUserTelegram();

            if (linkUrl) {
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
        async function checkTelegram() {
            const data = await userService.checkTelegramConnected();
            setTelegramConnected(data);
        }

        checkTelegram();
    }, []);

    return(
        <aside className="account-sidebar">
            <div className="profile-card">
                <Avatar
                    user={user}
                    size={100}
                    className='profile-card-avatar'
                />
                <h4 className="profile-card-name">{user?.name}</h4>
                <div className="profile-card-rating">
                    <RatingStars rating={user?.rating ?? 0} />
                    (<span>{user?.rating}</span>)
                </div>
                {/* <a href="/account/settings" className="btn btn-outline-primary btn-sm">{t(`accountSidebar.links.editProfile`, { ns: 'navigation' })}</a> */}
            </div>

            <AccountSidebarLinks/>

            <ContactModal/>

            {!telegramConnected && (
                <button onClick={() => connectTelegram()} className="telegram-button">{dict.buttons.special.connectTelegram}</button>
            )}
        </aside>
    );
};

export default AccountSidebar;