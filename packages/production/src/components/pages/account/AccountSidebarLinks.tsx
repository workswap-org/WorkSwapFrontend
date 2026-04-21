"use client"

import NavItem from '@core/components/common/NavItem';
import { useActivePage } from '@core/lib/contexts/ActivePageContext';
import { useI18n } from '@core/lib/contexts/I18nContext';
import styles from "./AccountSidebar.module.scss";
import CardsIcon from "@core/components/common/icons/CardsIcon"
import GearIcon from '@core/components/common/icons/GearIcon';
import MessagesIcon from "@core/components/common/icons/MessagesIcon"
import HeartIcon from '@core/components/common/icons/HeartIcon';
import ShieldIcon from '@core/components/common/icons/ShieldIcon';
import CommentIcon from '@core/components/common/icons/CommentIcon';
import GridIcon from '@core/components/common/icons/GridIcon';

const AccountSidebarLinks = () => {
    const activePage = useActivePage();

    const { dict } = useI18n();

    const links = [
        /* { key: "account", icon: "fa-user" }, */
        { key: "my-listings", icon: <CommentIcon size={22} /> },
        { key: "favorites", icon: <HeartIcon size={24} /> /* "fa-heart" */ },
        { key: "messenger", icon: <CardsIcon /> /* "fa-message-lines" */ },
        { key: "settings", icon: <GearIcon size={24}/> },
        { key: "security", icon: <ShieldIcon size={24} /> /* "fa-shield-keyhole"  */},
    ];


    return (
        <nav className={styles.accountMenu}>
            <NavItem
                href='/catalog'
                className={styles.accountMenuItem}
            >
                <GridIcon size={24} />
                {dict.navigation.catalog}
            </NavItem>
            <NavItem
                href='/forum'
                className={styles.accountMenuItem}
            >
                <MessagesIcon size={24} />
                {dict.navigation.forum}
            </NavItem>
            {links.map((link) => (
                <NavItem
                    key={link.key}
                    href={`/account/${link.key}`}
                    className={`${styles.accountMenuItem} ${activePage === link.key ? styles.active : ""}`}
                >
                    {link.icon}
                    {dict.navigation.accountSidebar.links[link.key]}
                </NavItem>
            ))}
        </nav>
    );
};

export default AccountSidebarLinks;