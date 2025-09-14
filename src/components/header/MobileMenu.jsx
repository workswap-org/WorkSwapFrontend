import { useAuth } from "@/contexts/auth/AuthContext";
import AccountSidebarLinks from "@/components/account/AccountSidebarLinks";
import Avatar from "@/components/small-components/Avatar";
import { Link } from "react-router-dom";
import NotificationMobileButton from "@/components/notifications/NotificationMobileButton";

const MobileMenu = ({
    hideMobile,
    activePage
}) => {

    const { user } = useAuth();

    return (
        <div className="mobile-menu">
            <div className="user-info-menu">
                <Avatar
                    user={user}
                    size={100}
                    className='profile-avatar'
                />

                <h2>{user?.name}</h2>
            </div>

            {user ? (
                <Link to="logout" className="navbar-btn">
                    <div><i className="fa-regular fa-left-from-bracket fa-lg"></i></div>
                    <span>Выйти</span> 
                </Link>
            ) : (
                <Link to="login" className="navbar-btn">
                    <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                    <span>Войти в аккаунт</span> 
                </Link>
            )}

            <div className="account-manager">
                <AccountSidebarLinks hideMobile={hideMobile} activePage={activePage}/>
            </div>

            <NotificationMobileButton/>
        </div>
    );
};

export default MobileMenu;