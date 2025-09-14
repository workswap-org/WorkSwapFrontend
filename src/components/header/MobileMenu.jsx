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
            <Avatar
                user={user}
                size={100}
                className='profile-avatar'
            />

            <h2>{user?.name}</h2>

            <Link className="navbar-btn">
                <div><i class="fa-regular fa-left-from-bracket fa-lg"></i></div>
                <span>Выйти</span> 
            </Link>

            <div className="account-manager">
                <AccountSidebarLinks hideMobile={hideMobile} activePage={activePage}/>
            </div>

            <NotificationMobileButton/>
        </div>
    );
};

export default MobileMenu;