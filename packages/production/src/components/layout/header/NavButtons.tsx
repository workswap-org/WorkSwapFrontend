"use client"

import Link from "next/link";
import { AUTH_BASE } from "@core/config";
import { useEffect, useState } from "react";
import { userService } from "@core/lib/services/user";
import ThemeChanger from "@core/components/layout/ThemeChanger";
import NavItem from "@core/components/common/NavItem"
import Avatar from "@core/components/common/Avatar";
import LanguageSwitcher from "@core/components/layout/LanguageSwitcher";
import { useI18n } from "@core/lib/contexts/I18nContext";
import NotificationHeaderButton from '@core/components/ui/notifications/NotificationHeaderButton';
import SignOutIcon from "@core/components/common/icons/SignOutIcon"

const NavButtons = () => {

    const { user, isAuthenticated, isAdmin } = userService.useCurrentUser();
    const [url, setUrl] = useState<string | null>(null);
    const { dict } = useI18n();

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="nav-buttons">
            <div className="flex-row">
                <div className="nav-link normal-only">
                    <ThemeChanger id={"themeChangerMobile"}/>
                </div>

                <NavItem href="/forum" className="nav-link">
                    {dict.navigation.forum}
                </NavItem>

                <NavItem href="/catalog" className="nav-link">
                    {dict.navigation.catalog}
                </NavItem>

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        {dict.navigation.admin}
                    </a>
                )}
            </div>

            {isAuthenticated ? (
                <div className="account-link-container">
                    <Link href="/account" className="account-link">
                        <Avatar
                            user={user}
                            size={32}
                            className=''
                            link={false}
                        />
                        <span className="ellipsis">{user?.name || "Пользователь"}</span>
                    </Link>
                    <NotificationHeaderButton />
                    <Link
                        className="logout-btn"
                        href='/logout'
                    >
                        <SignOutIcon />
                    </Link>
                </div>
            ) : (
                <a
                    href={`${AUTH_BASE}/auth${url ? `?redirect=${encodeURIComponent(url || "")}` : ""}`}
                    className="btn btn-outline-primary login-btn"
                >
                    <span>{dict.buttons.login}</span>
                </a>
            )}

            <LanguageSwitcher/>
        </div>
    );
};

export default NavButtons;