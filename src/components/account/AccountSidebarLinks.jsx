import { useActivePage } from "@/contexts/active-page/useActivePage";

const AccountSidebarLinks = () => {

    const activePage = useActivePage();

    const links = [
        { href: "/secure/account", key: "account", label: "Аккаунт" },
        { href: "/secure/my-listings", key: "my-listings", label: "Мои объявления" },
        { href: "/secure/favorites", key: "favorites", label: "Избранное" },
        { href: "/secure/messenger", key: "messenger", label: "Сообщения" },
        { href: "/secure/resume", key: "resume", label: "Моё резюме" },
        { href: "/secure/settings", key: "settings", label: "Настройки" },
        { href: "/secure/security", key: "security", label: "Безопасность" },
    ];

    return (
        <nav className="account-menu">
            {links.map((link) => (
                <a
                    key={link.key}
                    href={link.href}
                    className={`account-menu-item ${activePage === link.key ? "active" : ""}`}
                >
                    {link.label}
                </a>
            ))}
        </nav>
    );
};
export default AccountSidebarLinks;