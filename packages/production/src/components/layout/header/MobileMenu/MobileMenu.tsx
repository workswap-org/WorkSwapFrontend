"use client"

import { usePathname } from "next/navigation";
import NotificationMobileButton from '@core/components/ui/notifications/NotificationMobileButton';
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import { AUTH_BASE } from "@core/config";
import Link from "next/link";
import { userService } from "@core/lib/services/user"
import { useNotification } from "@core/lib/contexts/NotificationContext"
import LanguageSwitcher from '@core/components/layout/LanguageSwitcher/LanguageSwitcher';
import Avatar from "@core/components/common/Avatar/Avatar"
import AccountSidebarLinks from "@/components/pages/account/AccountSidebarLinks";
import ContactModal from "@/components/ui/modal/ContactModal";
import { useI18n } from "@core/lib/contexts/I18nContext";
import styles from "./MobuleMenu.module.scss"
import SignOutIcon from "@core/components/common/icons/SignOutIcon";
import UnreadNotifications from "@core/components/ui/notifications/UnreadNotifications/UnreadNotifications";

const MobileMenu = () => {

    const { dict } = useI18n();
    const { user, isAuthenticated } = userService.useCurrentUser();
    const [mobileMenuEm, setMobileMenuEm] = useState<HTMLElement | null>(null);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);

    const EDGE_SIZE = 120;
    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            const startX = eventData.initial[0];
            const screenWidth = window.innerWidth;

            const target = eventData.event?.target as HTMLElement | null;
            if (target?.closest('[data-mb-swipe-ignore]')) {
                return;
            }

            if (startX >= screenWidth - EDGE_SIZE && !isOpen) {
                setOpen(true);
            }
        },
        onSwipedRight: () => {
            if (isOpen) {
                setOpen(false);
            }
        },
        delta: 30,
        trackMouse: false,
        preventScrollOnSwipe: false,
    });

    useEffect(() => {
        setMobileMenuEm(document.getElementById("mobile-menu"));

        const cleanup = handlers.ref(document.body);
        return cleanup;
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [usePathname]);

    const { unreadNotificationsCount } = useNotification();

    return (
        <>
            <button 
                onClick={() => setOpen(p => !p)} 
                className={styles.navbarToggler} 
                id="notificationAnchor"
            >
                <div><i className="fa-solid fa-bars"></i></div>
                {unreadNotificationsCount > 0 && (
                    <UnreadNotifications count={unreadNotificationsCount}/>
                )}
            </button>
            {mobileMenuEm && createPortal(
                <div className={`${styles.mobileMenu} ${isOpen ? styles.show : ""}`}>

                    <LanguageSwitcher mobile />

                    <div className={styles.userInfo}>
                        {isAuthenticated && (
                            <Avatar
                                user={user}
                                size={100}
                            />
                        )}

                        <h2>{user?.name}</h2>
                    </div>

                    {user?.name ? (
                        <Link className={styles.navbarBtn} href='/logout'>
                            <div><SignOutIcon /></div>
                            <span>{dict.navigation.accountSidebar.logout}</span> 
                        </Link>
                    ) : (
                        <a
                            href={`${AUTH_BASE}/auth?redirect=${encodeURIComponent(window.location.origin + window.location.href)}`}
                            className={styles.navbarBtn}
                        >
                            <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                            <span>{dict.navigation.accountSidebar.login}</span> 
                        </a>
                    )}

                    <div className={styles.accountManager}>
                        <AccountSidebarLinks />
                    </div>

                    <NotificationMobileButton className={styles.navbarBtn} />

                    <ContactModal/>
                </div>,
                mobileMenuEm
            )}
        </>
    )
};

export default MobileMenu;