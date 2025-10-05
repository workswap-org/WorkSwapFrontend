import { useActivePage } from "@/lib/hooks/contexts/useActivePage";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AccountSidebarLinks = () => {
    const activePage = useActivePage();

    const { t } = useTranslation('navigation')

    const links = [
        /* { key: "account", icon: "fa-user" }, */
        /* { key: "catalog", icon: "fa-grid-2" }, */
        { key: "my-listings", icon: "fa-cards-blank" },
        { key: "favorites", icon: "fa-heart" },
        { key: "messenger", icon: "fa-message-lines" },
        { key: "settings", icon: "fa-gear" },
        { key: "security", icon: "fa-shield-keyhole" },
    ];


    return (
        <nav className="account-menu">
            <Link
                to='/catalog'
                className={`account-menu-item`}
            >
                <div><i className={`fa-regular fa-grid-2 fa-lg`}></i></div>
                {t(`accountSidebar.links.catalog`, { ns: 'navigation' })}
            </Link>
            {links.map((link) => (
                <Link
                    key={link.key}
                    to={`/secure/${link.key}`}
                    className={`account-menu-item ${activePage === link.key ? "active" : ""}`}
                >
                    <div><i className={`fa-regular ${link.icon} fa-lg`}></i></div>
                    {t(`accountSidebar.links.${link.key}`, { ns: 'navigation' })}
                </Link>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;