import AccountSidebarLinks from "@/components/account/AccountSidebarLinks";
import NavButtons from "./NavButtons";
import ThemeChanger from "@/components/ThemeChanger";
import { Link } from "react-router-dom";

const Header = ({ isEmpty, activePage }) => {

    if (isEmpty) {
        return (
            <header>
                <div className="header-container">

                </div>
            </header>
        );
    }

    return (
        <header>
            <div className="header-container">
                <nav className="navbar">
                    <Link className="navbar-brand" to="/catalog">WorkSwap</Link>
                    <div className="flex-row media-only-flex">
                        <div className="nav-link">
                            <ThemeChanger/>
                        </div>
                        <button className="navbar-toggler">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse">
                        <nav className="navbar-top">
                            <Link className="navbar-brand" href="/catalog" to="#{brand}">WorkSwap</Link>
                            <button id="navbar-toggler" className="navbar-toggler">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </nav>

                        <NavButtons />

                        <div className="account-manager">
                            <AccountSidebarLinks activePage={activePage}/>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;