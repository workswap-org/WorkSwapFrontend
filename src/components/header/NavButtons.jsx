import ThemeChanger from "@/components/ThemeChanger";
import { useTranslation } from "react-i18next";

const NavButtons = ({ user, onLogout }) => {

    const { t } = useTranslation();

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "ADMIN"; // или как у тебя хранится роль

    return (
        <div className="nav-buttons">
            <div className="flex-row">
                <div className="nav-link normal-only">
                    <ThemeChanger/>
                </div>

                {isAuthenticated && (
                    <a href="/secure/messenger" className="nav-link">
                        <i className="fa-solid fa-comments-question fa-lg" style={{ lineHeight: "normal" }}></i>
                    </a>
                )}

                {isAuthenticated && (
                    <div className="notification-container">
                        <button className="nav-link" id="notificationBtn">
                            <i className="fa fa-bell fa-lg" aria-hidden="true"></i>
                            <div id="unreadNotifications" className="unread-notifications-count" style={{ display: "none" }}></div>
                        </button>

                        {/* Выпадающее окно с уведомлениями */}
                        <div id="notificationDropdown" className="notification-center-dropdown hidden">
                            <div className="notification-center-header">Уведомления</div>
                            <div id="notificationList" className="notification-center-list">
                                <p className="no-notifications">Загрузка...</p>
                            </div>
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        Админка
                    </a>
                )}

                <a href="/news" className="nav-link">
                    Новости
                </a>
            </div>

            {/* Для неавторизованных */}
            {!isAuthenticated && (
                <a
                    href="/login"
                    style={{ display: "flex", flexDirection: "row" }}
                    className="btn btn-outline-primary"
                >
                    <img src="/images/google.png" className="logo" alt="Google" />
                    <span>{t("login")}</span>
                </a>
            )}

            {/* Для авторизованных */}
            {isAuthenticated && (
                <div className="account-link-container">
                    <a href="/secure/account" className="account-link">
                        <img
                            src={user.avatarUrl || "/images/default-avatar.png"}
                            alt="avatar"
                            className="avatar"
                            style={{ width: 32, height: 32, borderRadius: "50%" }}
                        />
                        <span className="ellipsis">{user.name || "Пользователь"}</span>
                    </a>
                    <button
                        className="logout-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            onLogout();
                        }}
                    >
                        <i className="fa fa-arrow-left-from-bracket fa-lg" aria-hidden="true"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavButtons;