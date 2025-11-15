import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
 
const SidebarSectionLayout = ({
    pageName,
    sections,
    children
}) => {

    const { t } = useTranslation('common');

    const params = new URLSearchParams(window.location.search);
    const isMobile = window.innerWidth <= 600;
    const section = params.get("section") || '';
    const initialMenu = findSection(section) || (isMobile ? null : findFirst());

    const [currentSection, setCurrentSection] = useState(initialMenu);

    useEffect(() => {
        console.log(currentSection);
    }, [currentSection])

    function findSection(name) {
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
                    >
                        <div><i className={`fa-regular fa-${section.icon}`}></i></div>
                        {t(`${pageName}.sections.${section.name}`)}
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