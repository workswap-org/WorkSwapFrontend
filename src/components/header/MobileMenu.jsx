import { useAuth } from "@/lib/contexts/auth/AuthContext";
import AccountSidebarLinks from "@/components/account/AccountSidebarLinks";
import Avatar from "@/components/small-components/Avatar";
import { Link, useNavigate } from "react-router-dom";
import NotificationMobileButton from "@/components/notifications/NotificationMobileButton";

const MobileMenu = ({
    hideMobile,
    activePage
}) => {

    const navigate = useNavigate();
    const { user } = useAuth();

    function to(to) {
        hideMobile();
        navigate(to);
    }

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
                <button className="navbar-btn" onClick={() => to("logout")}>
                    <div><i className="fa-regular fa-left-from-bracket fa-lg"></i></div>
                    <span>Выйти</span> 
                </button>
            ) : (
                <button className="navbar-btn" onClick={() => to("login")}>
                    <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                    <span>Войти в аккаунт</span> 
                </button>
            )}

            <div className="account-manager">
                <AccountSidebarLinks hideMobile={hideMobile} activePage={activePage}/>
            </div>

            <NotificationMobileButton/>
        </div>
    );
};

export default MobileMenu;