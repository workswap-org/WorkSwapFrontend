import { 
    ThemeChanger, 
    Avatar, 
    NotificationHeaderButton 
} from "@core/components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@core/lib";

const NavButtons = () => {

    const { t } = useTranslation(['buttons', 'navigation'])

    const { user, isAuthenticated, isAdmin } = useAuth();

    return (
        <div className="nav-buttons">
            <div className="flex-row">
                <div className="nav-link normal-only">
                    <ThemeChanger id={"themeChangerMobile"}/>
                </div>

                {isAuthenticated && (
                    <>
                        {/* <Link to="/secure/messenger" className="nav-link">
                            <i className="fa-solid fa-comments-question fa-lg" style={{ lineHeight: "normal" }}></i>
                        </Link> */}

                        <NotificationHeaderButton />
                    </>
                )}

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        Админка
                    </a>
                )}

                {/* <Link to="/news" className="nav-link">
                    Новости
                </Link> */}
            </div>

            {/* Для неавторизованных */}
            {!isAuthenticated && (
                <Link
                    to="/login"
                    style={{ display: "flex", flexDirection: "row" }}
                    className="btn btn-outline-primary"
                >
                    <img src="/images/google.png" className="google-logo" alt="Google" />
                    <span>{t("login")}</span>
                </Link>
            )}

            {/* Для авторизованных */}
            {isAuthenticated && (
                <div className="account-link-container">
                    <Link to="/secure/account" className="account-link">
                        <Avatar 
                            user={user}
                            size={32}
                            className=''
                            link={false}
                        />
                        <span className="ellipsis">{user?.name || "Пользователь"}</span>
                    </Link>
                    <Link
                        className="logout-btn"
                        to='/logout'
                    >
                        <i className="fa fa-arrow-left-from-bracket fa-lg" aria-hidden="true"></i>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavButtons;