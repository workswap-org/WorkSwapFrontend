"use client"

import NavItem from '@core/components/common/NavItem';
import { useActivePage } from '@core/lib/contexts/ActivePageContext';
import { useI18n } from '@core/lib/contexts/I18nContext';

const AccountSidebarLinks = () => {
    const activePage = useActivePage();

    const { dict } = useI18n();

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
                {dict.navigation.catalog}
            </NavItem>
            <NavItem
                href='/forum'
                className={`account-menu-item`}
            >
                <div><i className={`fa-regular fa-comments fa-lg`}></i></div>
                {dict.navigation.forum}
            </NavItem>
            {links.map((link) => (
                <NavItem
                    key={link.key}
                    href={`/account/${link.key}`}
                    className={`account-menu-item ${activePage === link.key ? "active" : ""}`}
                >
                    <div><i className={`fa-regular ${link.icon} fa-lg`}></i></div>
                    {dict.navigation.accountSidebar.links[link.key]}
                </NavItem>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;