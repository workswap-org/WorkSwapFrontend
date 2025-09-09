import { useActivePage } from "@/hooks/contexts/useActivePage";
import { Link } from "react-router-dom";

const AccountSidebarLinks = ( { hideMobile } ) => {
    const activePage = useActivePage();

    const links = [
        { to: "/secure/account", key: "account", label: "Аккаунт" },
        { to: "/secure/my-listings", key: "my-listings", label: "Мои объявления" },
        { to: "/secure/favorites", key: "favorites", label: "Избранное" },
        { to: "/secure/messenger", key: "messenger", label: "Сообщения" },
        /* { to: "/secure/resume", key: "resume", label: "Моё резюме" }, */
        { to: "/secure/settings", key: "settings", label: "Настройки" },
        { to: "/secure/security", key: "security", label: "Безопасность" },
    ];

    return (
        <nav className="account-menu">
            {links.map((link) => (
                <Link
                    onClick={hideMobile}
                    key={link.key}
                    to={link.to}
                    className={`account-menu-item ${activePage === link.key ? "active" : ""}`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;