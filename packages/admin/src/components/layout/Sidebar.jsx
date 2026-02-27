import { NavLink } from "react-router-dom";
import { ThemeChanger } from "@core/components";

export default function Sidebar({ sidebarVisible, setSidebarVisible}) {
    return (
        <aside className={`sidebar ${sidebarVisible ? 'show' : ''}`}>
            <div className="text-center mb-4">
                <a href="https://workswap.org">
                <h2 className="admin-logo">WorkSwap</h2>
                </a>
            </div>

            <div className="theme-container">
                <ThemeChanger />
            </div>
            

            <nav className="admin-nav">
                <div className="admin-nav__title">Основное</div>
                
                <NavLink to="/dashboard" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tachometer-alt"></i> Панель управления
                </NavLink>
                <NavLink to="/listings" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-list"></i> Объявления
                </NavLink>
                <NavLink to="/resumes" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-file-alt"></i> Резюме
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavLink>

                <div className="admin-nav__title">Контент</div>

                <NavLink to="/news" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-newspaper"></i> Новости
                </NavLink>
                <NavLink to="/reviews" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-comments"></i> Отзывы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavLink>
                <NavLink to="/questions" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-question-circle"></i> Вопросы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavLink>

                <div className="admin-nav__title">Пользователи</div>

                <NavLink to="/users" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-users"></i> Пользователи
                </NavLink>
                <NavLink to="/permissions" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-shield-halved"></i> Роли и разрешения
                </NavLink>

                <div className="admin-nav__title">Настройки</div>

                <NavLink to="/settings" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-cog"></i> Системные
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavLink>
                <NavLink to="/localization" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-language"></i>Локализация
                </NavLink>

                <div className="admin-nav__title">Настройки данных</div>
                <NavLink to="/locations" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-location-dot"></i> Локации
                </NavLink>
                <NavLink to="/categories" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-sitemap"></i> Категории
                </NavLink>

                <div className="admin-nav__title">Организация</div>
                <NavLink to="/tasks" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tasks"></i> Задачи
                </NavLink>
            </nav>
        </aside>
    );
}