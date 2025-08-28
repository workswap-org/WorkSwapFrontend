import AccountSidebarLinks from "@/components/account/AccountSidebarLinks";
import NavButtons from "./NavButtons";
import ThemeChanger from "@/components/ThemeChanger";

const Header = ({ activePage, user, onLogout }) => {
    return (
        <header>
            <div className="header-container">
                <nav className="navbar">
                    <a className="navbar-brand" href="/catalog" th:text="#{brand}">WorkSwap</a>
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
                            <a className="navbar-brand" href="/catalog" th:text="#{brand}">WorkSwap</a>
                            <button id="navbar-toggler" className="navbar-toggler">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </nav>

                        <NavButtons user={user} onLogout={onLogout} />

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