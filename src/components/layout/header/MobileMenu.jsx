import { useAuth } from "@core/lib";
import {
    AccountSidebarLinks, 
    ContactModal
} from "@/components";
import {
    Avatar, 
    NotificationMobileButton
} from "@core/components";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const MobileMenu = () => {

    const { t } = useTranslation('navigation')

    const { user, isAuthenticated } = useAuth();

    return (
        <div className="mobile-menu">
            <div className="user-info-menu">
                {isAuthenticated && (
                    <Avatar
                        user={user}
                        size={100}
                        className='profile-avatar'
                    />
                )}

                <h2>{user?.name}</h2>
            </div>

            {isAuthenticated ? (
                <Link className="navbar-btn" to='/logout'>
                    <div><i className="fa-regular fa-left-from-bracket fa-lg"></i></div>
                    <span>{t(`accountSidebar.logout`, { ns: 'navigation' })}</span> 
                </Link>
            ) : (
                <Link className="navbar-btn" to='/login?redirect=${window.location.pathname}'>
                    <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                    <span>{t(`accountSidebar.login`, { ns: 'navigation' })}</span> 
                </Link>
            )}

            <div className="account-manager">
                <AccountSidebarLinks />
            </div>

            <NotificationMobileButton/>

            <ContactModal/>
        </div>
    );
};

export default MobileMenu;