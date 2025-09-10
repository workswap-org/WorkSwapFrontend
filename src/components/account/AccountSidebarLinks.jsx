import { useActivePage } from "@/hooks/contexts/useActivePage";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AccountSidebarLinks = ( { hideMobile } ) => {
    const activePage = useActivePage();

    const { t } = useTranslation('navigation')

    const links = [ "account", "my-listings", "favorites", "messenger", "settings", "security"];

    return (
        <nav className="account-menu">
            {links.map((link) => (
                <Link
                    onClick={hideMobile}
                    key={link}
                    to={`/secure/${link}`}
                    className={`account-menu-item ${activePage === link ? "active" : ""}`}
                >
                    {t(`accountSidebar.links.${link}`, { ns: 'navigation' })}
                </Link>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;