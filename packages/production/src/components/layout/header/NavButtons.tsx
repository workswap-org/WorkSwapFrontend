"use client"

import { 
    ThemeChanger, 
    Avatar,
    LanguageSwitcher, 
    NavItem
} from "@core/components";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { userService } from "@core/lib";
import { AUTH_BASE } from "@core/config";
import { useEffect, useState } from "react";

const NavButtons = () => {

    const { t } = useTranslation(['buttons', 'navigation'])

    const { user, isAuthenticated, isAdmin } = userService.useCurrentUser();
    const [url, setUrl] = useState<string | null>(null);

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
                    {t(`forum`, { ns: 'navigation' })}
                </NavItem>

                <NavItem href="/catalog" className="nav-link">
                    {t(`catalog`, { ns: 'navigation' })}
                </NavItem>

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        {t(`admin`, { ns: 'navigation' })}
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
                    {/* <NotificationHeaderButton /> */}
                    <Link
                        className="logout-btn"
                        href='/logout'
                    >
                        <i className="fa fa-arrow-left-from-bracket fa-lg" aria-hidden="true"></i>
                    </Link>
                </div>
            ) : (
                <a
                    href={`${AUTH_BASE}/auth` + url ? `?redirect=${encodeURIComponent(url || "")}` : ""}
                    className="btn btn-outline-primary login-btn"
                >
                    <span>{t("login")}</span>
                </a>
            )}

            <LanguageSwitcher/>
        </div>
    );
};

export default NavButtons;