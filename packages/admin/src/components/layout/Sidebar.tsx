
import ThemeChanger from "@core/components/layout/ThemeChanger";
import { Dispatch, SetStateAction } from "react";
import NavItem from "@core/components/common/NavItem"

export default function Sidebar({ sidebarVisible, setSidebarVisible}: {sidebarVisible: boolean, setSidebarVisible: Dispatch<SetStateAction<boolean>>}) {
    return (
        <aside className={`sidebar ${sidebarVisible ? 'show' : ''}`}>
            <div className="text-center mb-4">
                <a href="https://workswap.org">
                <h2 className="admin-logo">WorkSwap</h2>
                </a>
            </div>

            <div className="theme-container">
                <ThemeChanger id={"headerTC"} />
            </div>
            

            <nav className="admin-nav">
                <div className="admin-nav__title">Основное</div>
                
                <NavItem href="/dashboard" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tachometer-alt"></i> Панель управления
                </NavItem>
                <NavItem href="/listings" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-list"></i> Объявления
                </NavItem>
                <NavItem href="/resumes" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-file-alt"></i> Резюме
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>

                <div className="admin-nav__title">Контент</div>

                <NavItem href="/news" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-newspaper"></i> Новости
                </NavItem>
                <NavItem href="/reviews" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-comments"></i> Отзывы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>
                <NavItem href="/questions" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-question-circle"></i> Вопросы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>

                <div className="admin-nav__title">Пользователи</div>

                <NavItem href="/users" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-users"></i> Пользователи
                </NavItem>
                <NavItem href="/permissions" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-shield-halved"></i> Роли и разрешения
                </NavItem>

                <div className="admin-nav__title">Настройки</div>

                <NavItem href="/settings" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-cog"></i> Системные
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>
                <NavItem href="/localization" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-language"></i>Локализация
                </NavItem>

                <div className="admin-nav__title">Настройки данных</div>
                <NavItem href="/locations" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-location-dot"></i> Локации
                </NavItem>
                <NavItem href="/categories" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-sitemap"></i> Категории
                </NavItem>

                <div className="admin-nav__title">Организация</div>
                <NavItem href="/tasks" className="admin-nav__item" onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tasks"></i> Задачи
                </NavItem>
            </nav>
        </aside>
    );
}