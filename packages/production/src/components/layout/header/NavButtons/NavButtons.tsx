"use client"

import Link from "next/link";
import { AUTH_BASE } from "@core/config";
import { useEffect, useState } from "react";
import { userService } from "@core/lib/services/user";
import ThemeChanger from "@core/components/layout/ThemeChanger";
import NavItem from "@core/components/common/NavItem"
import Avatar from "@core/components/common/Avatar/Avatar";
import LanguageSwitcher from "@core/components/layout/LanguageSwitcher/LanguageSwitcher";
import { useI18n } from "@core/lib/contexts/I18nContext";
import NotificationHeaderButton from '@/components/layout/header/NotificationHeaderButton';
import SignOutIcon from "@core/components/common/icons/SignOutIcon"
import styles from "./NavButtons.module.scss"
import { useAuth } from "@core/lib/contexts/AuthContext";

const NavButtons = () => {

    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [url, setUrl] = useState<string | null>(null);
    const { dict } = useI18n();

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className={styles.navButtons}>
            <div className="flex-row">
                <div className={`${styles.navLink} normal-only`}>
                    <ThemeChanger id={"themeChangerMobile"}/>
                </div>

                <NavItem href="/forum" className={styles.navLink} activeClassName={styles.active}>
                    {dict.navigation.forum}
                </NavItem>

                <NavItem href="/catalog" className={styles.navLink} activeClassName={styles.active}>
                    {dict.navigation.catalog}
                </NavItem>

                {isAdmin && (
                    <a href="https://dash.workswap.org" className={styles.navLink} target="_blank" rel="noreferrer">
                        {dict.navigation.admin}
                    </a>
                )}
            </div>

            {isAuthenticated ? (
                <div className={styles.accountLinkContainer}>
                    <Link href="/account" className={styles.accountLink}>
                        <Avatar
                            user={user}
                            size={32}
                            className=''
                            link={false}
                        />
                        <span className="ellipsis">{user?.name || "Пользователь"}</span>
                    </Link>
                    <NotificationHeaderButton />
                    <button
                        className={styles.logoutBtn}
                        onClick={logout}
                    >
                        <SignOutIcon />
                    </button>
                </div>
            ) : (
                <a
                    href={`${AUTH_BASE}/auth${url ? `?redirect=${encodeURIComponent(url || "")}` : ""}`}
                    className={`btn btn-outline-primary ${styles.loginBtn}`}
                >
                    <span>{dict.buttons.login}</span>
                </a>
            )}

            <LanguageSwitcher/>
        </div>
    );
};

export default NavButtons;