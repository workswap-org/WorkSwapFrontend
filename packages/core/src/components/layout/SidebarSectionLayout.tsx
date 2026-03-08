"use client"

import { useI18n } from "@core/lib/contexts/I18nContext";
import { ReactNode, useEffect, useState } from "react";
 
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
        <div className="sidebar-section-page">
            <div className="sidebar-sections">
                {Object.values(sections).map((section) => (
                    <button
                        key={section.name}
                        className={`section-btn hover ${section.name === currentSection?.name ? "active" : ""}`}
                        onClick={() => setCurrentSection(section)}
                        id={notifications?.menu.name === section.name ? "notificationAnchor" : "none"}
                    >
                        <div><i className={`fa-regular fa-${section.icon}`}></i></div>
                        {dict.common[pageName].sections[section.name]}
                        {notifications?.menu.name === section.name && notifications.count > 0 &&
                            <span id="unreadNotifications" className="unread-notifications-count">
                                {notifications.count}
                            </span>
                        }
                    </button>
                ))}
            </div>
            <div className={`section-container ${currentSection ? "active" : ""}`} >
                <div className='mobile-actions media-only-flex'>
                    <button onClick={() => setCurrentSection(null)}>
                        <i className={`fa-regular fa-arrow-left fa-lg`}></i>
                    </button>
                </div>
                
                {children && children(currentSection)}
            </div>
        </div>
    );
}

export default SidebarSectionLayout;