import ThemeChanger from "@/components/ThemeChanger";
import { Link } from "react-router-dom";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import NavButtons from "./NavButtons";

const Header = ({ isEmpty, activePage }) => {

    const [mobileVisible, setMobileVisible] = useState(false);

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

    function hideMobile() {
        setMobileVisible(false)
    }


    return (
        <header>
            <div className="header-container">
                <nav className="navbar">
                    <Link className="navbar-brand" to="/catalog">WorkSwap</Link>
                    <div className="flex-row media-only-flex">
                        <div className="nav-link">
                            <ThemeChanger id={"themeChangerHeader"}/>
                        </div>
                        <button onClick={mobileMenuToggle} className="navbar-toggler">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className={`navbar-collapse ${mobileVisible ? 'show' : ""}`}>
                        <NavButtons />

                        <MobileMenu
                            hideMobile={hideMobile}
                            activePage={activePage}
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;