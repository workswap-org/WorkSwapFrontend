import ThemeChanger from "@core/components/layout/ThemeChanger";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import NavButtons from "./NavButtons";

const Header = ({ isEmpty, activePage }) => {

    const { t } = useTranslation('common')

    const location = useLocation();

    const [mobileVisible, setMobileVisible] = useState(false);

    useEffect(() => {
        setMobileVisible(false);
    }, [location]);


    if (isEmpty) {
        return (
            <header>
                <div className="header-container">

                </div>
            </header>
        );
    }

    function mobileMenuToggle() {
        setMobileVisible(!mobileVisible)
    }
    
    return (
        <header>
            <div className="header-container">
                <nav className="navbar">
                    <Link className="navbar-brand" to="/catalog">
                        <div className="brand">WorkSwap</div>
                        <div className="all-listings">
                            <i className="fa-regular fa-cards-blank"></i>
                            <div>{t(`all-listings`, { ns: 'common' })}</div>
                        </div>
                    </Link>
                    <div className="flex-row media-only-flex">
                        <div className="nav-link">
                            <ThemeChanger id={"themeChangerHeader"}/>
                        </div>
                        <button onClick={mobileMenuToggle} className="navbar-toggler">
                            <div><i className="fa-solid fa-bars"></i></div>
                        </button>
                    </div>
                    <div className={`navbar-collapse ${mobileVisible ? 'show' : ""}`}>
                        <NavButtons />

                        <MobileMenu
                            activePage={activePage}
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;