import ThemeChanger from "@/components/ThemeChanger";
import Avatar from "@/components/small-components/Avatar";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NotificationsContainer from "../notifications/NotificationsContainer";
import { useAuth } from "@/contexts/auth/AuthContext";

const NavButtons = () => {

    const { t } = useTranslation();

    const { user, logout } = useAuth();

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "ADMIN"; // или как у тебя хранится роль

    return (
        <div className="nav-buttons">
            <div className="flex-row">
                <div className="nav-link normal-only">
                    <ThemeChanger/>
                </div>

                {isAuthenticated && (
                    <>
                        <Link to="/secure/messenger" className="nav-link">
                            <i className="fa-solid fa-comments-question fa-lg" style={{ lineHeight: "normal" }}></i>
                        </Link>

                        <NotificationsContainer/>
                    </>
                )}

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        Админка
                    </a>
                )}

                <Link to="/news" className="nav-link">
                    Новости
                </Link>
            </div>

            {/* Для неавторизованных */}
            {!isAuthenticated && (
                <Link
                    to="/login"
                    style={{ display: "flex", flexDirection: "row" }}
                    className="btn btn-outline-primary"
                >
                    <img src="/images/google.png" className="logo" alt="Google" />
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
                        />
                        <span className="ellipsis">{user.name || "Пользователь"}</span>
                    </Link>
                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        <i className="fa fa-arrow-left-from-bracket fa-lg" aria-hidden="true"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavButtons;