"use client"

import { 
    useActivePage 
} from "@core/lib";
import { useTranslation } from 'react-i18next';
import { NavItem } from "@core/components";

const AccountSidebarLinks = () => {
    const activePage = useActivePage();

    const { t } = useTranslation('navigation')

    const links = [
        /* { key: "account", icon: "fa-user" }, */
        { key: "my-listings", icon: "fa-cards-blank" },
        { key: "favorites", icon: "fa-heart" },
        { key: "messenger", icon: "fa-message-lines" },
        { key: "settings", icon: "fa-gear" },
        { key: "security", icon: "fa-shield-keyhole" },
    ];


    return (
        <nav className="account-menu">
            <NavItem
                href='/catalog'
                className={`account-menu-item`}
            >
                <div><i className={`fa-regular fa-grid-2 fa-lg`}></i></div>
                {t(`catalog`, { ns: 'navigation' })}
            </NavItem>
            <NavItem
                href='/forum'
                className={`account-menu-item`}
            >
                <div><i className={`fa-regular fa-comments fa-lg`}></i></div>
                {t(`forum`, { ns: 'navigation' })}
            </NavItem>
            {links.map((link) => (
                <NavItem
                    key={link.key}
                    href={`/account/${link.key}`}
                    className={`account-menu-item ${activePage === link.key ? "active" : ""}`}
                >
                    <div><i className={`fa-regular ${link.icon} fa-lg`}></i></div>
                    {t(`accountSidebar.links.${link.key}`, { ns: 'navigation' })}
                </NavItem>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;