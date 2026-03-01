"use client"

import { useNotification, userService } from "@core/lib";
import { AccountSidebarLinks, ContactModal } from "@/components";
import {
    Avatar, LanguageSwitcher
} from "@core/components";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import { AUTH_BASE } from "@core/config";
import Link from "next/link";

const MobileMenu = () => {

    const { t } = useTranslation('navigation')
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
        setUrl(window.location.href);

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
                className="navbar-toggler" 
                id="notificationAnchor"
            >
                <div><i className="fa-solid fa-bars"></i></div>
                {unreadNotificationsCount > 0 && (
                    <span id="unreadNotifications" className="unread-notifications-count">
                        {unreadNotificationsCount}
                    </span>
                )}
            </button>
            {mobileMenuEm && createPortal(
                <div className={`mobile-menu ${isOpen ? "show" : ""}`}>

                    <LanguageSwitcher/>

                    <div className="user-info-menu">
                        {isAuthenticated && (
                            <Avatar
                                user={user}
                                size={100}
                                className='profile-avatar'
                            />
                        )}

                        <h2>{user?.name}</h2>
                    </div>

                    {user?.name ? (
                        <Link className="navbar-btn" href='/logout'>
                            <div><i className="fa-regular fa-left-from-bracket fa-lg"></i></div>
                            <span>{t(`accountSidebar.logout`, { ns: 'navigation' })}</span> 
                        </Link>
                    ) : (
                        <a
                            href={`${AUTH_BASE}/auth` + url ? `?redirect=${encodeURIComponent(url || "")}` : ""}
                            className="navbar-btn"
                        >
                            <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                            <span>{t(`accountSidebar.login`, { ns: 'navigation' })}</span> 
                        </a>
                    )}

                    <div className="account-manager">
                        <AccountSidebarLinks />
                    </div>

                    {/* <NotificationMobileButton/>
 */}
                    <ContactModal/>
                </div>,
                mobileMenuEm
            )}
        </>
    )
};

export default MobileMenu;