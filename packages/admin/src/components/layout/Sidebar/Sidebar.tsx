
import ThemeChanger from "@core/components/layout/ThemeChanger";
import { Dispatch, SetStateAction } from "react";
import NavItem from "@core/components/common/NavItem"
import styles from "./Sidebar.module.scss"

export default function Sidebar({ sidebarVisible, setSidebarVisible}: {sidebarVisible: boolean, setSidebarVisible: Dispatch<SetStateAction<boolean>>}) {
    return (
        <aside className={`${styles.sidebar} ${sidebarVisible ? styles.show : ''}`}>
            <div className="text-center mb-4">
                <a href="https://workswap.org">
                <h2 className={styles.logo}>WorkSwap</h2>
                </a>
            </div>

            <div className={styles.themeContainer}>
                <ThemeChanger id={"headerTC"} />
            </div>
            

            <nav className={styles.nav}>
                <div className={styles.title}>Основное</div>
                
                <NavItem href="/dashboard" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tachometer-alt"></i> Панель управления
                </NavItem>
                <NavItem href="/listings" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-list"></i> Объявления
                </NavItem>
                <NavItem href="/resumes" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-file-alt"></i> Резюме
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>

                <div className={styles.title}>Контент</div>

                <NavItem href="/news" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-newspaper"></i> Новости
                </NavItem>
                <NavItem href="/reviews" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-comments"></i> Отзывы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>
                <NavItem href="/questions" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-question-circle"></i> Вопросы
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>

                <div className={styles.title}>Пользователи</div>

                <NavItem href="/users" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-users"></i> Пользователи
                </NavItem>
                <NavItem href="/permissions" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-shield-halved"></i> Роли и разрешения
                </NavItem>

                <div className={styles.title}>Настройки</div>

                <NavItem href="/settings" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-cog"></i> Системные
                    <i className="fa-solid fa-square-xmark" style={{ color: 'red' }}></i>
                </NavItem>
                <NavItem href="/localization" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-language"></i>Локализация
                </NavItem>

                <div className={styles.title}>Настройки данных</div>
                <NavItem href="/locations" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-location-dot"></i> Локации
                </NavItem>
                <NavItem href="/categories" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-sitemap"></i> Категории
                </NavItem>

                <div className={styles.title}>Организация</div>
                <NavItem href="/tasks" className={styles.navItem} onClick={() => setSidebarVisible(false)}>
                    <i className="fa-solid fa-tasks"></i> Задачи
                </NavItem>
            </nav>
        </aside>
    );
}