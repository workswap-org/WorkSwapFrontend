import { useAuth } from "@/lib/contexts/auth/AuthContext";
import AccountSidebarLinks from "@/components/layout//sidebar/account/AccountSidebarLinks";
import Avatar from "@/components/common/Avatar";
import { Link } from "react-router-dom";
import NotificationMobileButton from "@/components/ui/notifications/NotificationMobileButton";
import { useTranslation } from 'react-i18next';
import ContactModal from "@/components/ui/modal/ContactModal";

const MobileMenu = ({
    activePage
}) => {

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
                <Link className="navbar-btn" to='/login'>
                    <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                    <span>{t(`accountSidebar.login`, { ns: 'navigation' })}</span> 
                </Link>
            )}

            <div className="account-manager">
                <AccountSidebarLinks activePage={activePage}/>
            </div>

            <NotificationMobileButton/>

            <ContactModal/>
        </div>
    );
};

export default MobileMenu;