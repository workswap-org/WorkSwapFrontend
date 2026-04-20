"use client"

import { useI18n } from "@core/lib/contexts/I18nContext";
import { ReactNode, useEffect, useState } from "react";
import styles from "./SidebarSectionLayout.module.scss";
import UnreadNotifications from "@core/components/ui/notifications/UnreadNotifications/UnreadNotifications";
import LeftArrowIcon from "@core/components/common/icons/LeftArrowIcon";
 
export interface SidebarSection {
    first: boolean;
    name: string;
    icon: string;
}

interface SidebarSectionLayoutProps {
    pageName: string;
    sections: Record<string, SidebarSection>;
    notifications?: { menu: SidebarSection; count: number };
    children: (currentSection: SidebarSection | null) => ReactNode;
}

const SidebarSectionLayout = ({
    pageName,
    sections,
    notifications,
    children
}: SidebarSectionLayoutProps) => {

    const { dict } = useI18n();

    const params = new URLSearchParams(window.location.search);
    const isMobile = window.innerWidth <= 600;
    const section = params.get("section") || '';
    const initialMenu = findSection(section) || (isMobile ? null : findFirst());

    const [currentSection, setCurrentSection] = useState(initialMenu);
    console.log("sections: ", sections)

    useEffect(() => {
        console.log(currentSection);
    }, [currentSection])

    function findSection(name: string) {
        return Object.values(sections).find(s => s.name === name) || null;
    }

    function findFirst() {
        return Object.values(sections).find(s => s.first === true) || null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.sidebar}>
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={section.name}
                        className={`${styles.section} hover ${section.name === currentSection?.name ? "active" : ""}`}
                        onClick={() => setCurrentSection(section)}
                        id={notifications?.menu.name === section.name ? "notificationAnchor" : "none"}
                    >
                        <div><i className={`fa-regular fa-${section.icon}`}></i></div>
                        {dict.common[pageName].sections[key]}
                        {notifications?.menu.name === section.name && notifications.count > 0 &&
                            <UnreadNotifications count={notifications.count}/>
                        }
                    </button>
                ))}
            </div>
            <div className={`${styles.container} ${currentSection ? styles.active : ""}`} >
                <div className={`${styles.mobileActions} media-only-flex`}>
                    <button onClick={() => setCurrentSection(null)} className={styles.backBtn}>
                        <LeftArrowIcon />
                    </button>
                </div>
                
                {children && children(currentSection)}
            </div>
        </div>
    );
}

export default SidebarSectionLayout;