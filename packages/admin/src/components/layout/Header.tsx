import { pageTitles, useActivePage } from "@core/lib/contexts/ActivePageContext";
import Avatar from "@core/components/common/Avatar/Avatar";
import SignOutIcon from "@core/components/common/icons/SignOutIcon"
import { useAuth } from "@core/lib/contexts/AuthContext";
import Link from "next/link";

const Header = ({ toggleSidebar }: {toggleSidebar: () => void}) => {

    const { user } = useAuth();
    const activePage = useActivePage();
    
    return (
        <header className="admin-header">
            <h1>{pageTitles[activePage]}</h1>

            <div className="admin-user">
                <span>{user?.name || "Администратор"}</span>
                <Avatar 
                    user={user}        // передаём объект пользователя
                    size={40}          // размер аватара, например 40px
                />
                <Link
                    className="logout-btn"
                    href="/logout"
                >
                    <SignOutIcon />
                </Link>
            </div>

            <div className="mobile-menu-btn" onClick={() => toggleSidebar()}>
                <i className="fa-solid fa-bars fa-xl"></i>
            </div>
        </header>
    );
};

export default Header;